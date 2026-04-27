# Security Policy

## Supported Version

The supported version is the current `main` branch published to GitHub Pages:

https://nazireu007.github.io/academia-dr-eletronica/

## Reporting a Vulnerability

Do not open a public issue for sensitive security reports.

Send a private report to the project owner with:

- affected URL or file
- steps to reproduce
- expected and actual behavior
- screenshots or console logs, if available
- any account or payment context needed to understand impact

## Public Static Hosting Notes

This project runs on GitHub Pages. Client-side files are public by nature, so secrets must not be committed to this repository.

Do not store private service keys, admin passwords, payment secrets, database passwords, or Supabase service-role keys in frontend files. Public anon keys and publishable keys can be present only when their backend Row Level Security policies are correctly configured.

## Deployment Boundary

The Pages workflow publishes only the public app bundle. Internal tools and operational files stay in the repository and are intentionally excluded from the deployed artifact, including:

- access hash generator
- smoke tests
- Supabase SQL setup
- monetization notes
- raw/source notes
- repository documentation

Review `.github/workflows/deploy-pages.yml` before adding new public files.
