# Competitive Pricing Monitor

> Detect competitor pricing page changes weekly — price moves, plan restructures, and feature additions — and surface their implications before your sales team finds out from a prospect.

---

## 1. Overview

Compares current and previous pricing snapshots for configured competitors, computes an exact diff (price changes, new features, removed features, new plans), then uses an LLM to explain what each change means for positioning and how to respond. Only runs the LLM if changes are detected. Requires approval before the alert goes to the team.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 60

---

## 2. The problem

Competitor pricing changes happen quietly. A 20% price cut or a feature added to a mid-tier plan can change every active competitive deal. Sales finds out when a prospect says "they just offered us X." This workflow detects changes weekly and alerts the team with context.

---

## 3. How it works

```
Weekly Wednesday Schedule ─┐
                            ├─→ Compute Pricing Diff ─→ Any Changes?
Manual Trigger ─────────────┘   (Load Sample Snapshots)
                                                            │              │
                                                          Yes             No
                                                            │              │
                                                 Prepare Prompt        Skip
                                                            │
                                                   LLM: Analyse Implications
                                                            │
                                                    Validate → Format Report
                                                            │
                                                   Send for Approval
                                                            │
                                                     Wait (48h)
                                                            │
                                                       Approved?
                                                  ┌────────┴────────┐
                                                Yes                  No
                                                  │                   │
                                          Send Pricing Alert    Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Conditional | Only called when changes detected |
| SMTP Email | Basic | Yes | Approval and alert delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  PRICING_EMAIL_TO    = strategy@yourcompany.com
  AI_MODEL            = gpt-4o-mini
  PRICING_SCHEDULE    = 0 9 * * 3   (Wednesday 09:00)

Step 3: Add real pricing snapshot capture (production)
  Before "Compute Pricing Diff", add:
  - HTTP Request nodes to fetch each competitor's pricing page
  - A Code node to parse the pricing data into the snapshot format (see Input Schema)
  - A Google Sheets read to retrieve the previous week's snapshot
  - After sending the alert, write the current snapshot back to Sheets

Step 4: Test with Manual Trigger
  - CompetitorX Pro plan dropped from $79 to $63 (+AI assistant feature added)
  - CompetitorY: no changes
  - LLM analyses CompetitorX change only
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PRICING_EMAIL_TO` | Required | — | Alert recipient |
| `PRICING_SCHEDULE` | Optional | `0 9 * * 3` | Wednesday 09:00 |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model (only called when changes detected) |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

Snapshot format (previous and current must match this structure):

```json
{
  "competitor": "string",
  "url": "string",
  "previous": {
    "captured_at": "YYYY-MM-DD",
    "plans": [{ "name": "string", "price_monthly": 79, "price_annual_monthly": 65, "features": ["string"], "contact_sales": false }]
  },
  "current": {
    "captured_at": "YYYY-MM-DD",
    "plans": [{ "name": "string", "price_monthly": 63, "price_annual_monthly": 52, "features": ["string"], "contact_sales": false }]
  }
}
```

---

## 8. Output schema

```json
{
  "change_summaries": [{ "competitor": "string", "headline": "string", "implication": "string", "recommended_response": "string", "urgency": "immediate|this-week|this-quarter|monitor" }],
  "aggregate_assessment": "string",
  "confidence": "low|medium|high"
}
```

---

## 9. Estimated AI cost

LLM only called when changes are detected. 1-3 competitor changes: ~1,500 tokens | gpt-4o-mini | ~$0.002/run. No changes: $0.

---

## 10. Privacy and security

- Competitor pricing data (public) is sent to the LLM.
- No customer data is processed.
- Alert requires approval before distribution.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No changes detected | "Any Changes?" routes to Skip node; no email sent |
| LLM output invalid | Error handler; no alert sent |
| Email fails | Retries 3 times |
| Approval timeout | Alert not sent |

---

## 12. Customization examples

### Store snapshots in Google Sheets

After "Send Pricing Alert", add a Google Sheets write node. Store the current snapshot with its date. On the next run, read last week's entry as `previous`.

### Add web scraping for live pricing detection

Use an HTTP Request node to fetch competitor pricing pages, then a Code node to parse out plan names and prices from the HTML. This enables true automated detection rather than manual snapshot maintenance.

### Alert only on price decreases

In "Compute Pricing Diff", add a filter: only flag `direction === 'decrease'` changes. Price increases are less urgent for competitive response.

---

## 13. How to test

1. Click **Manual Trigger** — CompetitorX Pro plan change loaded.
2. "Compute Pricing Diff" detects 3 changes (price decrease + feature add on Pro).
3. "Any Changes?" routes to LLM path.
4. "Validate LLM Output" — `_error: false`.
5. Receive approval email → approve.
6. Alert delivered.
7. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No automatic web scraping.** Manual snapshot comparison only in base version.
- **HTML parsing for live data is fragile.** Competitor page structure changes break parsing.
- **No persistent snapshot storage.** Previous snapshot is embedded in sample data; production requires Sheets/DB.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
