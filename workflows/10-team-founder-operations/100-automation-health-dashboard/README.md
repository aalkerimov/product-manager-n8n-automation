# Automation Health Dashboard

> Get a weekly report on your entire n8n automation stack: pass rates, time saved, failing workflows, and highest-value automations — sent every Monday.

---

## 1. Overview

Runs every Monday at 6am (the first thing in your inbox). Takes execution stats for all active workflows from the past week. Computes: total executions, pass rate, minutes saved, failing workflows ranked by error rate, most active workflows, and highest-value workflows by time saved. No LLM — pure deterministic arithmetic.

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 100

> **No LLM.** All health computation is deterministic arithmetic.

---

## 2. The problem

Most founders build automations and never know if they're working. A broken workflow silently fails for weeks. This dashboard is the closed loop — once a week, you see what's running, what's failing, and what it's saving you.

---

## 3. How it works

```
Schedule (Mon 6am) ─┐
                     ├─→ Load Stats ─→ Compute Health ─→ Format Dashboard ─→ Send to Founder
Manual Trigger ──────┘
```

> No approval gate — operational insight to yourself.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Dashboard delivery |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  AUTOMATION_HEALTH_EMAIL_TO = founder@yourcompany.com

Step 3: Connect to n8n API (optional)
  For real-time stats, replace "Load Workflow Stats" with HTTP Request:
  GET http://your-n8n-host/api/v1/executions
  Authorization: Bearer YOUR_N8N_API_KEY
  Parameters: status=all&limit=500&startedAfter=<7 days ago ISO>
  Group by workflowId, count successes vs. errors.

Step 4: Update manual_minutes_saved_per_run
  For each workflow, estimate how long the task would take manually.
  The weekly time savings calculation multiplies this by execution count.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `AUTOMATION_HEALTH_EMAIL_TO` | Required | — | Your email |

---

## 7. Input schema

```json
{
  "workflows": [{ "name": "string", "collection": "string", "executions": 47, "errors": 0, "avg_duration_s": 12, "manual_minutes_saved_per_run": 5 }],
  "week": "string"
}
```

---

## 8. Output schema

```json
{
  "metrics": { "total_workflows": 9, "total_executions": 111, "total_errors": 6, "pass_rate": 94.6, "total_minutes_saved": 1235, "total_hours_saved": 20.6 },
  "failing": [{ "name": "string", "errors": 3, "executions": 23 }],
  "most_active": [{ "name": "string", "executions": 47 }],
  "highest_savings": [{ "name": "string" }]
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- Workflow names and execution counts only. No execution data or payload content.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Email fails | Retries 3 times |
| No executions this week | Report shows zeros |

---

## 12. Customization examples

### n8n API integration

Replace "Load Workflow Stats" with HTTP Request to n8n's executions API. Parse the JSON response: group by `workflowId`, count total vs. `status=error`. Map to the workflows schema.

### Trend over time

Append each week's `pass_rate` and `total_hours_saved` to a Google Sheet. After 4 weeks, add a Visualize step to chart automation adoption growth.

---

## 13. How to test

1. Click **Manual Trigger** — 9 workflows, week of July 7–11.
2. "Compute Health" — 111 total runs, 6 errors, 94.6% pass rate, ~20h saved.
3. Dashboard email with failing workflows (Bug Triage 3 errors, LLM Regression 2, Competitor Radar 1).

---

## 14. Known limitations

- **Not runtime-tested.**
- **No LLM (by design)** — all computation is deterministic arithmetic.
- **Execution data is static sample** — replace with n8n API HTTP Request for production.
- **No historical trend** — add Google Sheets append step for week-over-week comparison.
- **`manual_minutes_saved_per_run` is manually estimated** — refine over time based on actual savings.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `emailSend`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
