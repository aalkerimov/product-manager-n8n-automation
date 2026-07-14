# Usability Test Summariser

> Extract task completion rates, systemic issues, and prioritised design recommendations from usability test notes — approved before sharing with design and product.

---

## 1. Overview

Takes structured usability test notes (tasks, per-participant outcomes and quotes) and uses an LLM to produce an executive summary, task-level severity ratings, systemic issue identification (issues spanning multiple tasks), positive findings, and prioritised design recommendations. Requires approval before sharing.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 73

---

## 2. The problem

Usability test notes are raw and unstructured. Synthesising 5 participants × 5 tasks into a shareable report takes 3–4 hours. Design and product teams often skip the synthesis and act on impressions from watching one session. This workflow produces a structured first-draft report in minutes.

---

## 3. How it works

```
Manual Trigger ─→ Load Sample Test Data ─→ Prepare Prompt ─→ LLM: Summarise ─→ Validate ─→ Format ─→ Approval ─→ Share
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Test summary generation |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  USABILITY_EMAIL_TO       = design@yourcompany.com
  USABILITY_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL                 = gpt-4o-mini

Step 3: After a usability test session
  Edit "Load Sample Test Data" Code node with your tasks, outcomes, and notes.
  Each note needs: participant ID, outcome (success/failure), and observer note.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `USABILITY_EMAIL_TO` | Required | — | Design and product team recipients |
| `USABILITY_APPROVER_EMAIL` | Optional | Same as `USABILITY_EMAIL_TO` | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "test_title": "string",
  "test_date": "YYYY-MM-DD",
  "prototype_version": "string",
  "tasks": [{
    "task_id": "T1",
    "task": "string",
    "success_rate_pct": 60,
    "avg_time_seconds": 142,
    "notes": [{ "participant": "P1", "outcome": "success|failure", "note": "string" }]
  }]
}
```

---

## 8. Output schema

```json
{
  "overall_usability_rating": "high|medium|low",
  "task_summaries": [{ "task_id": "string", "success_rate_pct": 60, "severity": "critical|major|minor", "primary_issue": "string", "key_quotes": ["string"] }],
  "systemic_issues": [{ "issue": "string", "affected_tasks": ["T1"], "severity": "string", "root_cause": "string" }],
  "positive_findings": ["string"],
  "design_recommendations": [{ "recommendation": "string", "priority": "high|medium|low", "affected_tasks": ["string"], "rationale": "string" }],
  "executive_summary": "string"
}
```

---

## 9. Estimated AI cost

3 tasks × 5 participants: ~2,500 tokens | gpt-4o-mini | ~$0.003/test.

---

## 10. Privacy and security

- Participant notes may be identifiable. Use participant codes (P1, P2), not real names.
- Ensure appropriate consent for LLM processing of session notes.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no summary sent |
| Email fails | Retries 3 times |
| Approval timeout | Summary not shared |

---

## 12. Customization examples

### Auto-import from Dovetail or EnjoyHQ

Build a webhook that receives a research note export from Dovetail and maps it to the expected task/note schema before posting to n8n.

### Video clip tagging

After "Validate LLM Output", use the `response_ids` / participant codes from issues to build a structured tagging list. Export to your research repo for video clip annotation.

---

## 13. How to test

1. Click **Manual Trigger** — 3-task, 5-participant test loaded.
2. "Validate LLM Output" — `_error: false`, `task_summaries` present.
3. Approve → summary sent to design team.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Use participant codes, not real names** — PII concern with LLM.
- **Success rates must be pre-calculated** — the workflow does not compute them from raw data.
- **LLM systemic issue identification** may miss cross-task patterns in complex multi-session tests.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
