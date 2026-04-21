const studyPhases = [
  {
    title: "Fase 1",
    subtitle: "Fundamentos",
    items: [
      "Tensão, corrente, resistência e potência",
      "Lei de Ohm aplicada",
      "Leitura de componentes",
      "Uso básico do multímetro",
    ],
  },
  {
    title: "Fase 2",
    subtitle: "Bancada e soldagem",
    items: [
      "Organização da bancada",
      "Soldagem e dessoldagem",
      "Leitura de trilhas",
      "Esquemas simples",
    ],
  },
  {
    title: "Fase 3",
    subtitle: "Diagnóstico",
    items: [
      "Análise por blocos",
      "Testes de alimentação",
      "Identificação de curto",
      "Substituição correta de componentes",
    ],
  },
  {
    title: "Fase 4",
    subtitle: "Avançado",
    items: [
      "Retrabalho SMD",
      "Fonte de bancada no diagnóstico",
      "Osciloscópio e leitura de sinais",
      "Reparo de placas complexas",
    ],
  },
];

const quizQuestions = [
  {
    id: "q1",
    question: "Qual grandeza representa a oposição à passagem de corrente?",
    options: ["Potência", "Resistência", "Frequência", "Capacitância"],
    answer: 1,
    explanation: "Resistência é a grandeza que se opõe à passagem de corrente no circuito.",
  },
  {
    id: "q2",
    question: "Na Lei de Ohm, qual expressão calcula a corrente?",
    options: ["I = V ÷ R", "I = V × R", "I = R ÷ V", "I = P × V"],
    answer: 0,
    explanation: "A corrente é obtida dividindo a tensão pela resistência.",
  },
  {
    id: "q3",
    question: "Qual instrumento é mais básico para medir tensão, continuidade e resistência?",
    options: ["Osciloscópio", "Gerador de funções", "Multímetro", "Microscópio"],
    answer: 2,
    explanation: "O multímetro é a base da medição na bancada.",
  },
  {
    id: "q4",
    question: "Uma boa solda deve ser:",
    options: ["Opaca e rachada", "Brilhante e uniforme", "Excessivamente volumosa", "Feita sem aquecer a ilha"],
    answer: 1,
    explanation: "O curso destaca que uma boa solda deve ficar brilhante, uniforme e bem assentada.",
  },
  {
    id: "q5",
    question: "Na análise por blocos, qual é uma divisão comum de placa?",
    options: ["Entrada, proteção e saídas", "Somente LEDs e conectores", "Somente CI e resistores", "Microcontrolador e estética"],
    answer: 0,
    explanation: "A placa costuma ser dividida em entrada, proteção, reguladores, processamento e saídas.",
  },
  {
    id: "q6",
    question: "Em MOSFETs, curto direto entre dreno e fonte costuma indicar:",
    options: ["Funcionamento ideal", "Falha provável", "Frequência baixa", "Tensão regulada"],
    answer: 1,
    explanation: "Curto entre dreno e fonte é forte indicativo de falha.",
  },
  {
    id: "q7",
    question: "Para desbloquear o certificado nesta plataforma, você precisa:",
    options: ["Somente abrir todas as aulas", "Concluir as aulas e ser aprovado no quiz", "Fazer login duas vezes", "Apenas favoritar uma aula"],
    answer: 1,
    explanation: "O certificado depende da conclusão da trilha e da aprovação no quiz final.",
  },
  {
    id: "q8",
    question: "ESD é importante porque:",
    options: ["Aumenta a potência do circuito", "Evita danos por descarga eletrostática", "Substitui o multímetro", "Melhora o brilho da solda"],
    answer: 1,
    explanation: "ESD protege circuitos sensíveis contra descarga eletrostática.",
  },
];

const storageKeys = {
  member: "academia-dr-member-v4",
  completed: "academia-dr-completed-v4",
  selectedLesson: "academia-dr-selected-lesson-v4",
  favorites: "academia-dr-favorites-v4",
  notes: "academia-dr-notes-v4",
  activePanel: "academia-dr-panel-v4",
  quizAnswers: "academia-dr-quiz-answers-v4",
  quizResult: "academia-dr-quiz-result-v4",
  accessSession: "academia-dr-access-session-v1",
};

