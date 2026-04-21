function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

async function buildAccessHash(code, iterations) {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(code),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return {
    saltBase64: bytesToBase64(salt),
    codeHashBase64: bytesToBase64(new Uint8Array(derivedBits)),
  };
}

const form = document.querySelector("#access-generator-form");
const codeInput = document.querySelector("#generator-code");
const codeConfirmInput = document.querySelector("#generator-code-confirm");
const feedback = document.querySelector("#generator-feedback");
const output = document.querySelector("#generator-output");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const code = codeInput.value.trim();
  const confirmation = codeConfirmInput.value.trim();

  if (code.length < 10) {
    feedback.textContent = "Use um codigo com pelo menos 10 caracteres.";
    feedback.className = "auth-feedback is-error";
    return;
  }

  if (code !== confirmation) {
    feedback.textContent = "Os dois campos precisam ser iguais.";
    feedback.className = "auth-feedback is-error";
    return;
  }

  if (!window.crypto?.subtle) {
    feedback.textContent = "Este navegador nao oferece Web Crypto para gerar o hash.";
    feedback.className = "auth-feedback is-error";
    return;
  }

  feedback.textContent = "Gerando hash seguro...";
  feedback.className = "auth-feedback";

  const iterations = 150000;
  const result = await buildAccessHash(code, iterations);

  output.value = `window.MEMBER_ACCESS_CONFIG = {
  courseTitle: "Academia DR",
  accessMessage:
    "Digite o codigo de acesso entregue ao aluno. Troque o hash padrao deste arquivo antes de compartilhar o link publicamente.",
  sessionHours: 12,
  passwordVersion: "v1",
  pbkdf2Iterations: ${iterations},
  saltBase64: "${result.saltBase64}",
  codeHashBase64: "${result.codeHashBase64}",
};`;

  feedback.textContent = "Configuracao gerada. Agora substitua o conteudo de access-config.js e publique novamente.";
  feedback.className = "auth-feedback is-success";
  output.select();
});
