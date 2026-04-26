import { createServer } from "node:http";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { once } from "node:events";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { WebSocket } = require("ws");

const projectRoot = process.cwd();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function createStaticServer(rootDir) {
  const mimeByExtension = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".sql": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8",
  };

  const server = createServer(async (request, response) => {
    try {
      const incomingUrl = new URL(request.url || "/", "http://127.0.0.1");
      const pathname = decodeURIComponent(incomingUrl.pathname === "/" ? "/index.html" : incomingUrl.pathname);
      const resolvedPath = path.resolve(rootDir, `.${pathname}`);

      if (!resolvedPath.startsWith(rootDir)) {
        response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("forbidden");
        return;
      }

      const content = await readFile(resolvedPath);
      const extension = path.extname(resolvedPath).toLowerCase();
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": mimeByExtension[extension] || "application/octet-stream",
      });
      response.end(content);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("not found");
    }
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => {
              if (error) {
                closeReject(error);
                return;
              }
              closeResolve();
            });
          }),
        port: address.port,
      });
    });
  });
}

async function waitForProcessExit(process, timeoutMs = 2000) {
  if (process.exitCode !== null || process.signalCode !== null) return true;

  const result = await Promise.race([once(process, "exit").then(() => true), delay(timeoutMs).then(() => false)]);
  return result;
}

async function startChrome() {
  const chromeBin = process.env.CHROME_BIN || "google-chrome";
  const userDataDir = await mkdtemp(path.join(os.tmpdir(), "nitro-smoke-chrome-"));
  const chrome = spawn(
    chromeBin,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-sync",
      "--remote-debugging-port=0",
      `--user-data-dir=${userDataDir}`,
      "about:blank",
    ],
    {
      cwd: projectRoot,
      stdio: ["ignore", "ignore", "pipe"],
    }
  );

  let stderr = "";
  chrome.stderr.on("data", (chunk) => {
    stderr += String(chunk);
  });

  const devtoolsFile = path.join(userDataDir, "DevToolsActivePort");
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (chrome.exitCode !== null) {
      throw new Error(`Chrome encerrou antes de iniciar o DevTools.\n${stderr}`);
    }

    if (await pathExists(devtoolsFile)) {
      const [portLine] = (await readFile(devtoolsFile, "utf8")).trim().split("\n");
      return {
        close: async () => {
          if (chrome.exitCode === null && chrome.signalCode === null) {
            chrome.kill("SIGTERM");
            await waitForProcessExit(chrome, 1000);
          }

          if (chrome.exitCode === null) {
            chrome.kill("SIGKILL");
            await waitForProcessExit(chrome, 1000);
          }

          try {
            await rm(userDataDir, { force: true, maxRetries: 5, recursive: true, retryDelay: 150 });
          } catch (error) {
            console.warn(`Aviso: nao foi possivel remover o perfil temporario do Chrome: ${error.message || error}`);
          }
        },
        port: Number.parseInt(portLine, 10),
      };
    }

    await delay(100);
  }

  chrome.kill("SIGKILL");
  await rm(userDataDir, { force: true, recursive: true });
  throw new Error("Chrome não expôs a porta do DevTools a tempo.");
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  const listeners = new Set();
  let commandId = 0;

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(String(event.data));

    if (payload.id) {
      const entry = pending.get(payload.id);
      if (!entry) return;
      pending.delete(payload.id);
      if (payload.error) {
        entry.reject(new Error(payload.error.message || "Falha no DevTools Protocol."));
        return;
      }
      entry.resolve(payload.result || {});
      return;
    }

    listeners.forEach((listener) => listener(payload));
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener("error", (event) => {
      reject(event.error || new Error("Falha ao conectar no DevTools Protocol."));
    });

    socket.addEventListener("open", () => {
      resolve({
        close() {
          socket.close();
        },
        onEvent(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        send(method, params = {}, sessionId = undefined) {
          commandId += 1;
          const id = commandId;
          const message = { id, method, params };
          if (sessionId) {
            message.sessionId = sessionId;
          }

          return new Promise((commandResolve, commandReject) => {
            pending.set(id, {
              reject: commandReject,
              resolve: commandResolve,
            });
            socket.send(JSON.stringify(message));
          });
        },
      });
    });
  });
}

async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send(
    "Runtime.evaluate",
    {
      awaitPromise: true,
      expression,
      returnByValue: true,
    },
    sessionId
  );

  if (result.exceptionDetails) {
    throw new Error(`Falha ao avaliar expressão: ${expression}`);
  }

  return result.result?.value;
}