const dom = {
  accessModal: document.querySelector("#access-modal"),
  accessForm: document.querySelector("#access-form"),
  accessCodeInput: document.querySelector("#access-code-input"),
  accessCopy: document.querySelector("#access-copy"),
  accessFeedback: document.querySelector("#access-feedback"),
  authModal: document.querySelector("#auth-modal"),
  memberForm: document.querySelector("#member-form"),
  memberNameInput: document.querySelector("#member-name-input"),
  memberEmailInput: document.querySelector("#member-email-input"),
  memberGoalInput: document.querySelector("#member-goal-input"),
  memberRhythmInput: document.querySelector("#member-rhythm-input"),
  closeProfileModal: document.querySelector("#close-profile-modal"),
  profileModalTitle: document.querySelector("#profile-modal-title"),
  profileModalCopy: document.querySelector("#profile-modal-copy"),
  editProfile: document.querySelector("#edit-profile"),
  logoutButton: document.querySelector("#logout-button"),
  topNavLinks: [...document.querySelectorAll(".top-nav-link")],
  sidebarLinks: [...document.querySelectorAll(".sidebar-link")],
  panels: [...document.querySelectorAll(".member-panel")],
  memberName: document.querySelector("#member-name"),
  memberPlan: document.querySelector("#member-plan"),
  memberAvatar: document.querySelector("#member-avatar"),
  heroSubtitle: document.querySelector("#hero-subtitle"),
  heroTitle: document.querySelector("#hero-title"),
  heroText: document.querySelector("#hero-text"),
  resumeCourse: document.querySelector("#resume-course"),
  goToQuiz: document.querySelector("#go-to-quiz"),
  statModules: document.querySelector("#stat-modules"),
  statLessons: document.querySelector("#stat-lessons"),
  statHours: document.querySelector("#stat-hours"),
  statNotes: document.querySelector("#stat-notes"),
  memberGreeting: document.querySelector("#member-greeting"),
  memberGoalCopy: document.querySelector("#member-goal-copy"),
  memberRhythm: document.querySelector("#member-rhythm"),
  memberGoal: document.querySelector("#member-goal"),
  progressCount: document.querySelector("#progress-count"),
  progressCopy: document.querySelector("#progress-copy"),
  progressFill: document.querySelector("#progress-fill"),
  unlockChecklist: document.querySelector("#unlock-checklist"),
  nextLessonTitle: document.querySelector("#next-lesson-title"),
  nextLessonSummary: document.querySelector("#next-lesson-summary"),
  openNextLesson: document.querySelector("#open-next-lesson"),
  openCoursePanel: document.querySelector("#open-course-panel"),
  memberMetrics: document.querySelector("#member-metrics"),
  achievementGrid: document.querySelector("#achievement-grid"),
  timelineList: document.querySelector("#timeline-list"),
  lessonSearch: document.querySelector("#lesson-search"),
  moduleNav: document.querySelector("#module-nav"),
  favoriteLesson: document.querySelector("#favorite-lesson"),
  markComplete: document.querySelector("#mark-complete"),
  lessonBreadcrumb: document.querySelector("#lesson-breadcrumb"),
  lessonOverline: document.querySelector("#lesson-overline"),
  lessonTitle: document.querySelector("#lesson-title"),
  lessonSummary: document.querySelector("#lesson-summary"),
  lessonPosition: document.querySelector("#lesson-position"),
  lessonDuration: document.querySelector("#lesson-duration"),
  lessonStatus: document.querySelector("#lesson-status"),
  lessonModuleName: document.querySelector("#lesson-module-name"),
  lessonContent: document.querySelector("#lesson-content"),
  prevLesson: document.querySelector("#prev-lesson"),
  nextLesson: document.querySelector("#next-lesson"),
  lessonOutline: document.querySelector("#lesson-outline"),
  moduleProgressCopy: document.querySelector("#module-progress-copy"),
  moduleProgressFill: document.querySelector("#module-progress-fill"),
  lessonNote: document.querySelector("#lesson-note"),
  favoriteList: document.querySelector("#favorite-list"),
  noteList: document.querySelector("#note-list"),
  resourceLinks: document.querySelector("#resource-links"),
  quizList: document.querySelector("#quiz-list"),
  submitQuiz: document.querySelector("#submit-quiz"),
  quizScoreLabel: document.querySelector("#quiz-score-label"),
  quizResultCopy: document.querySelector("#quiz-result-copy"),
  printCertificate: document.querySelector("#print-certificate"),
  certificateCard: document.querySelector("#certificate-card"),
  certificateStudent: document.querySelector("#certificate-student"),
  certificateDate: document.querySelector("#certificate-date"),
  certificateId: document.querySelector("#certificate-id"),
  certificateStatusTitle: document.querySelector("#certificate-status-title"),
  certificateStatusCopy: document.querySelector("#certificate-status-copy"),
  glossaryPreview: document.querySelector("#glossary-preview"),
  hudProgressPercent: document.querySelector("#hud-progress-percent"),
  hudQuizStatus: document.querySelector("#hud-quiz-status"),
  hudCertificateStatus: document.querySelector("#hud-certificate-status"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function slugify(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function initials(name) {
  const parts = String(name || "Aluno")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "AL";
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeStored(key) {
  localStorage.removeItem(key);
}

const defaultAccessConfig = {
  courseTitle: "Academia DR",
  accessMessage:
    "Digite o codigo de acesso entregue ao aluno. Troque o hash padrao antes de vender o curso.",
  sessionHours: 12,
  passwordVersion: "v1",
  pbkdf2Iterations: 150000,
  saltBase64: "L83p4kLEhKVRIOI9fe6Fag==",
  codeHashBase64: "iiKH2pVjXMnnBer9m/mxgLLTbXM/ZMLU57ZnbR6hCKQ=",
};

const accessConfig = {
  ...defaultAccessConfig,
  ...(window.MEMBER_ACCESS_CONFIG || {}),
};

function decodeBase64(value) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function encodeBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

async function deriveAccessHash(code) {
  if (!window.crypto?.subtle) {
    throw new Error("Este navegador nao oferece Web Crypto para validar o acesso.");
  }

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(code),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: decodeBase64(accessConfig.saltBase64),
      iterations: accessConfig.pbkdf2Iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return encodeBase64(new Uint8Array(derivedBits));
}

async function verifyAccessCode(code) {
  const normalizedCode = String(code || "").trim();
  if (!normalizedCode) return false;
  const derived = await deriveAccessHash(normalizedCode);
  return derived === accessConfig.codeHashBase64;
}

function parseCourse(markdown) {
  const lines = markdown.split(/\r?\n/);
  const course = {
    title: "",
    subtitle: "",
    introLines: [],
    summary: [],
    modules: [],
  };

  let currentModule = null;
  let currentLesson = null;
  let mode = "intro";
  const subtitleLines = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("# ")) {
      course.title = trimmed.replace(/^#\s+/, "");
      return;
    }

    if (trimmed.startsWith(">")) {
      subtitleLines.push(trimmed.replace(/^>\s?/, ""));
      return;
    }

    if (trimmed === "## Sumário") {
      mode = "summary";
      return;
    }

    const moduleMatch = trimmed.match(/^##\s+Módulo\s+(\d+)\s+—\s+(.+)$/);
    if (moduleMatch) {
      currentModule = {
        number: String(moduleMatch[1]).padStart(2, "0"),
        title: moduleMatch[2],
        lessons: [],
      };
      course.modules.push(currentModule);
      currentLesson = null;
      mode = "module";
      return;
    }

    const lessonMatch = trimmed.match(/^###\s+(\d+)\.\s+(.+)$/);
    if (lessonMatch && currentModule) {
      currentLesson = {
        order: Number(lessonMatch[1]),
        title: lessonMatch[2],
        rawLines: [],
      };
      currentModule.lessons.push(currentLesson);
      mode = "lesson";
      return;
    }

    if (mode === "summary") {
      if (trimmed) {
        course.summary.push(trimmed);
      }
      return;
    }

    if (mode === "lesson" && currentLesson) {
      currentLesson.rawLines.push(line);
      return;
    }

    if (mode === "intro") {
      course.introLines.push(line);
    }
  });

  course.subtitle = subtitleLines.join(" ");
  course.intro = course.introLines.join("\n").trim();

  course.modules.forEach((module) => {
    module.lessons.forEach((lesson, indexInModule) => {
      lesson.moduleNumber = module.number;
      lesson.moduleTitle = module.title;
      lesson.indexInModule = indexInModule;
      lesson.id = `lesson-${String(lesson.order).padStart(2, "0")}-${slugify(lesson.title)}`;
      lesson.raw = lesson.rawLines.join("\n").trim();
      lesson.blocks = splitBlocks(lesson.raw);
      lesson.summary = extractSummary(lesson.blocks);
      lesson.outline = extractOutline(lesson.blocks);
      lesson.wordCount = lesson.raw.split(/\s+/).filter(Boolean).length;
      lesson.duration = Math.max(4, Math.ceil(lesson.wordCount / 155));
      delete lesson.rawLines;
    });
  });

  course.lessons = course.modules.flatMap((module) => module.lessons);
  course.totalDuration = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  course.glossary = extractGlossary(course);
  return course;
}

function splitBlocks(raw) {
  return raw
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean);
}

function isFormulaLine(line) {
  return /[=÷×²Ωµ]/.test(line) && line.length < 64;
}

function isShortHeading(line) {
  if (line.length > 64) return false;
  if (/[.!?]$/.test(line)) return false;
  if (line.includes(";")) return false;
  if (isFormulaLine(line)) return false;
  return line.split(/\s+/).filter(Boolean).length <= 8;
}

function isListLine(line) {
  return /;$/.test(line) || /^Exercício\s+\d+/i.test(line);
}

function renderBlock(block) {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  if (lines.length === 1) {
    const line = lines[0];
    if (isFormulaLine(line)) return `<div class="formula-line">${escapeHtml(line)}</div>`;
    if (isShortHeading(line)) return `<h4>${escapeHtml(line)}</h4>`;
    return `<p>${escapeHtml(line)}</p>`;
  }

  if (lines.every(isFormulaLine)) {
    return `<div class="formula-group">${lines
      .map((line) => `<div class="formula-line">${escapeHtml(line)}</div>`)
      .join("")}</div>`;
  }

  const listRatio = lines.filter(isListLine).length / lines.length;
  if (listRatio >= 0.7) {
    return `<ul>${lines
      .map((line) => `<li>${escapeHtml(line.replace(/;$/, ""))}</li>`)
      .join("")}</ul>`;
  }

  return `<p>${escapeHtml(lines.join(" "))}</p>`;
}

function extractSummary(blocks) {
  const paragraph = blocks.find((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    return lines.length > 0 && !isShortHeading(lines[0]) && !isFormulaLine(lines[0]);
  });

  if (!paragraph) return "Conteúdo pronto para estudo.";

  return paragraph
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
}

function extractOutline(blocks) {
  const headings = blocks
    .map((block) => block.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length === 1 && isShortHeading(lines[0]))
    .map((lines) => lines[0]);

  if (headings.length > 0) return headings.slice(0, 6);

  const listBlock = blocks.find((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    return lines.length >= 2 && lines.every(isListLine);
  });

  if (!listBlock) return [];

  return listBlock
    .split("\n")
    .map((line) => line.trim().replace(/;$/, ""))
    .filter(Boolean)
    .slice(0, 6);
}

function extractGlossary(course) {
  const glossaryLesson = course.lessons.find((lesson) => normalize(lesson.title).includes("glossario"));
  if (!glossaryLesson) return [];

  const items = [];
  glossaryLesson.blocks.forEach((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 1 && isShortHeading(lines[0])) {
      const next = glossaryLesson.blocks[index + 1];
      if (!next) return;
      items.push({
        term: lines[0],
        description: next
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .join(" "),
      });
    }
  });

  return items.slice(0, 6);
}

const course = parseCourse(window.COURSE_MARKDOWN || "");
const validLessonIds = new Set(course.lessons.map((lesson) => lesson.id));

function sanitizeLessonIdCollection(values) {
  return (Array.isArray(values) ? values : []).filter((value) => validLessonIds.has(value));
}

function sanitizeNotesMap(value) {
  return Object.fromEntries(
    Object.entries(value && typeof value === "object" ? value : {}).filter(([lessonId]) =>
      validLessonIds.has(lessonId)
    )
  );
}

function sanitizeQuizAnswers(value) {
  const source = value && typeof value === "object" ? value : {};
  return quizQuestions.reduce((accumulator, question) => {
    if (Number.isInteger(source[question.id])) {
      accumulator[question.id] = source[question.id];
    }
    return accumulator;
  }, {});
}

function getValidAccessSession() {
  const session = loadJSON(storageKeys.accessSession, null);
  if (!session || typeof session !== "object") return null;
  if (session.passwordVersion !== accessConfig.passwordVersion) return null;
  if (!session.expiresAt) return null;

  const expiresAt = new Date(session.expiresAt).getTime();
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    removeStored(storageKeys.accessSession);
    return null;
  }

  return session;
}

const state = {
  member: loadJSON(storageKeys.member, null),
  completed: new Set(sanitizeLessonIdCollection(loadJSON(storageKeys.completed, []))),
  favorites: new Set(sanitizeLessonIdCollection(loadJSON(storageKeys.favorites, []))),
  notes: sanitizeNotesMap(loadJSON(storageKeys.notes, {})),
  quizAnswers: sanitizeQuizAnswers(loadJSON(storageKeys.quizAnswers, {})),
  quizResult: loadJSON(storageKeys.quizResult, null),
  selectedLessonId: validLessonIds.has(loadJSON(storageKeys.selectedLesson, course.lessons[0]?.id))
    ? loadJSON(storageKeys.selectedLesson, course.lessons[0]?.id)
    : course.lessons[0]?.id,
  activePanel: loadJSON(storageKeys.activePanel, "dashboard"),
  query: "",
  accessSession: getValidAccessSession(),
};

function saveState() {
  saveJSON(storageKeys.member, state.member);
  saveJSON(storageKeys.completed, [...state.completed]);
  saveJSON(storageKeys.favorites, [...state.favorites]);
  saveJSON(storageKeys.notes, state.notes);
  saveJSON(storageKeys.quizAnswers, state.quizAnswers);
  saveJSON(storageKeys.quizResult, state.quizResult);
  saveJSON(storageKeys.selectedLesson, state.selectedLessonId);
  saveJSON(storageKeys.activePanel, state.activePanel);
  if (state.accessSession) {
    saveJSON(storageKeys.accessSession, state.accessSession);
  } else {
    removeStored(storageKeys.accessSession);
  }
}

function getLessonById(id) {
  return course.lessons.find((lesson) => lesson.id === id) || course.lessons[0];
}

function getLessonIndex(id) {
  return course.lessons.findIndex((lesson) => lesson.id === id);
}

function getModuleByNumber(number) {
  return course.modules.find((module) => module.number === number);
}

function getModuleProgress(module) {
  const done = module.lessons.filter((lesson) => state.completed.has(lesson.id)).length;
  const total = module.lessons.length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : (done / total) * 100,
  };
}

