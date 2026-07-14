# Discovery Session Scheduler

> Match research participants to available session slots across timezones and produce a confirmed schedule — reviewed before sending invitations.

---

## 1. Overview

Takes a list of qualified participants (with timezones, available days, and time preferences) and a researcher's scheduling constraints (preferred windows, session duration, buffer time). Uses deterministic code to compute an optimal schedule, converting all times to both UTC and participant local time. Requires approval before the researcher sends actual calendar invitations.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 80

---

## 2. The problem

Scheduling research sessions across multiple timezones is slow and error-prone. Researchers manually compare calendars, do timezone conversions, and send emails back and forth. This workflow automates the slot matching and timezone conversion, producing a ready-to-confirm schedule in seconds.

---

## 3. How it works

```
Manual Trigger ─→ Load Session Data ─→ Compute Session Schedule ─→ Format Report ─→ Approval ─→ Send Schedule to Researcher
```

> **No LLM.** All scheduling is deterministic code logic.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Approval and researcher notification |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  SCHEDULER_RESEARCHER_EMAIL = researcher@yourcompany.com
  SCHEDULER_APPROVER_EMAIL   = pm@yourcompany.com (if different)

Step 3: Feed session data
  Edit "Load Sample Session Data" Code node.
  Update study parameters and participant list.
  Participants should come from the Participant Recruitment Screener (#77).

Step 4: After approval
  Researcher sends actual calendar invites / Calendly links per the confirmed schedule.
  For automated invites, add HTTP Request to Calendly's scheduling API after "Approved?".
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `SCHEDULER_RESEARCHER_EMAIL` | Required | — | Researcher who sends invitations |
| `SCHEDULER_APPROVER_EMAIL` | Optional | Same as `SCHEDULER_RESEARCHER_EMAIL` | PM approver |

---

## 7. Input schema

```json
{
  "study": { "study_name": "string", "session_duration_minutes": 45, "buffer_minutes": 15, "researcher_timezone": "UTC+0", "preferred_windows_utc": [{ "day": "Monday", "from": "10:00", "to": "16:00" }], "target_sessions": 6 },
  "participants": [{ "id": "string", "name": "string", "email": "string", "timezone": "UTC+2", "available_days": ["Monday"], "preferred_time": "morning|afternoon" }]
}
```

---

## 8. Output schema

```json
{
  "sessions": [{ "participant_id": "string", "suggested_day": "string", "researcher_window_utc": "string", "participant_local_time": "string", "session_duration_minutes": 45, "status": "to_confirm" }],
  "unscheduled": [{ "id": "string", "reason": "string" }],
  "meta": { "scheduled": 3, "unscheduled": 0, "total": 3 }
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- Participant names and emails in execution data.
- Review n8n data retention settings.
- Do not send actual session invitations until the researcher has confirmed each slot with a calendar system.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No participants can be scheduled | Unscheduled list shows all; empty sessions list |
| Email fails | Retries 3 times |
| Approval timeout | Schedule not sent |

---

## 12. Customization examples

### Auto-send Calendly invite links

After "Approved?", add a SplitInBatches node (one item per session). For each session, POST to the Calendly API to create a scheduled event and send an invite to the participant email.

### Google Calendar integration

After "Approved?", use the Google Calendar HTTP Request to create events programmatically, inviting each participant as an attendee with the computed time slot.

---

## 13. How to test

1. Click **Manual Trigger** — 3 qualified participants, 3-week horizon loaded.
2. "Compute Session Schedule" — `sessions` array with day, UTC window, and local time.
3. Approval email shows schedule.
4. Approve → schedule sent to researcher.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Scheduling logic uses simple day-matching, not exact date scheduling** — no actual calendar date is assigned. Extend with a date-generation loop for exact slot assignment.
- **Does not detect double-booking** — requires integration with Google Calendar or Calendly to check real availability.
- **Timezone support is UTC±N only** — daylight saving time is not accounted for.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `code`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
