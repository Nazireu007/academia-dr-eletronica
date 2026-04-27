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
          window.__smoke = { consoleErrors: [], lastOpenedWindow: null, openCalls: [], uncaughtErrors: [] };
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
              const openedWindow = {
                closed: false,
                close() {
                  this.closed = true;
                },
                location: { href: args[0] },
                opener: null,
              };
              window.__smoke.lastOpenedWindow = openedWindow;
              return openedWindow;
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
    const autoOpenEnabled = await evaluate(
      cdp,
      sessionId,
      'typeof appConfig !== "undefined" && appConfig.sponsoredAutoOpenEnabled === true'
    );

    await evaluate(
      cdp,
      sessionId,
      'window.__smoke.openCalls = []; window.__smoke.lastOpenedWindow = null; setActivePanel("public"); undefined;'
    );
    await clickCenter(cdp, sessionId, "#resume-course");
    await delay(350);
    const sponsoredNavigationBeforeClose = await evaluate(
      cdp,
      sessionId,
      `
        ({
          panelName: state.activePanel,
          openCalls: window.__smoke.openCalls.length,
          opened: Boolean(window.__smoke.lastOpenedWindow),
          pending: document.querySelector("#resume-course")?.classList.contains("is-sponsored-pending") || false,
        })
      `
    );
    await evaluate(cdp, sessionId, "window.__smoke.lastOpenedWindow?.close(); undefined;");
    await delay(700);
    const sponsoredNavigationAfterClose = await evaluate(
      cdp,
      sessionId,
      `
        ({
          panelName: state.activePanel,
          openCalls: window.__smoke.openCalls.length,
        })
      `
    );

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
        deviceScaleFactor: 1,
        height: 768,
        mobile: false,
        width: 1366,
      },
      sessionId
    );
    await evaluate(
      cdp,
      sessionId,
      `
        closePixModal();
        window.dispatchEvent(new Event("resize"));
        openPixModal();
        undefined;
      `
    );
    await delay(300);
    const desktopPixModalFit = await evaluate(
      cdp,
      sessionId,
      `
        (() => {
          const card = document.querySelector("#pix-modal .pix-card");
          const actions = document.querySelector("#pix-modal .auth-actions");
          const whatsappButton = document.querySelector("#pix-whatsapp-link");
          if (!card || !actions || !whatsappButton) return null;
          const cardRect = card.getBoundingClientRect();
          const actionsRect = actions.getBoundingClientRect();
          const whatsappRect = whatsappButton.getBoundingClientRect();
          return {
            actionsBottom: Math.round(actionsRect.bottom),
            cardBottom: Math.round(cardRect.bottom),
            cardTop: Math.round(cardRect.top),
            viewportHeight: window.innerHeight,
            whatsappBottom: Math.round(whatsappRect.bottom),
          };
        })()
      `
    );
    await evaluate(cdp, sessionId, "closePixModal(); undefined;");

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
          window.__smoke.openCalls = [];
          const target = document.querySelector("#resume-course");
          const first = shouldOpenSponsoredLinkAfterClick(target);
          if (first) openSponsoredWindow(getSmartlinkUrl());
          const second = shouldOpenSponsoredLinkAfterClick(target);
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

    await cdp.send(
      "Emulation.setDeviceMetricsOverride",
      {
        deviceScaleFactor: 1,
        height: 900,
        mobile: false,
        width: 1366,
      },
      sessionId
    );
    await evaluate(cdp, sessionId, 'window.dispatchEvent(new Event("resize")); undefined;');
    await delay(300);
    await evaluate(
      cdp,
      sessionId,
      `
        authState.session = { user: { id: "smoke-free", email: "gratis@example.com" } };
        authState.user = authState.session.user;
        authState.accessGranted = true;
        authState.accessStatus = "pending";
        state.member = { name: "Aluno Gratis", email: "gratis@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
        state.activePanel = "dashboard";
        window.__smoke.openCalls = [];
        window.__smoke.lastOpenedWindow = null;
        renderAll();
        setActivePanel("dashboard");
        undefined;
      `
    );
    await delay(450);
    const freeSponsoredButtonMatrix = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          const checks = [
            { selector: '.top-nav-link[data-panel-target="public"]', expectedPanel: "public", startPanel: "dashboard" },
            { selector: '.sidebar-link[data-panel-target="public"]', expectedPanel: "public", startPanel: "dashboard" },
            { selector: '.top-nav-link[data-panel-target="dashboard"]', expectedPanel: "dashboard", startPanel: "public" },
            {
              selector: '.top-nav-link[data-panel-target="course"]',
              expectedPanel: "course",
              startPanel: "public",
              presetCourseView: "modules",
              expectedCourseView: "lesson",
            },
            { selector: '.top-nav-link[data-panel-target="library"]', expectedPanel: "library", startPanel: "public" },
            { selector: '.top-nav-link[data-panel-target="quiz"]', expectedPanel: "quiz", startPanel: "public" },
            { selector: '.top-nav-link[data-panel-target="certificate"]', expectedPanel: "certificate", startPanel: "public" },
            { selector: '.hud-chip[data-panel-target="dashboard"]', expectedPanel: "dashboard", startPanel: "course" },
            { selector: '.hud-chip[data-panel-target="quiz"]', expectedPanel: "quiz", startPanel: "dashboard" },
            { selector: '.hud-chip[data-panel-target="certificate"]', expectedPanel: "certificate", startPanel: "course" },
            { selector: "#open-next-lesson", expectedPanel: "course", startPanel: "dashboard" },
            {
              selector: "#open-course-panel",
              expectedPanel: "course",
              startPanel: "dashboard",
              presetCourseView: "modules",
              expectedCourseView: "lesson",
            },
            { selector: '.resource-link-card[data-open-panel="quiz"]', expectedPanel: "quiz", startPanel: "library" },
            { selector: '.resource-link-card[data-open-panel="certificate"]', expectedPanel: "certificate", startPanel: "library" },
          ];

          const runOne = (index, results) => {
            if (index >= checks.length) {
              resolve(results);
              return;
            }

            const check = checks[index];
            state.activePanel = check.startPanel;
            uiState.mobileCourseView = check.presetCourseView || "lesson";
            uiState.mobilePublicView = check.presetPublicView || "plans";
            renderAll();
            setActivePanel(check.startPanel);
            window.__smoke.openCalls = [];
            window.__smoke.lastOpenedWindow = null;

            const target = document.querySelector(check.selector);
            if (!target) {
              results.push({ ...check, found: false });
              runOne(index + 1, results);
              return;
            }

            target.click();
            const beforeClosePanel = state.activePanel;
            const pendingBeforeClose = target.classList.contains("is-sponsored-pending");
            const adWindow = window.__smoke.lastOpenedWindow;
            adWindow?.close();
            window.dispatchEvent(new Event("focus"));

            window.setTimeout(() => {
              const activeTopNav = document.querySelector('.top-nav-link.is-active');
              const activeSidebarLink = document.querySelector('.sidebar-link.is-active');
              const activeHud = document.querySelector('.hud-chip.is-active');
              results.push({
                ...check,
                afterClosePanel: state.activePanel,
                afterCourseView: uiState.mobileCourseView,
                afterPublicView: uiState.mobilePublicView,
                afterNavActiveTarget: activeTopNav?.dataset.panelTarget || null,
                afterSidebarActiveTarget: activeSidebarLink?.dataset.panelTarget || null,
                afterHudActiveTarget: activeHud?.dataset.panelTarget || null,
                afterHudPressed: activeHud?.getAttribute("aria-pressed") || null,
                beforeClosePanel,
                found: true,
                openCalls: window.__smoke.openCalls.length,
                pendingAfterClose: target.classList.contains("is-sponsored-pending"),
                pendingBeforeClose,
                shouldOpen: window.__smoke.openCalls.length === 1,
              });
              window.setTimeout(() => {
                runOne(index + 1, results);
              }, 30);
            }, 750);
          };

          runOne(0, []);
        }))()
      `
    );
    const freeCourseFlowMatrix = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          const publicLessons = course.lessons.filter((lesson) => isLessonPublic(lesson));
          const results = {
            publicLessonCount: publicLessons.length,
            sidebarStep: null,
            nextStep: null,
            prevStep: null,
          };

          if (publicLessons.length < 2) {
            resolve(results);
            return;
          }

          const firstLessonId = publicLessons[0].id;
          const secondLessonId = publicLessons[1].id;

          const resetFreeCourseState = (lessonId) => {
            authState.session = { user: { id: "smoke-free", email: "gratis@example.com" } };
            authState.user = authState.session.user;
            authState.accessGranted = true;
            authState.accessStatus = "pending";
            state.member = { name: "Aluno Gratis", email: "gratis@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
            state.selectedLessonId = lessonId;
            state.activePanel = "course";
            renderAll();
            setActivePanel("course");
            window.__smoke.openCalls = [];
            window.__smoke.lastOpenedWindow = null;
          };

          resetFreeCourseState(firstLessonId);
          const sidebarTarget = document.querySelector('[data-lesson-id="' + secondLessonId + '"]');
          sidebarTarget?.click();
          const sidebarBeforeClose = state.selectedLessonId;
          window.__smoke.lastOpenedWindow?.close();
          window.dispatchEvent(new Event("focus"));

          window.setTimeout(() => {
            results.sidebarStep = {
              beforeCloseLesson: sidebarBeforeClose,
              afterCloseLesson: state.selectedLessonId,
              openCalls: window.__smoke.openCalls.length,
            };

            window.setTimeout(() => {
              resetFreeCourseState(firstLessonId);
              const nextTarget = document.querySelector("#next-lesson");
              nextTarget?.click();
              const nextBeforeClose = state.selectedLessonId;
              window.__smoke.lastOpenedWindow?.close();
              window.dispatchEvent(new Event("focus"));

              window.setTimeout(() => {
                results.nextStep = {
                  beforeCloseLesson: nextBeforeClose,
                  afterCloseLesson: state.selectedLessonId,
                  openCalls: window.__smoke.openCalls.length,
                };

                window.setTimeout(() => {
                  resetFreeCourseState(secondLessonId);
                  const prevTarget = document.querySelector("#prev-lesson");
                  prevTarget?.click();
                  const prevBeforeClose = state.selectedLessonId;
                  window.__smoke.lastOpenedWindow?.close();
                  window.dispatchEvent(new Event("focus"));

                  window.setTimeout(() => {
                    results.prevStep = {
                      beforeCloseLesson: prevBeforeClose,
                      afterCloseLesson: state.selectedLessonId,
                      openCalls: window.__smoke.openCalls.length,
                    };
                    resolve(results);
                  }, 750);
                }, 30);
              }, 750);
            }, 30);
          }, 750);
        }))()
      `
    );
    const guestCourseNavigationMatrix = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          const publicLessons = course.lessons.filter((lesson) => isLessonPublic(lesson));
          const results = [];
          const checks = [
            { selector: '.top-nav-link[data-panel-target="library"]', expectedPanel: "library" },
            { selector: '.top-nav-link[data-panel-target="certificate"]', expectedPanel: "certificate" },
          ];

          if (publicLessons.length === 0) {
            resolve(results);
            return;
          }

          const resetGuestCourseState = () => {
            authState.session = null;
            authState.user = null;
            authState.accessGranted = false;
            authState.accessStatus = "guest";
            state.activePanel = "course";
            state.selectedLessonId = publicLessons[0].id;
            renderAll();
            setActivePanel("course");
            window.__smoke.openCalls = [];
            window.__smoke.lastOpenedWindow = null;
          };

          const runOne = (index) => {
            if (index >= checks.length) {
              resolve(results);
              return;
            }

            const check = checks[index];
            resetGuestCourseState();
            const target = document.querySelector(check.selector);
            if (!target) {
              results.push({ ...check, found: false });
              runOne(index + 1);
              return;
            }

            target.click();
            const beforeClosePanel = state.activePanel;
            const pendingBeforeClose = target.classList.contains("is-sponsored-pending");
            window.__smoke.lastOpenedWindow?.close();
            window.dispatchEvent(new Event("focus"));

            window.setTimeout(() => {
              const activeTopNav = document.querySelector('.top-nav-link.is-active');
              const activeSidebarLink = document.querySelector('.sidebar-link.is-active');
              results.push({
                ...check,
                found: true,
                beforeClosePanel,
                afterClosePanel: state.activePanel,
                afterNavActiveTarget: activeTopNav?.dataset.panelTarget || null,
                afterSidebarActiveTarget: activeSidebarLink?.dataset.panelTarget || null,
                openCalls: window.__smoke.openCalls.length,
                pendingAfterClose: target.classList.contains("is-sponsored-pending"),
                pendingBeforeClose,
              });
              window.setTimeout(() => {
                runOne(index + 1);
              }, 30);
            }, 750);
          };

          runOne(0);
        }))()
      `
    );
    const freeInternalNavigationResult = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          state.activePanel = "dashboard";
          renderAll();
          setActivePanel("dashboard");
          window.__smoke.openCalls = [];
          window.__smoke.lastOpenedWindow = null;
          const target = document.querySelector("#open-course-panel");
          const eligibility = {
            adsEnabled: appConfig.adsEnabled,
            mobile: isMobileLayout(),
            navigationTarget: isSponsoredNavigationTarget(target),
            plan: getMemberPlanKind(),
            premiumAction: Boolean(isPremiumActionTarget(target)),
            skip: shouldSkipSponsoredParallelClick(target),
            smartlink: getSmartlinkUrl(),
            targetText: target?.textContent?.trim() || "",
          };
          target.click();
          const beforeClose = {
            panelName: state.activePanel,
            openCalls: window.__smoke.openCalls.length,
            opened: Boolean(window.__smoke.lastOpenedWindow),
          };
          window.__smoke.lastOpenedWindow?.close();
          window.dispatchEvent(new Event("focus"));
          window.setTimeout(() => {
            resolve({
              afterClose: {
                panelOpen: state.activePanel === "course",
                openCalls: window.__smoke.openCalls.length,
              },
              beforeClose,
              eligibility,
              shouldOpen: window.__smoke.openCalls.length === 1,
            });
          }, 700);
        }))()
      `
    );
    const sponsoredCloseWithoutFocusResult = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          authState.session = { user: { id: "smoke-no-focus", email: "nofocus@example.com" } };
          authState.user = authState.session.user;
          authState.accessGranted = true;
          authState.accessStatus = "pending";
          state.member = { name: "Aluno Sem Foco", email: "nofocus@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
          state.activePanel = "dashboard";
          window.__smoke.openCalls = [];
          window.__smoke.lastOpenedWindow = null;
          renderAll();
          setActivePanel("dashboard");

          const presentationTarget = document.querySelector('.top-nav-link[data-panel-target="public"]');
          presentationTarget?.click();
          window.dispatchEvent(new Event("blur"));
          const beforeClose = {
            panel: state.activePanel,
            opened: Boolean(window.__smoke.lastOpenedWindow),
            pending: presentationTarget?.classList.contains("is-sponsored-pending") || false,
          };
          window.__smoke.lastOpenedWindow?.close();

          window.setTimeout(() => {
            const activeTopNav = document.querySelector('.top-nav-link.is-active');
            const activeSidebarLink = document.querySelector('.sidebar-link.is-active');
            resolve({
              activeSidebarTarget: activeSidebarLink?.dataset.panelTarget || null,
              activeTopNavTarget: activeTopNav?.dataset.panelTarget || null,
              afterClosePanel: state.activePanel,
              beforeClose,
              openCalls: window.__smoke.openCalls.length,
              pendingAfterClose: presentationTarget?.classList.contains("is-sponsored-pending") || false,
            });
          }, 900);
        }))()
      `
    );
    const sponsoredHudCloseWithoutFocusResult = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          authState.session = { user: { id: "smoke-hud-no-focus", email: "hudnofocus@example.com" } };
          authState.user = authState.session.user;
          authState.accessGranted = true;
          authState.accessStatus = "pending";
          state.member = { name: "Aluno HUD", email: "hudnofocus@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
          state.activePanel = "dashboard";
          window.__smoke.openCalls = [];
          window.__smoke.lastOpenedWindow = null;
          renderAll();
          setActivePanel("dashboard");

          const hudTarget = document.querySelector('.hud-chip[data-panel-target="certificate"]');
          hudTarget?.click();
          window.dispatchEvent(new Event("blur"));
          const beforeClose = {
            panel: state.activePanel,
            opened: Boolean(window.__smoke.lastOpenedWindow),
            pending: hudTarget?.classList.contains("is-sponsored-pending") || false,
          };
          window.__smoke.lastOpenedWindow?.close();

          window.setTimeout(() => {
            const activeHud = document.querySelector('.hud-chip.is-active');
            resolve({
              activeHudPressed: activeHud?.getAttribute("aria-pressed") || null,
              activeHudTarget: activeHud?.dataset.panelTarget || null,
              afterClosePanel: state.activePanel,
              beforeClose,
              openCalls: window.__smoke.openCalls.length,
              pendingAfterClose: hudTarget?.classList.contains("is-sponsored-pending") || false,
            });
          }, 900);
        }))()
      `
    );
    const supabaseRefreshDoesNotClobberNavigationResult = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          const originalLoadRemoteProfile = loadRemoteProfile;
          const originalRefreshRemoteAccessStatus = refreshRemoteAccessStatus;
          const originalPullRemoteState = pullRemoteState;
          const originalScheduleRemoteSync = scheduleRemoteSync;

          const session = { user: { id: "smoke-auth-clobber", email: "clobber@example.com", user_metadata: { name: "Clobber" } } };
          saveJSON(storageKeys.supabaseUser, session.user.id);
          authState.session = session;
          authState.user = session.user;
          authState.profileExists = true;
          authState.accessGranted = true;
          authState.accessStatus = "pending";
          authState.isAdmin = false;
          authState.profileRole = "student";
          state.member = { name: "Aluno Clobber", email: "clobber@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
          state.activePanel = "dashboard";
          window.__smoke.openCalls = [];
          window.__smoke.lastOpenedWindow = null;
          renderAll();
          setActivePanel("dashboard");

          loadRemoteProfile = async () => {
            authState.profileExists = true;
            authState.isAdmin = false;
            authState.profileRole = "student";
            state.member = { name: "Aluno Clobber", email: "clobber@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
            return true;
          };
          refreshRemoteAccessStatus = async () => {
            authState.accessStatus = "pending";
            authState.accessGranted = true;
            return true;
          };
          pullRemoteState = async () => {
            applyRemoteStatePayload({
              activePanel: "dashboard",
              completed: [],
              favorites: [],
              notes: {},
              quizAnswers: {},
              quizResult: null,
              selectedLessonId: course.lessons[0]?.id,
            });
          };
          scheduleRemoteSync = () => {};

          const presentationTarget = document.querySelector('.top-nav-link[data-panel-target="public"]');
          presentationTarget?.click();
          window.dispatchEvent(new Event("blur"));
          window.__smoke.lastOpenedWindow?.close();

          window.setTimeout(async () => {
            const afterSponsoredClosePanel = state.activePanel;
            await applySupabaseSession(session);
            const activeTopNav = document.querySelector('.top-nav-link.is-active');
            const activeSidebarLink = document.querySelector('.sidebar-link.is-active');
            const result = {
              activeSidebarTarget: activeSidebarLink?.dataset.panelTarget || null,
              activeTopNavTarget: activeTopNav?.dataset.panelTarget || null,
              afterRefreshPanel: state.activePanel,
              afterSponsoredClosePanel,
              openCalls: window.__smoke.openCalls.length,
            };

            loadRemoteProfile = originalLoadRemoteProfile;
            refreshRemoteAccessStatus = originalRefreshRemoteAccessStatus;
            pullRemoteState = originalPullRemoteState;
            scheduleRemoteSync = originalScheduleRemoteSync;
            resolve(result);
          }, 900);
        }))()
      `
    );
    const supabaseRefreshDoesNotClobberHudResult = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          const originalLoadRemoteProfile = loadRemoteProfile;
          const originalRefreshRemoteAccessStatus = refreshRemoteAccessStatus;
          const originalPullRemoteState = pullRemoteState;
          const originalScheduleRemoteSync = scheduleRemoteSync;

          const session = { user: { id: "smoke-hud-clobber", email: "hudclobber@example.com", user_metadata: { name: "HUD" } } };
          saveJSON(storageKeys.supabaseUser, session.user.id);
          authState.session = session;
          authState.user = session.user;
          authState.profileExists = true;
          authState.accessGranted = true;
          authState.accessStatus = "pending";
          authState.isAdmin = false;
          authState.profileRole = "student";
          state.member = { name: "Aluno HUD Clobber", email: "hudclobber@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
          state.activePanel = "dashboard";
          window.__smoke.openCalls = [];
          window.__smoke.lastOpenedWindow = null;
          renderAll();
          setActivePanel("dashboard");

          loadRemoteProfile = async () => {
            authState.profileExists = true;
            authState.isAdmin = false;
            authState.profileRole = "student";
            state.member = { name: "Aluno HUD Clobber", email: "hudclobber@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
            return true;
          };
          refreshRemoteAccessStatus = async () => {
            authState.accessStatus = "pending";
            authState.accessGranted = true;
            return true;
          };
          pullRemoteState = async () => {
            applyRemoteStatePayload({
              activePanel: "dashboard",
              completed: [],
              favorites: [],
              notes: {},
              quizAnswers: {},
              quizResult: null,
              selectedLessonId: course.lessons[0]?.id,
            });
          };
          scheduleRemoteSync = () => {};

          const hudTarget = document.querySelector('.hud-chip[data-panel-target="certificate"]');
          hudTarget?.click();
          window.dispatchEvent(new Event("blur"));
          window.__smoke.lastOpenedWindow?.close();

          window.setTimeout(async () => {
            const afterSponsoredClosePanel = state.activePanel;
            await applySupabaseSession(session);
            const activeHud = document.querySelector('.hud-chip.is-active');
            const result = {
              activeHudPressed: activeHud?.getAttribute("aria-pressed") || null,
              activeHudTarget: activeHud?.dataset.panelTarget || null,
              afterRefreshPanel: state.activePanel,
              afterSponsoredClosePanel,
              openCalls: window.__smoke.openCalls.length,
            };

            loadRemoteProfile = originalLoadRemoteProfile;
            refreshRemoteAccessStatus = originalRefreshRemoteAccessStatus;
            pullRemoteState = originalPullRemoteState;
            scheduleRemoteSync = originalScheduleRemoteSync;
            resolve(result);
          }, 900);
        }))()
      `
    );
    const pendingClickLockResult = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          authState.session = { user: { id: "smoke-free-lock", email: "gratis2@example.com" } };
          authState.user = authState.session.user;
          authState.accessGranted = true;
          authState.accessStatus = "pending";
          state.member = { name: "Aluno Gratis 2", email: "gratis2@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
          state.activePanel = "public";
          window.__smoke.openCalls = [];
          window.__smoke.lastOpenedWindow = null;
          renderAll();
          setActivePanel("public");

          const firstTarget = document.querySelector('.top-nav-link[data-panel-target="dashboard"]');
          const secondTarget = document.querySelector('.top-nav-link[data-panel-target="course"]');
          firstTarget?.click();
          const panelAfterFirstClick = state.activePanel;
          const openCallsAfterFirstClick = window.__smoke.openCalls.length;
          const pendingAfterFirstClick = firstTarget?.classList.contains("is-sponsored-pending") || false;
          secondTarget?.click();
          const panelAfterSecondClick = state.activePanel;
          const openCallsAfterSecondClick = window.__smoke.openCalls.length;
          const pendingFirstAfterSecondClick = firstTarget?.classList.contains("is-sponsored-pending") || false;
          const pendingSecondAfterSecondClick = secondTarget?.classList.contains("is-sponsored-pending") || false;

          window.__smoke.lastOpenedWindow?.close();
          window.dispatchEvent(new Event("focus"));

          window.setTimeout(() => {
            resolve({
              openCallsAfterFirstClick,
              openCallsAfterSecondClick,
              panelAfterFirstClick,
              panelAfterSecondClick,
              pendingAfterFirstClick,
              pendingFirstAfterSecondClick,
              pendingSecondAfterSecondClick,
              finalPanel: state.activePanel,
            });
          }, 700);
        }))()
      `
    );
    const sponsoredTargetSnapshotResult = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          authState.session = { user: { id: "smoke-snapshot", email: "snapshot@example.com" } };
          authState.user = authState.session.user;
          authState.accessGranted = true;
          authState.accessStatus = "pending";
          state.member = { name: "Aluno Snapshot", email: "snapshot@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
          state.activePanel = "public";
          window.__smoke.openCalls = [];
          window.__smoke.lastOpenedWindow = null;
          renderAll();
          setActivePanel("public");

          const firstTarget = document.createElement("button");
          firstTarget.type = "button";
          firstTarget.dataset.panelTarget = "dashboard";
          firstTarget.textContent = "Destino original";

          const secondTarget = document.createElement("button");
          secondTarget.type = "button";
          secondTarget.dataset.panelTarget = "course";
          secondTarget.textContent = "Destino concorrente";

          document.body.append(firstTarget, secondTarget);

          let replayedPanel = null;
          bindSponsoredClick(firstTarget, ({ dataset }) => {
            replayedPanel = dataset.panelTarget;
            openPrimaryPanel(dataset.panelTarget);
          });
          bindSponsoredClick(secondTarget, ({ dataset }) => {
            replayedPanel = dataset.panelTarget;
            openPrimaryPanel(dataset.panelTarget);
          });

          firstTarget.click();
          const pendingBeforeMutation = firstTarget.classList.contains("is-sponsored-pending");
          firstTarget.dataset.panelTarget = "certificate";
          secondTarget.click();
          const openCallsAfterSecondClick = window.__smoke.openCalls.length;

          window.__smoke.lastOpenedWindow?.close();
          window.dispatchEvent(new Event("focus"));

          window.setTimeout(() => {
            const result = {
              finalPanel: state.activePanel,
              openCalls: window.__smoke.openCalls.length,
              openCallsAfterSecondClick,
              pendingAfterClose: firstTarget.classList.contains("is-sponsored-pending"),
              pendingBeforeMutation,
              replayedPanel,
            };
            firstTarget.remove();
            secondTarget.remove();
            resolve(result);
          }, 750);
        }))()
      `
    );
    const focusOwnedReplayResult = await evaluate(
      cdp,
      sessionId,
      `
        (() => new Promise((resolve) => {
          authState.session = { user: { id: "smoke-focus-owner", email: "gratis3@example.com" } };
          authState.user = authState.session.user;
          authState.accessGranted = true;
          authState.accessStatus = "pending";
          state.member = { name: "Aluno Gratis 3", email: "gratis3@example.com", goal: "aprender eletronica", rhythm: "20 min por dia", joinedAt: new Date().toISOString() };
          state.activePanel = "public";
          window.__smoke.openCalls = [];
          window.__smoke.lastOpenedWindow = null;
          renderAll();
          setActivePanel("public");

          let replayCount = 0;
          const target = document.querySelector('.top-nav-link[data-panel-target="quiz"]');
          const fakeWindow = { closed: false };
          resumeActionAfterSponsoredClose(() => {
            replayCount += 1;
            openPrimaryPanel("quiz");
          }, fakeWindow, target);

          window.dispatchEvent(new Event("blur"));

          window.setTimeout(() => {
            const beforeFocus = {
              replayCount,
              panel: state.activePanel,
              pending: Boolean(pendingSponsoredResume),
              pendingTarget: target?.classList.contains("is-sponsored-pending") || false,
            };

            window.dispatchEvent(new Event("focus"));

            window.setTimeout(() => {
              resolve({
                beforeFocus,
                afterFocus: {
                  replayCount,
                  panel: state.activePanel,
                  pending: Boolean(pendingSponsoredResume),
                  pendingTarget: target?.classList.contains("is-sponsored-pending") || false,
                },
              });
            }, 900);
          }, 250);
        }))()
      `
    );
    const smokeConsoleErrors = await evaluate(cdp, sessionId, "window.__smoke.consoleErrors");
    const smokeUncaughtErrors = await evaluate(cdp, sessionId, "window.__smoke.uncaughtErrors");

    assert(title.includes("Nitro Scan Pro"), "O título da página não carregou corretamente.");
    assert(guestMode, "A página pública deveria iniciar em modo visitante.");
    assert(!topAdVisible, "O bloco físico de anúncio público deveria ficar oculto.");
    assert(!topAdFallbackVisible, "O fallback físico do anúncio público não deveria aparecer.");
    assert(checkoutRel.includes("noopener") && checkoutRel.includes("noreferrer"), "O link de checkout está sem rel seguro.");
    assert(whatsappRel.includes("noopener") && whatsappRel.includes("noreferrer"), "O link de WhatsApp está sem rel seguro.");
    assert(
      sponsoredLinkRel.includes("sponsored") && sponsoredLinkRel.includes("nofollow"),
      "O link patrocinado não recebeu os atributos corretos."
    );
    assert(autoOpenEnabled, "A abertura do smartlink patrocinado deveria estar ativada para o plano gratuito.");
    assert(sponsoredNavigationBeforeClose.opened, "O primeiro clique elegivel deveria abrir o smartlink patrocinado.");
    assert(sponsoredNavigationBeforeClose.openCalls === 1, "O primeiro clique elegivel deveria abrir apenas um anuncio.");
    assert(sponsoredNavigationBeforeClose.pending, "O botao clicado deveria ficar pendente ate o fechamento do anuncio.");
    assert(sponsoredNavigationBeforeClose.panelName === "public", "A navegacao patrocinada deveria aguardar o fechamento do anuncio.");
    assert(sponsoredNavigationAfterClose.panelName === "course", "A acao do botao deveria ser aplicada apos fechar o anuncio.");
    assert(sponsoredNavigationAfterClose.openCalls === 1, "A acao retomada nao deveria abrir outro anuncio.");
    assert(accessModalOpen, "O botão principal deveria abrir o modal de acesso.");
    assert(openCallsAfterAccess === 0, "Uma ação crítica abriu janela paralela de anúncio.");
    assert(pixModalOpen, "O atalho de Pix deveria abrir o modal de pagamento.");
    assert(pixWhatsappHref.includes("wa.me/"), "O botão de comprovante no WhatsApp não foi configurado.");
    assert(desktopPixModalFit !== null, "Nao foi possivel medir o encaixe do modal Pix no desktop.");
    assert(
      desktopPixModalFit.cardTop >= 0 &&
        desktopPixModalFit.cardBottom <= desktopPixModalFit.viewportHeight + 2 &&
        desktopPixModalFit.actionsBottom <= desktopPixModalFit.viewportHeight + 2 &&
        desktopPixModalFit.whatsappBottom <= desktopPixModalFit.viewportHeight + 2,
      `O modal Pix no desktop ainda esta cortando os botoes inferiores: ${JSON.stringify(desktopPixModalFit)}`
    );
    assert(mobileSwitcherVisible, "A navegação móvel da apresentação não ficou visível no viewport reduzido.");
    assert(mobileSponsoredResult.mobile, "O smoke test deveria estar em viewport mobile.");
    assert(mobileSponsoredResult.mobileEnabled, "A monetizacao por clique mobile deveria estar ativa.");
    assert(mobileSponsoredResult.first === true, "O primeiro clique mobile elegivel deveria abrir anuncio.");
    assert(mobileSponsoredResult.second === true, "A elegibilidade mobile deveria permanecer ativa a cada novo clique.");
    assert(mobileSponsoredResult.openCalls >= 1, "O smartlink mobile nao abriu janela patrocinada no primeiro clique.");

    assert(!premiumDashboardAdVisible, "O painel premium nao deveria exibir anuncios.");
    assert(premiumIntelligenceVisible, "O painel premium deveria exibir a inteligencia adaptativa.");
    assert(premiumOpenCallsAfterClicks === 0, "Cliques no premium nao deveriam abrir anuncios.");
    assert(
      freeSponsoredButtonMatrix.every((item) => item.found),
      `Nem todos os botoes monitorados do gratis foram encontrados: ${JSON.stringify(freeSponsoredButtonMatrix)}`
    );
    assert(
      freeSponsoredButtonMatrix.every((item) => item.shouldOpen),
      `Algum botao do gratis nao ficou elegivel para anuncio quando deveria: ${JSON.stringify(freeSponsoredButtonMatrix)}`
    );
    assert(
      freeSponsoredButtonMatrix.every((item) => item.openCalls === 1),
      `Algum botao do gratis nao abriu exatamente um anuncio: ${JSON.stringify(freeSponsoredButtonMatrix)}`
    );
    assert(
      freeSponsoredButtonMatrix.every((item) => item.pendingBeforeClose && item.pendingAfterClose === false),
      `Algum botao do gratis nao manteve o estado pendente corretamente durante o anuncio: ${JSON.stringify(freeSponsoredButtonMatrix)}`
    );
    assert(
      freeSponsoredButtonMatrix.every((item) => item.afterClosePanel === item.expectedPanel),
      `Algum botao do gratis nao retomou para o painel certo: ${JSON.stringify(freeSponsoredButtonMatrix)}`
    );
    assert(
      freeSponsoredButtonMatrix.every((item) => item.afterNavActiveTarget === item.expectedPanel),
      `A navegacao superior do gratis nao refletiu o painel retomado: ${JSON.stringify(freeSponsoredButtonMatrix)}`
    );
    assert(
      freeSponsoredButtonMatrix.every((item) => item.afterSidebarActiveTarget === item.expectedPanel),
      `A navegacao lateral do gratis nao refletiu o painel retomado: ${JSON.stringify(freeSponsoredButtonMatrix)}`
    );
    assert(
      freeSponsoredButtonMatrix
        .filter((item) => item.expectedCourseView)
        .every((item) => item.afterCourseView === item.expectedCourseView),
      `Algum atalho que abre o player nao restaurou a subview correta: ${JSON.stringify(freeSponsoredButtonMatrix)}`
    );
    assert(
      freeSponsoredButtonMatrix
        .filter((item) => ["dashboard", "quiz", "certificate"].includes(item.expectedPanel))
        .every((item) => item.afterHudActiveTarget === item.expectedPanel && item.afterHudPressed === "true"),
      `O HUD nao refletiu corretamente o painel ativo apos a navegacao gratuita: ${JSON.stringify(freeSponsoredButtonMatrix)}`
    );
    assert(
      freeCourseFlowMatrix.publicLessonCount >= 2,
      `O smoke do player gratis precisa de pelo menos 2 aulas publicas: ${JSON.stringify(freeCourseFlowMatrix)}`
    );
    assert(
      freeCourseFlowMatrix.sidebarStep?.openCalls === 1 &&
        freeCourseFlowMatrix.sidebarStep?.beforeCloseLesson !== freeCourseFlowMatrix.sidebarStep?.afterCloseLesson,
      `A troca de aula pelo menu lateral no gratis nao retomou corretamente: ${JSON.stringify(freeCourseFlowMatrix)}`
    );
    assert(
      freeCourseFlowMatrix.nextStep?.openCalls === 1 &&
        freeCourseFlowMatrix.nextStep?.beforeCloseLesson !== freeCourseFlowMatrix.nextStep?.afterCloseLesson,
      `O botao proxima aula no gratis nao retomou corretamente: ${JSON.stringify(freeCourseFlowMatrix)}`
    );
    assert(
      freeCourseFlowMatrix.prevStep?.openCalls === 1 &&
        freeCourseFlowMatrix.prevStep?.beforeCloseLesson !== freeCourseFlowMatrix.prevStep?.afterCloseLesson,
      `O botao aula anterior no gratis nao retomou corretamente: ${JSON.stringify(freeCourseFlowMatrix)}`
    );
    assert(
      guestCourseNavigationMatrix.length === 2 && guestCourseNavigationMatrix.every((item) => item.found),
      `Nem todos os atalhos do player gratuito foram encontrados: ${JSON.stringify(guestCourseNavigationMatrix)}`
    );
    assert(
      guestCourseNavigationMatrix.every((item) => item.openCalls === 1),
      `Os atalhos do player gratuito deveriam abrir exatamente um anuncio: ${JSON.stringify(guestCourseNavigationMatrix)}`
    );
    assert(
      guestCourseNavigationMatrix.every((item) => item.pendingBeforeClose && item.pendingAfterClose === false),
      `Os atalhos do player gratuito nao ficaram pendentes corretamente durante o anuncio: ${JSON.stringify(guestCourseNavigationMatrix)}`
    );
    assert(
      guestCourseNavigationMatrix.every((item) => item.afterClosePanel === item.expectedPanel),
      `Os atalhos do player gratuito nao retomaram o painel certo: ${JSON.stringify(guestCourseNavigationMatrix)}`
    );
    assert(
      guestCourseNavigationMatrix.every((item) => item.afterNavActiveTarget === item.expectedPanel),
      `A navegacao superior publica nao refletiu o painel retomado: ${JSON.stringify(guestCourseNavigationMatrix)}`
    );
    assert(
      guestCourseNavigationMatrix.every((item) => item.afterSidebarActiveTarget === item.expectedPanel),
      `A navegacao lateral publica nao refletiu o painel retomado: ${JSON.stringify(guestCourseNavigationMatrix)}`
    );
    assert(
      freeInternalNavigationResult.beforeClose.opened,
      `A navegacao interna gratuita deveria abrir o anuncio quando o clique estiver elegivel: ${JSON.stringify(
        freeInternalNavigationResult
      )}`
    );
    assert(freeInternalNavigationResult.shouldOpen, "A navegacao interna gratuita deveria estar elegivel para o anuncio.");
    assert(freeInternalNavigationResult.beforeClose.openCalls === 1, "A navegacao interna gratuita deveria abrir apenas uma janela patrocinada.");
    assert(freeInternalNavigationResult.beforeClose.panelName !== "course", "O painel interno so deveria abrir depois que o anuncio fosse fechado.");
    assert(freeInternalNavigationResult.afterClose.panelOpen, "A navegacao interna deveria continuar automaticamente apos fechar o anuncio.");
    assert(freeInternalNavigationResult.afterClose.openCalls === 1, "A repeticao automatica da acao nao deveria abrir outro anuncio.");
    assert(
      sponsoredCloseWithoutFocusResult.beforeClose.opened &&
        sponsoredCloseWithoutFocusResult.beforeClose.pending &&
        sponsoredCloseWithoutFocusResult.openCalls === 1 &&
        sponsoredCloseWithoutFocusResult.afterClosePanel === "public" &&
        sponsoredCloseWithoutFocusResult.activeTopNavTarget === "public" &&
        sponsoredCloseWithoutFocusResult.activeSidebarTarget === "public" &&
        sponsoredCloseWithoutFocusResult.pendingAfterClose === false,
      `Fechar anuncio sem evento de foco deve abrir a Apresentacao original, nao manter Painel: ${JSON.stringify(
        sponsoredCloseWithoutFocusResult
      )}`
    );
    assert(
      sponsoredHudCloseWithoutFocusResult.beforeClose.opened &&
        sponsoredHudCloseWithoutFocusResult.beforeClose.pending &&
        sponsoredHudCloseWithoutFocusResult.openCalls === 1 &&
        sponsoredHudCloseWithoutFocusResult.afterClosePanel === "certificate" &&
        sponsoredHudCloseWithoutFocusResult.activeHudTarget === "certificate" &&
        sponsoredHudCloseWithoutFocusResult.activeHudPressed === "true" &&
        sponsoredHudCloseWithoutFocusResult.pendingAfterClose === false,
      `Fechar anuncio sem evento de foco deve executar o HUD clicado originalmente: ${JSON.stringify(
        sponsoredHudCloseWithoutFocusResult
      )}`
    );
    assert(
      supabaseRefreshDoesNotClobberNavigationResult.openCalls === 1 &&
        supabaseRefreshDoesNotClobberNavigationResult.afterSponsoredClosePanel === "public" &&
        supabaseRefreshDoesNotClobberNavigationResult.afterRefreshPanel === "public" &&
        supabaseRefreshDoesNotClobberNavigationResult.activeTopNavTarget === "public" &&
        supabaseRefreshDoesNotClobberNavigationResult.activeSidebarTarget === "public",
      `Refresh do Supabase com estado remoto antigo nao pode sobrescrever a Apresentacao clicada: ${JSON.stringify(
        supabaseRefreshDoesNotClobberNavigationResult
      )}`
    );
    assert(
      supabaseRefreshDoesNotClobberHudResult.openCalls === 1 &&
        supabaseRefreshDoesNotClobberHudResult.afterSponsoredClosePanel === "certificate" &&
        supabaseRefreshDoesNotClobberHudResult.afterRefreshPanel === "certificate" &&
        supabaseRefreshDoesNotClobberHudResult.activeHudTarget === "certificate" &&
        supabaseRefreshDoesNotClobberHudResult.activeHudPressed === "true",
      `Refresh do Supabase com estado remoto antigo nao pode sobrescrever o HUD clicado: ${JSON.stringify(
        supabaseRefreshDoesNotClobberHudResult
      )}`
    );
    assert(
      pendingClickLockResult.openCallsAfterFirstClick === 1 && pendingClickLockResult.openCallsAfterSecondClick === 1,
      `Um segundo clique durante o anuncio nao deveria abrir nova janela patrocinada: ${JSON.stringify(pendingClickLockResult)}`
    );
    assert(
      pendingClickLockResult.panelAfterFirstClick === "public" && pendingClickLockResult.panelAfterSecondClick === "public",
      `Nenhum painel deveria trocar enquanto o anuncio ainda estiver aberto: ${JSON.stringify(pendingClickLockResult)}`
    );
    assert(
      pendingClickLockResult.pendingAfterFirstClick &&
        pendingClickLockResult.pendingFirstAfterSecondClick &&
        pendingClickLockResult.pendingSecondAfterSecondClick === false,
      `O primeiro botao deveria permanecer dono da acao pendente ate o fechamento do anuncio: ${JSON.stringify(pendingClickLockResult)}`
    );
    assert(
      pendingClickLockResult.finalPanel === "dashboard",
      `Ao fechar o anuncio, a plataforma deveria executar a acao do primeiro clique apenas: ${JSON.stringify(pendingClickLockResult)}`
    );
    assert(
      sponsoredTargetSnapshotResult.pendingBeforeMutation &&
        sponsoredTargetSnapshotResult.openCallsAfterSecondClick === 1 &&
        sponsoredTargetSnapshotResult.openCalls === 1 &&
        sponsoredTargetSnapshotResult.replayedPanel === "dashboard" &&
        sponsoredTargetSnapshotResult.finalPanel === "dashboard" &&
        sponsoredTargetSnapshotResult.pendingAfterClose === false,
      `A acao patrocinada deve preservar o destino do clique original e ignorar outro botao: ${JSON.stringify(
        sponsoredTargetSnapshotResult
      )}`
    );
    assert(
      focusOwnedReplayResult.beforeFocus.replayCount === 0 &&
        focusOwnedReplayResult.beforeFocus.panel === "public" &&
        focusOwnedReplayResult.beforeFocus.pending &&
        focusOwnedReplayResult.beforeFocus.pendingTarget,
      `A acao patrocinada nao deveria escapar antes do retorno de foco do anuncio: ${JSON.stringify(focusOwnedReplayResult)}`
    );
    assert(
      focusOwnedReplayResult.afterFocus.replayCount === 1 &&
        focusOwnedReplayResult.afterFocus.panel === "quiz" &&
        focusOwnedReplayResult.afterFocus.pending === false &&
        focusOwnedReplayResult.afterFocus.pendingTarget === false,
      `Ao voltar do anuncio, a plataforma deveria retomar exatamente o destino original: ${JSON.stringify(focusOwnedReplayResult)}`
    );
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