function getNextLesson() {
  return course.lessons.find((lesson) => !state.completed.has(lesson.id)) || course.lessons[0];
}

function getAnsweredQuizCount() {
  return quizQuestions.filter((question) => Number.isInteger(state.quizAnswers[question.id])).length;
}

function getCompletionPercent() {
  return course.lessons.length === 0 ? 0 : Math.round((state.completed.size / course.lessons.length) * 100);
}

function hasUnlockedCertificate() {
  return state.completed.size === course.lessons.length && Boolean(state.quizResult?.passed);
}

function hasActiveAccess() {
  state.accessSession = getValidAccessSession();
  return Boolean(state.accessSession);
}

function setAccessFeedback(message = "", tone = "") {
  dom.accessFeedback.textContent = message;
  dom.accessFeedback.classList.remove("is-error", "is-success");
  if (tone) {
    dom.accessFeedback.classList.add(tone);
  }
}

function openAccessModal(message = accessConfig.accessMessage) {
  dom.accessCopy.textContent = message;
  dom.accessModal.classList.add("is-open");
  dom.accessModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open", "access-locked");
  dom.accessCodeInput.value = "";
  setAccessFeedback("", "");
  dom.accessCodeInput.focus();
}

function closeAccessModal() {
  dom.accessModal.classList.remove("is-open");
  dom.accessModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("access-locked");
  if (!dom.authModal.classList.contains("is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function createAccessSession() {
  const now = Date.now();
  state.accessSession = {
    grantedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + accessConfig.sessionHours * 60 * 60 * 1000).toISOString(),
    passwordVersion: accessConfig.passwordVersion,
  };
  saveState();
}

function clearAccessSession() {
  state.accessSession = null;
  saveState();
}

function syncProfileModalCopy() {
  const isEditing = Boolean(state.member);
  dom.profileModalTitle.textContent = isEditing
    ? "Atualize seu perfil de aluno."
    : "Complete seu perfil inicial.";
  dom.profileModalCopy.textContent = isEditing
    ? "Ajuste seus dados, meta e ritmo de estudo sem perder o progresso salvo neste navegador."
    : "Seu perfil salva nome, e-mail, meta e ritmo de estudo neste navegador para personalizar a jornada.";
  dom.closeProfileModal.hidden = !isEditing;
}

function openAuthModal(prefill = false) {
  syncProfileModalCopy();
  dom.authModal.classList.add("is-open");
  dom.authModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (prefill && state.member) {
    dom.memberNameInput.value = state.member.name || "";
    dom.memberEmailInput.value = state.member.email || "";
    dom.memberGoalInput.value = state.member.goal || "dominar fundamentos";
    dom.memberRhythmInput.value = state.member.rhythm || "30 min por dia";
  }
}

function closeAuthModal() {
  dom.authModal.classList.remove("is-open");
  dom.authModal.setAttribute("aria-hidden", "true");
  if (!dom.accessModal.classList.contains("is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function setActivePanel(panelName) {
  state.activePanel = panelName;
  saveState();

  dom.panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === panelName);
  });

  [...dom.topNavLinks, ...dom.sidebarLinks].forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panelTarget === panelName);
  });
}

