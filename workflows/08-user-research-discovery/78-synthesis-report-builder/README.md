# Synthesis Report Builder

> Synthesise findings from multiple research studies into a structured cross-study report — reviewed before distributing to leadership.

---

## 1. Overview

Takes key findings from multiple research studies (usability tests, surveys, interviews, analytics) and uses an LLM to identify cross-study patterns, reconcile conflicting findings, produce prioritised recommendations (with effort and evidence strength), flag open questions, and suggest next studies. Requires approval before distributing.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 78

---

## 2. The problem

After running several research studies, the findings exist in silos — a usability report, an NPS analysis, interview notes. No one synthesises across them. Product and engineering decisions are made based on the last study run, not the full body of evidence. This workflow closes that gap.

---

## 3. How it works

```
Manual Trigger ─→ Load Research Inputs ─→ Prepare Prompt ─→ LLM: Synthesise ─→ Validate ─→ Format ─→ Approval ─→ Distribute
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Cross-study synthesis |
| SMTP Email | Basic | Yes | Approval and distribution |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  SYNTHESIS_EMAIL_TO       = product@yourcompany.com
  SYNTHESIS_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL                 = gpt-4o-mini

Step 3: Feed research findings
  Edit "Load Sample Research Inputs" Code node.
  Each study needs: name, type, participant count, and an array of key findings.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `SYNTHESIS_EMAIL_TO` | Required | — | Leadership recipients |
| `SYNTHESIS_APPROVER_EMAIL` | Optional | Same as `SYNTHESIS_EMAIL_TO` | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "report_title": "string",
  "period": "string",
  "studies": [{ "study": "string", "type": "usability|survey|interviews|analytics", "participants": 5, "key_findings": ["string"] }],
  "audience": "string"
}
```

---

## 8. Output schema

```json
{
  "executive_summary": "string",
  "cross_study_patterns": [{ "pattern": "string", "confidence": "high|medium|low", "supporting_studies": ["string"], "strategic_implication": "string" }],
  "reconciled_findings": [{ "topic": "string", "what_different_studies_say": "string", "synthesis": "string" }],
  "prioritised_recommendations": [{ "recommendation": "string", "priority": "high|medium|low", "effort": "high|medium|low", "evidence_strength": "strong|moderate|weak", "rationale": "string" }],
  "open_questions": ["string"],
  "next_studies_suggested": [{ "study": "string", "why": "string" }]
}
```

---

## 9. Estimated AI cost

4 studies: ~3,000 tokens | gpt-4o-mini | ~$0.004/report.

---

## 10. Privacy and security

- Study findings (anonymised aggregates) sent to LLM. No individual participant data required.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no report sent |
| Email fails | Retries 3 times |
| Approval timeout | Report not distributed |

---

## 12. Customization examples

### Quarterly research digest

Schedule quarterly via Cron Trigger. Accumulate study findings in a Sheets/Notion database throughout the quarter. Pull the latest findings via HTTP Request and feed to the synthesiser automatically.

### PDF export

After approval, add an HTTP Request to a PDF generation service (e.g., Gotenberg, PDFShift) with the report HTML. Attach the PDF to the distribution email.

---

## 13. How to test

1. Click **Manual Trigger** — 4 studies (usability, NPS, interviews, analytics) loaded.
2. "Validate LLM Output" — `_error: false`, `cross_study_patterns` array present.
3. Approve → report distributed to leadership.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM synthesis quality depends on input quality** — provide specific, evidence-backed findings, not vague summaries.
- **Pattern confidence is LLM judgment** — treat low-confidence patterns as hypotheses.
- **Reconciliation only works if findings overlap** — studies on different topics will produce few reconciled findings.

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
