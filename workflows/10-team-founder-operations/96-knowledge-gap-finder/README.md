# Knowledge Gap Finder

> Map your team's current skills against upcoming roadmap work, identify critical gaps, and get specific learning path recommendations — reviewed before sharing with the team.

---

## 1. Overview

Triggered manually (quarterly or before planning). Takes a team skills inventory and a list of upcoming high-priority projects with required skills. LLM identifies gaps, prioritises by impact, suggests who should learn what and how, identifies team strengths to leverage, and recommends hiring only where gaps can't be bridged internally in time.

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 96

---

## 2. The problem

Most product teams discover skill gaps when they're already in the sprint — "we need to ship this React Native feature but nobody has shipped to the App Store." This workflow surfaces those gaps before quarterly planning, so you can train, hire, or descope in time.

---

## 3. How it works

```
Manual Trigger ─→ Load Skills ─→ Prepare Prompt ─→ LLM: Gap Analysis ─→ Validate ─→ Format ─→ Approval ─→ Share with Team
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Gap identification and learning path recommendations |
| SMTP Email | Basic | Yes | Approval and team distribution |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  KNOWLEDGE_GAP_EMAIL_TO       = team@yourcompany.com
  KNOWLEDGE_GAP_APPROVER_EMAIL = pm@yourcompany.com
  AI_MODEL                     = gpt-4o-mini

Step 3: Update skills inventory
  Edit "Load Skills Inventory" with your team and their actual skills.
  Update upcoming_work with the current quarter's high-priority projects
  and their required skills.

Step 4: Run manually each quarter
  Click Manual Trigger before quarterly planning to get the gap analysis.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `KNOWLEDGE_GAP_EMAIL_TO` | Required | — | Team recipients |
| `KNOWLEDGE_GAP_APPROVER_EMAIL` | Optional | Same | Manager approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "team": [{ "name": "string", "role": "string", "skills": ["string"] }],
  "upcoming_work": [{ "title": "string", "priority": "high|medium|low", "required_skills": ["string"] }],
  "quarter": "Q3 2026"
}
```

---

## 8. Output schema

```json
{
  "gaps": [{ "skill": "string", "missing_from": ["string"], "required_for": ["string"], "priority": "critical|high|medium", "impact_if_unaddressed": "string", "learning_path": { "recommended_resource": "string", "estimated_days": 5, "who_should_lead": "string" } }],
  "strengths_to_leverage": ["string"],
  "hiring_recommendation": "string|null",
  "quarter_readiness_assessment": "string"
}
```

---

## 9. Estimated AI cost

~1,800 tokens | gpt-4o-mini | ~$0.003/quarter run. ~$0.01/year.

---

## 10. Privacy and security

- Team skills data sent to LLM — do not include salary, performance review, or HR-sensitive data.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; analysis not sent |
| Email fails | Retries 3 times |
| Approval timeout | Analysis not shared |

---

## 12. Customization examples

### Pull skills from HR tool

Add HTTP Request to your HRIS (e.g., BambooHR, Lattice) to pull team skills profiles automatically. Map to the skills schema.

### Integrate with roadmap tool

Pull upcoming projects from Linear/Jira via API. Map each project's tech requirements to the `required_skills` array.

---

## 13. How to test

1. Click **Manual Trigger** — 5-person team, 4 upcoming projects.
2. "Validate LLM Output" — gaps for React Native, LLM integration, SAML.
3. Approve → team receives gap analysis with specific learning paths.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Skills inventory requires manual maintenance** — integrate with HR tool for automation.
- **LLM does not assess skill depth** — "knows React" vs. "expert React" not distinguished.

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
