# Founder Weekly Review

> Turn your Friday retrospective data (wins, struggles, decisions, metrics) into structured reflection, pattern insight, and a sharp intention for next week.

---

## 1. Overview

Runs every Friday at 5pm. Takes this week's wins, struggles, big decisions, and key metric changes. LLM produces: a week headline, key pattern observed, the single highest-leverage change for next week, metric commentary, decision quality feedback, energy assessment, a single next-week intention, and a coaching question to reflect on over the weekend. Sent directly to you — no approval gate.

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 99

---

## 2. The problem

Most founders end the week by starting the next one. The habit of structured reflection — not just noting what happened, but extracting the pattern and setting a clear intention — is the difference between founders who improve and those who repeat the same mistakes quarterly.

---

## 3. How it works

```
Schedule (Fri 5pm) ─┐
                     ├─→ Load Review Data ─→ Prepare Prompt ─→ LLM: Reflection ─→ Validate ─→ Format ─→ Send to Founder
Manual Trigger ──────┘
```

> No approval gate — personal founder insight.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Reflection, pattern analysis, coaching question |
| SMTP Email | Basic | Yes | Weekly review delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  WEEKLY_REVIEW_EMAIL_TO = founder@yourcompany.com (yourself)
  AI_MODEL               = gpt-4o-mini

Step 3: Fill in weekly data
  Edit "Load Weekly Review Data" each Friday (or before the schedule fires):
  - wins: list of 2-4 wins
  - struggles: honest list of what didn't work
  - big_decisions: key decisions with confidence and reversibility
  - key_metrics_vs_last_week: compare current vs. previous for 3-5 metrics
  - energy_level: low|medium|high
  - focus_rating: 1-5
  - what_i_would_do_differently: one sentence
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `WEEKLY_REVIEW_EMAIL_TO` | Required | — | Your email |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "week": "string",
  "wins": ["string"],
  "struggles": ["string"],
  "big_decisions": [{ "decision": "string", "confidence": "high|medium|low", "reversible": true }],
  "key_metrics_vs_last_week": [{ "metric": "string", "current": 38400, "previous": 37200, "unit": "string" }],
  "energy_level": "medium",
  "focus_rating": 3,
  "what_i_would_do_differently": "string"
}
```

---

## 8. Output schema

```json
{
  "week_headline": "string",
  "key_pattern": "string",
  "leverage_point": "string",
  "metric_commentary": "string",
  "decision_quality_note": "string",
  "energy_note": "string",
  "next_week_intention": "string",
  "question_to_sit_with": "string"
}
```

---

## 9. Estimated AI cost

~1,200 tokens | gpt-4o-mini | ~$0.002/week. ~$0.10/month.

---

## 10. Privacy and security

- Business metrics, team observations, and personal energy level sent to LLM — keep external LLM use in mind for board-sensitive data.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; review not sent |
| Email fails | Retries 3 times |

---

## 12. Customization examples

### Auto-pull metrics

Add HTTP Request nodes to pull metrics from your analytics platform (Stripe for MRR, Typeform for NPS, Zendesk for support tickets). Compute week-over-week changes and feed into the review data schema automatically.

### Archive to Notion

After "Format Weekly Review", add HTTP Request to Notion's pages API to create a new page in a "Weekly Reviews" database. Useful for trend analysis across months.

---

## 13. How to test

1. Click **Manual Trigger** — week of July 7–11, 3 wins, 3 struggles, 4 metrics.
2. "Validate LLM Output" — week_headline, key_pattern, coaching question present.
3. You receive the review with leverage point and coaching question.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Review data requires manual entry** — add metric API calls for automation.
- **LLM does not have access to previous weeks** — add Notion/Google Sheets persistence for longitudinal pattern analysis.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
