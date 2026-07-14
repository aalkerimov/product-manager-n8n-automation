# Bug Triage Assistant

> Classify incoming bug reports by severity (P0–P3), identify engineering area, suggest reproduction steps, and flag regressions — reviewed before sending to engineering.

---

## 1. Overview

Takes raw bug reports and uses an LLM (temperature 0.1 for consistency) to produce structured triage: severity with rationale, engineering area, likely cause hypothesis, reproduction steps, difficulty, suggested owner, and workaround. P0 count is surfaced in the email subject for instant visibility.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 81

---

## 2. The problem

Bug reports arrive as freeform text from support tickets, Slack, or user submissions. Without structured triage, engineers waste time re-reading reports to determine priority and ownership. P0s get missed in the noise. This workflow produces a ready-to-act triage report in seconds.

---

## 3. How it works

```
Manual Trigger (sample) ─┐
                          ├─→ Prepare Prompt ─→ LLM: Triage ─→ Validate ─→ Format ─→ Approval ─→ Send to Engineering
Webhook: Bug Report ──────┘
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Severity classification and triage |
| SMTP Email | Basic | Yes | Approval and engineering notification |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  BUG_TRIAGE_EMAIL_TO       = engineering@yourcompany.com
  BUG_TRIAGE_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL                  = gpt-4o-mini

Step 3: Feed bug reports
  Option A: Edit "Load Sample Bug Reports" with your bugs.
  Option B: POST to /webhook/triage-bug with bugs array and product context.
  
  Linear/GitHub integration: Trigger on issue creation, map fields to bug schema, POST to webhook.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `BUG_TRIAGE_EMAIL_TO` | Required | — | Engineering team recipients |
| `BUG_TRIAGE_APPROVER_EMAIL` | Optional | Same as above | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "bugs": [{ "id": "BUG-2041", "title": "string", "reporter": "string", "description": "string", "environment": "production|staging", "affected_users": 12, "steps_to_reproduce": "string" }],
  "product": "string",
  "engineering_team_context": "string"
}
```

---

## 8. Output schema

```json
{
  "triaged_bugs": [{ "id": "string", "severity": "P0|P1|P2|P3", "severity_rationale": "string", "engineering_area": "string", "likely_cause": "string", "reproduction_steps": ["string"], "reproduction_difficulty": "easy|medium|hard", "suggested_owner": "string", "workaround": "string|null", "regression": true }],
  "triage_summary": "string"
}
```

---

## 9. Estimated AI cost

3 bugs: ~2,000 tokens | gpt-4o-mini | ~$0.003/run.

---

## 10. Privacy and security

- Bug descriptions may contain user email addresses or PII — review before sending to LLM.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no triage sent |
| Email fails | Retries 3 times |
| Approval timeout | Triage not sent |

---

## 12. Customization examples

### Linear webhook integration

In Linear, add a webhook for `IssueCreated`. Map `issue.title`, `issue.description`, `issue.identifier` to the bug schema and POST to `/webhook/triage-bug`. The triage result can be POSTed back to Linear's API to set priority and assignee.

### Auto-write triage back to GitHub Issues

After "Approved?", add an HTTP Request to the GitHub API to add a triage comment to the issue and set the appropriate label (P0/P1/P2/P3).

---

## 13. How to test

1. Click **Manual Trigger** — 3 bugs loaded (dashboard 504, mobile assignee reset, CSV export).
2. "Validate LLM Output" — `_error: false`, `triaged_bugs` present.
3. Approval email shows bugs sorted by severity with P0 count in subject.
4. Approve → engineering receives triage.

---

## 14. Known limitations

- **Not runtime-tested.**
- **P0 determination is LLM judgment** — verify against your own severity SLA definition.
- **Regression flag is LLM judgment** — requires description to mention a version or "before this release".
- **No auto-write back to issue tracker** — add HTTP Request nodes for Linear/GitHub/Jira.

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
