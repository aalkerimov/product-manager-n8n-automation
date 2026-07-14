# AI Cost Monitor

> Track weekly AI spending per workflow and model, flag budget overruns, and distribute a cost report — reviewed before distribution.

---

## 1. Overview

Runs every Monday. Takes AI usage data (token counts per workflow per model) and computes weekly cost using current pricing. Flags workflows over individual budget and alerts if total exceeds the threshold percentage. Sorts by cost descending and breaks down by model. Requires approval before distribution.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 87

> **No LLM.** All cost calculation is deterministic.

---

## 2. The problem

AI API costs accumulate silently across many workflows. Without visibility, a single high-token workflow can consume the entire monthly budget without anyone noticing until the invoice arrives.

---

## 3. How it works

```
Schedule (Mon 9am) ─┐
                     ├─→ Load Usage ─→ Compute Costs ─→ Format ─→ Approval ─→ Distribute
Manual Trigger ──────┘
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Approval and distribution |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  AI_COST_EMAIL_TO       = engineering@yourcompany.com
  AI_COST_APPROVER_EMAIL = pm@yourcompany.com (if different)

Step 3: Update usage data
  Edit "Load AI Usage Data" weekly with real token counts.
  
  For automation: call the OpenAI usage API:
  GET https://api.openai.com/v1/usage?date=YYYY-MM-DD
  Or use your n8n execution logs to sum token usage per workflow.

Step 4: Set budget limits
  Update budget_config: weekly_budget_usd, alert_threshold_pct, per_workflow_budget_usd.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `AI_COST_EMAIL_TO` | Required | — | Engineering and PM recipients |
| `AI_COST_APPROVER_EMAIL` | Optional | Same as above | PM approver |

---

## 7. Input schema

```json
{
  "usage_data": [{ "workflow": "string", "model": "gpt-4o-mini", "input_tokens": 45200, "output_tokens": 12800, "calls": 34 }],
  "budget_config": { "weekly_budget_usd": 25.00, "alert_threshold_pct": 80, "per_workflow_budget_usd": 10.00 }
}
```

---

## 8. Output schema

```json
{
  "per_workflow": [{ "workflow": "string", "model": "string", "cost_usd": 0.0146, "calls": 34, "over_budget": false }],
  "model_totals": { "gpt-4o-mini": 0.021, "gpt-4o": 0.52 },
  "total_cost": 0.54,
  "budget_pct": 78.5,
  "alert": false
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- No sensitive data. Usage data is internal operational data.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No usage data | Empty report; still sent for visibility |
| Email fails | Retries 3 times |
| Approval timeout | Report not distributed |

---

## 12. Customization examples

### Real OpenAI usage pull

Add HTTP Request nodes after "Load AI Usage Data" to call `GET https://api.openai.com/v1/usage` for each day of the past week. Aggregate by model and map to the usage_data schema.

### Budget hard stop

Add a condition before "Send for Approval": if `total_cost > weekly_budget_usd`, skip approval and immediately send an urgent alert to engineering and finance.

---

## 13. How to test

1. Click **Manual Trigger** — 4 workflows loaded with 1-week usage.
2. "Compute AI Costs" — total cost, per-workflow costs, model breakdown.
3. Approve → team receives cost report with budget burn rate.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Usage data is static sample** — replace with real OpenAI API call or n8n log aggregation.
- **Pricing is hardcoded** — update the pricing map when OpenAI changes rates.
- **No monthly rollup** — add Airtable/Google Sheets persistence to track trends week-over-week.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
