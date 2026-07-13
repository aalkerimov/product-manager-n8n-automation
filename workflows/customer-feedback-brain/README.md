# Customer Feedback Brain

> Collect feedback from any source, classify it with AI, and get a weekly product-insights report — without drowning in Notion pages.

---

## The problem

Customer feedback arrives in 8 different places. Nobody reads all of it. Important signals get missed. The product roadmap is based on whoever shouted loudest last week.

## How it works

```
Webhook / CSV / Sheets / Manual
        ↓
  Normalise to common schema
        ↓
  Deduplicate within 7-day window
        ↓
  AI classification (batch of 10)
  → problem_category, sentiment, urgency, segment, product_area
        ↓
  Generate product insights report
        ↓
  Human approval (email)
        ↓
  Send to Slack / Email / Telegram
```

## Required integrations

| Integration | Stack | Purpose |
|---|---|---|
| OpenAI API | Required | Classification + report generation |
| SMTP Email | Basic | Approval emails + report delivery |
| Slack API | Advanced | Report delivery to channel |
| Google Sheets | Basic (optional) | Store feedback items |
| PostgreSQL | Advanced (optional) | Persistent feedback storage |

## Installation (5 minutes)

```bash
# 1. Import the workflow
# In n8n: Workflows → Import from file → workflows/customer-feedback-brain/workflow.json

# 2. Import subworkflows (do this first)
# Workflows → Import from file → subworkflows/llm-classifier/workflow.json
# Workflows → Import from file → subworkflows/human-approval/workflow.json
# Workflows → Import from file → subworkflows/notification-router/workflow.json

# 3. Copy subworkflow IDs
# Open each subworkflow → copy ID from browser URL bar
# Update the three "Call" nodes in the main workflow with the correct IDs

# 4. Create credentials (Settings → Credentials)
# → OpenAI API (paste your key)
# → SMTP Email (your email server settings)

# 5. Test
# Click "Manual Trigger" → the workflow runs with built-in sample data
# You'll receive an approval email → click Approve → report is sent
```

## Configuration variables

| Variable | Default | Description |
|---|---|---|
| `FEEDBACK_WEBHOOK_PATH` | `/webhook/feedback` | Webhook URL path |
| `FEEDBACK_REPORT_SCHEDULE` | `0 9 * * 1` | Cron: every Monday 09:00 |
| `FEEDBACK_CLASSIFICATION_THRESHOLD` | `0.6` | Min AI confidence to include |
| `FEEDBACK_DEDUP_WINDOW_HOURS` | `168` | Dedup lookback (7 days) |
| `AI_MODEL_FAST` | `gpt-4o-mini` | Model for classification |
| `NOTIFICATION_EMAIL_TO` | — | Report recipient email |
| `COMPANY_NAME` | `Your Company` | Shown in report header |

## Input schema

```json
{
  "id": "string (optional — generated if missing)",
  "text": "string (required — the feedback content)",
  "source": "typeform | support_email | intercom | zendesk | app_store_review | github_issue | in_app_survey | csv | webhook",
  "customer_segment": "enterprise | growth | startup | consumer (optional)",
  "rating": "number 1–5 or 1–10 (optional)",
  "created_at": "ISO 8601 string (optional)"
}
```

Send an array of these objects to the webhook, or paste them as a batch in the Manual Trigger.

## Output schema

See `sample-output.json` for the full structure. Key sections:
- `top_repeated_problems` — by frequency, with segment breakdown
- `important_quotes` — high-confidence key quotes from customers
- `feature_requests` — extracted feature asks
- `possible_bugs` — items classified as potential bugs
- `affected_segments` — which segments are most impacted
- `recommendations` — AI-generated action suggestions

## Estimated AI cost

| Run type | Items | Model | Estimated cost |
|---|---|---|---|
| Small batch | 20 items | gpt-4o-mini | ~$0.01 |
| Medium batch | 100 items | gpt-4o-mini | ~$0.05 |
| Large batch | 500 items | gpt-4o-mini | ~$0.25 |
| Report generation | 1 call | gpt-4o-mini | ~$0.02 |

**Weekly total: typically $0.03–0.30** depending on feedback volume.

## Privacy and security

- Feedback text is sent to your configured AI provider (OpenAI by default)
- Raw feedback is stored only in your n8n instance (DB or Sheets you configure)
- The report is only sent after human approval
- No customer names or emails are extracted or stored (unless they appear in the feedback text itself)
- Review your AI provider's data retention policy — OpenAI does not train on API data by default

## Failure behaviour

| Failure | What happens |
|---|---|
| Webhook unreachable | n8n retries 3x with 1s backoff |
| AI API error | Retries 3x; if all fail, workflow logs error and stops |
| Email not delivered | Retries 3x; approval times out after 24h |
| Approval timeout | Report is logged but not sent |
| Invalid input JSON | Item is skipped; valid items continue |

## Customisation examples

### Add a Typeform source

1. In Typeform: Connect → Webhooks → set endpoint to your n8n webhook URL
2. The webhook will receive Typeform's format — add a transformation branch in the "Collect" node

### Add a CSV source

1. Schedule a Google Drive watch or manual trigger
2. Use n8n's "Read Binary File" node → "CSV" node to parse rows
3. Map columns to the standard schema in the Normalize node

### Change the report schedule

```bash
FEEDBACK_REPORT_SCHEDULE="0 9 * * 5"  # Friday 09:00 instead
```

## How to test

1. Click **Manual Trigger (for testing)** in n8n
2. The workflow runs with built-in sample data (5 items)
3. Check the **Executions** tab for each step's output
4. You'll receive an approval email — click **Approve**
5. The report is sent to your configured channel
6. Compare output with `sample-output.json`

## Known limitations

- **Deduplication is per-run only** in the basic stack. For cross-run deduplication, set up PostgreSQL and query existing hashes before classifying.
- **No real-time streaming** — feedback is collected in batches, not as it arrives.
- **AI confidence varies** — low-confidence items (< 0.6) are not classified. Review the logs if you're seeing many skipped items.
- **Max 8,000 chars per feedback item** — longer text is truncated before AI processing.
- **Rate limits** — if you process > 1,000 items at once, you may hit OpenAI rate limits. Use the batch size setting to reduce concurrent calls.

## Changelog

| Version | Change |
|---|---|
| 1.0.0 | Initial release |
