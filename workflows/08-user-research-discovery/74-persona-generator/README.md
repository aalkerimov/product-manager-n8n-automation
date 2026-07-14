# Persona Generator

> Build evidence-grounded product personas from research data — reviewed before sharing with product and design.

---

## 1. Overview

Takes research inputs (interview findings, survey segments, feature analytics, behavioural data) and uses an LLM to synthesise evidence-grounded personas. Each persona includes goals, frustrations, behavioural patterns, retention signals, product implications, and the research evidence that supports it. Personas are reviewed before sharing.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 74

---

## 2. The problem

Most product personas are invented in a workshop, not derived from research. They describe fictional demographics (age, hobby, name) instead of product-relevant behaviours and motivations. This workflow forces grounding in real data and produces personas structured around retention signals and product implications.

---

## 3. How it works

```
Manual Trigger ─→ Load Research Data ─→ Prepare Prompt ─→ LLM: Generate Personas ─→ Validate ─→ Format ─→ Approval ─→ Share
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Persona synthesis |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  PERSONA_EMAIL_TO       = product@yourcompany.com
  PERSONA_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL               = gpt-4o-mini

Step 3: Feed research inputs
  Edit "Load Sample Research Data" Code node with your actual research findings.
  Each input needs: source name and key findings text.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PERSONA_EMAIL_TO` | Required | — | Product and design team recipients |
| `PERSONA_APPROVER_EMAIL` | Optional | Same as `PERSONA_EMAIL_TO` | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "product": "string",
  "research_inputs": [{ "source": "string", "findings": "string" }],
  "segments_to_personas": 3,
  "notes": "string"
}
```

---

## 8. Output schema

```json
{
  "personas": [{ "name": "string", "archetype": "string", "segment": "string", "primary_goal": "string", "secondary_goals": ["string"], "key_frustrations": ["string"], "behavioural_patterns": ["string"], "success_metric": "string", "retention_signal": "string", "product_implications": ["string"], "research_evidence": ["string"] }],
  "persona_matrix": "string"
}
```

---

## 9. Estimated AI cost

~2,000 tokens | gpt-4o-mini | ~$0.002/run.

---

## 10. Privacy and security

- Research findings (anonymised) sent to LLM.
- No individual participant data required.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no personas sent |
| Email fails | Retries 3 times |
| Approval timeout | Personas not sent |

---

## 12. Customization examples

### Export to Figma via API

After approval, POST persona JSON to the Figma REST API, creating a new page in your design library with persona cards using a pre-built component template.

### Quarterly refresh

Schedule quarterly via a cron trigger. Feed in updated NPS, interview, and analytics data. Compare new personas to previous to detect segment evolution.

---

## 13. How to test

1. Click **Manual Trigger** — ProjectFlow research data loaded.
2. "Validate LLM Output" — `_error: false`, 3 `personas` present.
3. Approve → shared with product and design.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Persona quality is proportional to research quality** — garbage in, garbage out.
- **LLM personas are not empirically validated** — treat as structured hypotheses to be validated with more research.
- **Retention signal field** requires quantitative product analytics to be meaningful — the LLM will infer from available data.

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
