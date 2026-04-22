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
  supabaseUser: "academia-dr-supabase-user-v1",
};

const dom = {
  accessModal: document.querySelector("#access-modal"),
  accessForm: document.querySelector("#access-form"),
  localAccessFields: document.querySelector("#local-access-fields"),
  cloudAuthFields: document.querySelector("#cloud-auth-fields"),
  accessCodeInput: document.querySelector("#access-code-input"),
  accessCopy: document.querySelector("#access-copy"),
  accessFeedback: document.querySelector("#access-feedback"),
  authEmailInput: document.querySelector("#auth-email-input"),
  authPasswordInput: document.querySelector("#auth-password-input"),
  authModeCopy: document.querySelector("#auth-mode-copy"),
  authSignupButton: document.querySelector("#auth-signup-button"),
  authResetButton: document.querySelector("#auth-reset-button"),
  authRefreshAccessButton: document.querySelector("#auth-refresh-access-button"),
  authSignoutButton: document.querySelector("#auth-signout-button"),
  authSubmitButton: document.querySelector("#auth-submit-button"),
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
  adminTopLink: document.querySelector("#admin-top-link"),
  adminSidebarLink: document.querySelector("#admin-sidebar-link"),
  topNavLinks: [...document.querySelectorAll(".top-nav-link")],
  sidebarLinks: [...document.querySelectorAll(".sidebar-link")],
  panels: [...document.querySelectorAll(".member-panel")],
  offerTitle: document.querySelector("#offer-title"),
  offerCopy: document.querySelector("#offer-copy"),
  primaryCheckoutLink: document.querySelector("#primary-checkout-link"),
  enterMemberArea: document.querySelector("#enter-member-area"),
  whatsappSalesLink: document.querySelector("#whatsapp-sales-link"),
  paymentTrustList: document.querySelector("#payment-trust-list"),
  paymentTrustNote: document.querySelector("#payment-trust-note"),
  salesMetrics: document.querySelector("#sales-metrics"),
  previewLessonList: document.querySelector("#preview-lesson-list"),
  offerLinks: document.querySelector("#offer-links"),
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
  memberAccount: document.querySelector("#member-account"),
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
  publicAdCard: document.querySelector("#public-ad-card"),
  dashboardAdCard: document.querySelector("#dashboard-ad-card"),
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
  lessonAdCard: document.querySelector("#lesson-ad-card"),
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
  certificateWorkload: document.querySelector("#certificate-workload"),
  certificateDate: document.querySelector("#certificate-date"),
  certificateId: document.querySelector("#certificate-id"),
  certificateStatusTitle: document.querySelector("#certificate-status-title"),
  certificateStatusCopy: document.querySelector("#certificate-status-copy"),
  certificateUpsell: document.querySelector("#certificate-upsell"),
  glossaryPreview: document.querySelector("#glossary-preview"),
  hudProgressPercent: document.querySelector("#hud-progress-percent"),
  hudQuizStatus: document.querySelector("#hud-quiz-status"),
  hudCertificateStatus: document.querySelector("#hud-certificate-status"),
  refreshAdminMembers: document.querySelector("#refresh-admin-members"),
  adminMemberSearch: document.querySelector("#admin-member-search"),
  adminFilterButtons: [...document.querySelectorAll("[data-admin-filter]")],
  adminStatusCopy: document.querySelector("#admin-status-copy"),
  adminMetrics: document.querySelector("#admin-metrics"),
  adminSelfCard: document.querySelector("#admin-self-card"),
  adminPendingList: document.querySelector("#admin-pending-list"),
  adminMemberList: document.querySelector("#admin-member-list"),
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
  courseTitle: "Nitro Scan Pro",
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

const defaultAppConfig = {
  authMode: "local",
  courseSlug: "curso-eletronica-completo",
  siteUrl: window.location.href,
  supabaseUrl: "",
  supabaseAnonKey: "",
  commerceMode: "hybrid",
  offerTitle: "Comece grátis e avance para o premium quando quiser",
  offerCopy:
    "Crie sua conta gratuita para estudar com anúncios. Quando quiser zero anúncios e certificado de conclusão, ative o plano premium por R$ 50.",
  priceLabel: "R$ 50",
  billingLabel: "pagamento único",
  merchantBrand: "Nitro Scan Pro",
  paymentProviderLabel: "Checkout PicPay",
  checkoutUrl: "",
  hotmartCheckoutUrl: "",
  hotmartMembersUrl: "",
  whatsappNumber: "",
  whatsappMessage: "Ola! Quero ativar o plano premium do Curso Completo de Eletronica por R$ 50.",
  pixKey: "",
  freePlanLabel: "Conta gratuita",
  premiumPlanLabel: "Plano premium",
  adsEnabled: true,
  adSenseClient: "",
  freeModuleNumbers: ["01"],
  previewLessonIds: [],
};

const appConfig = {
  ...defaultAppConfig,
  ...(window.APP_CONFIG || {}),
};

const authState = {
  client: null,
  session: null,
  user: null,
  accessGranted: false,
  accessStatus: "guest",
  isAdmin: false,
  profileRole: "student",
  syncTimer: null,
  syncInFlight: false,
  adminMembers: [],
};

let accessTargetPanel = "dashboard";

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

function isSupabaseMode() {
  return appConfig.authMode === "supabase";
}

function hasSupabaseConfig() {
  return Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey);
}

async function getAuthClient() {
  if (!isSupabaseMode() || !hasSupabaseConfig()) return null;
  if (authState.client) return authState.client;

  const module = await import("https://esm.sh/@supabase/supabase-js@2");
  authState.client = module.createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return authState.client;
}

function getRemoteStatePayload() {
  return {
    completed: [...state.completed],
    favorites: [...state.favorites],
    notes: state.notes,
    quizAnswers: state.quizAnswers,
    quizResult: state.quizResult,
    selectedLessonId: state.selectedLessonId,
    activePanel: state.activePanel,
  };
}

function applyRemoteStatePayload(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  state.completed = new Set(sanitizeLessonIdCollection(source.completed));
  state.favorites = new Set(sanitizeLessonIdCollection(source.favorites));
  state.notes = sanitizeNotesMap(source.notes);
  state.quizAnswers = sanitizeQuizAnswers(source.quizAnswers);
  state.quizResult = source.quizResult || null;
  state.selectedLessonId = validLessonIds.has(source.selectedLessonId)
    ? source.selectedLessonId
    : course.lessons[0]?.id;
  state.activePanel = source.activePanel || "dashboard";
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
  activePanel: loadJSON(storageKeys.activePanel, "public"),
  query: "",
  accessSession: getValidAccessSession(),
  adminQuery: "",
  adminFilter: "all",
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

  if (isSupabaseMode() && authState.accessGranted) {
    scheduleRemoteSync();
  }
}

function resetMemberWorkspace() {
  state.member = null;
  state.completed = new Set();
  state.favorites = new Set();
  state.notes = {};
  state.quizAnswers = {};
  state.quizResult = null;
  state.selectedLessonId = course.lessons[0]?.id;
  state.activePanel = "public";
}

function getCurrentMemberSeed() {
  if (!authState.user) return null;
  const currentEmail = String(authState.user.email || "").trim().toLowerCase();
  const memberEmail = String(state.member?.email || "").trim().toLowerCase();
  return currentEmail && memberEmail && currentEmail === memberEmail ? state.member : null;
}

async function ensureRemoteProfile() {
  if (!isSupabaseMode() || !authState.user) return;
  const client = await getAuthClient();
  if (!client) return;

  const currentMember = getCurrentMemberSeed();
  const fullName =
    currentMember?.name ||
    authState.user.user_metadata?.name ||
    String(authState.user.email || "").split("@")[0] ||
    "Aluno";
  const payload = {
    user_id: authState.user.id,
    email: authState.user.email || currentMember?.email || "",
    full_name: fullName,
    goal: currentMember?.goal || "dominar fundamentos",
    rhythm: currentMember?.rhythm || "30 min por dia",
    updated_at: new Date().toISOString(),
  };

  await client.from("member_profiles").upsert(payload, {
    onConflict: "user_id",
  });
}

