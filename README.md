# Nitro Scan Pro | Curso Completo de Eletrônica

Esta pasta agora contém uma plataforma web local em formato de área de membros.

## O que foi criado

- `index.html`: interface principal da plataforma.
- `styles.css`: identidade visual premium, responsiva e com modo de impressão do certificado.
- `script.js`: lógica da área de membros, perfil do aluno, progresso, favoritos, anotações, quiz e certificado.
- `app-config.js`: chaveia entre modo local e autenticação real com Supabase.
- `access-config.js`: configuração local de acesso por código. Este arquivo fica fora do GitHub Pages e não deve guardar chaves privadas.
- `course-data.js`: conteúdo completo do curso embutido para funcionar direto no navegador.
- `conteudo/curso-eletronica.md`: texto-base limpo extraído do material bruto.
- `gerar-acesso.html`: ferramenta local para gerar um novo hash de acesso.
- `supabase-schema.sql`: estrutura do backend para contas individuais, liberação por aluno e estado remoto.
- `MONETIZACAO.md`: guia rápido do modelo comercial do curso.
- `privacidade.html`: política de privacidade pública da plataforma.
- `termos.html`: termos públicos de uso da plataforma.
- `robots.txt` e `sitemap.xml`: arquivos públicos de SEO.
- `site.webmanifest` e `sw.js`: base PWA segura, sem cache agressivo.
- `SECURITY.md`: política de segurança do projeto.

## Recursos da plataforma

- onboarding do aluno com perfil salvo localmente
- area de membros bloqueada por codigo de acesso com sessao expirada automaticamente
- modo profissional pronto para Supabase com login por e-mail e liberação individual
- vitrine pública com preview grátis e CTA de checkout/WhatsApp
- painel admin para liberar ou bloquear alunos via Supabase
- painel de membro com métricas e conquistas
- player do curso com módulos, busca e progresso
- favoritos e anotações por aula
- biblioteca pessoal de revisão
- quiz final com correção
- certificado desbloqueado por conclusão e aprovação

## Como visualizar

Abra `index.html` no navegador.

## Publicar no GitHub Pages

Este projeto já está preparado para publicar via GitHub Pages com GitHub Actions.

O workflow fica em `.github/workflows/deploy-pages.yml` e publica apenas os arquivos que devem ir para a web:

- `index.html`
- `styles.css`
- `script.js`
- `app-config.js`
- `course-data.js`
- `privacidade.html`
- `termos.html`
- `favicon.svg`
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- `sw.js`
- `404.html`

Isso evita expor ferramentas e arquivos internos como `access-config.js`, `gerar-acesso.html`, `access-generator.js`, `supabase-schema.sql`, `smoke-test.mjs`, `MONETIZACAO.md`, `meuprojeto.txt`, `.tools/` e documentação do repositório.

## SEO, PWA e segurança

- `sitemap.xml` lista somente as páginas públicas indexáveis.
- `robots.txt` aponta o sitemap e bloqueia URLs internas que não devem aparecer em busca.
- `site.webmanifest` ativa metadados de instalação do app.
- `sw.js` registra um service worker transparente, sem cache agressivo, para não prender versão velha nem interferir com login/anúncios.
- `SECURITY.md` documenta como reportar vulnerabilidades e reforça que chaves privadas não devem entrar no front-end.

### Passo a passo

1. Crie um repositório no GitHub.
2. Envie esta pasta para a branch `main`.
3. No GitHub, abra `Settings > Pages`.
4. Em `Build and deployment`, selecione `GitHub Actions`.
5. Após o workflow rodar, o link ficará assim:

`https://SEUUSUARIO.github.io/NOME-DO-REPOSITORIO/`

### Sugestão de nome do repositório

`academia-dr-eletronica`

Com esse nome, o link ficaria:

`https://SEUUSUARIO.github.io/academia-dr-eletronica/`

## Protecao da area de membros local

O modo local por codigo continua disponivel apenas para desenvolvimento ou uso offline. Ele nao e publicado no GitHub Pages quando `authMode` esta em `supabase`. O bloqueio local funciona com:

- hash PBKDF2 no navegador
- sessao com expiracao automatica
- botao de saida da area protegida
- perfil do aluno separado da validacao de acesso

Para trocar o codigo local:

1. Abra `gerar-acesso.html` no navegador.
2. Gere um novo bloco de configuracao.
3. Substitua o conteudo de `access-config.js`.
4. Use esse arquivo somente em ambiente local ou em uma hospedagem privada.

## Autenticacao profissional

Se voce quiser sair do modo local e usar contas individuais de verdade:

1. Crie um projeto no Supabase.
2. Rode `supabase-schema.sql` no SQL Editor.
3. Preencha `app-config.js` com:
   - `authMode: "supabase"`
   - `supabaseUrl`
   - `supabaseAnonKey`
4. Publique novamente.

Depois disso:

- cada aluno entra com e-mail e senha
- o acesso pode ser liberado por aluno na tabela `course_access`
- progresso, notas e quiz sobem para o backend
- o codigo de acesso local deixa de ser o fluxo principal
- novos cadastros criam perfil remoto antes de abrir a plataforma
- o painel admin usa a RPC `admin_set_course_access` para centralizar a liberação no banco, com fallback para a política antiga enquanto o SQL novo não for aplicado

Para transformar sua conta em admin no Supabase:

```sql
update public.member_profiles
set role = 'admin'
where email = 'SEUEMAIL@AQUI.COM';
```

Com isso, o painel `Admin` aparece na interface e voce consegue:

- listar alunos
- liberar acesso individual
- bloquear acesso
- acompanhar status do curso

## Modo híbrido comercial

Voce tambem pode vender sem abandonar seu site:

1. Configure `app-config.js` com:
   - `checkoutUrl` ou `hotmartCheckoutUrl`
   - `hotmartMembersUrl`
   - `whatsappNumber`
   - `freeModuleNumbers`
2. A aba `Oferta` vira sua vitrine pública.
3. O player libera só o preview grátis para visitantes.
4. O resto da plataforma continua premium.

## Observacao importante

Esta protecao melhora bastante a experiencia e evita acesso casual direto, mas continua sendo uma aplicacao estatica no GitHub Pages. Isso significa:

- os dados do aluno continuam salvos no navegador via `localStorage`
- nao existe autenticacao real por aluno no servidor
- quem tiver conhecimento tecnico ainda pode inspecionar o front-end

Para protecao profissional de verdade, com compra, login individual e recuperacao de conta, o proximo passo e usar backend ou plataforma de membros.
