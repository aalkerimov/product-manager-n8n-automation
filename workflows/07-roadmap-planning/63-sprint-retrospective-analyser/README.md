# Sprint Retrospective Analyser

> Turn raw went-well / to-improve / action retro items into a themed, prioritised sprint report — reviewed before it goes to the team.

---

## 1. Overview

Takes retrospective items (from a retro board tool webhook or manual input), groups them into themes using an LLM, identifies root causes for improvement areas, prioritises the next-sprint action list, and signals overall team health. Requires approval before the team sees the results.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 63

---

## 2. The problem

Raw retro output is a wall of sticky notes. Most PMs read them once, pick 2 actions, and forget the rest. Recurring themes go unnoticed. The team keeps fixing the same problems. This workflow extracts patterns and produces a structured, prioritised output every sprint.

---

## 3. How it works

```
Manual Trigger (sample) ─┐
                          ├─→ Prepare Prompt ─→ LLM: Analyse Retro ─→ Validate ─→ Format Report
Webhook: Post-Sprint ─────┘
                                                                                         │
                                                                            Send for Approval
                                                                                         │
                                                                               Wait (48h)
                                                                                         │
                                                                                   Approved?
                                                                             ┌─────────┴──────┐
                                                                           Yes                No
                                                                             │                  │
                                                                   Send to Team          Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Theme extraction and prioritisation |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  RETRO_EMAIL_TO = team@yourcompany.com
  AI_MODEL       = gpt-4o-mini

Step 3: Connect your retro tool (production)
  Post items to: POST /webhook/retro-analyse
  Body: { "items": [...], "sprint": "Sprint 23", "team": "Product Engineering" }
  
  Or use tools like Parabol, RetroTool, EasyRetro — most support webhooks on session close.

Step 4: Test with Manual Trigger
  - 14 sample items (5 went-well, 5 to-improve, 4 actions)
  - Approve → report sent to RETRO_EMAIL_TO
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `RETRO_EMAIL_TO` | Required | — | Team recipient |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "sprint": "Sprint 23",
  "team": "Product Engineering",
  "items": [
    { "id": "string", "category": "went_well|to_improve|action", "text": "string" }
  ]
}
```

---

## 8. Output schema

```json
{
  "went_well_themes": [{ "theme": "string", "items_count": 2, "key_insight": "string" }],
  "improvement_themes": [{ "theme": "string", "items_count": 2, "root_cause": "string", "recurring": true }],
  "prioritised_actions": [{ "action": "string", "owner": "string", "by_when": "next sprint|this week|ongoing", "addresses_theme": "string" }],
  "team_health_signal": "improving|stable|declining",
  "team_health_rationale": "string",
  "patterns_to_watch": ["string"]
}
```

---

## 9. Estimated AI cost

14 items: ~2,000 tokens | gpt-4o-mini | ~$0.002/sprint.

---

## 10. Privacy and security

- Retro item text (internal team observations) is sent to your LLM provider.
- Ensure your LLM provider has appropriate data processing agreements.
- Report requires approval before team sees it.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Empty items | LLM prompt has no items; produces minimal output |
| LLM invalid JSON | Error handler; no report sent |
| Email fails | Retries 3 times |
| Approval timeout | Report not sent |

---

## 12. Customization examples

### Track recurring themes across sprints

After "Validate LLM Output", add a Google Sheets write node logging `improvement_themes` with the sprint name. Over time, filter for themes marked `recurring: true` across multiple sprints.

### Auto-create Jira tickets for prioritised actions

After "Send to Team", add HTTP Request nodes to the Jira API creating tickets for each item in `prioritised_actions`.

---

## 13. How to test

1. Click **Manual Trigger** — 14 items loaded.
2. "Validate LLM Output" — `_error: false`, themes and actions populated.
3. Receive approval email → approve.
4. Retro summary sent to RETRO_EMAIL_TO.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM theme grouping is probabilistic** — may vary between runs. Temperature set to 0.3 for consistency.
- **Recurring flag relies on LLM judgment**, not cross-sprint data comparison.
- **No integration with retro tools out of the box** — requires webhook setup.

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
