# Survey Response Analyser

> Analyse open-text NPS survey responses to extract themes, critical issues, delight signals, and feature requests — approved before sharing with the product team.

---

## 1. Overview

Takes raw survey responses (NPS scores + open-text) and computes NPS stats deterministically, then uses an LLM to identify recurring themes, extract top insights, flag critical issues, and list feature requests with frequency counts. Requires approval before sharing analysis.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 72

---

## 2. The problem

NPS survey exports sit in Sheets for weeks because nobody has time to read 200 open-text comments. When they are read, it is done informally — one PM reads them, forms impressions, and those impressions drive decisions without structured evidence. This workflow turns raw responses into a structured, evidence-backed analysis in 60 seconds.

---

## 3. How it works

```
Manual Trigger (sample) ─┐
                          ├─→ Compute NPS + Prepare Prompt ─→ LLM: Analyse ─→ Validate ─→ Format
Webhook: Survey Export ───┘
                                                                                           │
                                                                              Send for Approval
                                                                                           │
                                                                                   Wait (48h)
                                                                                           │
                                                                                     Approved?
                                                                                ┌──────────┴──────┐
                                                                              Yes              No
                                                                                │                │
                                                                    Share Analysis         Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Theme extraction and insight synthesis |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  SURVEY_EMAIL_TO       = product@yourcompany.com
  SURVEY_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL              = gpt-4o-mini

Step 3: Feed survey responses
  Option A: Edit "Load Sample Responses" Code node
  Option B: POST to /webhook/analyse-survey:
  {
    "responses": [{ "id": "R001", "nps_score": 9, "open_text": "string" }],
    "survey_title": "string",
    "question": "string"
  }

  Integrations:
  - Typeform: Trigger on new submission → batch → POST to n8n
  - Survicate: Webhook on survey close → POST to n8n
  - Sheets: Read range weekly → POST to n8n
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `SURVEY_EMAIL_TO` | Required | — | Product team recipients |
| `SURVEY_APPROVER_EMAIL` | Optional | Same as `SURVEY_EMAIL_TO` | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "responses": [{ "id": "string", "nps_score": 9, "open_text": "string" }],
  "survey_title": "string",
  "question": "string"
}
```

---

## 8. Output schema

```json
{
  "themes": [{ "theme": "string", "sentiment": "positive|negative|mixed", "frequency": 4, "representative_quotes": ["string"], "response_ids": ["string"], "actionable": true }],
  "top_3_insights": ["string"],
  "critical_issues": ["string"],
  "delight_signals": ["string"],
  "feature_requests": [{ "request": "string", "frequency": 2, "response_ids": ["string"] }],
  "recommended_actions": [{ "action": "string", "priority": "high|medium|low", "rationale": "string" }]
}
```

---

## 9. Estimated AI cost

15 responses: ~3,000 tokens | gpt-4o-mini | ~$0.004. 100 responses: ~8,000 tokens | ~$0.01.

---

## 10. Privacy and security

- Open-text responses (potentially identifiable) are sent to your LLM.
- Ensure you have appropriate consent from survey participants for LLM processing.
- Anonymise responses if required before posting to the webhook.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no analysis sent |
| Email fails | Retries 3 times |
| Approval timeout | Analysis not shared |

---

## 12. Customization examples

### Auto-trigger on Typeform close

In Typeform, set a webhook on form close that batches all responses and POSTs to `/webhook/analyse-survey`. Add a Code node to transform Typeform's response format into the expected schema.

### Segment by NPS group

Add a SplitInBatches node after "Compute NPS & Prepare Prompt" to run separate LLM calls for promoter responses, passive responses, and detractor responses. Produces segment-specific insights.

---

## 13. How to test

1. Click **Manual Trigger** — 15 NPS responses loaded.
2. "Validate LLM Output" — `_error: false`, `themes` present.
3. NPS computed: NPS 40 from 15 responses.
4. Receive approval email with full analysis.
5. Approve → analysis shared.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM theme counts are estimated** — the `frequency` field is LLM-estimated, not exact. Build exact counts from `response_ids` if precision is needed.
- **Requires participant consent for LLM processing** — anonymise open-text if PII is present.
- **Token limits** — very large surveys (500+ responses) may need chunking. Add a SplitInBatches + merge step.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `webhook`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
