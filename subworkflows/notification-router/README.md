# Notification Router Subworkflow

Routes a notification to one or more channels: Slack, Email, or Telegram.

## Purpose

This subworkflow provides a single notification interface for all main workflows. Instead of duplicating Slack/Email/Telegram nodes everywhere, each workflow calls this once with the message content.

## Setup

1. Import this workflow
2. Create credentials for the channels you want:
   - `Slack API` — for Slack
   - `SMTP Email` — for email
   - `Telegram API` — for Telegram
3. Set environment variables:
   - `SLACK_CHANNEL_ALERTS` (e.g. `#product-alerts`)
   - `NOTIFICATION_EMAIL_TO` (e.g. `team@yourcompany.com`)
   - `TELEGRAM_CHAT_ID` (your chat or group ID)
4. Copy this workflow's ID and paste it into each main workflow's "Send via Notification Router" node

## Input

```json
{
  "channel": "slack | email | telegram | all",
  "title": "🚨 Competitor pricing changed",
  "body": "Formatted notification body (markdown supported for Slack/Telegram)",
  "urgency": "low | medium | high",
  "metadata": {}
}
```

## Output

```json
{
  "sent": true,
  "channels": ["slack"],
  "title": "...",
  "urgency": "high",
  "sentAt": "2025-01-13T10:00:00Z"
}
```

## Channel configuration

| `channel` value | Sends to |
|---|---|
| `slack` | Slack only |
| `email` | Email only |
| `telegram` | Telegram only |
| `all` | All configured channels |

Set `NOTIFICATION_CHANNEL` in `.env` to control the default for all workflows.

## Failing gracefully

If a channel send fails after 3 retries, the node logs the error. Other channels still receive the notification. The output always reports which channels were attempted.
