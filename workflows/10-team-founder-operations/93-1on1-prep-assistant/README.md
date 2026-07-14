# 1:1 Prep Assistant

> Generate a tailored agenda, coaching questions, and recognition moments before each 1:1 — sent to the manager only.

---

## 1. Overview

Triggered manually before a 1:1. Takes context about the team member: last meeting summary, recent work, career goals, known challenges, and topics to discuss. LLM generates: a warm opening question, agenda items with coaching questions, a specific recognition moment, and manager follow-up commitments. Sent to the manager only — no team distribution.

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 93

---

## 2. The problem

Managers often enter 1:1s without a plan, defaulting to status updates. The most effective 1:1s are coaching sessions — but preparing the right questions for each individual takes 20+ minutes. This workflow does the prep work automatically.

---

## 3. How it works

```
Manual Trigger ─→ Load Context ─→ Prepare Prompt ─→ LLM: Generate Prep ─→ Validate ─→ Format ─→ Send to Manager
```

> No approval gate — the prep is for the manager only.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Personalised agenda and coaching questions |
| SMTP Email | Basic | Yes | Deliver prep to manager |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  ONE_ON_ONE_EMAIL_TO = pm@yourcompany.com (yourself)
  AI_MODEL            = gpt-4o-mini

Step 3: Update context before each 1:1
  Edit "Load 1:1 Context" with:
  - team_member name, role, last meeting summary
  - recent_work (last sprint delivery, quality work, process contributions)
  - context.career_goal, known_challenges, team_dynamics
  - topics_to_discuss (your agenda items for the meeting)

Step 4: Run manually
  Click Manual Trigger 30 minutes before the 1:1.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `ONE_ON_ONE_EMAIL_TO` | Required | — | Manager's email (yourself) |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "team_member": "string",
  "role": "string",
  "last_meeting_summary": "string",
  "recent_work": [{ "item": "string", "type": "delivery|quality|process" }],
  "context": { "career_goal": "string", "known_challenges": "string" },
  "topics_to_discuss": ["string"]
}
```

---

## 8. Output schema

```json
{
  "opening_check_in": "string",
  "agenda_items": [{ "topic": "string", "type": "string", "suggested_questions": ["string"], "manager_action_before": "string|null" }],
  "recognition_moment": "string",
  "manager_commitments_to_follow_up": ["string"],
  "coaching_theme": "string"
}
```

---

## 9. Estimated AI cost

~1,500 tokens | gpt-4o-mini | ~$0.002/1:1 prep.

---

## 10. Privacy and security

- Individual performance notes and career conversations sent to LLM — do not include formal PIP data or HR-sensitive content.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; prep not sent |
| Email fails | Retries 3 times |

---

## 12. Customization examples

### Schedule automatically

Add a Schedule trigger that runs 30 minutes before each recurring 1:1 slot (e.g., every Tuesday at 09:30). Hardcode the team member's context in "Load 1:1 Context" for that specific person.

### Multi-person version

Duplicate the workflow for each direct report. Name each one `93a-1on1-prep-{name}` to keep them separate and manageable.

---

## 13. How to test

1. Click **Manual Trigger** — Alex Chen context loaded (recurring tasks delivery, design spec blocker).
2. "Validate LLM Output" — `_error: false`, `agenda_items` with coaching questions.
3. Manager receives prep with coaching theme and specific recognition moment.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Context must be updated manually** — no Linear/Jira integration for auto-pulling recent work.
- **One team member per run** — extend "Load 1:1 Context" with multiple members and add SplitInBatches for batch prep.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