function renderProfile() {
  const member = state.member || {
    name: "Aluno",
    email: "",
    goal: "dominar fundamentos",
    rhythm: "30 min por dia",
  };

  dom.memberName.textContent = member.name;
  dom.memberPlan.textContent = member.email || "Plano local";
  dom.memberAvatar.textContent = initials(member.name);
  dom.heroSubtitle.textContent = `Área do aluno ${member.name}`;
  dom.heroTitle.textContent = course.title || "Curso Completo de Eletrônica";
  dom.heroText.textContent =
    "Uma experiência de membro com jornada guiada, player de aulas, revisão pessoal, avaliação final e certificado.";
  dom.memberGreeting.textContent = `Olá, ${member.name}. Seu laboratório digital está pronto.`;
  dom.memberGoalCopy.textContent = `Objetivo atual: ${member.goal}. A plataforma vai te ajudar a avançar no ritmo "${member.rhythm}".`;
  dom.memberRhythm.textContent = `Ritmo: ${member.rhythm}`;
  dom.memberGoal.textContent = `Objetivo: ${member.goal}`;
  dom.certificateStudent.textContent = member.name;
}

function renderHeroStats() {
  dom.statModules.textContent = String(course.modules.length);
  dom.statLessons.textContent = String(course.lessons.length);
  dom.statHours.textContent = `${Math.ceil(course.totalDuration / 60)}h`;
  dom.statNotes.textContent = String(
    Object.values(state.notes).filter((value) => String(value).trim().length > 0).length
  );
}