async function loadRemoteProfile() {
  if (!isSupabaseMode() || !authState.user) return;
  const client = await getAuthClient();
  if (!client) return;
  const currentMember = getCurrentMemberSeed();

  const { data } = await client
    .from("member_profiles")
    .select("full_name,email,goal,rhythm,role,created_at")
    .eq("user_id", authState.user.id)
    .maybeSingle();

  state.member = {
    name:
      data?.full_name ||
      currentMember?.name ||
      authState.user.user_metadata?.name ||
      String(authState.user.email || "").split("@")[0] ||
      "Aluno",
    email: data?.email || authState.user.email || currentMember?.email || "",
    goal: data?.goal || currentMember?.goal || "dominar fundamentos",
    rhythm: data?.rhythm || currentMember?.rhythm || "30 min por dia",
    joinedAt: data?.created_at || currentMember?.joinedAt || new Date().toISOString(),
  };
  authState.profileRole = data?.role || "student";
  authState.isAdmin = authState.profileRole === "admin";
  syncAdminUi();
}

async function pullRemoteState() {
  if (!isSupabaseMode() || !authState.user) return;
  const client = await getAuthClient();
  if (!client) return;

  const { data } = await client
    .from("member_states")
    .select("payload")
    .eq("user_id", authState.user.id)
    .eq("course_slug", appConfig.courseSlug)
    .maybeSingle();

  if (data?.payload) {
    applyRemoteStatePayload(data.payload);
  }
}