async function clickCenter(cdp, sessionId, selector) {
  const rect = await evaluate(
    cdp,
    sessionId,
    `
      (() => {
        const element = document.querySelector(${JSON.stringify(selector)});
        if (!element) return null;
        element.scrollIntoView({ block: "center", inline: "center" });
        const box = element.getBoundingClientRect();
        return { x: box.left + box.width / 2, y: box.top + box.height / 2, width: box.width, height: box.height };
      })()
    `
  );

  assert(rect && rect.width > 0 && rect.height > 0, `Elemento nao clicavel no smoke test: ${selector}`);
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x, y: rect.y }, sessionId);
  await cdp.send("Input.dispatchMouseEvent", { button: "left", clickCount: 1, type: "mousePressed", x: rect.x, y: rect.y }, sessionId);
  await cdp.send("Input.dispatchMouseEvent", { button: "left", clickCount: 1, type: "mouseReleased", x: rect.x, y: rect.y }, sessionId);
}

async function main() {
  const server = await createStaticServer(projectRoot);
  const chrome = await startChrome();
  let cdp = null;
  let stopListening = () => {};
  const runtimeExceptions = [];
  const consoleErrors = [];

  try {
    const version = await fetch(`http://127.0.0.1:${chrome.port}/json/version`).then((response) => response.json());
    cdp = await createCdpClient(version.webSocketDebuggerUrl);

    stopListening = cdp.onEvent((payload) => {
      if (payload.method === "Runtime.exceptionThrown") {
        runtimeExceptions.push(payload.params?.exceptionDetails?.text || "Runtime exception");
      }

      if (payload.method === "Runtime.consoleAPICalled" && payload.params?.type === "error") {
        consoleErrors.push(
          (payload.params.args || [])
            .map((item) => item.value || item.description || "")
            .join(" ")
            .trim()
        );
      }
    });

    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { flatten: true, targetId });

    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    await cdp.send("Log.enable", {}, sessionId);
    await cdp.send(
      "Page.addScriptToEvaluateOnNewDocument",
      {
        source: `
          window.__smoke = { consoleErrors: [], openCalls: [], uncaughtErrors: [] };
          window.addEventListener("error", (event) => {
            window.__smoke.uncaughtErrors.push(String(event.message || "window error"));
          });
          window.addEventListener("unhandledrejection", (event) => {
            window.__smoke.uncaughtErrors.push(String(event.reason || "unhandled rejection"));
          });
          const originalConsoleError = console.error.bind(console);
          console.error = (...args) => {
            window.__smoke.consoleErrors.push(args.map((item) => String(item)).join(" "));
            originalConsoleError(...args);
          };
          const originalOpen = window.open.bind(window);
          window.open = (...args) => {
            window.__smoke.openCalls.push(args.map((item) => String(item ?? "")));
            if (args[0] && String(args[0]).startsWith("http")) {
              return {
                close() {},
                location: { href: args[0] },
                opener: null,
              };
            }
            return originalOpen(...args);
          };
        `,
      },
      sessionId
    );

    await cdp.send("Page.navigate", { url: `http://127.0.0.1:${server.port}/index.html` }, sessionId);
    await delay(4500);

    const title = await evaluate(cdp, sessionId, "document.title");
    const guestMode = await evaluate(cdp, sessionId, 'document.body.classList.contains("guest-mode")');
    const topAdVisible = await evaluate(
      cdp,
      sessionId,
      'Boolean(document.querySelector("#public-top-ad-card") && !document.querySelector("#public-top-ad-card").hidden)'
    );
    const topAdFallbackVisible = await evaluate(
      cdp,
      sessionId,
      'Boolean(document.querySelector("#public-top-ad-card .ad-fallback-card") && !document.querySelector("#public-top-ad-card .ad-fallback-card").hidden)'
    );
    const checkoutRel = await evaluate(cdp, sessionId, 'document.querySelector("#primary-checkout-link").rel');
    const whatsappRel = await evaluate(cdp, sessionId, 'document.querySelector("#whatsapp-sales-link").rel');
    const sponsoredLinkRel = await evaluate(
      cdp,
      sessionId,
      'document.querySelector("#offer-links .is-sponsored-link")?.rel || ""'
    );
    const autoOpenDisabled = await evaluate(
      cdp,
      sessionId,
      'typeof appConfig !== "undefined" && appConfig.sponsoredAutoOpenEnabled === true'
    );
    const sponsoredWarmupLimit = await evaluate(cdp, sessionId, "getSponsoredClickWarmupLimit()");
    const sponsoredCooldown = await evaluate(cdp, sessionId, "getSponsoredClickCooldownMs()");

    await evaluate(
      cdp,
      sessionId,
      'sessionStorage.removeItem("nitro-sponsored-click-count-v2"); sessionStorage.removeItem("nitro-sponsored-last-opened-at-v1"); window.__smoke.openCalls = []; undefined;'
    );
    await clickCenter(cdp, sessionId, "#resume-course");
    await delay(350);
    const openCallsAfterFirstSponsoredClick = await evaluate(cdp, sessionId, "window.__smoke.openCalls.length");
    await clickCenter(cdp, sessionId, "#resume-course");
    await delay(350);
    const openCallsAfterSecondSponsoredClick = await evaluate(cdp, sessionId, "window.__smoke.openCalls.length");
    const activePanelAfterSponsoredClick = await evaluate(cdp, sessionId, "state.activePanel");

    await evaluate(cdp, sessionId, "window.__smoke.openCalls = []; undefined;");
    await evaluate(cdp, sessionId, 'document.querySelector("#enter-member-area").click(); undefined;');
    await delay(250);
    const accessModalOpen = await evaluate(
      cdp,
      sessionId,
      'document.querySelector("#access-modal").classList.contains("is-open")'
    );
    const openCallsAfterAccess = await evaluate(cdp, sessionId, "window.__smoke.openCalls.length");

    await evaluate(cdp, sessionId, 'document.querySelector("[data-open-pix-modal]").click(); undefined;');
    await delay(250);
    const pixModalOpen = await evaluate(
      cdp,
      sessionId,
      'document.querySelector("#pix-modal").classList.contains("is-open")'
    );
    const pixWhatsappHref = await evaluate(cdp, sessionId, 'document.querySelector("#pix-whatsapp-link").href');

    await cdp.send(
      "Emulation.setDeviceMetricsOverride",
      {
        deviceScaleFactor: 2,
        height: 844,
        mobile: true,
        width: 390,
      },
      sessionId
    );
    await evaluate(cdp, sessionId, 'window.dispatchEvent(new Event("resize")); undefined;');
    await delay(400);
    const mobileSwitcherVisible = await evaluate(
      cdp,
      sessionId,
      'getComputedStyle(document.querySelector("#public-mobile-switcher")).display !== "none"'
    );
    const mobileSponsoredResult = await evaluate(
      cdp,
      sessionId,
      `
        (() => {
          closeAccessModal();
          state.activePanel = "public";
          setActivePanel("public");
          sessionStorage.removeItem("nitro-sponsored-click-count-v2");
          sessionStorage.removeItem("nitro-sponsored-last-opened-at-v1");
          window.__smoke.openCalls = [];
          const target = document.querySelector("#resume-course");
          const first = shouldOpenSponsoredLinkAfterClick(target);
          const second = shouldOpenSponsoredLinkAfterClick(target);
          if (second) openSponsoredWindow(getSmartlinkUrl());
          return {
            first,
            second,
            mobile: isMobileLayout(),
            mobileEnabled: appConfig.sponsoredClickMobileEnabled === true,
            openCalls: window.__smoke.openCalls.length,
          };
        })()
      `
    );

    await evaluate(
      cdp,
      sessionId,
      `
        authState.session = { user: { id: "smoke-premium", email: "premium@example.com" } };
        authState.user = authState.session.user;
        authState.accessGranted = true;
        authState.accessStatus = "active";
        state.member = { name: "Aluno Premium", email: "premium@example.com", goal: "diagnosticar placas", rhythm: "30 min por dia", joinedAt: new Date().toISOString() };
        state.activePanel = "dashboard";
        sessionStorage.removeItem("nitro-sponsored-click-count-v2");
        sessionStorage.removeItem("nitro-sponsored-last-opened-at-v1");
        window.__smoke.openCalls = [];
        renderAll();
        undefined;
      `
    );
    await delay(450);
    const premiumDashboardAdVisible = await evaluate(
      cdp,
      sessionId,
      'Boolean([...document.querySelectorAll("#dashboard-top-ad-card, #dashboard-ad-card, #dashboard-footer-ad-card")].some((element) => !element.hidden))'
    );
    const premiumIntelligenceVisible = await evaluate(
      cdp,
      sessionId,
      'Boolean(document.querySelector("#premium-intelligence-card.is-premium-active") && !document.querySelector("#premium-intelligence-card").hidden)'
    );
    await clickCenter(cdp, sessionId, "#open-next-lesson");
    await delay(300);
    await clickCenter(cdp, sessionId, "#open-course-panel");
    await delay(300);
    const premiumOpenCallsAfterClicks = await evaluate(cdp, sessionId, "window.__smoke.openCalls.length");
    const smokeConsoleErrors = await evaluate(cdp, sessionId, "window.__smoke.consoleErrors");
    const smokeUncaughtErrors = await evaluate(cdp, sessionId, "window.__smoke.uncaughtErrors");

    assert(title.includes("Nitro Scan Pro"), "O título da página não carregou corretamente.");
    assert(guestMode, "A página pública deveria iniciar em modo visitante.");
    assert(topAdVisible, "O bloco principal de anúncio público não ficou visível.");
    assert(topAdFallbackVisible, "O fallback do anúncio público não apareceu quando o banner não renderizou.");
    assert(checkoutRel.includes("noopener") && checkoutRel.includes("noreferrer"), "O link de checkout está sem rel seguro.");
    assert(whatsappRel.includes("noopener") && whatsappRel.includes("noreferrer"), "O link de WhatsApp está sem rel seguro.");
    assert(
      sponsoredLinkRel.includes("sponsored") && sponsoredLinkRel.includes("nofollow"),
      "O link patrocinado não recebeu os atributos corretos."
    );
    assert(autoOpenDisabled, "A abertura do smartlink patrocinado deveria estar ativada para o plano gratuito.");
    assert(sponsoredWarmupLimit === 1, "O smartlink deveria abrir no segundo clique elegivel.");
    assert(sponsoredCooldown === 0, "O smartlink nao deveria ter cooldown quando a regra e abrir no segundo clique.");
    assert(openCallsAfterFirstSponsoredClick === 0, "O primeiro clique elegivel nao deveria abrir anuncio.");
    assert(openCallsAfterSecondSponsoredClick >= 1, "O segundo clique elegivel deveria abrir o smartlink patrocinado.");
    assert(activePanelAfterSponsoredClick === "course", "A acao do botao deveria ficar aplicada antes/depois do anuncio.");
    assert(accessModalOpen, "O botão principal deveria abrir o modal de acesso.");
    assert(openCallsAfterAccess === 0, "Uma ação crítica abriu janela paralela de anúncio.");
    assert(pixModalOpen, "O atalho de Pix deveria abrir o modal de pagamento.");
    assert(pixWhatsappHref.includes("wa.me/"), "O botão de comprovante no WhatsApp não foi configurado.");
    assert(mobileSwitcherVisible, "A navegação móvel da apresentação não ficou visível no viewport reduzido.");
    assert(mobileSponsoredResult.mobile, "O smoke test deveria estar em viewport mobile.");
    assert(mobileSponsoredResult.mobileEnabled, "A monetizacao por clique mobile deveria estar ativa.");
    assert(mobileSponsoredResult.first === false, "O primeiro clique mobile elegivel nao deveria abrir anuncio.");
    assert(mobileSponsoredResult.second === true, "O segundo clique mobile elegivel deveria abrir o smartlink patrocinado.");
    assert(mobileSponsoredResult.openCalls >= 1, "O smartlink mobile nao abriu janela patrocinada no segundo clique.");
    assert(!premiumDashboardAdVisible, "O painel premium nao deveria exibir anuncios.");
    assert(premiumIntelligenceVisible, "O painel premium deveria exibir a inteligencia adaptativa.");
    assert(premiumOpenCallsAfterClicks === 0, "Cliques no premium nao deveriam abrir anuncios.");
    assert(runtimeExceptions.length === 0, `Houve exceções do navegador: ${runtimeExceptions.join(" | ")}`);
    assert(consoleErrors.length === 0, `Houve erros no console do navegador: ${consoleErrors.join(" | ")}`);
    assert(smokeConsoleErrors.length === 0, `console.error foi chamado na página: ${smokeConsoleErrors.join(" | ")}`);
    assert(smokeUncaughtErrors.length === 0, `A página registrou erros não tratados: ${smokeUncaughtErrors.join(" | ")}`);

    console.log("Smoke test concluído com sucesso.");
    console.log(`URL validada: http://127.0.0.1:${server.port}/index.html`);
  } finally {
    stopListening();
    cdp?.close();
    const cleanupResults = await Promise.allSettled([chrome.close(), server.close()]);
    cleanupResults
      .filter((result) => result.status === "rejected")
      .forEach((result) => {
        console.warn(`Aviso: falha durante a limpeza do smoke test: ${result.reason?.message || result.reason}`);
      });
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
