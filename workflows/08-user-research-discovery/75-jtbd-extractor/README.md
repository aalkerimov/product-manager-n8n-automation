# Jobs-to-be-Done Extractor

> Extract functional, emotional, and social jobs from interview excerpts and research notes — reviewed before the JTBD map is shared with the team.

---

## 1. Overview

Takes raw interview quotes and research excerpts and uses an LLM to extract Jobs-to-be-Done structured following the JTBD framework: functional jobs (When [situation], I want to [motivation], so I can [outcome]), emotional jobs (Feel [emotion] when [trigger]), and social jobs (Be perceived as [attribute] by [audience]). Also identifies pain points and underserved jobs. Requires approval before sharing.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 75

---

## 2. The problem

Interview transcripts contain rich signals about what users are really trying to accomplish — but extracting structured JTBD statements from raw quotes requires JTBD expertise and significant time. Most teams skip this and build features based on feature requests rather than underlying jobs.

---

## 3. How it works

```
Manual Trigger ─→ Load Sample Excerpts ─→ Prepare Prompt ─→ LLM: Extract JTBD ─→ Validate ─→ Format ─→ Approval ─→ Share
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | JTBD extraction |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  JTBD_EMAIL_TO       = product@yourcompany.com
  JTBD_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL            = gpt-4o-mini

Step 3: Feed interview excerpts
  Edit "Load Sample Excerpts" Code node with your quotes.
  Each excerpt is a plain string — direct quote or paraphrase from a participant.
  Include source and persona context.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `JTBD_EMAIL_TO` | Required | — | Product team recipients |
| `JTBD_APPROVER_EMAIL` | Optional | Same as `JTBD_EMAIL_TO` | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "excerpts": ["string — quote or paraphrase from participant"],
  "source": "string — study name and date",
  "persona": "string — which persona/segment these excerpts are from"
}
```

---

## 8. Output schema

```json
{
  "functional_jobs": [{ "job": "When ... I want ... so I can ...", "frequency": "daily|weekly|occasional", "evidence_indexes": [1], "current_solution": "string", "underserved": true }],
  "emotional_jobs": [{ "job": "Feel ... when ...", "valence": "positive|negative", "evidence_indexes": [2], "product_implication": "string" }],
  "social_jobs": [{ "job": "Be perceived as ... by ...", "evidence_indexes": [4], "product_implication": "string" }],
  "pain_points": [{ "pain": "string", "severity": "critical|major|minor", "evidence_indexes": [1] }],
  "jtbd_summary": "string"
}
```

---

## 9. Estimated AI cost

~1,500 tokens | gpt-4o-mini | ~$0.002/extraction run.

---

## 10. Privacy and security

- Direct quotes may be identifiable — paraphrase when participants requested anonymity.
- No structured PII required in input.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no map sent |
| Email fails | Retries 3 times |
| Approval timeout | Map not shared |

---

## 12. Customization examples

### Cross-persona JTBD comparison

Run the extractor for each of your 3 personas with their respective quote sets. Then add a Code node that merges all three outputs and identifies shared vs persona-specific jobs.

### Auto-import from Otter.ai or Dovetail

Build a webhook that receives a transcript export, extracts key quotes, and posts them to this workflow's sample loader.

---

## 13. How to test

1. Click **Manual Trigger** — 9 mid-market team lead excerpts loaded.
2. "Validate LLM Output" — `_error: false`, `functional_jobs` present.
3. Approve → JTBD map shared.

---

## 14. Known limitations

- **Not runtime-tested.**
- **JTBD extraction quality depends on quote quality** — vague excerpts produce vague jobs.
- **Evidence indexes are LLM-assigned** — verify against source quotes.
- **`underserved` flag is LLM judgment** — validate with quantitative data where possible.

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