async function pushRemoteState() {
  if (
    !isSupabaseMode() ||
    !authState.user ||
    (!authState.accessGranted && !authState.isAdmin) ||
    authState.syncInFlight
  ) {
    return;
  }
  const client = await getAuthClient();
  if (!client) return;

  authState.syncInFlight = true;

  try {
    await ensureRemoteProfile();
    await client.from("member_states").upsert(
      {
        user_id: authState.user.id,
        course_slug: appConfig.courseSlug,
        payload: getRemoteStatePayload(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,course_slug",
      }
    );
  } finally {
    authState.syncInFlight = false;
  }
}

function scheduleRemoteSync() {
  if (authState.syncTimer) {
    window.clearTimeout(authState.syncTimer);
  }

  authState.syncTimer = window.setTimeout(() => {
    authState.syncTimer = null;
    void pushRemoteState();
  }, 450);
}

async function refreshAdminMembers() {
  if (!isSupabaseMode()) {
    dom.adminStatusCopy.textContent = "O painel administrativo ainda nao esta disponivel nesta configuracao.";
    dom.adminMetrics.innerHTML = "";
    dom.adminMemberList.innerHTML = `<div class="empty-state">A configuracao administrativa ainda nao foi ativada.</div>`;
    return;
  }

  if (!authState.isAdmin) {
    dom.adminStatusCopy.textContent = "Entre com uma conta administradora para visualizar os alunos.";
    dom.adminMetrics.innerHTML = "";
    dom.adminMemberList.innerHTML = `<div class="empty-state">Acesso restrito a administradores.</div>`;
    return;
  }

  const client = await getAuthClient();
  if (!client) return;

  const [{ data: profiles, error: profilesError }, { data: accessRows, error: accessError }] =
    await Promise.all([
      client
        .from("member_profiles")
        .select("user_id,full_name,email,role,updated_at")
        .order("updated_at", { ascending: false }),
      client
        .from("course_access")
        .select("user_id,course_slug,access_status,granted_at,updated_at")
        .eq("course_slug", appConfig.courseSlug),
    ]);

  if (profilesError || accessError) {
    dom.adminStatusCopy.textContent =
      profilesError?.message || accessError?.message || "Nao foi possivel carregar os cadastros.";
    return;
  }

  const accessMap = new Map((accessRows || []).map((row) => [row.user_id, row]));
  authState.adminMembers = (profiles || []).map((profile) => {
    const access = accessMap.get(profile.user_id);
    return {
      userId: profile.user_id,
      name: profile.full_name || "Aluno",
      email: profile.email || "",
      role: profile.role || "student",
      accessStatus: access?.access_status || "pending",
      grantedAt: access?.granted_at || "",
      updatedAt: access?.updated_at || profile.updated_at || "",
    };
  });

  const freeCount = authState.adminMembers.filter((member) => member.accessStatus === "pending").length;
      const premiumCount = authState.adminMembers.filter((member) => member.accessStatus === "active").length;
      dom.adminStatusCopy.textContent = `Lista atualizada. ${freeCount} conta(s) gratuita(s) e ${premiumCount} premium.`;
      renderAdminPanel();
}

async function updateMemberAccess(userId, accessStatus) {
  const client = await getAuthClient();
  if (!client || !authState.isAdmin) return;
  const currentMember = (authState.adminMembers || []).find((member) => member.userId === userId);
  const isUnblocking = currentMember?.accessStatus === "blocked" && accessStatus === "pending";

  dom.adminStatusCopy.textContent =
    accessStatus === "active"
      ? "Ativando plano premium..."
      : isUnblocking
        ? "Desbloqueando conta..."
        : accessStatus === "pending"
        ? "Movendo conta para o plano gratuito..."
        : "Bloqueando acesso da conta...";

  const { error } = await client.from("course_access").upsert(
    {
      user_id: userId,
      course_slug: appConfig.courseSlug,
      access_status: accessStatus,
      granted_at: accessStatus === "active" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,course_slug",
    }
  );

  if (error) {
    dom.adminStatusCopy.textContent = error.message;
    return;
  }

  dom.adminStatusCopy.textContent =
    accessStatus === "active"
      ? "Plano premium ativado com sucesso."
      : isUnblocking
        ? "Conta desbloqueada com sucesso."
        : accessStatus === "pending"
        ? "Conta colocada no plano gratuito."
        : "Conta bloqueada com sucesso.";
  await refreshAdminMembers();
}

async function updateMemberRole(userId, role) {
  const client = await getAuthClient();
  if (!client || !authState.isAdmin) return;

  dom.adminStatusCopy.textContent = `Atualizando perfil para ${role === "admin" ? "administrador" : "aluno"}...`;

  const { error } = await client
    .from("member_profiles")
    .update({
      role,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    dom.adminStatusCopy.textContent = error.message;
    return;
  }

  dom.adminStatusCopy.textContent = `Perfil atualizado para ${role === "admin" ? "administrador" : "aluno"}.`;
  await refreshAdminMembers();
}

async function removeMemberEnrollment(userId) {
  const client = await getAuthClient();
  if (!client || !authState.isAdmin) return;

  if (userId === authState.user?.id) {
    dom.adminStatusCopy.textContent = "Sua conta administradora principal não pode ser removida por aqui.";
    return;
  }

  const confirmed = window.confirm(
    "Tem certeza que deseja remover este inscrito? Isso retira o acesso, o progresso salvo e o cadastro do curso."
  );

  if (!confirmed) return;

  dom.adminStatusCopy.textContent = "Removendo inscrito do curso...";

  let { error } = await client.rpc("admin_remove_member", {
    target_user_id: userId,
    target_course_slug: appConfig.courseSlug,
  });

  if (error) {
    const cleanupStates = await client
      .from("member_states")
      .delete()
      .eq("user_id", userId)
      .eq("course_slug", appConfig.courseSlug);

    const cleanupAccess = await client
      .from("course_access")
      .delete()
      .eq("user_id", userId)
      .eq("course_slug", appConfig.courseSlug);

    const cleanupProfile = await client.from("member_profiles").delete().eq("user_id", userId);

    error = cleanupProfile.error || cleanupAccess.error || cleanupStates.error || null;
  }

  if (error) {
    dom.adminStatusCopy.textContent =
      "Nao foi possivel remover este inscrito ainda. Atualize o SQL do Supabase e tente novamente.";
    return;
  }

  dom.adminStatusCopy.textContent = "Inscrito removido com sucesso.";
  await refreshAdminMembers();
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

function getAccessibleLessons() {
  return hasMemberAreaAccess() ? course.lessons : course.lessons.filter((lesson) => isLessonPublic(lesson));
}

function isLessonPublic(lesson) {
  if (!lesson) return false;
  if ((appConfig.previewLessonIds || []).includes(lesson.id)) return true;
  return (appConfig.freeModuleNumbers || []).includes(lesson.moduleNumber);
}

function getPreviewLessons() {
  const configured = (appConfig.previewLessonIds || [])
    .map((lessonId) => getLessonById(lessonId))
    .filter(Boolean);

  if (configured.length > 0) return configured.slice(0, 6);

  return course.lessons.filter((lesson) => isLessonPublic(lesson)).slice(0, 6);
}

function getCheckoutUrl() {
  return appConfig.hotmartCheckoutUrl || appConfig.checkoutUrl || "#";
}

function getWhatsAppUrl() {
  if (!appConfig.whatsappNumber) return "#";
  const phone = String(appConfig.whatsappNumber).replace(/\D+/g, "");
  const text = encodeURIComponent(appConfig.whatsappMessage || "");
  return `https://wa.me/${phone}?text=${text}`;
}

async function copyPixKey() {
  const key = String(appConfig.pixKey || "").trim();
  if (!key) return false;

  try {
    await navigator.clipboard.writeText(key);
  } catch (_error) {
    const helper = document.createElement("textarea");
    helper.value = key;
    helper.setAttribute("readonly", "");
    helper.style.position = "absolute";
    helper.style.left = "-9999px";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }

  return true;
}

async function copyTextToClipboard(text) {
  const content = String(text || "").trim();
  if (!content) return false;

  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (_error) {
    const helper = document.createElement("textarea");
    helper.value = content;
    helper.setAttribute("readonly", "");
    helper.style.position = "absolute";
    helper.style.left = "-9999px";
    document.body.append(helper);
    helper.select();
    const copied = document.execCommand("copy");
    helper.remove();
    return copied;
  }
}

function buildWelcomeMessage(member) {
  const firstName = String(member?.name || "Aluno").trim().split(/\s+/)[0] || "Aluno";
  const loginUrl = appConfig.siteUrl || window.location.href;
  return [
    `Olá, ${firstName}! Seu acesso à Nitro Scan Pro já está liberado.`,
    `Entre por aqui: ${loginUrl}`,
    `Use o e-mail ${member?.email || ""} para entrar na área do curso.`,
    "Depois do login, clique em Abrir minha área e continue seus estudos normalmente.",
    "Se precisar de ajuda, fale comigo no WhatsApp.",
  ].join(" ");
}

function getMemberPlanKind() {
  if (!isSupabaseMode()) {
    return hasActiveAccess() ? "premium" : "guest";
  }

  if (!authState.session) return "guest";
  if (authState.isAdmin) return "premium";
  if (authState.accessStatus === "blocked") return "blocked";
  if (authState.accessStatus === "active") return "premium";
  return "free";
}

function isPremiumMember() {
  return getMemberPlanKind() === "premium";
}

function isFreeMember() {
  return getMemberPlanKind() === "free";
}

function ensureAdsScript() {
  if (!appConfig.adsEnabled || !appConfig.adSenseClient) return;
  if (document.querySelector(`script[data-ad-client="${appConfig.adSenseClient}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.adClient = appConfig.adSenseClient;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    appConfig.adSenseClient
  )}`;
  document.head.append(script);
}

function getAdSupportMarkup(title, compact = false) {
  return `
    <p class="panel-label">Espaco patrocinado</p>
    <h3>${escapeHtml(title)}</h3>
    <p class="side-copy">${
      compact
        ? "Esta conta gratuita exibe anúncios. Para estudar sem anúncios e liberar o certificado, ative o premium por R$ 50."
        : "Esta conta gratuita exibe anúncios. Para remover os anúncios e emitir o certificado de conclusão, ative o premium por R$ 50."
    }</p>
  `;
}

function hasMemberAreaAccess() {
  return isSupabaseMode()
    ? Boolean(authState.session && (authState.accessGranted || authState.isAdmin))
    : hasActiveAccess();
}

function isAdminPanelAvailable() {
  return Boolean(isSupabaseMode() && authState.isAdmin);
}

function isPanelRestricted(panelName) {
  return panelName !== "public";
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
  const lessons = getAccessibleLessons();
  return lessons.find((lesson) => !state.completed.has(lesson.id)) || lessons[0] || course.lessons[0];
}

function getAnsweredQuizCount() {
  return quizQuestions.filter((question) => Number.isInteger(state.quizAnswers[question.id])).length;
}

function getCompletionPercent() {
  return course.lessons.length === 0 ? 0 : Math.round((state.completed.size / course.lessons.length) * 100);
}

function hasUnlockedCertificate() {
  return isPremiumMember() && state.completed.size === course.lessons.length && Boolean(state.quizResult?.passed);
}

async function refreshRemoteAccessStatus() {
  if (!isSupabaseMode() || !authState.user) {
    authState.accessGranted = false;
    authState.accessStatus = "guest";
    return false;
  }

  const client = await getAuthClient();
  if (!client) {
    authState.accessGranted = false;
    authState.accessStatus = "guest";
    return false;
  }

  const { data } = await client
    .from("course_access")
    .select("access_status")
    .eq("user_id", authState.user.id)
    .eq("course_slug", appConfig.courseSlug)
    .maybeSingle();

  authState.accessStatus = data?.access_status || "pending";
  authState.accessGranted = Boolean(authState.session) && authState.accessStatus !== "blocked";
  return authState.accessGranted;
}

function hasActiveAccess() {
  if (isSupabaseMode()) {
    return Boolean(authState.session && authState.accessGranted);
  }

  state.accessSession = getValidAccessSession();
  return Boolean(state.accessSession);
}

function syncAdminUi() {
  const showAdmin = isAdminPanelAvailable();
  if (dom.adminTopLink) dom.adminTopLink.hidden = !showAdmin;
  if (dom.adminSidebarLink) dom.adminSidebarLink.hidden = !showAdmin;

  if (!showAdmin && state.activePanel === "admin") {
    state.activePanel = "public";
    saveState();
  }
}

function setAccessFeedback(message = "", tone = "") {
  dom.accessFeedback.textContent = message;
  dom.accessFeedback.classList.remove("is-error", "is-success");
  if (tone) {
    dom.accessFeedback.classList.add(tone);
  }
}

function syncAccessModeUi() {
  const supabaseMode = isSupabaseMode();
  const signedIn = Boolean(authState.session);
  const alreadyInside = supabaseMode && signedIn && hasMemberAreaAccess();
  const blockedMember = supabaseMode && signedIn && authState.accessStatus === "blocked" && !authState.isAdmin;
  const waitingAccess = supabaseMode && signedIn && !alreadyInside && !blockedMember;
  const cloudFieldsVisible = supabaseMode && !signedIn;

  dom.localAccessFields.hidden = supabaseMode;
  dom.cloudAuthFields.hidden = !cloudFieldsVisible;
  dom.authSignupButton.hidden = !supabaseMode || signedIn;
  dom.authResetButton.hidden = !supabaseMode || signedIn;
  dom.authRefreshAccessButton.hidden = !supabaseMode || !signedIn || alreadyInside;
  dom.authSignoutButton.hidden = !supabaseMode || !signedIn;
  dom.authSubmitButton.hidden = blockedMember || waitingAccess;

  dom.accessCodeInput.disabled = supabaseMode;
  dom.accessCodeInput.required = !supabaseMode;

  if (dom.authEmailInput) {
    dom.authEmailInput.disabled = !cloudFieldsVisible;
    dom.authEmailInput.required = cloudFieldsVisible;
  }

  if (dom.authPasswordInput) {
    dom.authPasswordInput.disabled = !cloudFieldsVisible;
    dom.authPasswordInput.required = cloudFieldsVisible;
  }

  if (!supabaseMode) {
    dom.accessCopy.textContent =
      "Esta plataforma exige um codigo de acesso antes de liberar aulas, progresso, quiz e certificado.";
    dom.authSubmitButton.textContent = "Entrar na área protegida";
    dom.authSubmitButton.disabled = false;
    return;
  }

  if (!hasSupabaseConfig()) {
    dom.accessCopy.textContent =
      "A configuracao de acesso da plataforma ainda nao foi concluida.";
    dom.authModeCopy.textContent =
      "Conclua a configuracao da plataforma para ativar contas individuais.";
    dom.authSubmitButton.textContent = "Configuracao pendente";
    dom.authSubmitButton.disabled = true;
    return;
  }

  dom.authSubmitButton.disabled = false;

  if (blockedMember) {
    dom.accessCopy.textContent =
      "Sua conta esta temporariamente indisponivel para este curso.";
    setAccessFeedback(
      "Se voce acredita que isso e um engano, fale com o suporte e depois clique em Atualizar acesso.",
      ""
    );
    return;
  }

  if (waitingAccess) {
    dom.accessCopy.textContent =
      "Sua conta já foi criada. Falta apenas a liberação do acesso nesta plataforma.";
    dom.authModeCopy.textContent =
      "Quando o acesso for liberado, clique em Atualizar acesso. Se entrou com a conta errada, use Sair da conta.";
    return;
  }

  dom.accessCopy.textContent = alreadyInside
    ? "Sua conta já está conectada. Clique abaixo para abrir a plataforma."
    : "Entre com seu e-mail e senha ou crie sua conta gratuita para começar a usar a plataforma.";
  dom.authModeCopy.textContent = alreadyInside
    ? "Se quiser usar outro e-mail, clique em Sair da conta primeiro."
    : "Se o seu e-mail já existe, use Entrar com e-mail. Se for a primeira vez, clique em Criar conta grátis.";
  dom.authSubmitButton.textContent = alreadyInside ? "Abrir minha área" : "Entrar com e-mail";
}

function openAccessModal(message = accessConfig.accessMessage, targetPanel = "dashboard") {
  accessTargetPanel = targetPanel;
  syncAccessModeUi();
  dom.accessCopy.textContent = message;
  dom.accessModal.classList.add("is-open");
  dom.accessModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open", "access-locked");
  dom.accessCodeInput.value = "";
  if (dom.authEmailInput) dom.authEmailInput.value = authState.user?.email || "";
  if (dom.authPasswordInput) dom.authPasswordInput.value = "";
  setAccessFeedback("", "");

  if (isSupabaseMode()) {
    if (!dom.cloudAuthFields.hidden) {
      (dom.authEmailInput || dom.authPasswordInput)?.focus();
    } else if (!dom.authRefreshAccessButton.hidden) {
      dom.authRefreshAccessButton.focus();
    } else if (!dom.authSubmitButton.hidden) {
      dom.authSubmitButton.focus();
    }
  } else {
    dom.accessCodeInput.focus();
  }
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
  if (panelName === "admin" && !isAdminPanelAvailable()) {
    setAccessFeedback("Esta area administrativa so fica visivel para contas administradoras.", "is-error");
    openAccessModal("Entre com uma conta administradora para gerenciar os alunos do curso.", "admin");
    panelName = "public";
  }

  if (panelName === "course" && !hasMemberAreaAccess()) {
    const lesson = getLessonById(state.selectedLessonId);
    if (!isLessonPublic(lesson)) {
      openAccessModal("Entre com sua conta para abrir o curso completo.", "course");
      panelName = "public";
    }
  }

  if (isPanelRestricted(panelName) && panelName !== "course" && !hasMemberAreaAccess()) {
    openAccessModal("Entre com sua conta para acessar este painel.", panelName);
    panelName = "public";
  }

  state.activePanel = panelName;
  saveState();

  dom.panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === panelName);
  });

  [...dom.topNavLinks, ...dom.sidebarLinks].forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panelTarget === panelName);
  });

  if (panelName === "admin" && isAdminPanelAvailable()) {
    void refreshAdminMembers();
  }
}

