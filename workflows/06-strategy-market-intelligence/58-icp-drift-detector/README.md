# ICP Drift Detector

> Compare your actual customer base distribution to your stated ICP every month and flag where reality has drifted from intention.

---

## 1. Overview

Reads your customer data from Google Sheets, computes segment, industry, region, and employee-size distributions for active and churned customers, and delivers a monthly report. No LLM required — this is statistical analysis. The report shows you whether you are still selling to who you say you are selling to.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 58

---

## 2. The problem

You define your ICP once and then let sales close whoever they can. Six months later your enterprise churn rate is high because half your enterprise deals were not real ICP. The ICP document is stale. This workflow makes the gap visible every month.

---

## 3. How it works

```
Monthly Schedule ─┐
                   ├─→ Analyse Distribution vs ICP ─→ Send ICP Report (email)
Manual Trigger ────┘   (Read Sheets OR Load Sample)
```

No LLM. Pure distribution analysis with flagging logic.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| Google Sheets OAuth2 | Basic | Yes (scheduled) | Read customer data |
| SMTP Email | Basic | Yes | Monthly report delivery |

No LLM required.

---

## 5. Five-minute setup

```
Step 1: Prepare Google Sheet
  - Sheet name: "customers"
  - Required columns: id, company, segment, employees, industry, region, arr, status, months_retained
  - status values: active | churned

Step 2: Create credentials
  a. Google Sheets OAuth2 named "YOUR_GOOGLE_SHEETS_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 3: Set environment variables
  ICP_SHEET_ID    = your_sheet_id
  ICP_DEFINITION  = B2B SaaS, 50-500 employees, software/technology, US or EU, mid-market or SMB
  ICP_EMAIL_TO    = strategy@yourcompany.com
  ICP_SCHEDULE    = 0 9 1 * *   (1st of month at 09:00)

Step 4: Test with Manual Trigger
  - 12 sample customers (11 valid, 1 edge-case missing required fields)
  - Distribution report delivered to ICP_EMAIL_TO
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `ICP_SHEET_ID` | Required | — | Google Sheet ID |
| `ICP_DEFINITION` | Required | `B2B SaaS, 50-500 employees…` | Your stated ICP (used in report header) |
| `ICP_EMAIL_TO` | Required | — | Report recipient |
| `ICP_SCHEDULE` | Optional | `0 9 1 * *` | Monthly cron |

---

## 7. Input schema

Google Sheet columns:

| Column | Required | Values |
|---|---|---|
| `id` | Yes | string — unique |
| `company` | No | string |
| `segment` | Yes | enterprise, mid-market, smb, startup |
| `employees` | No | integer |
| `industry` | No | string |
| `region` | No | US, EU, UK, etc |
| `arr` | No | number (USD) |
| `status` | Yes | active, churned |
| `months_retained` | No | integer |

---

## 8. Output schema

Plain-text report containing:
- Segment, industry, and region distribution (% of total, absolute counts)
- Average employee count for active vs churned customers
- Top actual segment/industry/region vs stated ICP flag
- Skipped record count

---

## 9. Estimated AI cost

**$0.00** — no LLM used.

---

## 10. Privacy and security

- Customer company names, segments, and ARR are sent in the email report.
- Ensure the email recipient list is appropriate for this level of commercial data.
- No data is written back to the sheet.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Sheet read fails | n8n shows error in Executions; no report sent |
| All records invalid | `valid.length === 0`; distribution report shows zeros |
| Email fails | n8n retries 3 times |

---

## 12. Customization examples

### Add LLM interpretation

After "Analyse Distribution vs ICP", add an HTTP Request to an LLM with the stats and ICP definition. Ask it to explain what the drift means strategically and what to do about it.

### Flag specific drift threshold

In the Code node, add logic to set `drift_detected: true` if the top actual segment differs from the ICP target segment. Then add an IF node to change the email subject line to "DRIFT DETECTED: ICP Report".

### Track month-over-month

After sending the report, add a Google Sheets write node to log the distribution stats with the current date. Run the next month's analysis against last month's snapshot.

---

## 13. How to test

1. Click **Manual Trigger** — 12 sample customers loaded.
2. Inspect "Analyse Distribution vs ICP" — `stats` field shows full distribution.
3. Report email received with distribution breakdown.
4. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Distribution only — no automated drift scoring.** Comparing to ICP requires human judgment (see section 12 for adding LLM interpretation).
- **No approval gate.** This is an informational report. Add a Wait node if you want review before distribution.
- **No month-over-month comparison.** Requires snapshot storage (see customization).

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `googleSheets`, `code`, `emailSend`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
