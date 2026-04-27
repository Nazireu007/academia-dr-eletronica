import { readFile } from "node:fs/promises";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compactSql(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function findPolicy(sql, policyName) {
  const pattern = new RegExp(`create policy "${escapeRegex(policyName)}"[\\s\\S]*?;`, "i");
  const match = sql.match(pattern);
  assert(match, `Policy ausente no schema: ${policyName}`);
  return compactSql(match[0]);
}

const schema = await readFile("supabase-schema.sql", "utf8");
const deployWorkflow = await readFile(".github/workflows/deploy-pages.yml", "utf8");
const appConfig = await readFile("app-config.js", "utf8");
const script = await readFile("script.js", "utf8");

const profilesInsertOwn = findPolicy(schema, "profiles_upsert_own");
const profilesUpdateOwn = findPolicy(schema, "profiles_update_own");
const profilesUpdateAdmin = findPolicy(schema, "profiles_update_admin");
const courseAccessInsertAdmin = findPolicy(schema, "course_access_insert_admin");
const courseAccessUpdateAdmin = findPolicy(schema, "course_access_update_admin");
const courseAccessDeleteAdmin = findPolicy(schema, "course_access_delete_admin");

assert(
  profilesInsertOwn.includes("with check (auth.uid() = user_id and role = 'student')"),
  "profiles_upsert_own precisa bloquear criacao propria com role diferente de student."
);

assert(
  profilesUpdateOwn.includes("using (auth.uid() = user_id)") &&
    profilesUpdateOwn.includes("with check (auth.uid() = user_id and role = 'student')"),
  "profiles_update_own precisa permitir edicao propria apenas mantendo role student."
);

assert(
  profilesUpdateAdmin.includes("using (public.is_admin())") &&
    profilesUpdateAdmin.includes("with check (public.is_admin())"),
  "profiles_update_admin precisa continuar restrita a administradores."
);

assert(
  courseAccessInsertAdmin.includes("with check (public.is_admin())"),
  "course_access_insert_admin precisa exigir administrador."
);

assert(
  courseAccessUpdateAdmin.includes("using (public.is_admin())") &&
    courseAccessUpdateAdmin.includes("with check (public.is_admin())"),
  "course_access_update_admin precisa exigir administrador."
);

assert(
  courseAccessDeleteAdmin.includes("using (public.is_admin())"),
  "course_access_delete_admin precisa exigir administrador."
);

[profilesInsertOwn, profilesUpdateOwn].forEach((policy) => {
  assert(
    !policy.includes("with check (auth.uid() = user_id);"),
    "Policy insegura detectada: perfil proprio sem trava de role."
  );
});

[
  "access-config.js",
  "access-generator.js",
  "gerar-acesso.html",
  "supabase-schema.sql",
  "supabase-security-audit.sql",
  "security-check.mjs",
  "smoke-test.mjs",
].forEach((privateFile) => {
  assert(
    !new RegExp(`\\bcp\\s+${escapeRegex(privateFile)}\\s+_site/`, "i").test(deployWorkflow),
    `${privateFile} nao deve ser copiado para o GitHub Pages.`
  );
});

assert(
  appConfig.includes("passwordBreachCheckEnabled: true"),
  "A protecao gratuita contra senha vazada deve ficar ativa em app-config.js."
);

assert(
  script.includes("https://api.pwnedpasswords.com/range/") &&
    script.includes("getSignupPasswordIssue") &&
    script.includes("getCompromisedPasswordCount"),
  "O cadastro precisa consultar a API k-anonymity do HaveIBeenPwned antes de criar conta."
);

console.log("Security check concluido com sucesso.");
