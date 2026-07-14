# Participant Recruitment Screener

> Score and filter research participant applicants against study criteria — reviewed before sending the outreach list to the researcher.

---

## 1. Overview

Takes participant screener responses and evaluates each applicant against configurable criteria (company size, role, product usage duration, weekly activity, willingness to interview). Uses deterministic code scoring — no LLM. Sends a qualified list for approval before the researcher contacts anyone.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 77

---

## 2. The problem

Screening participants manually wastes 1–2 hours per study. Researchers review spreadsheets of form responses, checking each against criteria by hand. This workflow automates the scoring in seconds and shows the researcher exactly who qualifies and why each rejected applicant failed.

---

## 3. How it works

```
Manual Trigger (sample) ─┐
                          ├─→ Score Applicants ─→ Any Qualified? ─→ Format Results ─→ Approval ─→ Send Outreach List
Webhook: Screener Form ───┘
```

> **No LLM.** Applicant scoring is deterministic rule evaluation.

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
  SCREENER_EMAIL_TO       = research@yourcompany.com
  SCREENER_APPROVER_EMAIL = pm@yourcompany.com (if different)

Step 3: Configure criteria
  Edit "Load Sample Applicants" Code node → update criteria object with your study requirements.
  Fields: min_company_size, max_company_size, required_roles, min_months_using, min_weekly_tasks, willing_to_interview

Step 4: Feed applicants
  Option A: Edit "Load Sample Applicants" with your applicant list.
  Option B: POST to /webhook/screen-participant with applicants array and criteria.
  
  Typeform / Google Forms integration:
  - Trigger on new submission
  - Map form fields to the applicant schema
  - POST batched or individual applicants to n8n
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `SCREENER_EMAIL_TO` | Required | — | Researcher recipients |
| `SCREENER_APPROVER_EMAIL` | Optional | Same as `SCREENER_EMAIL_TO` | PM approver |

---

## 7. Input schema

```json
{
  "applicants": [{ "id": "A001", "name": "string", "company_size": 45, "role": "string", "months_using_our_product": 4, "weekly_tasks": 38, "willing_to_interview": true, "timezone": "UTC+2", "email": "string" }],
  "criteria": { "min_company_size": 20, "max_company_size": 500, "required_roles": ["string"], "min_months_using": 3, "min_weekly_tasks": 20, "willing_to_interview": true },
  "study_name": "string"
}
```

---

## 8. Output schema

```json
{
  "qualified": [{ "id": "string", "role": "string", "company_size": 45, "screening": { "qualifies": true, "score_pct": 100, "checks": {} } }],
  "rejected": [{ "id": "string", "screening": { "qualifies": false, "checks": {}, "passed_count": 3 } }],
  "meta": { "total": 5, "qualified_count": 3, "rejected_count": 2, "checked_at": "ISO8601" }
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- Applicant PII (name, email) in n8n execution data.
- Do not log executions with PII if n8n is shared — toggle `saveManualExecutions` off in production.
- Send outreach list only to the researcher, not to the broader team.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No qualified applicants | "Log No Qualified" node; no email sent to researcher |
| Email fails | Retries 3 times |
| Approval timeout | Outreach list not sent |

---

## 12. Customization examples

### Typeform webhook integration

In Typeform, set a webhook for each form submission. Map the submission to the applicant schema in a Code node and POST to `/webhook/screen-participant`. Run individual or batched.

### Scoring with weighted criteria

Extend the "Score Applicants" Code node to add a `weight` per criterion. Compute a weighted score percentage and use a threshold (e.g. 80%) rather than requiring all criteria to pass.

---

## 13. How to test

1. Click **Manual Trigger** — 5 applicants loaded.
2. "Score Applicants" — `qualified_count` matches expected (A001, A003, A005 qualify).
3. Approval email with qualified list sent.
4. Approve → researcher receives outreach list.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Applicant PII is in execution data** — review n8n data retention settings.
- **Criteria are binary** — no partial credit or weighted scoring in base version.
- **`previous_tool` not included in scoring** — add to criteria if your study requires switchers from a specific tool.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `webhook`, `code`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
