# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| latest  | ✅        |

## Credential security

**Never commit secrets.**

This repository must not contain:
- API keys or tokens (OpenAI, Slack, Linear, GitHub, etc.)
- Passwords or credentials of any kind
- Real email addresses of real people
- Production webhook URLs that could be triggered externally
- Customer data or personally identifiable information (PII)
- Database connection strings with real credentials

All secrets must be managed inside n8n's built-in credential store or via your
organisation's secret manager. See `.env.example` for the environment-variable
pattern — never put actual values in `.env.example`.

## What to do if you find a secret accidentally committed

1. Do **not** open a public GitHub Issue
2. Email the maintainers at: security@YOUR_ORG.example (replace before publishing)
3. Rotate the exposed credential immediately — assume it is compromised
4. We will acknowledge within 48 hours and guide you through a proper remediation

## Sensitive product data in workflow outputs

- Competitor intelligence and customer feedback may be commercially sensitive
- Restrict access to the n8n instance to people who need it
- Use n8n's role-based access control (RBAC) to limit workflow visibility
- Do not store raw AI outputs in public Google Sheets

## n8n instance hardening (self-hosted)

- Enable n8n basic auth or SSO before exposing to the internet
- Use HTTPS behind a reverse proxy (Caddy, Nginx, Traefik)
- Restrict the webhook port to internal networks where possible
- Keep n8n updated — security patches ship regularly

## Reporting a vulnerability in this project

If you find a security issue in the workflows or scripts in this repo, please
disclose it responsibly by emailing the maintainers rather than opening a
public issue.
