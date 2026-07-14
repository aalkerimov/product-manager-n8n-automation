# OKR Progress Tracker

> Weekly OKR pulse — deterministic scoring from numeric key result progress, with at-risk alerts — no LLM.

---

## 1. Overview

Reads OKR data (objectives, key results, targets, and current values) and computes progress percentages using deterministic math. Supports numeric, binary, and inverse KR types. Sends a weekly pulse report with overall portfolio progress and at-risk/off-track call-outs. No LLM required.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 69

---

## 2. The problem

OKR tracking is inconsistently done — some teams check quarterly, some never. The KR values are known (in Sheets or Notion) but nobody builds the aggregate view. This workflow runs every Monday and turns the data into a clear pulse in 30 seconds.

---

## 3. How it works

```
Weekly Monday Schedule ─┐
                         ├─→ Score OKRs (deterministic) ─→ Format Report ─→ Send OKR Pulse (email)
Manual Trigger ──────────┘   (Load Sample OKRs)
```

No LLM. Pure arithmetic on key result values.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Weekly pulse delivery |

No LLM. No external data source required for testing.

---

## 5. Five-minute setup

```
Step 1: Create credential
  - SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  OKR_EMAIL_TO   = leadership@yourcompany.com
  OKR_SCHEDULE   = 0 9 * * 1  (Monday 09:00)

Step 3: Update OKR data
  Edit the "Load Sample OKRs" Code node with your actual objectives and KRs.
  Each KR needs: id, title, type, target, current, unit

  KR types:
  - numeric: progress = current/target × 100
  - binary: done (100%) or not (0%)
  - numeric_inverse: lower is better (e.g. churn, bugs)
  - binary_inverse: 0 is the target (e.g. P0 incidents)

Step 4: For production, read KR values from Google Sheets
  Replace the Code node with a Sheets read node.
  Update current values weekly in the sheet.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `OKR_EMAIL_TO` | Required | — | Weekly pulse recipients |
| `OKR_SCHEDULE` | Optional | `0 9 * * 1` | Monday 09:00 |
| `NOTIFICATION_EMAIL_FROM` | Optional | `automation@acme-analytics.com` | Sender |

---

## 7. Input schema

```json
{
  "okrs": [{
    "id": "O1",
    "objective": "string",
    "quarter": "Q3 2026",
    "key_results": [{
      "id": "O1-KR1",
      "title": "string",
      "type": "numeric|binary|numeric_inverse|binary_inverse",
      "target": 220,
      "current": 64,
      "unit": "k USD"
    }]
  }],
  "quarter": "Q3 2026",
  "week": "week 2 of 13",
  "as_of": "YYYY-MM-DD"
}
```

---

## 8. Output schema

Per objective: `objective_progress_pct` (0–100), `objective_status` (on-track/at-risk/off-track).  
Per KR: `progress_pct`, `status`.  
Overall portfolio: `overall_pct`.

Status thresholds: on-track ≥ 70%, at-risk 40–69%, off-track < 40%.

---

## 9. Estimated AI cost

**$0.00** — no LLM used.

---

## 10. Privacy and security

- OKR targets and progress values are included in email.
- No customer data processed.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No OKRs | Report shows 0 objectives |
| KR target = 0 | Progress set to 100% (guard) |
| Email fails | Retries 3 times |

---

## 12. Customization examples

### Read KR values from Google Sheets

Replace the sample Code node with a Google Sheets read node. Format:
| id | objective_id | title | type | target | current | unit |

### Alert on off-track KRs only

Add an IF node after "Score OKRs" checking if `scored.some(o => o.objective_status === 'off-track')`. Only send the email if there are off-track items.

### Historical sparkline in Sheets

After "Score OKRs", write the `overall_pct` and per-KR `progress_pct` values to a history tab in Sheets with the `as_of` date. Use Sheets charts for a visual progress timeline.

---

## 13. How to test

1. Click **Manual Trigger** — 3 objectives, 10 KRs loaded.
2. "Score OKRs" — `objective_status`, `progress_pct` per KR.
3. Check email: OKR pulse with emoji-coded status.
4. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **KR values must be manually updated** — no automatic data pull in base version.
- **Status thresholds are fixed** (on-track ≥ 70%) — adjustable in "Score OKRs" Code node.
- **No historical trending** — each run is independent without additional logging.

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
