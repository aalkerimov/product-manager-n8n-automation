# Stakeholder Update Composer

> Draft weekly stakeholder updates from structured roadmap status data — approved before sending to leadership.

---

## 1. Overview

Takes structured product status data (shipped items, in-progress items, metrics, risks, decisions needed) and uses an LLM to draft a professional stakeholder update in the right tone for the audience (leadership, board, all-hands). Runs weekly on Friday mornings. Requires approval before sending.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 67

---

## 2. The problem

Weekly stakeholder updates take 30–60 minutes to write and are often written in a rush on Friday afternoon. The result is inconsistent tone, missing context, or over-padded updates that no one reads. A draft that takes 30 seconds to approve is a draft that actually gets sent.

---

## 3. How it works

```
Weekly Friday Schedule ─┐
                         ├─→ Prepare Prompt ─→ LLM: Draft Update ─→ Validate ─→ Send for Approval
Manual Trigger ──────────┘   (Load Sample Status)
                                                                                          │
                                                                                  Wait (48h)
                                                                                          │
                                                                                    Approved?
                                                                               ┌──────────┴──────┐
                                                                             Yes                No
                                                                               │                  │
                                                                   Send to Stakeholders    Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Draft stakeholder update |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  STAKEHOLDER_EMAIL_TO       = leadership@yourcompany.com
  STAKEHOLDER_APPROVER_EMAIL = pm@yourcompany.com (if different from stakeholders)
  STAKEHOLDER_SCHEDULE       = 0 9 * * 5   (Friday 09:00)
  AI_MODEL                   = gpt-4o-mini

Step 3: Automate status data collection (production)
  Replace "Load Sample Status Data" Code node with data pulled from:
  - Linear/Jira: completed tickets this week
  - Analytics: WAU, NPS
  - Sheets: manually curated risks and decisions

Step 4: Test with Manual Trigger
  - Sample with shipped items, in-progress with a blocker, metrics, risks
  - Approve → update sent to STAKEHOLDER_EMAIL_TO
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `STAKEHOLDER_EMAIL_TO` | Required | — | Stakeholder recipients |
| `STAKEHOLDER_APPROVER_EMAIL` | Optional | Same as `STAKEHOLDER_EMAIL_TO` | PM approver (if different) |
| `STAKEHOLDER_SCHEDULE` | Optional | `0 9 * * 5` | Friday 09:00 |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "period": "string",
  "audience": "leadership|board|all-hands",
  "shipped": [{ "item": "string", "ticket": "string", "impact": "string" }],
  "in_progress": [{ "item": "string", "eta": "YYYY-MM-DD", "status": "on-track|at-risk|blocked", "blocker": "string|null" }],
  "upcoming_next_sprint": ["string"],
  "metrics": { "wau": 4820, "wau_change_pct": 8, "nps": 42, "support_tickets": 38, "support_tickets_change_pct": -12 },
  "key_decisions_needed": ["string"],
  "risks": ["string"]
}
```

---

## 8. Output schema

```json
{ "subject": "string", "body_markdown": "string", "tl_dr": "string" }
```

---

## 9. Estimated AI cost

~2,000 tokens | gpt-4o-mini | ~$0.002/update | ~$0.008/month (weekly).

---

## 10. Privacy and security

- Internal roadmap status, metrics, and risks are sent to your LLM.
- Ensure appropriate data processing agreements.
- Update requires approval before stakeholders see it.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no update sent |
| Email fails | Retries 3 times |
| Approval timeout | Update not sent |

---

## 12. Customization examples

### Pull shipped tickets automatically from Linear

Replace the sample data Code node with an HTTP Request to the Linear API querying issues with `completedAt >= last week` in the current cycle. Map to the `shipped` array format.

### Different update formats per audience

Add an IF node before "Prepare Update Prompt" checking the `audience` field. Route leadership to a concise format, all-hands to a more detailed format, and board to a metrics-heavy format.

---

## 13. How to test

1. Click **Manual Trigger** — sample status data loaded.
2. "Validate LLM Output" — `_error: false`, `body_markdown` present.
3. Receive approval email with TL;DR and full draft.
4. Approve → update sent.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Status data must be populated manually** — no automated ticket/metrics pull in base version.
- **LLM tone varies** — temperature 0.4 for slight creative variance. Set to 0.1 for more consistent, drier output.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
