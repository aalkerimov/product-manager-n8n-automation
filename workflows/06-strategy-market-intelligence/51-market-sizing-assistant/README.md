# Market Sizing Assistant

> Build TAM/SAM/SOM estimates with explicit numbered assumptions, cited data sources, and bull/base/bear sensitivity ranges — not a single magic number.

---

## 1. Overview

The Market Sizing Assistant accepts a market brief (product category, target segments, geography, and any revenue proxies you have) and produces a structured three-tier market estimate. Every number is accompanied by the assumption that generated it, a confidence rating, and a source reference. The output goes through a human approval gate before it is sent anywhere.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 51

---

## 2. The problem

Market sizing estimates produced by AI or consultants are often a single number with no trail of assumptions. When the number turns out to be wrong — and it often is — nobody can explain which assumption was the weak point. This workflow makes every assumption explicit and quantified so disagreements happen at the right level.

---

## 3. How it works

```
Manual Trigger (sample data) ─┐
                               ├─→ Validate Input ─→ Prepare LLM Prompt ─→ LLM: Build Market Estimates
Webhook: Receive Brief ────────┘
                                                                              │
                                                                    Validate LLM Output
                                                                       │           │
                                                                  (pass)         (fail)
                                                                    │               │
                                                              Format Report    LLM Error Handler
                                                                    │
                                                          Send Approval Request (email with approve/reject links)
                                                                    │
                                                           Wait for Approval (48h timeout)
                                                                    │
                                                               Approved?
                                                              ┌─────┴─────┐
                                                           Yes             No
                                                            │               │
                                                   Send Final Report    Log Rejection
                                                            │
                                                   Log to Google Sheets
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM API | Basic | Yes | Build TAM/SAM/SOM with assumptions |
| SMTP Email | Basic | Yes | Approval request and final report delivery |
| Google Sheets OAuth2 | Basic | Optional | Log runs and estimates |

---

## 5. Five-minute setup

```
Step 1: Import subworkflows (if not already done)
  - subworkflows/llm-classifier/workflow.json
  - subworkflows/human-approval/workflow.json
  - subworkflows/notification-router/workflow.json

Step 2: Import this workflow
  n8n → Workflows → Import from file → workflow.json

Step 3: Create credentials in n8n (Settings → Credentials)
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
     Header name: Authorization
     Header value: Bearer <your-openai-api-key>
  b. SMTP credential named "YOUR_SMTP_CREDENTIAL"
     Fill in your SMTP host, port, username, password

Step 4: Create Google Sheets credential (optional)
  - OAuth2 credential named "YOUR_GOOGLE_SHEETS_CREDENTIAL"
  - Create a sheet named "market-sizing-log" with columns:
    run_id, product_category, geography, tam_base, sam_base, som_base, confidence, status, sent_at
  - Replace YOUR_GOOGLE_SHEET_ID in the "Log to Google Sheets" node

Step 5: Set environment variables (or replace placeholders directly in nodes)
  OPENAI_BASE_URL         = https://api.openai.com       (or your compatible provider)
  AI_MODEL                = gpt-4o-mini
  MARKET_SIZING_EMAIL_TO  = strategy@yourcompany.com
  NOTIFICATION_EMAIL_FROM = automation@yourcompany.com
  COMPANY_NAME            = Your Company Name

Step 6: Test
  - Click Manual Trigger → the workflow runs with built-in sample data
  - Check each node's output in the Executions tab
  - You will receive an approval email → click "Approve and send report"
  - Verify the final report arrives in your inbox
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | Base URL for any OpenAI-compatible provider |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model name |
| `MARKET_SIZING_EMAIL_TO` | Required | — | Recipient of approval request and final report |
| `NOTIFICATION_EMAIL_FROM` | Optional | `automation@example.com` | Sender address |
| `COMPANY_NAME` | Optional | `Your Company` | Used in email subject lines |
| `YOUR_GOOGLE_SHEET_ID` | Optional | — | Google Sheet for run logging (replace in node) |

---

## 7. Input schema

Send a POST request to `/webhook/market-sizing` with a JSON body, or use the Manual Trigger:

```json
{
  "product_category": "string — required. e.g. 'B2B project management software'",
  "target_segments": ["string", "string"],
  "geography": "string — required. e.g. 'North America'",
  "pricing_model": "string — optional. e.g. 'SaaS subscription'",
  "avg_contract_value_usd": 2400,
  "revenue_proxies": [
    { "name": "string — source name", "value": "number or string" }
  ],
  "competitors": ["string"],
  "assumptions_to_flag": ["string — anything you know is uncertain"],
  "requested_by": "email@yourcompany.com"
}
```

