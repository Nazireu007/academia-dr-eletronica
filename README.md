# Academia DR | Curso Completo de Eletrônica

Esta pasta agora contém uma plataforma web local em formato de área de membros.

## O que foi criado

- `index.html`: interface principal da plataforma.
- `styles.css`: identidade visual premium, responsiva e com modo de impressão do certificado.
- `script.js`: lógica da área de membros, perfil do aluno, progresso, favoritos, anotações, quiz e certificado.
- `app-config.js`: chaveia entre modo local e autenticação real com Supabase.
- `access-config.js`: configuração do bloqueio de acesso da área de membros.
- `course-data.js`: conteúdo completo do curso embutido para funcionar direto no navegador.
- `conteudo/curso-eletronica.md`: texto-base limpo extraído do material bruto.
- `gerar-acesso.html`: ferramenta local para gerar um novo hash de acesso.
- `supabase-schema.sql`: estrutura do backend para contas individuais, liberação por aluno e estado remoto.
- `MONETIZACAO.md`: guia rápido do modelo comercial do curso.

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
- `access-config.js`
- `course-data.js`
- `MONETIZACAO.md`
- `404.html`
- `conteudo/curso-eletronica.md`

Isso evita expor o arquivo bruto `meuprojeto.txt`.

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

## Protecao da area de membros

Esta versao agora exige um codigo de acesso antes de liberar o curso. O bloqueio funciona com:

- hash PBKDF2 no navegador
- sessao com expiracao automatica
- botao de saida da area protegida
- perfil do aluno separado da validacao de acesso

Para trocar o codigo atual:

1. Abra `gerar-acesso.html` no navegador.
2. Gere um novo bloco de configuracao.
3. Substitua o conteudo de `access-config.js`.
4. Publique novamente com `git push`.

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