function renderHeaderHud() {
  dom.hudProgressPercent.textContent = `${getCompletionPercent()}%`;
  dom.hudQuizStatus.textContent = state.quizResult
    ? `${state.quizResult.score}%`
    : `${getAnsweredQuizCount()}/${quizQuestions.length}`;
  dom.hudCertificateStatus.textContent = hasUnlockedCertificate() ? "Liberado" : "Bloqueado";
}

function renderProgress() {
  const completedCount = state.completed.size;
  const percent = course.lessons.length === 0 ? 0 : (completedCount / course.lessons.length) * 100;

  dom.progressCount.textContent = `${completedCount} de ${course.lessons.length} aulas concluídas`;
  dom.progressCopy.textContent = `Você tem ${state.favorites.size} favorito(s), ${Object.values(state.notes).filter((value) => String(value).trim()).length} anotação(ões) e ${getAnsweredQuizCount()} resposta(s) no quiz.`;
  dom.progressFill.style.width = `${percent}%`;
}

function renderUnlockChecklist() {
  const items = [
    {
      label: "Concluir 100% das aulas",
      done: state.completed.size === course.lessons.length,
    },
    {
      label: "Atingir pelo menos 70% no quiz final",
      done: Boolean(state.quizResult?.passed),
    },
    {
      label: "Manter perfil do aluno preenchido",
      done: Boolean(state.member?.name && state.member?.email),
    },
  ];

  dom.unlockChecklist.innerHTML = items
    .map(
      (item) => `
        <li class="checklist-item ${item.done ? "is-done" : ""}">
          <span class="checkmark">${item.done ? "OK" : "--"}</span>
          <span>${escapeHtml(item.label)}</span>
        </li>
      `
    )
    .join("");
}

