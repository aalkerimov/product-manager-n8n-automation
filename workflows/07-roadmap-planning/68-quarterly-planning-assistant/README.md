# Quarterly Planning Assistant

> Turn last-quarter actuals and proposed themes into a structured planning brief with recommended bets, OKRs, capacity allocation, and risk register — approved before sharing with leadership.

---

## 1. Overview

Takes last-quarter results, proposed Q themes, team constraints, and strategic context as input. Uses an LLM (gpt-4o for this complex task) to produce a structured planning brief with recommended bets, tradeoffs, capacity allocation, OKR suggestions, and a risk register. Requires approval before sharing with leadership.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 68

---

## 2. The problem

Quarterly planning is high-stakes and time-consuming. Teams spend days in Notion docs and slide decks before leadership alignment. This workflow produces the first structured draft — grounded in last-quarter data — in minutes. It is a starting point, not a replacement for team discussion.

---

## 3. How it works

```
Manual Trigger ─→ Load Sample Context ─→ Prepare Prompt ─→ LLM: Generate Brief ─→ Validate ─→ Format
                                                                                                    │
                                                                                      Send for Approval
                                                                                                    │
                                                                                            Wait (72h)
                                                                                                    │
                                                                                              Approved?
                                                                                        ┌─────────┴──────┐
                                                                                      Yes              No
                                                                                        │                │
                                                                              Share with Leadership  Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Planning brief generation (recommend gpt-4o for this task) |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  PLANNING_APPROVER_EMAIL = cpo@yourcompany.com
  PLANNING_EMAIL_TO       = leadership@yourcompany.com
  AI_MODEL                = gpt-4o  (recommended for this complex task)

Step 3: At quarter start
  Edit "Load Sample Planning Context" Code node with your actual:
  - Last quarter shipped/missed items and learnings
  - Proposed themes and initiatives
  - Team constraints and hard deadlines
  - Strategic context

Step 4: Click Manual Trigger → review → approve → share
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PLANNING_APPROVER_EMAIL` | Required | — | CPO / Head of Product approver |
| `PLANNING_EMAIL_TO` | Required | — | Leadership recipients |
| `AI_MODEL` | Required | `gpt-4o` | Recommend gpt-4o for this task |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "quarter": "Q3 2026",
  "last_quarter_summary": { "shipped": ["string"], "missed": ["string"], "key_learnings": ["string"], "metrics": { "arr_end_of_quarter": 1200000, "net_new_arr": 180000, "churn_pct": 2.1, "nps": 42 } },
  "proposed_themes_q3": [{ "theme": "string", "initiatives": ["string"], "rationale": "string" }],
  "constraints": { "headcount": "string", "budget_restriction": "string", "hard_deadlines": ["string"] },
  "strategic_context": "string"
}
```

---

## 8. Output schema

```json
{
  "planning_brief_title": "string",
  "recommended_bets": [{ "theme": "string", "recommended_initiatives": ["string"], "rationale": "string", "estimated_capacity_pct": 40, "confidence": "high|medium|low" }],
  "tradeoffs": ["string"],
  "must_do_this_quarter": ["string"],
  "suggested_deferral": ["string"],
  "capacity_allocation": { "description": "string", "breakdown": [{ "area": "string", "pct": 40 }] },
  "key_risks": [{ "risk": "string", "mitigation": "string", "severity": "high|medium|low" }],
  "recommended_okrs": [{ "objective": "string", "key_results": ["string"] }]
}
```

---

## 9. Estimated AI cost

~4,000 tokens | gpt-4o | ~$0.06/quarter. Use gpt-4o-mini to reduce cost: ~$0.005.

---

## 10. Privacy and security

- Strategic context, ARR, and internal plans are sent to your LLM.
- Ensure appropriate data processing agreements.
- Brief requires approval before leadership sees it.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no brief sent |
| Email fails | Retries 3 times |
| Approval timeout (72h) | Brief not sent |

---

## 12. Customization examples

### Use gpt-4o for higher-quality planning

The workflow defaults to `gpt-4o` for this task (set via `AI_MODEL`). For a cost/quality tradeoff, use `gpt-4o-mini` and add an iteration step where you feed the mini output back into the model for refinement.

### Connect to your data warehouse

Replace the sample data Code node with API calls to: Linear (shipped tickets), Stripe (ARR metrics), and Notion (planning docs). This gives you grounded, up-to-date inputs.

---

## 13. How to test

1. Click **Manual Trigger** — sample Q3 2026 planning context loaded.
2. "Validate LLM Output" — `_error: false`, `recommended_bets` populated.
3. CPO receives approval email with full brief.
4. Approve → shared with leadership.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM planning advice is a starting point** — not a replacement for team discussion and leadership alignment.
- **Capacity allocation is a rough estimate** — LLM cannot account for individual engineer skills or vacation schedules.
- **gpt-4o-mini may produce lower-quality planning recommendations** for complex strategic contexts.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
