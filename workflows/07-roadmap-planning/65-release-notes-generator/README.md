# Release Notes Generator

> Turn closed Jira/Linear tickets into user-facing release notes — reviewed and approved before publishing.

---

## 1. Overview

Takes a list of completed tickets (features, improvements, bug fixes, security patches) and uses an LLM to produce user-facing release notes. Generates a structured JSON output and a ready-to-publish Markdown draft. Requires approval before distribution.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 65

---

## 2. The problem

Writing release notes is time-consuming. Developers write tickets for engineers, not users. Someone has to read every ticket, understand the user impact, and translate it into a benefit statement. This workflow does that first draft in seconds.

---

## 3. How it works

```
Manual Trigger (sample) ─┐
                          ├─→ Prepare Prompt ─→ LLM: Generate Notes ─→ Validate ─→ Send for Approval
Webhook: Post-Deploy ─────┘
                                                                                              │
                                                                                      Wait (48h)
                                                                                              │
                                                                                        Approved?
                                                                                   ┌──────────┴──────┐
                                                                                 Yes                No
                                                                                   │                  │
                                                                          Publish Notes         Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Technical → user-facing translation |
| SMTP Email | Basic | Yes | Approval and publishing |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  RELEASE_EMAIL_TO              = pm@yourcompany.com  (approver)
  RELEASE_DISTRIBUTION_EMAIL   = users@yourcompany.com (published to)
  AI_MODEL                     = gpt-4o-mini

Step 3: Connect to your ticketing system (production)
  On release deploy: POST to /webhook/generate-release-notes with:
  { "version": "2.14.0", "release_date": "2026-07-14", "tickets": [...] }
  
  Or: Jira automation rule on sprint close → webhook call
  Or: GitHub Actions workflow_dispatch → HTTP POST to n8n webhook

Step 4: Test with Manual Trigger
  - 10 sample tickets (3 features, 3 improvements, 3 bug fixes, 1 security)
  - Approve → notes published to RELEASE_DISTRIBUTION_EMAIL
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `RELEASE_EMAIL_TO` | Required | — | Approver (PM) |
| `RELEASE_DISTRIBUTION_EMAIL` | Optional | Same as `RELEASE_EMAIL_TO` | Publishing destination (team, changelog system, etc) |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "version": "2.14.0",
  "release_date": "2026-07-14",
  "tickets": [
    { "id": "ENG-451", "type": "feature|improvement|bugfix|security", "title": "string — engineering ticket title", "jira_link": "https://..." }
  ]
}
```

---

## 8. Output schema

```json
{
  "release_title": "string",
  "release_summary": "string",
  "whats_new": [{ "title": "string", "description": "string", "ticket_id": "string" }],
  "improvements": [{ "title": "string", "description": "string", "ticket_id": "string" }],
  "bug_fixes": [{ "title": "string", "description": "string", "ticket_id": "string" }],
  "security": [{ "title": "string", "description": "string", "ticket_id": "string" }],
  "full_text_markdown": "string — complete GFM release notes"
}
```

---

## 9. Estimated AI cost

10 tickets: ~2,000 tokens | gpt-4o-mini | ~$0.002/release.

---

## 10. Privacy and security

- Ticket titles and IDs are sent to your LLM.
- No customer data processed.
- Release notes require approval before publishing.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no notes published |
| Email fails | Retries 3 times |
| Approval timeout | Notes not published |

---

## 12. Customization examples

### Publish to Notion changelog

After "Publish Release Notes", add an HTTP Request to the Notion API creating a new page in your changelog database using `full_text_markdown`.

### Post to Slack release channel

After "Publish Release Notes", add a Slack node posting the `release_summary` and a link to the full notes.

### Trigger from GitHub Actions

In your CI/CD workflow, add a step that POSTs to the n8n webhook URL with the list of merged PRs mapped to the ticket schema.

---

## 13. How to test

1. Click **Manual Trigger** — 10 tickets loaded.
2. "Validate LLM Output" — `_error: false`, `full_text_markdown` present.
3. Receive approval email with preview.
4. Approve → notes published.
5. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM translation quality varies by ticket title quality.** Vague ticket titles produce vague notes.
- **No direct publishing to Notion, Confluence, or changelog tools** — email only in base version.
- **Security item descriptions are deliberately generic** — do not include CVE details in user-facing notes without legal review.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `webhook`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