At minimum, provide `product_category`, `target_segments`, and `geography`. All other fields improve estimate quality.

---

## 8. Output schema

```json
{
  "tam": {
    "definition": "string",
    "base_usd": 12000000000,
    "bull_usd": 18000000000,
    "bear_usd": 7000000000,
    "methodology": "top-down | bottom-up | value-theory",
    "key_assumptions": [
      { "id": "A1", "statement": "string", "confidence": "low|medium|high", "source": "string" }
    ]
  },
  "sam": { "definition": "string", "base_usd": 1200000000, "bull_usd": 1800000000, "bear_usd": 700000000, "segmentation_rationale": "string" },
  "som": { "definition": "string", "base_usd": 60000000, "bull_usd": 108000000, "bear_usd": 28000000, "market_share_assumption_pct": 5, "rationale": "string" },
  "sensitivity_drivers": [{ "driver": "string", "impact": "high|medium|low", "direction": "upside|downside|both" }],
  "data_gaps": ["string"],
  "confidence_overall": "low|medium|high",
  "confidence_rationale": "string"
}
```

See `sample-output.json` for a complete example.

---

## 9. Estimated AI cost

| Scenario | Tokens (approx.) | Model | Cost per run |
|---|---|---|---|
| Simple brief, no proxies | ~1,500 | gpt-4o-mini | ~$0.001 |
| Full brief with 5 proxies | ~2,500 | gpt-4o-mini | ~$0.002 |
| Complex multi-segment | ~3,500 | gpt-4o | ~$0.035 |

**Assumptions:** 4 runs/month, gpt-4o-mini at $0.00015/1K input tokens + $0.00060/1K output tokens.  
**Estimated monthly cost:** under $0.02 for typical usage.

---

## 10. Privacy and security

- Market brief data (your product category, segments, revenue proxies) is sent to your configured LLM provider.
- No customer data is sent unless you include it in the revenue proxies or brief.
- The report is not sent until a human approves it.
- Credentials are stored in n8n's encrypted credential store, not in this file.
- Review your LLM provider's data retention policy before sending sensitive competitive information.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Missing required input fields | Validate Input node throws an error; execution stops with a clear message |
| LLM returns malformed JSON | Validate LLM Output node routes to LLM Error Handler; no report is generated |
| LLM returns SAM > TAM | Validation catches this and routes to error handler |
| Email delivery fails | n8n retries 3 times; if all fail, execution logs the error |
| Approval link not clicked within 48h | Wait node times out; report is not sent (no automatic fallback) |
| Google Sheets write fails | Non-blocking; report has already been sent; check Executions for error detail |

---

## 12. Customization examples

### Use a different LLM provider

Set `OPENAI_BASE_URL` to any OpenAI-compatible endpoint:
```
OPENAI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=anthropic/claude-3-haiku
```

### Add a Slack notification

Connect the "Send Final Report" output to a Slack node using the `notification-router` subworkflow instead of the second email node.

### Run on a schedule for known markets

Add a Schedule Trigger → Code node that produces pre-defined briefs for your standard market segments, then connect to Validate Input.

### Increase estimate depth

In the "Prepare LLM Prompt" node, extend the JSON schema to request competitor revenue benchmarks or geographic sub-breakdowns per segment.

---

## 13. How to test

1. Click **Manual Trigger** in n8n.
2. Inspect each node's output in the Executions tab.
3. The LLM call uses the sample brief: "B2B project management software, North America, SMB + Mid-market".
4. You will receive an approval email at `MARKET_SIZING_EMAIL_TO`.
5. Click **Approve and send report** in the email.
6. The formatted report arrives in your inbox.
7. Check the "Log to Google Sheets" node for the logged row (if configured).
8. Compare output with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.** Node parameters and typeVersions have not been verified against a live n8n instance. Manual verification required after import.
- **LLM accuracy is not guaranteed.** The model may produce plausible-sounding but incorrect estimates, especially without revenue proxies. Always validate key assumptions against primary sources.
- **No persistence across runs.** Previous sizing runs are not retrieved or compared unless you query the Google Sheet manually.
- **Approval link security.** The n8n resume URL is unguessable but not authenticated. Treat it like a single-use link.
- **Token limit.** Very long lists of revenue proxies (more than 20 items) may exceed context windows for smaller models.
- **SAM/TAM ratio not configurable.** The LLM decides the segmentation. If your SAM methodology differs, edit the prompt in the "Prepare LLM Prompt" node.

---

## 15. Dependencies

- n8n version 1.50.0 or higher
- Node types used: `manualTrigger`, `webhook`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `googleSheets`, `stickyNote`
- No external packages required

---

## 16. Contributing

See the project-level [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md` in this directory.
