# Calendar Audit & Focus Protector

> Analyse your weekly calendar, compute focus time percentage, flag meeting overload, and surface specific recommendations — sent to yourself every Monday morning.

---

## 1. Overview

Runs Monday at 6am (before #91 Weekly Priorities Planner). Takes this week's calendar events (manual or via Google Calendar API). Computes: total meeting hours, focus time %, recurring vs. one-off split, heaviest day, hours by category. Generates specific recommendations when focus time falls below the configured threshold. Sent directly — no approval gate (personal audit).

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 92

> **No LLM.** All analysis is deterministic arithmetic.

---

## 2. The problem

Knowledge workers consistently overestimate how much focus time they have. A calendar that looks manageable at a glance often hides 60–70% meeting load that leaves no room for deep work. This workflow makes the hidden visible — before the week starts.

---

## 3. How it works

```
Schedule (Mon 6am) ─┐
                     ├─→ Load Events ─→ Analyse Calendar ─→ Format Audit ─→ Send to Self
Manual Trigger ──────┘
```

> No approval gate — this is a personal audit, not a team communication.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Personal calendar audit delivery |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  CALENDAR_AUDIT_EMAIL_TO = pm@yourcompany.com (yourself)

Step 3: Update events weekly
  Edit "Load Calendar Events" each Sunday with next week's events.
  
  For automation: Add Google Calendar HTTP Request:
  GET https://www.googleapis.com/calendar/v3/calendars/primary/events
  ?timeMin=<Monday 00:00 ISO>&timeMax=<Friday 23:59 ISO>
  Map each event: summary→title, start.dateTime→start, end.dateTime→end

Step 4: Configure thresholds
  Set focus_threshold_pct (default: 40% = 16h of 40h week in focus work)
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `CALENDAR_AUDIT_EMAIL_TO` | Required | — | Your email |

---

## 7. Input schema

```json
{
  "events": [{ "title": "string", "day": "Monday", "start": "09:00", "end": "11:00", "category": "engineering|internal|customer|company|team|recruiting", "attendees": 8, "recurring": false }],
  "config": { "work_day_hours": 8, "work_days": 5, "focus_threshold_pct": 40 }
}
```

---

## 8. Output schema

```json
{
  "metrics": { "total_meeting_hours": 9, "total_available": 40, "focus_hours": 31, "focus_pct": 77.5, "below_threshold": false, "recurring_hours": 6, "one_off_hours": 3 },
  "by_category": { "engineering": 2, "internal": 4 },
  "suggestions": ["string"]
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- Calendar event titles sent by email to yourself only. No LLM; no external API.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Email fails | Retries 3 times |
| No events loaded | Zero-event report sent — all days show "no meetings" |

---

## 12. Customization examples

### Google Calendar integration

Add an HTTP Request node with OAuth2 credentials to pull events for the current week. The Calendar API returns events as an array — map `summary` to `title`, parse `start.dateTime` to extract `day` and `start` time.

### Slack morning summary

Replace the email node with an HTTP Request to post the audit to your personal Slack DM via Slack's `chat.postMessage` API.

---

## 13. How to test

1. Click **Manual Trigger** — 9 events across 5 days loaded.
2. "Analyse Calendar" — meeting load, focus %, by-day breakdown, suggestions.
3. Email arrives with audit report.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No LLM (by design)** — recommendations are rule-based.
- **Events must be manually entered** — integrate with Google Calendar API for production.
- **No cross-week trend tracking** — add Google Sheets persistence to see if meeting load is increasing.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `emailSend`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
