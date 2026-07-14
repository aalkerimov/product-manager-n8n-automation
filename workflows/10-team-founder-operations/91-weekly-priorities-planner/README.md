# Weekly Priorities Planner

> Turn your weekly context (OKRs, backlog, commitments, meetings) into a ruthlessly prioritised weekly plan — reviewed before sharing with your team.

---

## 1. Overview

Runs every Monday at 7am. Takes your OKRs, top backlog items with urgency and time estimates, committed deliverables, scheduled meetings, and available focus hours. LLM produces: a weekly theme, top 3 priorities with rationale and suggested day, defer/delegate lists, focus time allocation, risks, and end-of-week success criteria.

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 91

---

## 2. The problem

Monday mornings are reactive: Slack, emails, and yesterday's carry-over consume focus time before a plan is in place. This workflow front-loads the planning decision before the week starts — while you're still offline.

---

## 3. How it works

```
Schedule (Mon 7am) ─┐
                     ├─→ Load Context ─→ Prepare Prompt ─→ LLM: Plan ─→ Validate ─→ Format ─→ Approval ─→ Share with Team
Manual Trigger ──────┘
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Priority ranking and plan generation |
| SMTP Email | Basic | Yes | Approval and plan distribution |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  PRIORITIES_EMAIL_TO       = team@yourcompany.com
  PRIORITIES_APPROVER_EMAIL = pm@yourcompany.com (usually yourself)
  AI_MODEL                  = gpt-4o-mini

Step 3: Update weekly context
  Edit "Load Weekly Context" each Sunday evening:
  - Update week dates, OKRs, backlog items with urgency and estimates
  - Add committed deliverables and key meetings
  - Set focus_hours_available (total focus hours minus meeting time)

Step 4: Activate
  Turn on the workflow. It will run every Monday at 07:00.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PRIORITIES_EMAIL_TO` | Required | — | Team recipients |
| `PRIORITIES_APPROVER_EMAIL` | Optional | Same as above | PM (usually self) |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "week": "string",
  "role": "string",
  "okrs_this_quarter": ["string"],
  "top_backlog_items": [{ "id": "string", "title": "string", "estimate": "3h", "urgency": "high|medium|low", "linked_okr": "OKR1|null" }],
  "committed_deliverables": ["string"],
  "key_meetings": [{ "day": "string", "meeting": "string", "type": "string" }],
  "focus_hours_available": 20,
  "last_week_carry_over": "string"
}
```

---

## 8. Output schema

```json
{
  "weekly_theme": "string",
  "top_3_priorities": [{ "rank": 1, "item": "string", "why_this_week": "string", "linked_okr": "string", "estimated_hours": 3, "suggested_day": "string" }],
  "defer_list": [{ "item": "string", "reason": "string" }],
  "delegate_list": [{ "item": "string", "to": "string", "reason": "string" }],
  "risks_this_week": ["string"],
  "focus_time_allocation": { "okr_work_hours": 12, "meetings_hours": 4, "admin_hours": 4 },
  "end_of_week_success_criteria": ["string"]
}
```

---

## 9. Estimated AI cost

~2,000 tokens | gpt-4o-mini | ~$0.003/week. ~$0.15/month.

---

## 10. Privacy and security

- OKRs and backlog items sent to LLM — do not include confidential M&A or board-level strategy in the backlog if using an external LLM.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; plan not sent |
| Email fails | Retries 3 times |
| Approval timeout | Plan not shared |

---

## 12. Customization examples

### Auto-pull from Linear

Add HTTP Request to Linear's GraphQL API to fetch open issues assigned to you, sorted by priority. Map to the backlog_items schema automatically.

### Personal version (no team send)

Set `PRIORITIES_EMAIL_TO` to your own email only. Remove the "Share Plan with Team" step to keep the plan private.

---

## 13. How to test

1. Click **Manual Trigger** — week of July 14–18 with 5 backlog items and 3 OKRs loaded.
2. "Validate LLM Output" — `_error: false`, `top_3_priorities` present.
3. Approve → plan shared with team.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Weekly context requires manual update** — integrate with Linear/Jira API for automated backlog pull.
- **LLM does not have access to your actual calendar** — meeting data must be manually entered.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
