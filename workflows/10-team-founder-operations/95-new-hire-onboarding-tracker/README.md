# New Hire Onboarding Tracker

> Track milestone completion for new hires day-by-day, auto-flag overdue items, and require approval before alerting HR.

---

## 1. Overview

Runs weekly. Takes each active new hire's start date and milestone checklist (with `due_day` offsets). Computes which milestones are overdue relative to today. If all on track, sends a clean report to HR. If overdue items exist, triggers an approval gate before alerting HR. The manager reviews and approves the alert content before it goes to HR.

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 95

> **No LLM.** All milestone tracking is deterministic date arithmetic.

---

## 2. The problem

New hire onboarding milestones slip silently. The 30-day check-in gets missed. The first PR doesn't happen until week 3. Without a tracking system, these gaps only surface at the end-of-probation review — too late to course-correct.

---

## 3. How it works

```
Schedule (Mon 9am) ─┐
                     ├─→ Load Hires ─→ Track Milestones ─→ Format ─→ Any Overdue? ─→ Approval ─→ Alert HR
Manual Trigger ──────┘                                                       ↓
                                                                  On Track → Send to HR directly
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Approval gate + HR report |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  ONBOARDING_EMAIL_TO       = hr@yourcompany.com
  ONBOARDING_APPROVER_EMAIL = manager@yourcompany.com (usually yourself)

Step 3: Add new hire
  Edit "Load New Hire Data" when a new hire joins:
  - name, role, manager, start_date (YYYY-MM-DD)
  - milestones: array of {name, due_day, completed, completed_date}
  
Step 4: Update weekly
  Set completed: true and completed_date when milestones are done.
  For automation: store milestone data in Airtable and use HTTP Request to pull.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `ONBOARDING_EMAIL_TO` | Required | — | HR recipients |
| `ONBOARDING_APPROVER_EMAIL` | Optional | Same as above | Manager approver |

---

## 7. Input schema

```json
{
  "hires": [{ "name": "string", "role": "string", "manager": "string", "start_date": "YYYY-MM-DD", "milestones": [{ "name": "string", "due_day": 10, "completed": false, "completed_date": null }] }],
  "today": "YYYY-MM-DD"
}
```

---

## 8. Output schema

```json
{
  "reports": [{ "name": "string", "days_in_role": 14, "pct_complete": 57, "overdue_items": [{ "name": "string", "days_overdue": 2 }], "next_due": { "name": "string", "due_day": 14 } }],
  "meta": { "hire_count": 1, "total_overdue": 0 }
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- New hire personal data (name, role, manager notes) — keep within internal email system only.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| All on track | Clean report sent to HR, no approval gate |
| Email fails | Retries 3 times |
| Approval timeout | Overdue alert not sent |

---

## 12. Customization examples

### Airtable-backed milestone tracking

Store milestone data in Airtable. Add HTTP Request to pull current milestones for all active new hires. Update `completed` and `completed_date` fields via Airtable's PATCH API when milestones are completed.

### Slack notification to buddy

After "Any Overdue?" for each at-risk hire, send a Slack DM to the buddy: "Hey — {name} has an overdue milestone: {milestone}. Can you follow up today?"

---

## 13. How to test

1. Click **Manual Trigger** — Sofia Park (Day 14, 4/7 milestones complete).
2. "Track Milestones" — "Complete first independent task" is not yet overdue (due today).
3. Report sent to HR showing on-track status.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No LLM (by design)** — tracking is deterministic date arithmetic.
- **Milestone data must be updated manually** — add Airtable or Google Sheets integration.
- **Single hire in sample** — extend `hires` array for multiple simultaneous new hires.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `if`, `emailSend`, `wait`, `set`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
