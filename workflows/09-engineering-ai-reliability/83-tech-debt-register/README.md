# Tech Debt Register

> Score and prioritise tech debt items by blast radius, velocity impact, and risk trajectory — reviewed before sharing the prioritised register with the team.

---

## 1. Overview

Takes a list of engineering-reported tech debt items and uses an LLM to score each by blast radius (how many users/systems fail if this breaks), velocity tax (how much it slows feature development), and risk trajectory (getting worse or stable). Produces a sprint paydown recommendation given available capacity. Requires approval before distribution.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 83

---

## 2. The problem

Tech debt lists grow without prioritisation. Engineers know which items are risky but PMs lack the context to make trade-offs during sprint planning. This workflow provides a structured, scored view that engineers and PMs can both reason from.

---

## 3. How it works

```
Manual Trigger ─→ Load Sample Debt ─→ Prepare Prompt ─→ LLM: Score ─→ Validate ─→ Format ─→ Approval ─→ Share
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Debt scoring and prioritisation |
| SMTP Email | Basic | Yes | Approval and team distribution |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  TECH_DEBT_EMAIL_TO       = engineering@yourcompany.com
  TECH_DEBT_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL                 = gpt-4o-mini

Step 3: Feed tech debt items
  Edit "Load Sample Tech Debt" Code node.
  Set sprint_capacity_available in story points for the upcoming sprint.
  Add your actual debt items with: id, title, area, description, age_months, workaround, risk.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `TECH_DEBT_EMAIL_TO` | Required | — | Engineering and PM recipients |
| `TECH_DEBT_APPROVER_EMAIL` | Optional | Same as above | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "items": [{ "id": "TD-001", "title": "string", "area": "string", "description": "string", "age_months": 14, "reported_by": "string", "workaround": "string", "risk": "string" }],
  "product": "string",
  "sprint_capacity_available": 8
}
```

---

## 8. Output schema

```json
{
  "scored_items": [{ "id": "string", "blast_radius": "high|medium|low", "velocity_tax": "high|medium|low", "risk_trajectory": "increasing|stable|decreasing", "priority_rank": 1, "estimated_effort_points": 5, "recommended_action": "pay-now|schedule-next-quarter|monitor|accept", "rationale": "string" }],
  "paydown_recommendation": "string",
  "total_estimated_effort": 13
}
```

---

## 9. Estimated AI cost

4 items: ~2,000 tokens | gpt-4o-mini | ~$0.003/run.

---

## 10. Privacy and security

- Tech debt descriptions may reference internal architecture details. Review before sending to external LLM if architecture is sensitive.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; register not sent |
| Email fails | Retries 3 times |
| Approval timeout | Register not shared |

---

## 12. Customization examples

### Quarterly debt review

Run on a quarterly schedule via Cron Trigger. Pull the current debt backlog from Linear or Jira via HTTP Request, feed to the scorer, and produce a prioritised register for quarterly planning.

### Linear integration

After "Approved?", add HTTP Request nodes to update each Linear issue's priority and add a triage comment with the rationale.

---

## 13. How to test

1. Click **Manual Trigger** — 4 debt items loaded.
2. "Validate LLM Output" — `_error: false`, `scored_items` present.
3. Approve → team receives prioritised register with sprint recommendation.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Story point estimates are LLM guesses** — use as starting points, not commitments.
- **Scoring is relative to the items in the list** — add all significant debt items to get accurate relative ranking.
- **Blast radius requires runtime context** — LLM cannot know actual user distribution across endpoints.

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
