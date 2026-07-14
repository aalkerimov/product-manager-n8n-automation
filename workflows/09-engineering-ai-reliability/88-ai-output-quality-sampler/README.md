# AI Output Quality Sampler

> Use an LLM to evaluate a random sample of recent AI workflow outputs across accuracy, usefulness, and format dimensions — reviewed before sharing the quality report.

---

## 1. Overview

Takes 3–10 real samples of recent AI workflow outputs (input + output pairs) and sends them to an LLM evaluator at temperature 0.1. The evaluator scores each sample on accuracy (1–5), usefulness for a PM (1–5), and format compliance (1–5). Surfaces issues (score < 4) and highlights (score = 5). Produces recommended actions for prompt improvement.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 88

---

## 2. The problem

AI outputs drift over time as models update. A prompt that produced excellent triage last month may now produce vague or malformatted outputs. This workflow catches quality degradation before it affects decisions.

---

## 3. How it works

```
Manual Trigger ─→ Load Samples ─→ Prepare Evaluation Prompt ─→ LLM: Evaluate ─→ Validate ─→ Format ─→ Approval ─→ Distribute
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Output quality evaluation |
| SMTP Email | Basic | Yes | Approval and distribution |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  QUALITY_SAMPLE_EMAIL_TO       = engineering@yourcompany.com
  QUALITY_SAMPLE_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL                      = gpt-4o-mini

Step 3: Add your samples
  Edit "Load Output Samples": replace sample outputs with real recent outputs from your workflows.
  Select 3-5 outputs per run. Keep samples < 500 tokens each.

Step 4: Run weekly
  Add a Schedule Trigger (e.g., every Friday) and activate the workflow.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `QUALITY_SAMPLE_EMAIL_TO` | Required | — | Engineering and PM recipients |
| `QUALITY_SAMPLE_APPROVER_EMAIL` | Optional | Same as above | Approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM evaluator model |

---

## 7. Input schema

```json
{
  "samples": [{ "sample_id": "S001", "workflow": "string", "input": "string", "output": {}, "criteria": ["string"] }],
  "evaluator_model": "gpt-4o-mini"
}
```

---

## 8. Output schema

```json
{
  "evaluations": [{ "sample_id": "string", "workflow": "string", "accuracy_score": 5, "usefulness_score": 5, "format_score": 5, "overall_score": 5.0, "issues": ["string"], "highlights": ["string"] }],
  "quality_summary": "string",
  "recommended_actions": ["string"],
  "meta": { "sample_count": 3, "avg_overall_score": 4.7, "low_quality_count": 0 }
}
```

---

## 9. Estimated AI cost

3 samples: ~3,000 tokens | gpt-4o-mini | ~$0.004/run.

---

## 10. Privacy and security

- Sample outputs sent to LLM — do not include real PII in samples. Anonymise as needed.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; report not sent |
| Email fails | Retries 3 times |
| Approval timeout | Report not distributed |

---

## 12. Customization examples

### Random sampling from n8n execution history

Add a Code node that connects to n8n's internal API (`GET /executions`) to retrieve recent workflow outputs and randomly select 5 for evaluation. This makes the sampler fully automated.

### Quality score trend tracking

After approval, write each evaluation's average score to a Google Sheet with the date. Chart week-over-week quality trends to detect systematic drift.

---

## 13. How to test

1. Click **Manual Trigger** — 3 samples loaded (bug triage, survey analyser, JTBD).
2. "Validate LLM Output" — `_error: false`, `evaluations` present.
3. Approve → quality report with average score and per-workflow detail distributed.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM-as-evaluator has inherent biases** — treat scores as directional signals, not ground truth.
- **Samples must be loaded manually** — add n8n execution API integration for automated sampling.
- **No trend storage** — add persistence layer for week-over-week comparisons.

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
