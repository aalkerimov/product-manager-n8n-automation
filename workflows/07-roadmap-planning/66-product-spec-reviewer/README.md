# Product Spec Reviewer

> Run every product spec through a structured PM checklist before engineering picks it up — reviewed and approved before the feedback reaches the author.

---

## 1. Overview

Takes a product spec document (problem statement, user stories, success metrics, scope, open questions, technical considerations, launch plan) and reviews it against a PM quality checklist using an LLM. The review covers what is strong, what has critical gaps, and whether the spec is ready for engineering. A PM approves the review before it is sent to the spec author.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 66

---

## 2. The problem

Most spec reviews are informal or skipped entirely. Engineering picks up underspecified work, discovers ambiguities mid-sprint, and scope creeps. A structured review gate — even an AI-assisted one — catches obvious gaps before they become expensive sprint disruptions.

---

## 3. How it works

```
Manual Trigger (sample) ─┐
                          ├─→ Prepare Prompt ─→ LLM: Review Spec ─→ Validate ─→ Format Review
Webhook: Spec Submission ─┘
                                                                                        │
                                                                          Send for PM Approval
                                                                                        │
                                                                               Wait (48h)
                                                                                        │
                                                                                  Approved?
                                                                            ┌─────────┴──────┐
                                                                          Yes               No
                                                                            │                 │
                                                                  Send to Author       Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | PM checklist review |
| SMTP Email | Basic | Yes | Approval and author feedback |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  SPEC_EMAIL_TO       = pm-lead@yourcompany.com (approver)
  SPEC_AUTHOR_EMAIL   = spec-author@yourcompany.com (if different from approver)
  AI_MODEL            = gpt-4o-mini

Step 3: Submit specs via webhook (production)
  POST /webhook/review-spec with body:
  { "spec": { "title": "string", "author": "string", "version": "string", "sections": { ... } } }

  Integration options:
  - Notion: Trigger on spec page status change → format and POST
  - Confluence: Webhook on page update → POST to n8n
  - Manual: Engineer pastes spec JSON in a Slack slash command → n8n

Step 4: Test with Manual Trigger
  - Sample recurring tasks spec
  - Review feedback → PM approves → sent to author
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `SPEC_EMAIL_TO` | Required | — | PM approver email |
| `SPEC_AUTHOR_EMAIL` | Optional | Same as `SPEC_EMAIL_TO` | Spec author email for feedback delivery |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "spec": {
    "title": "string",
    "author": "string",
    "version": "0.3",
    "sections": {
      "problem_statement": "string",
      "user_stories": ["string"],
      "success_metrics": ["string"],
      "scope_in": ["string"],
      "scope_out": ["string"],
      "open_questions": ["string"],
      "technical_considerations": "string",
      "launch_plan": "string"
    }
  }
}
```

---

## 8. Output schema

```json
{
  "overall_quality": "strong|adequate|needs-work|incomplete",
  "checklist": [{ "item": "string", "status": "pass|partial|fail", "comment": "string" }],
  "strengths": ["string"],
  "critical_gaps": ["string"],
  "suggested_improvements": ["string"],
  "ready_for_engineering": true,
  "reviewer_summary": "string"
}
```

---

## 9. Estimated AI cost

1 spec: ~2,500 tokens | gpt-4o-mini | ~$0.003/spec.

---

## 10. Privacy and security

- Spec content (internal product strategy) is sent to your LLM provider.
- Ensure appropriate data processing agreements.
- Review requires PM approval before going to the author.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no review sent |
| Email fails | Retries 3 times |
| Approval timeout | Review not sent |

---

## 12. Customization examples

### Score specs numerically

After validating, add a Code node that counts `pass` / `partial` / `fail` items and computes a score (e.g., pass=2, partial=1, fail=0). Block engineering pickup if score < 70%.

### Auto-create review ticket in Jira

After "Send Feedback to Author", add an HTTP Request to the Jira API creating a sub-task on the feature epic: "Address spec review feedback — ENG-XXX".

### Trigger from Notion status change

Build a Notion automation that calls the n8n webhook when a spec document moves to "In Review" status.

---

## 13. How to test

1. Click **Manual Trigger** — recurring tasks spec loaded.
2. "Validate LLM Output" — `_error: false`, `checklist` populated.
3. PM receives approval email with full review.
4. Approve → feedback sent to `SPEC_AUTHOR_EMAIL`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM review is advisory, not deterministic** — a human PM must validate before blocking engineering.
- **No spec history or version comparison** — each run is independent.
- **Checklist items are LLM-defined** — not a fixed, organization-specific checklist.

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
