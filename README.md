# Academia DR | Curso Completo de Eletrônica

Esta pasta agora contém uma plataforma web local em formato de área de membros.

## O que foi criado

- `index.html`: interface principal da plataforma.
- `styles.css`: identidade visual premium, responsiva e com modo de impressão do certificado.
- `script.js`: lógica da área de membros, perfil do aluno, progresso, favoritos, anotações, quiz e certificado.
- `course-data.js`: conteúdo completo do curso embutido para funcionar direto no navegador.
- `conteudo/curso-eletronica.md`: texto-base limpo extraído do material bruto.

## Recursos da plataforma

- onboarding do aluno com perfil salvo localmente
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
- `course-data.js`
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

## Observação

Esta versão é local e estática. Os dados do aluno ficam salvos no navegador via `localStorage`.
