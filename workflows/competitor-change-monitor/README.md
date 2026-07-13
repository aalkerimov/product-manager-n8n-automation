# Competitor Change Monitor

> Know about competitor changes before your customers do.

---

## The problem

Competitor pricing, features, and messaging change constantly. Most teams find out from a sales call — or a customer asking "why does Rival X have this and you don't?" This workflow checks competitor pages automatically and only alerts you when something meaningful changes.

## How it works

```
Schedule (every 6h) / Manual Trigger
        ↓
  Load competitor pages from config
        ↓
  Rate-limited fetch (2s between requests)
        ↓
  Strip HTML → plain text → hash
        ↓
  Compare hash with previous snapshot
        ↓
  Skip if: no change | diff < 100 chars | first snapshot
        ↓
  AI analysis: change type, importance (1-10), impact, response
        ↓
  Skip if importance < threshold (default: 6)
        ↓
  Send notification (Slack / Email / Telegram)
```

## Required integrations

| Integration | Stack | Purpose |
|---|---|---|
| OpenAI API | Required | Change impact analysis |
| SMTP Email | Basic | Change notifications |
| Slack API | Advanced | Real-time channel alerts |

No authentication is used for competitor page fetches — only public pages are supported.

## Installation (5 minutes)

```bash
# 1. Import the workflow
# Workflows → Import from file → workflows/competitor-change-monitor/workflow.json

# 2. Import subworkflows (if not already done)
# llm-classifier, notification-router

# 3. Configure your competitor pages in .env:
COMPETITOR_PAGES_CONFIG='[
  {"company":"Rival A","url":"https://rival-a.com/pricing","type":"pricing"},
  {"company":"Rival A","url":"https://rival-a.com/changelog","type":"changelog"}
]'

# 4. Create credentials in n8n:
# → OpenAI API
# → SMTP Email or Slack API

# 5. Test: click Manual Trigger
# The workflow will check example.com (the default demo URL)
```

## Configuration variables

| Variable | Default | Description |
|---|---|---|
| `COMPETITOR_PAGES_CONFIG` | See example | JSON array of pages to monitor |
| `COMPETITOR_CHECK_SCHEDULE` | `0 */6 * * *` | Cron: every 6 hours |
| `COMPETITOR_CHANGE_IMPORTANCE_THRESHOLD` | `6` | Notify only if score ≥ this (1–10) |
| `COMPETITOR_DIFF_MIN_CHARS` | `100` | Min text diff to trigger analysis |
| `AI_MODEL_SMART` | `gpt-4o` | Model for impact analysis |

## Competitor pages config format

```json
[
  {
    "company": "Rival A",
    "url": "https://rival-a.com/pricing",
    "type": "pricing | changelog | features | careers | blog | docs | homepage"
  }
]
```

Add as many pages as you need. Each page is checked independently.

## Output schema

```json
{
  "company": "Rival A",
  "page_type": "pricing",
  "url": "https://rival-a.com/pricing",
  "previous_hash": "abc123",
  "new_hash": "xyz789",
  "ai_analysis": {
    "change_type": "pricing",
    "importance_score": 8,
    "possible_reason": "...",
    "product_impact": "...",
    "recommended_response": "...",
    "confidence": 0.87
  },
  "detected_at": "ISO 8601"
}
```

## Estimated AI cost

Most runs cost **$0.00** (no change detected). When a change is detected:
- Analysis per page change: ~$0.02–0.05 (gpt-4o)
- Typical monthly cost: $0.50–5.00 for 3–5 monitored pages

## Privacy and security

- Only **public URLs** are fetched. Never put authenticated URLs here.
- Competitor page content (stripped HTML) is sent to your AI provider for analysis.
- Snapshots are stored in your n8n instance only.
- Notifications contain AI analysis — treat competitor intelligence as confidential.

## Failure behaviour

| Failure | What happens |
|---|---|
| Page fetch fails (timeout/404) | Retries 3x; skipped for this run; logged |
| AI API error | Retries 3x; change is logged without analysis |
| First snapshot | Saves snapshot without sending notification |
| Below threshold | Logged; no notification sent |

## Customisation examples

### Lower the importance threshold during product launches

```bash
COMPETITOR_CHANGE_IMPORTANCE_THRESHOLD=3  # Catch even minor changes
```

### Monitor hiring pages for signals

```json
{"company": "Rival A", "url": "https://rival-a.com/careers", "type": "careers"}
```

A spike in engineering hires often signals a product expansion. A drop often signals a pivot.

### Check less frequently to reduce costs

```bash
COMPETITOR_CHECK_SCHEDULE="0 8 * * 1,3,5"  # Mon, Wed, Fri at 08:00
```

## How to test

1. Click **Manual Trigger** in n8n
2. The workflow loads the demo URL (example.com)
3. First run: saves a snapshot, no notification
4. Second run: the simulated snapshot differs → triggers AI analysis → notification if importance ≥ 6
5. Check the Executions tab to see the diff and AI analysis at each step

## Known limitations

- **JavaScript-rendered pages**: The HTTP Request node fetches static HTML only. Pages that require JavaScript to load their content (many SPAs) will return incomplete data. Use [Browserless](https://www.browserless.io/) or a puppeteer node for those.
- **Rate limiting by target servers**: Some sites rate-limit or block automated requests. Increase the delay or use a rotating proxy.
- **Snapshot persistence**: In the basic stack, snapshots are not persisted between workflow versions. If you reimport the workflow, previous snapshots are lost.
- **No diffing of structured data**: The workflow compares plain text. Structured changes (e.g., price changes in JSON) work best if the page renders them visibly in the HTML.

## Changelog

| Version | Change |
|---|---|
| 1.0.0 | Initial release |
