# Win/Loss Analysis Engine

> Combine CRM close reasons, deal notes, and interview data into recurring win/loss patterns by segment and competitor — on a schedule, not when someone has time.

---

## 1. Overview

The Win/Loss Analysis Engine reads closed deals from a Google Sheet (your CRM export), aggregates them, and asks an LLM to find patterns: why you win by segment, why you lose by competitor, and which actions are highest priority. Every pattern includes the deal IDs that support it. Output goes through a human approval gate before delivery.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 52

---

## 2. The problem

Win/loss data sits in CRM fields and sales call notes that nobody reads systematically. Individual deal reviews miss patterns. Quarterly business reviews are too slow. This workflow runs monthly and surfaces the patterns automatically.

---

## 3. How it works

```
Monthly Schedule ─┐
                   ├─→ Read Deals (Sheets) ─→ Validate & Normalise ─→ Prepare Prompt ─→ LLM: Identify Patterns
Manual Trigger ───┘   (or Load Sample Data)
                                                                                              │
                                                                                    Validate LLM Output
                                                                                       │         │
                                                                                   (pass)      (fail)
                                                                                      │           │
                                                                               Format Report  Error Handler
                                                                                      │
                                                                           Send Approval Request
                                                                                      │
                                                                            Wait for Approval (48h)
                                                                                      │
                                                                                  Approved?
                                                                              ┌───────┴──────┐
                                                                            Yes             No
                                                                             │               │
                                                                    Send Final Report   Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| Google Sheets OAuth2 | Basic | Yes (for scheduled runs) | Read closed deal data |
| SMTP Email | Basic | Yes | Approval and report delivery |
| OpenAI-compatible LLM | Basic | Yes | Pattern identification |

---

## 5. Five-minute setup

```
Step 1: Prepare your Google Sheet
  - Sheet name: "deals" (or rename the sheetName value in the Read node)
  - Required columns: deal_id, company, segment, outcome (won/lost),
    acv, close_reason, primary_competitor, deal_notes
  - Get the Sheet ID from the URL: docs.google.com/spreadsheets/d/SHEET_ID/edit

Step 2: Create credentials in n8n
  a. Google Sheets OAuth2 named "YOUR_GOOGLE_SHEETS_CREDENTIAL"
  b. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
     (Authorization: Bearer <your-key>)
  c. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 3: Update the "Read Deal Data from Sheets" node
  - Replace YOUR_WINLOSS_SHEET_ID with your Sheet ID (or set env var WINLOSS_SHEET_ID)

Step 4: Set environment variables
  WINLOSS_SHEET_ID     = your_sheet_id
  WINLOSS_SCHEDULE     = 0 8 1 * *   (1st of each month at 08:00)
  WINLOSS_EMAIL_TO     = sales@yourcompany.com
  AI_MODEL             = gpt-4o-mini
  OPENAI_BASE_URL      = https://api.openai.com

Step 5: Test with Manual Trigger
  - Runs with 10 embedded sample deals (9 valid, 1 edge-case incomplete record)
  - Check each node's output in the Executions tab
  - Receive approval email → click Approve
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `WINLOSS_SHEET_ID` | Required | — | Google Sheet ID for deal data |
| `WINLOSS_SCHEDULE` | Optional | `0 8 1 * *` | Cron for monthly run |
| `WINLOSS_EMAIL_TO` | Required | — | Recipient for approval and report |
| `NOTIFICATION_EMAIL_FROM` | Optional | `automation@acme-analytics.com` | Sender address |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model name |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM provider base URL |

---

## 7. Input schema

Your Google Sheet must have these columns (extras are ignored):

| Column | Required | Type | Notes |
|---|---|---|---|
| `deal_id` | Yes | string | Unique identifier |
| `company` | No | string | Company name |
| `segment` | Yes | string | enterprise, mid-market, smb, startup |
| `outcome` | Yes | string | `won` or `lost` |
| `acv` | No | number | Annual contract value in USD |
| `close_reason` | No | string | CRM close reason field |
| `primary_competitor` | No | string | Main competitor in the deal |
| `deal_notes` | No | string | Free-text notes; truncated at 500 chars |

