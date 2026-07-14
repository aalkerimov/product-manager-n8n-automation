# Interview Question Generator

> Generate a structured, unbiased interview guide from a research brief — reviewed before being shared with the research team.

---

## 1. Overview

Takes a research goal, participant profile, topic areas, duration, and format, and uses an LLM to produce a complete, semi-structured interview guide. Includes screener questions, warm-up, topic sections with probes, closing questions, a do-not-ask list, and an analysis framework. Requires approval before sharing.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 71

---

## 2. The problem

Writing a quality interview guide takes 2–4 hours — understanding how to avoid leading questions, how to structure probes, how to balance time across topics. Most PM-written guides either miss topics or ask biased questions. This workflow produces a research-quality first draft in seconds.

---

## 3. How it works

```
Manual Trigger (sample) ─┐
                          ├─→ Prepare Prompt ─→ LLM: Generate Guide ─→ Validate ─→ Format Guide
Webhook: Research Request ┘
                                                                                            │
                                                                               Send for Approval
                                                                                            │
                                                                                    Wait (48h)
                                                                                            │
                                                                                      Approved?
                                                                                 ┌─────────┴──────┐
                                                                               Yes              No
                                                                                 │                │
                                                                      Share with Team      Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Interview guide generation |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  INTERVIEW_EMAIL_TO       = research@yourcompany.com
  INTERVIEW_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL                 = gpt-4o-mini

Step 3: Submit research brief
  Option A: Edit "Load Sample Research Brief" Code node with your research goal
  Option B: POST to /webhook/generate-interview-guide:
  {
    "research_goal": "string",
    "interview_type": "discovery|validation|usability",
    "participant_profile": "string",
    "topic_areas": ["string"],
    "duration_minutes": 45,
    "format": "semi-structured",
    "researcher_note": "string"
  }

Step 4: PM receives guide for review → approves → sent to research team
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `INTERVIEW_EMAIL_TO` | Required | — | Research team recipients |
| `INTERVIEW_APPROVER_EMAIL` | Optional | Same as `INTERVIEW_EMAIL_TO` | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "research_goal": "string",
  "interview_type": "discovery|validation|usability",
  "participant_profile": "string",
  "topic_areas": ["string"],
  "duration_minutes": 45,
  "format": "semi-structured|structured|unstructured",
  "researcher_note": "string"
}
```

---

## 8. Output schema

```json
{
  "interview_title": "string",
  "estimated_duration_minutes": 45,
  "screener_questions": ["string"],
  "warm_up_questions": ["string"],
  "sections": [{ "section_title": "string", "section_goal": "string", "estimated_time_minutes": 8, "questions": [{ "question": "string", "type": "open|probe|hypothetical", "probes": ["string"] }] }],
  "closing_questions": ["string"],
  "do_not_ask": ["string"],
  "analysis_framework": "string"
}
```

---

## 9. Estimated AI cost

~2,500 tokens | gpt-4o-mini | ~$0.003/guide.

---

## 10. Privacy and security

- Research goal and participant profile are sent to your LLM.
- No participant PII processed.
- Guide requires approval before distribution.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no guide sent |
| Email fails | Retries 3 times |
| Approval timeout | Guide not sent |

---

## 12. Customization examples

### Store guides in Notion

After approval, add an HTTP Request to the Notion API creating a new page in your Research database with the guide sections structured as blocks.

### Connect to Calendly for participant scheduling

After sharing the guide, add an HTTP Request to Calendly creating a new scheduling event type linked to the interview.

---

## 13. How to test

1. Click **Manual Trigger** — switching motivation research brief loaded.
2. "Validate LLM Output" — `_error: false`, `sections` array present.
3. Receive approval email with full guide.
4. Approve → sent to `INTERVIEW_EMAIL_TO`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM question quality varies** — always review for leading language before use.
- **`do_not_ask` enforcement is prompt-based**, not structural — researchers must follow manually.
- **No participant recruitment** — connect to Calendly or User Interviews platform for scheduling.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `webhook`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