function getAdminAccessLabel(status) {
  if (status === "active") return appConfig.premiumPlanLabel || "Plano premium";
  if (status === "blocked") return "Acesso bloqueado";
  return appConfig.freePlanLabel || "Conta gratuita";
}

function getAdminRoleLabel(role) {
  return role === "admin" ? "Administrador" : "Aluno";
}

function formatAdminDate(value) {
  if (!value) return "Ainda sem atualização";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderProfile() {
  const hasAccess = hasMemberAreaAccess();
  const planKind = getMemberPlanKind();
  const member = state.member || {
    name: "Aluno",
    email: "",
    goal: "dominar fundamentos",
    rhythm: "30 min por dia",
  };

  if (hasAccess) {
    const accountEmail = authState.user?.email || member.email || "";
    dom.memberName.textContent = member.name;
    dom.memberPlan.textContent =
      planKind === "premium"
        ? appConfig.premiumPlanLabel || "Plano premium"
        : appConfig.freePlanLabel || "Conta gratuita";
    dom.memberAvatar.textContent = initials(member.name);
    dom.heroSubtitle.textContent = `Área do aluno ${member.name}`;
    dom.heroTitle.textContent = course.title || "Curso Completo de Eletrônica";
    dom.heroText.textContent =
      planKind === "premium"
        ? "Uma experiência premium, sem anúncios, com jornada guiada, player de aulas, revisão pessoal, avaliação final e certificado."
        : "Sua conta gratuita já está liberada, com jornada guiada, player de aulas, revisão pessoal e avaliação final. Ative o premium para emitir o certificado.";
    dom.memberGreeting.textContent = `Olá, ${member.name}. Seu laboratório digital está pronto.`;
    dom.memberGoalCopy.textContent =
      planKind === "premium"
        ? `Objetivo atual: ${member.goal}. Você está no plano premium, sem anúncios, avançando no ritmo "${member.rhythm}".`
        : `Objetivo atual: ${member.goal}. Você está na conta gratuita, estudando com anúncios e avançando no ritmo "${member.rhythm}".`;
    dom.memberAccount.textContent = accountEmail
      ? `Conta atual: ${accountEmail}`
      : "Conta atual: perfil autenticado";
    dom.memberRhythm.textContent = `Ritmo: ${member.rhythm}`;
    dom.memberGoal.textContent = `Objetivo: ${member.goal}`;
    dom.resumeCourse.textContent = "Continuar de onde parei";
    dom.goToQuiz.textContent = "Abrir quiz final";
    dom.certificateStudent.textContent = member.name;
    return;
  }

  dom.memberName.textContent = "Visitante";
  dom.memberPlan.textContent = "Acesso de apresentação";
  dom.memberAvatar.textContent = "DR";
  dom.heroSubtitle.textContent = "Conheça a plataforma";
  dom.heroTitle.textContent = course.title || "Curso Completo de Eletrônica";
  dom.heroText.textContent =
    "Conheça a plataforma, explore aulas de demonstração, crie sua conta gratuita e avance para o premium quando quiser.";
  dom.memberGreeting.textContent = "Veja por dentro da Nitro Scan Pro.";
  dom.memberGoalCopy.textContent =
    "Você está navegando na área pública. Crie sua conta para salvar progresso, fazer o quiz final e emitir o certificado.";
  dom.memberAccount.textContent = "Conta atual: visitante";
  dom.memberRhythm.textContent = "Acesso: apresentação";
  dom.memberGoal.textContent = "Plano: gratuito ou premium";
  dom.resumeCourse.textContent = "Abrir aulas de apresentação";
  dom.goToQuiz.textContent = "Criar conta grátis";
  dom.certificateStudent.textContent = "Aluno";
}

function renderSessionChrome() {
  const hasAccess = hasMemberAreaAccess();
  document.body.classList.toggle("guest-mode", !hasAccess);
  document.body.classList.toggle("member-mode", hasAccess);
  dom.logoutButton.hidden = !hasAccess;
  dom.editProfile.hidden = !hasAccess;
  dom.logoutButton.style.display = hasAccess ? "" : "none";
  dom.editProfile.style.display = hasAccess ? "" : "none";
  dom.logoutButton.setAttribute("aria-hidden", hasAccess ? "false" : "true");
  dom.editProfile.setAttribute("aria-hidden", hasAccess ? "false" : "true");
}

function renderPublicOffer() {
  const previewLessons = getPreviewLessons();
  const checkoutUrl = getCheckoutUrl();
  const whatsappUrl = getWhatsAppUrl();
  const isProtectedSite = window.location.protocol === "https:";
  const merchantBrand = String(appConfig.merchantBrand || "Nitro Scan Pro").trim();
  const paymentProviderLabel = appConfig.paymentProviderLabel || "Checkout PicPay";
  const signedIn = Boolean(authState.session);
  const offerMetrics = [
    { label: "Conta gratuita", value: appConfig.freePlanLabel || "Conta gratuita" },
    { label: "Plano premium", value: appConfig.priceLabel || "R$ 50" },
    { label: "Pagamento", value: paymentProviderLabel },
    { label: "Certificado", value: "Premium" },
  ];

  dom.offerTitle.textContent = appConfig.offerTitle;
  dom.offerCopy.textContent = appConfig.offerCopy;
  dom.primaryCheckoutLink.textContent = `Quero o premium por ${appConfig.priceLabel || "R$ 50"}`;
  dom.enterMemberArea.textContent = signedIn ? "Abrir minha área" : "Entrar ou criar conta grátis";
  dom.primaryCheckoutLink.href = checkoutUrl;
  dom.primaryCheckoutLink.classList.toggle("is-disabled-link", checkoutUrl === "#");
  dom.whatsappSalesLink.href = whatsappUrl;
  dom.whatsappSalesLink.classList.toggle("is-disabled-link", whatsappUrl === "#");

  const trustItems = [
    { title: "Cobrança profissional", copy: `${merchantBrand} em checkout externo` },
    { title: "Pagamento protegido", copy: "Escolha a forma de pagamento mais confortável para você" },
    {
      title: "Ambiente protegido",
      copy: isProtectedSite ? "Site em HTTPS com redirecionamento para checkout externo" : "Checkout externo e protegido",
    },
    { title: "Dados fora do site", copy: "As informações do pagamento são digitadas no ambiente do provedor" },
  ];

  dom.salesMetrics.innerHTML = offerMetrics
    .map(
      (item) => `
        <article class="metric-item">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </article>
      `
    )
    .join("");

  dom.paymentTrustList.innerHTML = trustItems
    .map(
      (item) => `
        <article class="payment-trust-item">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.copy)}</span>
        </article>
      `
    )
    .join("");

  dom.paymentTrustNote.textContent =
    checkoutUrl !== "#"
      ? `Ao clicar em comprar, você será direcionado ao checkout protegido da ${merchantBrand} para concluir o pagamento.`
      : "O checkout premium será exibido aqui assim que o meio de pagamento estiver disponível.";

  dom.previewLessonList.innerHTML =
    previewLessons.length > 0
      ? previewLessons
          .map(
            (lesson) => `
              <button class="library-item" data-preview-lesson="${lesson.id}" type="button">
                <strong>${escapeHtml(lesson.title)}</strong>
                <span>Módulo ${lesson.moduleNumber} • ${lesson.duration} min • acesso de apresentação</span>
              </button>
            `
          )
          .join("")
      : `<div class="empty-state">As aulas de apresentação aparecerão aqui assim que forem disponibilizadas.</div>`;

  const offerLinks = [
    {
      title: "Pagar com cartão ou PicPay",
      meta: `${merchantBrand} em checkout protegido`,
      href: checkoutUrl,
      variant: "primary-payment",
    },
    {
      title: "Copiar chave Pix",
      meta: appConfig.pixKey ? "Pague no seu banco e envie o comprovante" : "Chave Pix indisponivel",
      href: appConfig.pixKey ? "__copy_pix__" : "#",
      variant: "secondary-payment",
    },
    {
      title: "Falar no WhatsApp",
      meta: appConfig.whatsappNumber ? "Confirme pagamento ou tire dúvidas" : "Contato em configuração",
      href: whatsappUrl,
    },
  ];

  dom.offerLinks.innerHTML = offerLinks
    .map(
      (item) => `
        <a class="resource-link-card ${item.variant ? `is-${item.variant}` : ""} ${item.href === "#" ? "is-disabled-link" : ""}" href="${
          item.href === "__copy_pix__" ? "#" : item.href
        }" ${
          item.href === "#"
            ? 'aria-disabled="true"'
            : item.href === "__copy_pix__"
              ? 'data-copy-pix="true"'
              : 'target="_blank" rel="noreferrer"'
        }>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.meta)}</span>
        </a>
      `
    )
    .join("");

  dom.offerLinks.querySelectorAll("[data-copy-pix]").forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const copied = await copyPixKey();
      const meta = link.querySelector("span");
      if (!meta) return;
      const original = meta.textContent;
      meta.textContent = copied
        ? "Chave Pix copiada. Abra seu banco e envie o comprovante."
        : "Nao foi possivel copiar a chave Pix agora.";
      dom.paymentTrustNote.textContent = copied
        ? "Chave Pix copiada. Agora abra seu banco, conclua o pagamento e envie o comprovante no WhatsApp."
        : "Nao foi possivel copiar a chave Pix agora. Tente novamente em instantes.";
      window.setTimeout(() => {
        meta.textContent = original;
        dom.paymentTrustNote.textContent =
          checkoutUrl !== "#"
            ? `Ao clicar em comprar, você será direcionado ao checkout protegido da ${merchantBrand} para concluir o pagamento.`
            : "O checkout premium será exibido aqui assim que o meio de pagamento estiver disponível.";
      }, 2200);
    });
  });

  dom.previewLessonList.querySelectorAll("[data-preview-lesson]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedLessonId = button.dataset.previewLesson;
      saveState();
      setActivePanel("course");
      renderCourse();
    });
  });
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
      label: "Manter plano premium ativo para emitir o certificado",
      done: isPremiumMember(),
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
  const freeMember = isFreeMember();
  const memberMetrics = [
    { label: "Aulas concluídas", value: `${state.completed.size}/${course.lessons.length}` },
    { label: "Favoritos", value: String(state.favorites.size) },
    { label: "Anotações salvas", value: String(notesCount) },
    {
      label: freeMember ? "Certificado" : "Quiz final",
      value: freeMember ? "Premium" : state.quizResult ? `${state.quizResult.score}%` : "Pendente",
    },
  ];

  dom.nextLessonTitle.textContent = nextLesson.title;
  dom.nextLessonSummary.textContent = freeMember
    ? `${nextLesson.summary} Tempo estimado: ${nextLesson.duration} min. Sua conta gratuita estuda com anúncios. O plano premium remove anúncios e libera o certificado.`
    : `${nextLesson.summary} Tempo estimado: ${nextLesson.duration} min.`;

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
      text: freeMember ? "Ativar o premium para emitir o certificado." : "Liberar o certificado.",
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
  const hasPremiumAccess = hasMemberAreaAccess();

  dom.moduleNav.innerHTML = course.modules
    .map((module) => {
      const candidateLessons = hasPremiumAccess
        ? module.lessons
        : module.lessons.filter((lesson) => isLessonPublic(lesson));

      const visibleLessons = candidateLessons.filter((lesson) => {
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
  const hasPremiumAccess = hasMemberAreaAccess();
  const lessonUnlocked = hasPremiumAccess || isLessonPublic(lesson);
  const accessibleLessons = getAccessibleLessons();

  if (!lessonUnlocked) {
    openAccessModal("Esta aula faz parte do curso completo. Entre com sua conta para continuar.", "course");
    const fallbackLesson = getPreviewLessons()[0];
    if (fallbackLesson) {
      state.selectedLessonId = fallbackLesson.id;
      saveState();
      renderCourse();
      return;
    }

    dom.lessonBreadcrumb.textContent = "Curso / Area premium";
    dom.lessonOverline.textContent = "Conteudo bloqueado";
    dom.lessonTitle.textContent = "Entre com sua conta para estudar esta aula.";
    dom.lessonSummary.textContent =
      "Acesse a plataforma para liberar o player, progresso, favoritos, quiz e certificado.";
    dom.lessonPosition.textContent = "--";
    dom.lessonDuration.textContent = "--";
    dom.lessonStatus.textContent = "Bloqueada";
    dom.lessonModuleName.textContent = "Premium";
    dom.lessonContent.innerHTML =
      '<p class="side-copy">Nenhuma aula de apresentação foi configurada neste momento. Entre com sua conta ou ative o premium para continuar.</p>';
    dom.lessonOutline.innerHTML = "<li>Entre com sua conta para continuar.</li>";
    dom.moduleProgressCopy.textContent = "Conteudo premium bloqueado.";
    dom.moduleProgressFill.style.width = "0%";
    dom.lessonNote.value = "";
    dom.lessonNote.disabled = true;
    dom.favoriteLesson.disabled = true;
    dom.markComplete.disabled = true;
    dom.prevLesson.disabled = true;
    dom.nextLesson.disabled = true;
    return;
  }

  const lessonIndex = getLessonIndex(lesson.id);
  const accessibleIndex = accessibleLessons.findIndex((item) => item.id === lesson.id);
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
  dom.lessonNote.disabled = !hasPremiumAccess;

  dom.favoriteLesson.textContent = favorite ? "Remover dos favoritos" : "Favoritar aula";
  dom.favoriteLesson.classList.toggle("is-complete", favorite);
  dom.markComplete.textContent = done ? "Marcar como pendente" : "Marcar como concluída";
  dom.markComplete.classList.toggle("is-complete", done);
  dom.favoriteLesson.disabled = !hasPremiumAccess;
  dom.markComplete.disabled = !hasPremiumAccess;
  dom.prevLesson.disabled = accessibleIndex <= 0;
  dom.nextLesson.disabled = accessibleIndex >= accessibleLessons.length - 1;

  if (!hasPremiumAccess) {
    const hint = document.createElement("p");
    hint.className = "side-copy";
    hint.textContent = "Esta aula está aberta na apresentação. Favoritos, progresso e anotações completas ficam disponíveis depois do login.";
    dom.lessonContent.prepend(hint);
  }
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
  const studentName = String(state.member?.name || "Aluno").trim();
  const freeMember = isFreeMember();
  const checkoutUrl = getCheckoutUrl();
  const whatsappUrl = getWhatsAppUrl();
  const completedJourney = state.completed.size === course.lessons.length && Boolean(state.quizResult?.passed);
  dom.printCertificate.disabled = !unlocked;
  dom.certificateCard.classList.toggle("is-locked", !unlocked);
  dom.certificateCard.classList.toggle("has-long-student-name", studentName.length > 28);
  dom.certificateCard.classList.toggle("has-very-long-student-name", studentName.length > 42);
  dom.printCertificate.textContent = unlocked ? "Preencher e imprimir" : "Certificado bloqueado";
  const certifiedHours = Math.max(1, Math.ceil(course.totalDuration / 60));

  if (unlocked) {
    const date = new Date(state.quizResult.completedAt);
    const formatted = date.toLocaleDateString("pt-BR");
    const compactDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
      date.getDate()
    ).padStart(2, "0")}`;
    const identitySeed = slugify(studentName || "aluno")
      .replaceAll("-", "")
      .toUpperCase()
      .slice(0, 6)
      .padEnd(6, "X");
    const certificateCode = `NSP-${compactDate}-${identitySeed}`;

    dom.certificateWorkload.textContent = `Carga horária certificada: ${certifiedHours} horas`;
    dom.certificateDate.textContent = `Data: ${formatted}`;
    dom.certificateId.textContent = `Registro: ${certificateCode}`;
    dom.certificateStatusTitle.textContent = "Certificado liberado";
    dom.certificateStatusCopy.textContent =
      "Seu certificado profissional de curso livre já está preenchido com nome, data, carga horária e registro. Agora basta clicar em Preencher e imprimir.";
  } else {
    dom.certificateWorkload.textContent = `Carga horária certificada: ${certifiedHours} horas`;
    dom.certificateDate.textContent = "Data: aguardando conclusão";
    dom.certificateId.textContent = "Registro: aguardando liberação";
    dom.certificateStatusTitle.textContent = freeMember ? "Disponível no premium" : "Ainda bloqueado";
    dom.certificateStatusCopy.textContent =
      freeMember
        ? "Sua conta gratuita não inclui certificado de conclusão. Ative o plano premium para remover os anúncios e liberar a emissão do certificado."
        : "Conclua todas as aulas, alcance 70% ou mais no quiz final e mantenha o plano premium ativo para liberar o certificado profissional de curso livre.";
  }

  if (dom.certificateUpsell) {
    if (freeMember) {
      dom.certificateUpsell.innerHTML = `
        <div class="certificate-upsell-card ${completedJourney ? "is-ready" : ""}">
          <span class="certificate-upsell-kicker">${
            completedJourney ? "Apto para emissão" : "Benefício do premium"
          }</span>
          <strong>${completedJourney ? "Você já está apto para emissão" : "Certificado disponível no premium"}</strong>
          <p>${
            completedJourney
              ? "Você já concluiu a trilha e atingiu a nota mínima no quiz. Agora falta só ativar o plano premium para emitir o certificado sem anúncios."
              : "A conta gratuita permite estudar com anúncios. Para emitir o certificado ao concluir a trilha, ative o plano premium."
          }</p>
          <div class="certificate-upsell-actions">
            <a class="button button-primary button-small ${checkoutUrl === "#" ? "is-disabled-link" : ""}" href="${checkoutUrl}" ${
              checkoutUrl === "#" ? 'aria-disabled="true"' : 'target="_blank" rel="noreferrer"'
            }>Ativar premium agora</a>
            <a class="button button-secondary button-small ${whatsappUrl === "#" ? "is-disabled-link" : ""}" href="${whatsappUrl}" ${
              whatsappUrl === "#" ? 'aria-disabled="true"' : 'target="_blank" rel="noreferrer"'
            }>Tirar dúvida no WhatsApp</a>
          </div>
        </div>
      `;
    } else {
      dom.certificateUpsell.innerHTML = "";
    }
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

function renderAdminPanel() {
  const query = normalize(state.adminQuery);
  const allMembers = authState.adminMembers || [];
  const selfMember = allMembers.find((member) => member.userId === authState.user?.id) || null;
  const manageableMembers = allMembers.filter((member) => member.userId !== authState.user?.id);
  const pendingMembers = manageableMembers.filter((member) => member.accessStatus === "pending").slice(0, 6);
  const members = manageableMembers.filter((member) => {
    const matchesFilter =
      state.adminFilter === "all"
        ? true
        : state.adminFilter === "admins"
          ? member.role === "admin"
          : member.accessStatus === state.adminFilter;

    if (!matchesFilter) return false;
    if (!query) return true;
    return normalize(`${member.name} ${member.email} ${member.accessStatus}`).includes(query);
  });

  const metrics = [
    { label: "Cadastros", value: String(manageableMembers.length) },
    {
      label: "Gratuitos",
      value: String(manageableMembers.filter((member) => member.accessStatus === "pending").length),
    },
    {
      label: "Premium",
      value: String(manageableMembers.filter((member) => member.accessStatus === "active").length),
    },
    {
      label: "Admins",
      value: String(allMembers.filter((member) => member.role === "admin").length),
    },
  ];

  dom.adminFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.adminFilter === state.adminFilter);
  });

  dom.adminMetrics.innerHTML = metrics
    .map(
      (item) => `
        <article class="metric-item">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </article>
      `
    )
    .join("");

  dom.adminSelfCard.innerHTML = selfMember
    ? `
        <article class="admin-self-item">
          <strong>${escapeHtml(selfMember.name)}</strong>
          <span>${escapeHtml(selfMember.email || "Sem e-mail")}</span>
          <div class="admin-tag-row">
            <span class="admin-role-badge is-${escapeHtml(selfMember.role)}">${escapeHtml(
              getAdminRoleLabel(selfMember.role)
            )}</span>
            <span class="admin-status-badge is-${escapeHtml(selfMember.accessStatus)}">${escapeHtml(
              getAdminAccessLabel(selfMember.accessStatus)
            )}</span>
          </div>
          <span>Essa é a sua conta principal de administração.</span>
        </article>
      `
    : `<div class="empty-state">Sua conta administradora será exibida aqui.</div>`;

  dom.adminPendingList.innerHTML =
    pendingMembers.length > 0
      ? pendingMembers
          .map(
            (member) => `
              <article class="admin-pending-item">
                <div class="admin-member-copy">
                  <strong>${escapeHtml(member.name)}</strong>
                  <span>${escapeHtml(member.email || "Sem e-mail")}</span>
                </div>
                <button class="button button-secondary button-small" data-access-action="active" data-member-id="${member.userId}" type="button">
                  Ativar premium
                </button>
              </article>
            `
          )
          .join("")
      : `<div class="empty-state">Nenhuma conta gratuita aguardando liberação agora.</div>`;

  dom.adminMemberList.innerHTML =
    members.length > 0
      ? members
          .map(
            (member) => `
              <article class="admin-member-item">
                <div class="admin-member-copy">
                  <div class="admin-member-head">
                    <strong>${escapeHtml(member.name)}</strong>
                    <div class="admin-tag-row">
                      <span class="admin-status-badge is-${escapeHtml(member.accessStatus)}">${escapeHtml(
                        getAdminAccessLabel(member.accessStatus)
                      )}</span>
                      <span class="admin-role-badge is-${escapeHtml(member.role)}">${escapeHtml(
                        getAdminRoleLabel(member.role)
                      )}</span>
                    </div>
                  </div>
                  <span>${escapeHtml(member.email || "Sem e-mail")}</span>
                  <span>Atualizado em ${escapeHtml(formatAdminDate(member.updatedAt))}</span>
                </div>
                <div class="admin-member-actions">
                  <button class="button button-secondary button-small" data-access-action="active" data-member-id="${member.userId}" type="button" ${
                    member.accessStatus === "active" ? "disabled" : ""
                  }>Ativar premium</button>
                  <button class="button button-secondary button-small" data-access-action="pending" data-member-id="${member.userId}" type="button" ${
                    member.accessStatus === "pending" ? "disabled" : ""
                  }>Deixar no gratuito</button>
                  <button class="button button-secondary button-small" data-access-action="${
                    member.accessStatus === "blocked" ? "pending" : "blocked"
                  }" data-member-id="${member.userId}" type="button">${
                    member.accessStatus === "blocked" ? "Desbloquear" : "Bloquear"
                  }</button>
                  <button class="button button-secondary button-small" data-role-action="${
                    member.role === "admin" ? "student" : "admin"
                  }" data-member-id="${member.userId}" type="button">${
                    member.role === "admin" ? "Remover admin" : "Tornar admin"
                  }</button>
                  <button class="button button-secondary button-small" data-remove-member="${member.userId}" type="button">Remover inscrito</button>
                  <button class="button button-secondary button-small" data-copy-welcome="${member.userId}" type="button">Copiar boas-vindas</button>
                </div>
              </article>
            `
          )
          .join("")
      : `<div class="empty-state">Nenhuma conta encontrada neste filtro. Quando um aluno criar a conta, ela aparecerá aqui.</div>`;

  dom.adminMemberList.querySelectorAll("[data-access-action]").forEach((button) => {
    button.addEventListener("click", () => {
      void updateMemberAccess(button.dataset.memberId, button.dataset.accessAction);
    });
  });

  dom.adminPendingList.querySelectorAll("[data-access-action]").forEach((button) => {
    button.addEventListener("click", () => {
      void updateMemberAccess(button.dataset.memberId, button.dataset.accessAction);
    });
  });

  dom.adminMemberList.querySelectorAll("[data-role-action]").forEach((button) => {
    button.addEventListener("click", () => {
      void updateMemberRole(button.dataset.memberId, button.dataset.roleAction);
    });
  });

  dom.adminMemberList.querySelectorAll("[data-copy-welcome]").forEach((button) => {
    button.addEventListener("click", async () => {
      const member = allMembers.find((item) => item.userId === button.dataset.copyWelcome);
      if (!member) return;
      const copied = await copyTextToClipboard(buildWelcomeMessage(member));
      dom.adminStatusCopy.textContent = copied
        ? `Mensagem de boas-vindas copiada para ${member.name}.`
        : "Nao foi possivel copiar a mensagem de boas-vindas.";
    });
  });

  dom.adminMemberList.querySelectorAll("[data-remove-member]").forEach((button) => {
    button.addEventListener("click", () => {
      void removeMemberEnrollment(button.dataset.removeMember);
    });
  });
}

function renderMonetization() {
  const showAds = appConfig.adsEnabled && isFreeMember();
  ensureAdsScript();

  [
    [dom.publicAdCard, "Acesso gratuito com anúncios"],
    [dom.dashboardAdCard, "Seu plano gratuito é mantido por anúncios"],
    [dom.lessonAdCard, "Anúncio do plano gratuito"],
  ].forEach(([element, title], index) => {
    if (!element) return;
    element.hidden = !showAds;
    if (!showAds) {
      element.innerHTML = "";
      return;
    }

    element.innerHTML = `
      ${getAdSupportMarkup(title, index > 0)}
      <div class="ad-placeholder">${escapeHtml(
        appConfig.adSenseClient
          ? "Os anúncios automáticos serão exibidos aqui quando a conta de anúncios estiver ativa."
          : "Espaço preparado para anúncios. Assim que você conectar sua conta de anúncios, este plano gratuito começa a monetizar."
      )}</div>
    `;
  });
}

function renderAll() {
  syncAdminUi();
  renderSessionChrome();
  renderPublicOffer();
  renderMonetization();
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
  renderAdminPanel();
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

async function signInWithSupabase() {
  const email = dom.authEmailInput.value.trim();
  const password = dom.authPasswordInput.value.trim();

  if (!email || !password) {
    setAccessFeedback("Preencha e-mail e senha para entrar.", "is-error");
    return;
  }

  const client = await getAuthClient();
  if (!client) {
    setAccessFeedback("A plataforma ainda nao foi configurada para login individual.", "is-error");
    return;
  }

  setAccessFeedback("Entrando na conta do aluno...", "");
  const { error, data } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const normalizedMessage = normalize(error.message);

    if (
      normalizedMessage.includes("invalid login credentials") ||
      normalizedMessage.includes("invalid credentials") ||
      normalizedMessage.includes("email or password") ||
      normalizedMessage.includes("email not confirmed")
    ) {
      setAccessFeedback(
        "E-mail ou senha não conferem. Se a conta já existe, entre com a senha correta ou redefina a senha.",
        "is-error"
      );
      return;
    }

    setAccessFeedback(error.message, "is-error");
    return;
  }

  await applySupabaseSession(data.session);
}

async function signUpWithSupabase() {
  const email = dom.authEmailInput.value.trim();
  const password = dom.authPasswordInput.value.trim();
  const suggestedName = email.split("@")[0] || "Aluno";

  if (!email || !password) {
    setAccessFeedback("Preencha e-mail e senha para criar a conta.", "is-error");
    return;
  }

  if (password.length < 8) {
    setAccessFeedback("Use uma senha com pelo menos 8 caracteres.", "is-error");
    return;
  }

  const client = await getAuthClient();
  if (!client) {
    setAccessFeedback("A plataforma ainda nao foi configurada para login individual.", "is-error");
    return;
  }

  setAccessFeedback("Criando a conta do aluno...", "");
  const { error, data } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: appConfig.siteUrl,
      data: {
        name: suggestedName,
      },
    },
  });

  if (error) {
    const normalizedMessage = normalize(error.message);

    if (
      normalizedMessage.includes("already registered") ||
      normalizedMessage.includes("already been registered") ||
      normalizedMessage.includes("user already registered")
    ) {
      setAccessFeedback("Esse e-mail já está cadastrado. Tentando entrar na sua conta...", "");
      const loginAttempt = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (loginAttempt.error) {
        setAccessFeedback(
          "Esse e-mail já existe. Use a senha correta e clique em Entrar com e-mail.",
          "is-error"
        );
        return;
      }

      await applySupabaseSession(loginAttempt.data.session);
      return;
    }

    setAccessFeedback(error.message, "is-error");
    return;
  }

  if (data?.session) {
    setAccessFeedback("Conta criada com sucesso. Abrindo sua área...", "is-success");
    await applySupabaseSession(data.session);
    return;
  }

  const loginAttempt = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (!loginAttempt.error && loginAttempt.data.session) {
    setAccessFeedback("Conta criada com sucesso. Abrindo sua área...", "is-success");
    await applySupabaseSession(loginAttempt.data.session);
    return;
  }

  setAccessFeedback(
    "Conta criada com sucesso. Agora entre com seu e-mail e senha para continuar.",
    "is-success"
  );
}

async function resetSupabasePassword() {
  const email = dom.authEmailInput.value.trim();
  if (!email) {
    setAccessFeedback("Informe o e-mail da conta para redefinir a senha.", "is-error");
    return;
  }

  const client = await getAuthClient();
  if (!client) {
    setAccessFeedback("A plataforma ainda nao foi configurada para login individual.", "is-error");
    return;
  }

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: appConfig.siteUrl,
  });

  if (error) {
    setAccessFeedback(error.message, "is-error");
    return;
  }

  setAccessFeedback("Link de redefinicao enviado para o e-mail informado.", "is-success");
}

async function signOutFromSupabase() {
  const client = await getAuthClient();
  if (!client) return;
  await client.auth.signOut();
  authState.session = null;
  authState.user = null;
  authState.accessGranted = false;
  authState.accessStatus = "guest";
  authState.isAdmin = false;
  authState.profileRole = "student";
  authState.adminMembers = [];
  removeStored(storageKeys.supabaseUser);
  resetMemberWorkspace();
  state.activePanel = "public";
  saveState();
  syncAccessModeUi();
  syncAdminUi();
  closeAccessModal();
  renderAll();
}

async function applySupabaseSession(session) {
  const previousUserId = loadJSON(storageKeys.supabaseUser, null);
  authState.session = session || null;
  authState.user = session?.user || null;
  const nextUserId = authState.user?.id || null;

  if (!authState.session) {
    authState.accessGranted = false;
    authState.accessStatus = "guest";
    authState.isAdmin = false;
    authState.profileRole = "student";
    state.activePanel = "public";
    removeStored(storageKeys.supabaseUser);
    saveState();
    syncAccessModeUi();
    closeAccessModal();
    renderAll();
    return;
  }

  if (previousUserId !== nextUserId) {
    resetMemberWorkspace();
  }

  saveJSON(storageKeys.supabaseUser, nextUserId);

  await ensureRemoteProfile();
  await loadRemoteProfile();
  await refreshRemoteAccessStatus();
  syncAccessModeUi();

  if (!authState.accessGranted && !authState.isAdmin) {
    openAccessModal(
      "Conta autenticada. Sua conta foi criada, mas ainda está sem permissão para entrar."
    );
    setAccessFeedback(
      "Assim que a liberação for concluída, clique em Atualizar acesso.",
      ""
    );
    return;
  }

  if (authState.accessGranted || authState.isAdmin) {
    await pullRemoteState();
    saveState();
  }

  if (authState.isAdmin) {
    await refreshAdminMembers();
  }

  const nextPanel = authState.isAdmin
    ? accessTargetPanel === "admin"
      ? "admin"
      : accessTargetPanel === "public"
        ? "dashboard"
        : accessTargetPanel || "dashboard"
    : accessTargetPanel && accessTargetPanel !== "public"
      ? accessTargetPanel
      : "dashboard";

  closeAccessModal();
  state.activePanel = nextPanel;
  saveState();
  renderAll();

  if (!state.member?.name || !state.member?.email) {
    openAuthModal(false);
  } else {
    closeAuthModal();
  }
}

async function bootstrapSupabaseAuth() {
  if (!isSupabaseMode()) return;

  syncAccessModeUi();

  if (!hasSupabaseConfig()) {
    openAccessModal(
      "A configuracao da plataforma ainda nao foi concluida."
    );
    return;
  }

  const client = await getAuthClient();
  if (!client) return;

  const { data } = await client.auth.getSession();
  if (data.session) {
    await applySupabaseSession(data.session);
  } else {
    authState.session = null;
    authState.user = null;
    authState.accessGranted = false;
    authState.accessStatus = "guest";
    authState.isAdmin = false;
    authState.profileRole = "student";
    state.activePanel = "public";
    saveState();
    closeAccessModal();
    renderAll();
  }

  client.auth.onAuthStateChange((_event, session) => {
    void applySupabaseSession(session);
  });
}

async function handleAccessSubmit(event) {
  event.preventDefault();

  if (isSupabaseMode()) {
    if (authState.session && hasMemberAreaAccess()) {
      closeAccessModal();
      setActivePanel(authState.isAdmin && accessTargetPanel === "admin" ? "admin" : accessTargetPanel || "dashboard");
      return;
    }

    await signInWithSupabase();
    return;
  }

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
  if (isSupabaseMode()) {
    void signOutFromSupabase();
    return;
  }

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
  if (isSupabaseMode()) {
    void pushRemoteState();
  }
});

dom.accessForm.addEventListener("submit", handleAccessSubmit);
dom.authSignupButton.addEventListener("click", () => {
  void signUpWithSupabase();
});
dom.authResetButton.addEventListener("click", () => {
  void resetSupabasePassword();
});
dom.authRefreshAccessButton.addEventListener("click", () => {
  void applySupabaseSession(authState.session);
});
dom.authSignoutButton.addEventListener("click", () => {
  void signOutFromSupabase();
});

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

dom.enterMemberArea.addEventListener("click", () => {
  if (hasMemberAreaAccess()) {
    setActivePanel("dashboard");
    return;
  }

  openAccessModal("Entre com sua conta ou crie sua conta gratuita para liberar painel, progresso e certificado.", "dashboard");
});

dom.resumeCourse.addEventListener("click", () => {
  if (hasMemberAreaAccess()) {
    openNextLesson(true);
    return;
  }

  const previewLesson = getPreviewLessons()[0];
  if (!previewLesson) return;
  state.selectedLessonId = previewLesson.id;
  saveState();
  setActivePanel("course");
});
dom.goToQuiz.addEventListener("click", () => {
  if (hasMemberAreaAccess()) {
    setActivePanel("quiz");
    return;
  }

  openAccessModal("Entre com sua conta ou crie sua conta gratuita para liberar quiz, certificado e painel.", "dashboard");
});
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
  const accessibleLessons = getAccessibleLessons();
  const currentIndex = accessibleLessons.findIndex((lesson) => lesson.id === state.selectedLessonId);
  if (currentIndex <= 0) return;
  state.selectedLessonId = accessibleLessons[currentIndex - 1].id;
  saveState();
  renderCourse();
});

dom.nextLesson.addEventListener("click", () => {
  const accessibleLessons = getAccessibleLessons();
  const currentIndex = accessibleLessons.findIndex((lesson) => lesson.id === state.selectedLessonId);
  if (currentIndex >= accessibleLessons.length - 1) return;
  state.selectedLessonId = accessibleLessons[currentIndex + 1].id;
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

dom.refreshAdminMembers?.addEventListener("click", () => {
  void refreshAdminMembers();
});

dom.adminMemberSearch?.addEventListener("input", (event) => {
  state.adminQuery = event.target.value;
  renderAdminPanel();
});

dom.adminFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.adminFilter = button.dataset.adminFilter || "all";
    renderAdminPanel();
  });
});

window.addEventListener("focus", () => {
  if (isSupabaseMode()) {
    if (authState.session && !authState.accessGranted && state.activePanel !== "public" && !authState.isAdmin) {
      void applySupabaseSession(authState.session);
    }
    return;
  }

  if (!hasActiveAccess() && isPanelRestricted(state.activePanel)) {
    openAccessModal(
      "Sua sessao expirou ou ainda nao foi validada. Digite o codigo de acesso para continuar."
    );
    setActivePanel("public");
  }
});

renderAll();

syncAccessModeUi();

if (isSupabaseMode()) {
  void bootstrapSupabaseAuth();
} else {
  closeAccessModal();
  if (hasMemberAreaAccess() && !state.member) {
    openAuthModal(false);
  } else {
    closeAuthModal();
  }
}
