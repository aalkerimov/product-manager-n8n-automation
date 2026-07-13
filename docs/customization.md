# Customization Guide

This guide explains how to adapt the workflows to your specific stack, team size, and preferences.

---

## Changing the AI model

All AI calls read from environment variables. To switch models:

1. Update `.env`:
   ```
   AI_MODEL_FAST=gpt-4o-mini        # For classification (cost-optimised)
   AI_MODEL_SMART=gpt-4o            # For report generation (quality-optimised)
   ```

2. Or use any OpenAI-compatible provider:
   ```
   AI_PROVIDER_BASE_URL=https://api.anthropic.com/v1
   AI_MODEL_SMART=claude-3-5-sonnet-20241022
   ```

3. In n8n: update the OpenAI credential's **Base URL** field

---

## Switching from email to Slack

By default, workflows fall back to email. To use Slack instead:

1. Set `NOTIFICATION_CHANNEL=slack` in `.env`
2. Set `SLACK_CHANNEL_ALERTS=#your-channel` in `.env`
3. Create a Slack credential in n8n
4. In the **Notification Router** subworkflow, set the Slack credential name

---

## Adding a new competitor URL

Edit `COMPETITOR_PAGES_CONFIG` in `.env`:

```json
[
  {"company":"Rival A","url":"https://rival-a.com/pricing","type":"pricing"},
  {"company":"Rival A","url":"https://rival-a.com/changelog","type":"changelog"},
  {"company":"Rival B","url":"https://rival-b.com/features","type":"features"}
]
```

No workflow changes needed — the monitor reads this config on each run.

---

## Adding a new feedback source

The **Customer Feedback Brain** accepts any JSON array via webhook.

### Adding a Typeform source

1. In Typeform: **Connect → Webhooks → Add endpoint**
2. Set the endpoint to your n8n webhook URL
3. In the workflow, add a **Switch** branch for `source = typeform`
4. Map Typeform fields to the standard schema:
   ```json
   {
     "id": "{{ $json.event_id }}",
     "text": "{{ $json.form_response.answers[0].text }}",
     "source": "typeform",
     "created_at": "{{ $json.form_response.submitted_at }}"
   }
   ```

### Adding a CSV export

Drop a CSV file with these columns:
`id, text, source, customer_segment, created_at, rating`

Trigger the workflow manually and attach the file, or schedule a Google Drive
watch to pick up new files automatically.

---

## Adjusting classification thresholds

### Feedback Brain

| Variable | Default | Effect |
|---|---|---|
| `FEEDBACK_CLASSIFICATION_THRESHOLD` | `0.6` | Minimum confidence to include a classification |
| `FEEDBACK_DEDUP_WINDOW_HOURS` | `168` | Hours to look back for duplicates (7 days) |

### Competitor Monitor

| Variable | Default | Effect |
|---|---|---|
| `COMPETITOR_CHANGE_IMPORTANCE_THRESHOLD` | `6` | Score 1–10; only notify if ≥ this value |
| `COMPETITOR_DIFF_MIN_CHARS` | `100` | Ignore diffs shorter than this |

---

## Customising report templates

Each workflow has a **Generate Report** node with a system prompt.
You can edit the prompt directly in n8n to:

- Add sections (e.g. "Sales team impact")
- Change the output language
- Adjust the tone (executive vs. engineering audience)
- Require a specific output format (markdown table, bullet points, JSON)

---

## Using PostgreSQL instead of Google Sheets

1. Set up PostgreSQL: `docker compose up -d postgres`
2. Run `scripts/init-db.sql` against your database
3. In each workflow, find nodes labelled **[BASIC: Google Sheets]** and enable
   the paired **[ADVANCED: PostgreSQL]** nodes instead
4. Disable the Google Sheets nodes (right-click → Disable)

---

## Running on a different schedule

All schedules use cron expressions in environment variables:

```bash
FEEDBACK_REPORT_SCHEDULE="0 9 * * 1"   # Monday 09:00
COMPETITOR_CHECK_SCHEDULE="0 */6 * * *"  # Every 6 hours
BRIEF_SCHEDULE="0 8 * * 5"              # Friday 08:00
```

After changing `.env`, restart n8n:
```bash
docker compose restart n8n
```

On n8n Cloud, edit the Schedule node directly in the workflow.

---

## Disabling human approval

> ⚠️ Not recommended for production. Only disable for testing.

In the **Human Approval Gate** subworkflow, add a **Set** node before the
Wait node and hardcode `decision = approved`. This bypasses the approval step.

---

## Adding a Linear ticket on approval

When a feedback insight is approved, you can auto-create a Linear issue:

1. Add an **HTTP Request** node after the approval
2. Set URL: `https://api.linear.app/graphql`
3. Set method: POST
4. Set header: `Authorization: Bearer YOUR_LINEAR_KEY`
5. Body (GraphQL):
   ```graphql
   mutation {
     issueCreate(input: {
       title: "{{ $json.title }}",
       description: "{{ $json.summary }}",
       teamId: "{{ $env.LINEAR_TEAM_ID }}"
     }) { issue { id url } }
   }
   ```
