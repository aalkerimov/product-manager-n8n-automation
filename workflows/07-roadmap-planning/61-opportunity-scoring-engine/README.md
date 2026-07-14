# Opportunity Scoring Engine

> Score and rank product opportunities using RICE (Reach × Impact × Confidence / Effort) with a strategic fit modifier. No LLM — deterministic math from your inputs.

---

## 1. Overview

Reads a list of product opportunities from Google Sheets (or the embedded sample), computes RICE scores, sorts them, and delivers a ranked report monthly. All scoring inputs are on a 0–10 scale. No LLM is used — this is intentionally a math operation, not an inference.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 61

---

## 2. The problem

Most teams score opportunities informally ("I think this is high value") or not at all ("the loudest stakeholder wins"). RICE scoring forces explicit estimates and makes tradeoffs visible. This workflow automates the monthly recalculation and ranking so the list stays current.

---

## 3. How it works

```
Monthly Schedule ─┐
                   ├─→ Compute RICE Scores ─→ Send Scoring Report (email)
Manual Trigger ────┘   (Read Sheets OR Load Sample)
```

No LLM. Pure computation.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| Google Sheets OAuth2 | Basic | Yes (scheduled) | Read opportunity list |
| SMTP Email | Basic | Yes | Monthly report delivery |

No LLM required.

---

## 5. Five-minute setup

```
Step 1: Prepare Google Sheet
  Sheet name: "opportunities"
  Required columns: id, title, reach, impact, confidence, effort
  Optional columns: strategic_fit, category, tags
  All scoring columns: integers 0–10

Step 2: Create credentials
  a. Google Sheets OAuth2 named "YOUR_GOOGLE_SHEETS_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 3: Set environment variables
  OPP_SHEET_ID   = your_sheet_id
  OPP_EMAIL_TO   = product@yourcompany.com
  OPP_SCHEDULE   = 0 9 1 * *   (1st of month at 09:00)

Step 4: Test with Manual Trigger
  - 10 embedded sample opportunities scored and ranked
  - Report delivered to OPP_EMAIL_TO
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPP_SHEET_ID` | Required | — | Google Sheet ID |
| `OPP_EMAIL_TO` | Required | — | Report recipient |
| `OPP_SCHEDULE` | Optional | `0 9 1 * *` | Monthly cron |

---

## 7. Input schema

| Column | Required | Range | Description |
|---|---|---|---|
| `id` | Yes | string | Unique identifier |
| `title` | Yes | string | Opportunity description |
| `reach` | Yes | 0–10 | How many users/customers affected per quarter |
| `impact` | Yes | 0–10 | How much it moves the needle per user |
| `confidence` | Yes | 0–10 | Confidence in estimates (10=very confident) |
| `effort` | Yes | 0–10 | Engineering effort (10=largest effort) |
| `strategic_fit` | No | 0–10 | Alignment with current strategy |
| `category` | No | string | e.g. new-capability, integration, enterprise-requirement |
| `tags` | No | string | Comma-separated tags |

---

## 8. Output schema

Sorted list of opportunities with:
- Rank (1 = highest)
- RICE score = `(reach × impact × confidence%) / effort`
- Adjusted score (RICE + small strategic fit modifier)
- All input dimensions for reference

---

## 9. Estimated AI cost

**$0.00** — no LLM used.

---

## 10. Privacy and security

- Opportunity titles and scores are sent in the email.
- No customer data is processed.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Sheet read fails | Error in Executions; no report |
| Effort = 0 | RICE score set to 0 to avoid division by zero |
| All records invalid | Report shows 0 valid opportunities |

---

## 12. Customization examples

### Add customer request volume as reach input

Pull the count of customer requests per opportunity from workflow #01 (Customer Feedback Brain) output and map it to the `reach` column in your Google Sheet before running the scoring.

### Export scored list back to Sheets

After "Compute RICE Scores", add a Google Sheets update node that writes the `rice_score` and `rank` values back to the source sheet.

### Add filtering by category

In the "Compute RICE Scores" Code node, add a filter before sorting to only include opportunities matching a specific category (e.g., `category === 'enterprise-requirement'`).

---

## 13. How to test

1. Click **Manual Trigger** — 10 sample opportunities loaded.
2. Inspect "Compute RICE Scores" — `scored` array with ranks 1–10.
3. Check email for ranked report.
4. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **RICE is an estimate, not ground truth.** Scores are only as good as the input estimates. Discuss inputs as a team.
- **No historical tracking.** Score changes over time require adding snapshot storage.
- **No approval gate.** This is an informational ranking. Add a Wait node if leadership review is required before the report is distributed.

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
