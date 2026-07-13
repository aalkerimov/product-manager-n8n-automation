# Weekly Product Brief

> Stop spending 2 hours on Friday preparing a status update. Get a structured weekly brief in 3 minutes.

---

## The problem

Every Friday, someone has to pull data from GitHub, check the metrics dashboard, read through Slack threads, and synthesise it into a readable update. It takes hours, it's inconsistent, and important things still get missed.

## How it works

```
Schedule (Friday 08:00) / Manual Trigger
        ↓
  Initialise period (last 7 days)
        ↓
  ┌─────────────────────────────────┐
  │  Fetch GitHub PRs (if enabled) │
  │  Collect Manual Data (Sheets)  │
  └─────────────────────────────────┘
        ↓
  Merge all data sources
        ↓
  Generate structured brief with AI
  (health status, priorities, decisions)
        ↓
  Human approval
        ↓
  Send to team (Slack / Email / Telegram)
```

## Required integrations

| Integration | Stack | Purpose |
|---|---|---|
| OpenAI API | Required | Brief generation |
| SMTP Email | Basic | Approval + delivery |
| GitHub API | Optional | PR and commit data |
| Google Sheets | Optional | Manual metrics + blockers |
| Slack API | Advanced | Channel delivery |

## Installation (5 minutes)

```bash
# 1. Import the workflow
# Workflows → Import from file → workflows/weekly-product-brief/workflow.json

# 2. Import subworkflows (if not already done)
# human-approval, notification-router

# 3. Create credentials:
# → OpenAI API
# → SMTP Email
# → GitHub API (optional, read-only token)

# 4. Configure environment:
COMPANY_NAME="Acme Inc"
GITHUB_OWNER="your-org"
GITHUB_REPO="your-main-repo"
BRIEF_INCLUDE_GITHUB="true"
NOTIFICATION_EMAIL_TO="team@yourcompany.com"

# 5. Test: click Manual Trigger
# The workflow runs with embedded sample data
# You receive an approval email → click Approve → brief is sent
```

## Configuration variables

| Variable | Default | Description |
|---|---|---|
| `BRIEF_SCHEDULE` | `0 8 * * 5` | Cron: every Friday 08:00 |
| `BRIEF_PERIOD_DAYS` | `7` | Days back to collect data |
| `BRIEF_INCLUDE_GITHUB` | `true` | Include GitHub PR data |
| `GITHUB_OWNER` | — | GitHub org or username |
| `GITHUB_REPO` | — | Repository name |
| `AI_MODEL_SMART` | `gpt-4o` | Model for brief generation |
| `COMPANY_NAME` | `Your Company` | Shown in brief header |

## Adding weekly manual data (Google Sheets)

Create a Google Sheet with these columns:

| period | shipped | metric_name | metric_previous | metric_current | blockers | decisions | priorities |
|---|---|---|---|---|---|---|---|
| 2025-01-13 | Dark mode launched | WAU | 1240 | 1380 | Design review pending | Sunset CSV? | Billing page |

The workflow reads the current week's row. One row per week.

## Output schema

See `sample-output.json`. Key sections:

```json
{
  "overall_health": "green | yellow | red",
  "executive_summary": "2-3 sentence overview",
  "what_shipped": ["item 1", "item 2"],
  "important_metric_changes": [{"metric": "", "change": "", "significance": ""}],
  "customer_insights": ["..."],
  "current_blockers": [{"blocker": "", "owner": "", "urgency": ""}],
  "scope_changes": ["..."],
  "risks": [{"risk": "", "likelihood": "", "mitigation": ""}],
  "decisions_required": [{"question": "", "context": "", "deadline": ""}],
  "priorities_next_week": ["priority 1"]
}
```

## Estimated AI cost

| Run | Model | Estimated cost |
|---|---|---|
| Standard brief (with GitHub) | gpt-4o | ~$0.05–0.15 |
| Brief only (no GitHub) | gpt-4o | ~$0.03–0.08 |

**Monthly total: $0.50–2.00** for weekly runs.

## Privacy and security

- GitHub data is read-only — no writes to your repository
- Metric data from Sheets is sent to the AI provider for summarisation
- The brief is only sent after human approval
- Set `BRIEF_RECIPIENTS` carefully — the brief may contain sensitive roadmap information

## Failure behaviour

| Failure | What happens |
|---|---|
| GitHub API fails | Skips GitHub data; generates brief without it |
| Sheets fetch fails | Falls back to embedded sample data |
| AI brief generation fails | Retries 3x; workflow stops with error log |
| Approval times out | Brief is not sent; logged |

## Customisation examples

### Change to bi-weekly cadence

```bash
BRIEF_SCHEDULE="0 8 1,15 * *"  # 1st and 15th of each month
```

### Add multiple GitHub repos

Duplicate the "Fetch GitHub PRs" node for each additional repo and merge the outputs in "Merge All Data Sources".

### Include customer feedback brain output

If you're running the Customer Feedback Brain, add a Google Sheets read step to pull the latest report and include top insights in the manual data object.

## How to test

1. Click **Manual Trigger** in n8n
2. Workflow generates a brief using built-in sample data
3. You receive an approval email — click **Approve**
4. Brief is sent to your configured channel
5. Compare output to `sample-output.json`

## Known limitations

- **GitHub PR filtering** uses the `closed` state and `merged_at` timestamp — make sure your PRs are merged, not just closed.
- **Manual data** requires you to fill in a Google Sheets row each week — the workflow does not pull live analytics automatically (add a GA4 or Mixpanel node to do this).
- **Single repo** — basic configuration monitors one GitHub repo. Add nodes for additional repos.
- **No diff from previous brief** — each brief is standalone. For week-over-week comparison, store previous briefs and add a comparison step.

## Changelog

| Version | Change |
|---|---|
| 1.0.0 | Initial release |