function renderDashboard() {
  const nextLesson = getNextLesson();
  const notesCount = Object.values(state.notes).filter((value) => String(value).trim()).length;
  const memberMetrics = [
    { label: "Aulas concluídas", value: `${state.completed.size}/${course.lessons.length}` },
    { label: "Favoritos", value: String(state.favorites.size) },
    { label: "Anotações salvas", value: String(notesCount) },
    { label: "Quiz final", value: state.quizResult ? `${state.quizResult.score}%` : "Pendente" },
  ];

  dom.nextLessonTitle.textContent = nextLesson.title;
  dom.nextLessonSummary.textContent = `${nextLesson.summary} Tempo estimado: ${nextLesson.duration} min.`;

  dom.memberMetrics.innerHTML = memberMetrics
    .map(
      (item) => `
        <article class="metric-item">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </article>
      `
    )
    .join("");

  const achievements = [
    {
      title: "Primeira faísca",
      text: "Concluir a primeira aula da trilha.",
      done: state.completed.size >= 1,
    },
    {
      title: "Ritmo de bancada",
      text: "Chegar a 25% do curso.",
      done: getCompletionPercent() >= 25,
    },
    {
      title: "Diagnóstico técnico",
      text: "Ser aprovado no quiz final.",
      done: Boolean(state.quizResult?.passed),
    },
    {
      title: "Conclusão profissional",
      text: "Liberar o certificado.",
      done: hasUnlockedCertificate(),
    },
  ];

  dom.achievementGrid.innerHTML = achievements
    .map(
      (achievement) => `
        <article class="achievement-card ${achievement.done ? "is-done" : ""}">
          <strong>${escapeHtml(achievement.title)}</strong>
          <p>${escapeHtml(achievement.text)}</p>
        </article>
      `
    )
    .join("");

  dom.timelineList.innerHTML = studyPhases
    .map((phase, index) => {
      const threshold = Math.round(((index + 1) / studyPhases.length) * 100);
      const unlocked = getCompletionPercent() >= threshold;
      return `
        <article class="timeline-item ${unlocked ? "is-done" : ""}">
          <span class="timeline-badge">${escapeHtml(phase.title)}</span>
          <div>
            <strong>${escapeHtml(phase.subtitle)}</strong>
            <p>${escapeHtml(phase.items.join(" • "))}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSidebarModules() {
  const query = normalize(state.query);

  dom.moduleNav.innerHTML = course.modules
    .map((module) => {
      const visibleLessons = module.lessons.filter((lesson) => {
        if (!query) return true;
        const haystack = normalize(`${module.title} ${lesson.title} ${lesson.summary}`);
        return haystack.includes(query);
      });

      if (query && visibleLessons.length === 0) return "";

      const progress = getModuleProgress(module);

      return `
        <section class="module-group">
          <div class="module-group-head">
            <div>
              <p class="module-kicker">Módulo ${module.number}</p>
              <h3>${escapeHtml(module.title)}</h3>
            </div>
            <span class="module-progress-badge">${progress.done}/${progress.total}</span>
          </div>
          <div class="mini-progress-track">
            <div class="mini-progress-fill" style="width: ${progress.percent}%"></div>
          </div>
          <div class="lesson-links">
            ${visibleLessons
              .map((lesson) => {
                const active = lesson.id === state.selectedLessonId;
                const completed = state.completed.has(lesson.id);
                const favorite = state.favorites.has(lesson.id);
                return `
                  <button class="lesson-link ${active ? "is-active" : ""} ${completed ? "is-done" : ""}" data-lesson-id="${lesson.id}" type="button">
                    <span class="lesson-link-order">${String(lesson.order).padStart(2, "0")}</span>
                    <span class="lesson-link-copy">
                      <strong>${escapeHtml(lesson.title)}</strong>
                      <small>${lesson.duration} min ${favorite ? "• favorita" : ""}</small>
                    </span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");

  dom.moduleNav.querySelectorAll("[data-lesson-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedLessonId = button.dataset.lessonId;
      saveState();
      renderCourse();
    });
  });
}

function renderCourse() {
  renderSidebarModules();

  const lesson = getLessonById(state.selectedLessonId);
  const lessonIndex = getLessonIndex(lesson.id);
  const module = getModuleByNumber(lesson.moduleNumber);
  const moduleProgress = getModuleProgress(module);
  const done = state.completed.has(lesson.id);
  const favorite = state.favorites.has(lesson.id);

  dom.lessonBreadcrumb.textContent = `Curso / Módulo ${lesson.moduleNumber} / Aula ${lesson.order}`;
  dom.lessonOverline.textContent = `Módulo ${lesson.moduleNumber}`;
  dom.lessonTitle.textContent = lesson.title;
  dom.lessonSummary.textContent = lesson.summary;
  dom.lessonPosition.textContent = `${lesson.order}/${course.lessons.length}`;
  dom.lessonDuration.textContent = `${lesson.duration} min`;
  dom.lessonStatus.textContent = done ? "Concluída" : "Em andamento";
  dom.lessonModuleName.textContent = lesson.moduleTitle;
  dom.lessonContent.innerHTML = lesson.blocks.map(renderBlock).join("");
  dom.lessonOutline.innerHTML =
    lesson.outline.length > 0
      ? lesson.outline.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
      : "<li>Leia a aula completa e anote os pontos mais importantes.</li>";
  dom.moduleProgressCopy.textContent = `${moduleProgress.done} de ${moduleProgress.total} aulas deste módulo concluídas.`;
  dom.moduleProgressFill.style.width = `${moduleProgress.percent}%`;
  dom.lessonNote.value = state.notes[lesson.id] || "";

  dom.favoriteLesson.textContent = favorite ? "Remover dos favoritos" : "Favoritar aula";
  dom.favoriteLesson.classList.toggle("is-complete", favorite);
  dom.markComplete.textContent = done ? "Marcar como pendente" : "Marcar como concluída";
  dom.markComplete.classList.toggle("is-complete", done);
  dom.prevLesson.disabled = lessonIndex <= 0;
  dom.nextLesson.disabled = lessonIndex >= course.lessons.length - 1;
}

function renderLibrary() {
  const favoriteLessons = course.lessons.filter((lesson) => state.favorites.has(lesson.id));
  const notedLessons = course.lessons.filter((lesson) => String(state.notes[lesson.id] || "").trim());

  dom.favoriteList.innerHTML =
    favoriteLessons.length > 0
      ? favoriteLessons
          .map(
            (lesson) => `
              <button class="library-item" data-open-lesson="${lesson.id}" type="button">
                <strong>${escapeHtml(lesson.title)}</strong>
                <span>Módulo ${lesson.moduleNumber} • ${lesson.duration} min</span>
              </button>
            `
          )
          .join("")
      : `<div class="empty-state">Nenhuma aula favorita ainda.</div>`;

  dom.noteList.innerHTML =
    notedLessons.length > 0
      ? notedLessons
          .map(
            (lesson) => `
              <button class="library-item" data-open-lesson="${lesson.id}" type="button">
                <strong>${escapeHtml(lesson.title)}</strong>
                <span>${escapeHtml(String(state.notes[lesson.id]).slice(0, 120))}</span>
              </button>
            `
          )
          .join("")
      : `<div class="empty-state">Suas anotações aparecerão aqui.</div>`;

  const resources = [
    {
      title: "Texto-base completo",
      meta: "Markdown original do curso",
      action: "markdown",
      href: "conteudo/curso-eletronica.md",
    },
    {
      title: "Abrir quiz final",
      meta: "Revisão e avaliação",
      action: "panel",
      panel: "quiz",
    },
    {
      title: "Emitir certificado",
      meta: "Disponível após desbloqueio",
      action: "panel",
      panel: "certificate",
    },
  ];

  dom.resourceLinks.innerHTML = resources
    .map((resource) => {
      if (resource.action === "markdown") {
        return `
          <a class="resource-link-card" href="${resource.href}">
            <strong>${escapeHtml(resource.title)}</strong>
            <span>${escapeHtml(resource.meta)}</span>
          </a>
        `;
      }

      return `
        <button class="resource-link-card" data-open-panel="${resource.panel}" type="button">
          <strong>${escapeHtml(resource.title)}</strong>
          <span>${escapeHtml(resource.meta)}</span>
        </button>
      `;
    })
    .join("");

  dom.favoriteList.querySelectorAll("[data-open-lesson]").forEach((button) => {
    button.addEventListener("click", () => openLessonFromLibrary(button.dataset.openLesson));
  });

  dom.noteList.querySelectorAll("[data-open-lesson]").forEach((button) => {
    button.addEventListener("click", () => openLessonFromLibrary(button.dataset.openLesson));
  });

  dom.resourceLinks.querySelectorAll("[data-open-panel]").forEach((button) => {
    button.addEventListener("click", () => setActivePanel(button.dataset.openPanel));
  });
}

function renderQuiz() {
  dom.quizList.innerHTML = quizQuestions
    .map((question, index) => {
      const selected = state.quizAnswers[question.id];
      const hasResult = Boolean(state.quizResult);
      const isCorrect = hasResult && selected === question.answer;
      const showAnswerState = hasResult && Number.isInteger(selected);

      return `
        <article class="quiz-question">
          <p class="quiz-order">Questão ${index + 1}</p>
          <h3>${escapeHtml(question.question)}</h3>
          <div class="quiz-options">
            ${question.options
              .map(
                (option, optionIndex) => `
                  <label class="quiz-option ${
                    showAnswerState
                      ? optionIndex === question.answer
                        ? "is-correct"
                        : optionIndex === selected
                          ? "is-wrong"
                          : ""
                      : ""
                  }">
                    <input
                      type="radio"
                      name="${question.id}"
                      value="${optionIndex}"
                      ${selected === optionIndex ? "checked" : ""}
                    />
                    <span>${escapeHtml(option)}</span>
                  </label>
                `
              )
              .join("")}
          </div>
          ${
            hasResult
              ? `<p class="quiz-explanation ${isCorrect ? "is-correct" : "is-wrong"}">${escapeHtml(
                  question.explanation
                )}</p>`
              : ""
          }
        </article>
      `;
    })
    .join("");

  dom.quizList.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      state.quizAnswers[input.name] = Number(input.value);
      saveState();
      renderHeaderHud();
      renderProgress();
    });
  });

  if (!state.quizResult) {
    dom.quizScoreLabel.textContent = "Quiz ainda não corrigido";
    dom.quizResultCopy.textContent = `Você respondeu ${getAnsweredQuizCount()} de ${quizQuestions.length} questões. Corrija quando quiser.`;
  } else {
    dom.quizScoreLabel.textContent = state.quizResult.passed
      ? `Aprovado com ${state.quizResult.score}%`
      : `Resultado atual: ${state.quizResult.score}%`;
    dom.quizResultCopy.textContent = state.quizResult.passed
      ? "Excelente. Você atingiu a nota mínima e cumpriu a etapa de avaliação."
      : "Ainda não atingiu 70%. Revise o conteúdo e corrija novamente quando quiser.";
  }
}

function renderCertificate() {
  const unlocked = hasUnlockedCertificate();
  dom.printCertificate.disabled = !unlocked;
  dom.certificateCard.classList.toggle("is-locked", !unlocked);

  if (unlocked) {
    const date = new Date(state.quizResult.completedAt);
    const formatted = date.toLocaleDateString("pt-BR");
    const certificateCode = `DR-${slugify(state.member?.name || "aluno").toUpperCase()}-${formatted
      .replaceAll("/", "")
      .slice(0, 8)}`;

    dom.certificateDate.textContent = `Data: ${formatted}`;
    dom.certificateId.textContent = `Certificado: ${certificateCode}`;
    dom.certificateStatusTitle.textContent = "Certificado liberado";
    dom.certificateStatusCopy.textContent =
      "Você concluiu a trilha e foi aprovado no quiz final. O certificado já pode ser impresso.";
  } else {
    dom.certificateDate.textContent = "Data: aguardando conclusão";
    dom.certificateId.textContent = "Certificado: indisponível";
    dom.certificateStatusTitle.textContent = "Ainda bloqueado";
    dom.certificateStatusCopy.textContent =
      "Conclua todas as aulas e alcance 70% ou mais no quiz final para liberar o certificado.";
  }

  dom.glossaryPreview.innerHTML = course.glossary
    .map(
      (item) => `
        <article class="glossary-item">
          <strong>${escapeHtml(item.term)}</strong>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `
    )
    .join("");
}

function renderAll() {
  renderProfile();
  renderHeroStats();
  renderHeaderHud();
  renderProgress();
  renderUnlockChecklist();
  renderDashboard();
  renderCourse();
  renderLibrary();
  renderQuiz();
  renderCertificate();
  setActivePanel(state.activePanel);
}

function openLessonFromLibrary(lessonId) {
  state.selectedLessonId = lessonId;
  state.activePanel = "course";
  saveState();
  renderAll();
}

function handleQuizSubmit() {
  if (getAnsweredQuizCount() < quizQuestions.length) {
    dom.quizScoreLabel.textContent = "Quiz incompleto";
    dom.quizResultCopy.textContent = `Responda as ${quizQuestions.length} questoes antes de corrigir o quiz final.`;
    return;
  }

  const correctAnswers = quizQuestions.reduce((sum, question) => {
    return sum + (state.quizAnswers[question.id] === question.answer ? 1 : 0);
  }, 0);

  const score = Math.round((correctAnswers / quizQuestions.length) * 100);
  state.quizResult = {
    score,
    correctAnswers,
    total: quizQuestions.length,
    passed: score >= 70,
    completedAt: new Date().toISOString(),
  };
  saveState();
  renderAll();
}

function openNextLesson(panel = true) {
  state.selectedLessonId = getNextLesson().id;
  if (panel) state.activePanel = "course";
  saveState();
  renderAll();
}

async function handleAccessSubmit(event) {
  event.preventDefault();
  const accessCode = dom.accessCodeInput.value.trim();

  if (!accessCode) {
    setAccessFeedback("Digite o codigo de acesso para liberar a area de membros.", "is-error");
    return;
  }

  setAccessFeedback("Validando acesso protegido...", "");

  try {
    const isValid = await verifyAccessCode(accessCode);

    if (!isValid) {
      setAccessFeedback("Codigo invalido. Confira o acesso enviado apos a matricula.", "is-error");
      return;
    }

    createAccessSession();
    setAccessFeedback("Acesso validado. Abrindo a plataforma...", "is-success");
    closeAccessModal();
    renderAll();

    if (!state.member) {
      openAuthModal(false);
    }
  } catch (error) {
    setAccessFeedback(error.message, "is-error");
  }
}

function logoutMemberArea() {
  clearAccessSession();
  closeAuthModal();
  openAccessModal(
    "Sua sessao foi encerrada. Digite novamente o codigo de acesso para liberar a area de membros."
  );
}

dom.memberForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.member = {
    name: dom.memberNameInput.value.trim(),
    email: dom.memberEmailInput.value.trim(),
    goal: dom.memberGoalInput.value,
    rhythm: dom.memberRhythmInput.value,
    joinedAt: state.member?.joinedAt || new Date().toISOString(),
  };
  saveState();
  closeAuthModal();
  renderAll();
});

dom.accessForm.addEventListener("submit", handleAccessSubmit);

dom.editProfile.addEventListener("click", () => {
  openAuthModal(true);
});

dom.closeProfileModal.addEventListener("click", () => {
  closeAuthModal();
});

dom.logoutButton.addEventListener("click", () => {
  logoutMemberArea();
});

[...dom.topNavLinks, ...dom.sidebarLinks].forEach((button) => {
  button.addEventListener("click", () => {
    setActivePanel(button.dataset.panelTarget);
  });
});

dom.resumeCourse.addEventListener("click", () => openNextLesson(true));
dom.goToQuiz.addEventListener("click", () => setActivePanel("quiz"));
dom.openNextLesson.addEventListener("click", () => openNextLesson(true));
dom.openCoursePanel.addEventListener("click", () => setActivePanel("course"));

dom.lessonSearch.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderSidebarModules();
});

dom.favoriteLesson.addEventListener("click", () => {
  const lesson = getLessonById(state.selectedLessonId);
  if (state.favorites.has(lesson.id)) {
    state.favorites.delete(lesson.id);
  } else {
    state.favorites.add(lesson.id);
  }
  saveState();
  renderAll();
});

dom.markComplete.addEventListener("click", () => {
  const lesson = getLessonById(state.selectedLessonId);
  if (state.completed.has(lesson.id)) {
    state.completed.delete(lesson.id);
  } else {
    state.completed.add(lesson.id);
  }
  saveState();
  renderAll();
});

dom.prevLesson.addEventListener("click", () => {
  const currentIndex = getLessonIndex(state.selectedLessonId);
  if (currentIndex <= 0) return;
  state.selectedLessonId = course.lessons[currentIndex - 1].id;
  saveState();
  renderCourse();
});

dom.nextLesson.addEventListener("click", () => {
  const currentIndex = getLessonIndex(state.selectedLessonId);
  if (currentIndex >= course.lessons.length - 1) return;
  state.selectedLessonId = course.lessons[currentIndex + 1].id;
  saveState();
  renderCourse();
});

dom.lessonNote.addEventListener("input", () => {
  state.notes[state.selectedLessonId] = dom.lessonNote.value;
  saveState();
  renderHeroStats();
  renderProgress();
  renderLibrary();
  renderDashboard();
});

dom.submitQuiz.addEventListener("click", handleQuizSubmit);

dom.printCertificate.addEventListener("click", () => {
  if (!hasUnlockedCertificate()) return;
  window.print();
});

window.addEventListener("focus", () => {
  if (!hasActiveAccess()) {
    openAccessModal(
      "Sua sessao expirou ou ainda nao foi validada. Digite o codigo de acesso para continuar."
    );
  }
});

renderAll();

if (!hasActiveAccess()) {
  openAccessModal(accessConfig.accessMessage);
} else {
  closeAccessModal();
  if (!state.member) {
    openAuthModal(false);
  } else {
    closeAuthModal();
  }
}
