# Uptime & SLA Reporter

> Compute weekly SLA compliance per service, flag breaches, and surface incident history — reviewed before distribution to product and engineering.

---

## 1. Overview

Runs every Monday. Takes uptime measurements per service (uptime minutes, total minutes, SLA target, incidents) and deterministically computes uptime %, SLA gap, breach status, and total downtime. Groups incidents by service. Flags breaches in the approval email subject. Requires approval before distribution.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 89

> **No LLM.** All SLA calculation is deterministic arithmetic.

---

## 2. The problem

Without a weekly SLA summary, teams only see incidents in the moment. Cumulative SLA tracking — which service missed its target, by how much, for how long — is rarely visible to PMs until it becomes a customer contract issue.

---

## 3. How it works

```
Schedule (Mon 9am) ─┐
                     ├─→ Load Uptime ─→ Compute SLA ─→ Format ─→ Approval ─→ Distribute
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
  UPTIME_EMAIL_TO       = engineering@yourcompany.com
  UPTIME_APPROVER_EMAIL = pm@yourcompany.com (if different)

Step 3: Update service data
  Edit "Load Uptime Data": add your actual services with uptime_minutes,
  total_minutes, sla_target_pct (e.g., 99.9 for three-nines), and incident list.

Step 4: Connect monitoring system
  Add HTTP Request node before "Load Uptime Data" to call:
  - Datadog: GET /api/v1/slo/history
  - PagerDuty: GET /schedules or /incidents
  - StatusPage.io: GET /metrics
  Map to the services schema.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `UPTIME_EMAIL_TO` | Required | — | Engineering and PM recipients |
| `UPTIME_APPROVER_EMAIL` | Optional | Same as above | PM approver |

---

## 7. Input schema

```json
{
  "services": [{ "name": "string", "sla_target_pct": 99.9, "uptime_minutes": 10069, "total_minutes": 10080, "incidents": [{ "id": "string", "duration_minutes": 47, "severity": "P0", "description": "string" }] }],
  "period": { "start": "2026-07-07", "end": "2026-07-13" }
}
```

---

## 8. Output schema

```json
{
  "results": [{ "name": "string", "uptime_pct": 99.5337, "sla_target_pct": 99.9, "sla_met": false, "sla_gap": -0.3663, "downtime_minutes": 47, "incident_count": 1 }],
  "meta": { "service_count": 4, "sla_breaches": 2, "total_incidents": 3 }
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- No PII. Uptime data is operational metrics.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No incidents | Clean report shows all services met SLA |
| Email fails | Retries 3 times |
| Approval timeout | Report not distributed |

---

## 12. Customization examples

### Datadog SLO integration

Add HTTP Request to `GET https://api.datadoghq.com/api/v1/slo/history?from_ts=...&to_ts=...`. Map `data.overall.uptime` to `uptime_pct`. Compare with `sla_target_pct` to generate breaches.

### Monthly SLA rollup

Add a Google Sheets HTTP Request after distribution to append weekly data. Build a monthly chart to track SLA trend and predict annual uptime from weekly data.

---

## 13. How to test

1. Click **Manual Trigger** — 4 services loaded (Web App, API with P0 incident, Webhook, Data Export).
2. "Compute SLA Compliance" — Web App and API breach 99.9%/99.95% targets, others pass.
3. Approve → report distributed with breach count in subject.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No LLM (by design)** — calculation is deterministic.
- **Uptime data is static sample** — replace with Datadog/PagerDuty HTTP Request for production.
- **No monthly rollup or trend tracking** — add Google Sheets persistence.
- **SLA calculation is availability-based** — does not account for latency SLAs (p95 response time).

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