Records missing `deal_id`, `outcome`, or `segment` are skipped and counted in `skipped_count`.

---

## 8. Output schema

```json
{
  "win_themes": [{ "theme": "string", "frequency": 3, "segments": ["enterprise"], "evidence_deal_ids": ["D001"], "confidence": "high" }],
  "loss_themes": [{ "theme": "string", "frequency": 2, "segments": ["smb"], "evidence_deal_ids": ["D002"], "confidence": "medium" }],
  "competitor_analysis": [{ "competitor": "CompetitorA", "win_rate_vs_them": 66, "deals_competed": 3, "why_we_win": "string", "why_we_lose": "string" }],
  "segment_breakdown": [{ "segment": "enterprise", "total_deals": 3, "won": 2, "lost": 1, "win_rate_pct": 67, "top_win_reason": "string", "top_loss_reason": "string" }],
  "recommended_actions": [{ "action": "string", "priority": "high", "rationale": "string" }],
  "data_quality_notes": ["string"]
}
```

---

## 9. Estimated AI cost

| Deals analysed | Tokens (approx.) | Model | Cost per run |
|---|---|---|---|
| 10 deals | ~3,000 | gpt-4o-mini | ~$0.003 |
| 50 deals | ~8,000 | gpt-4o-mini | ~$0.008 |
| 200 deals | ~25,000 | gpt-4o-mini | ~$0.025 |

**Assumption:** 1 run/month. Monthly cost under $0.03 for most teams.

---

## 10. Privacy and security

- Deal notes and close reasons are sent to your configured LLM provider.
- Review your provider's data retention policy, especially if notes contain contact names or pricing.
- The report is not sent until a human approves it.
- No data is written back to the CRM — this is read-only.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Sheet read fails (auth expired) | Execution stops; n8n shows the error in the Executions tab |
| All deals invalid (missing fields) | Validate node returns empty deals array; LLM prompt errors gracefully |
| LLM returns malformed JSON | Validate LLM Output routes to Error Handler; no report generated |
| Email delivery fails | n8n retries 3 times; logs error on failure |
| Approval not received within 48h | Wait node times out; report is not sent |

---

## 12. Customization examples

### Add interview transcript data

Add a second Code node before "Validate and Normalise Deals" that reads from a "interviews" tab and appends entries to the deals array with `outcome: "interview"` and `deal_notes` containing the transcript excerpt.

### Include only deals from the last N days

In the "Validate and Normalise Deals" Code node, add a date filter:
```js
const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
const filtered = items.filter(d => new Date(d.close_date) >= cutoff);
```

### Post to Slack instead of email

Replace the "Send Final Report" Email node with an HTTP Request node calling the Slack API `chat.postMessage` endpoint, or use the `notification-router` subworkflow.

---

## 13. How to test

1. Click **Manual Trigger**.
2. Inspect "Validate and Normalise Deals" — 9 valid deals, 1 skipped.
3. Inspect "Validate LLM Output" — confirm `_error: false`.
4. Receive approval email → click Approve.
5. Final report arrives with win themes, loss themes, and competitor analysis.
6. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.** Node parameters have not been verified against a live n8n instance.
- **Pattern quality depends on data volume.** With fewer than 10 deals, the LLM may produce low-confidence output. 30+ deals recommended for meaningful patterns.
- **Deal notes are truncated at 500 characters.** Longer notes are cut off before the LLM sees them.
- **No deduplication across months.** The same deal may appear in multiple monthly runs if the sheet is not cleared.
- **No structured interview integration.** Interview transcripts must be manually added to the sheet's `deal_notes` column.

---

## 15. Dependencies

- n8n 1.50.0+
- Node types: `scheduleTrigger`, `manualTrigger`, `googleSheets`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md` in this directory.
