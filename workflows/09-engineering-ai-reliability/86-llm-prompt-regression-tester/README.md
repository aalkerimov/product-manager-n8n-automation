# LLM Prompt Regression Tester

> Run a test suite of prompts against your LLM and assert on output structure and content — reviewed before sharing regression results with engineering.

---

## 1. Overview

Maintains a library of test cases (system prompt + user prompt + assertions). Runs each against the configured LLM and checks outputs using field-level assertions: `equals`, `contains`, `min_length`. Reports pass/fail per test case with per-assertion detail. Requires approval before sharing results.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 86

---

## 2. The problem

LLM prompt changes often break subtle output format requirements that aren't caught until a downstream workflow fails. This workflow provides a lightweight regression suite that catches prompt regressions before deployment.

---

## 3. How it works

```
Manual Trigger ─→ Load Test Suite ─→ Run Regression Tests ─→ Format Report ─→ Approval ─→ Send to Engineering
```

> **Note:** The "Run Regression Tests" node uses simulated responses in sample mode. For production, replace with HTTP Request nodes that call the LLM for each test case and check real outputs.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes (for production) | Run prompts and check outputs |
| SMTP Email | Basic | Yes | Approval and results notification |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  REGRESSION_EMAIL_TO       = engineering@yourcompany.com
  REGRESSION_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL                  = gpt-4o-mini

Step 3: Add your test cases
  Edit "Load Test Suite" with your actual prompts and assertions.

Step 4: Enable real LLM calls
  In "Run Regression Tests": replace the simulated_responses map with an HTTP Request
  to the OpenAI API for each test case. Parse response, run assertions, collect results.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `REGRESSION_EMAIL_TO` | Required | — | Engineering recipients |
| `REGRESSION_APPROVER_EMAIL` | Optional | Same as above | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model to test |

---

## 7. Input schema

```json
{
  "test_suite": [{ "id": "T001", "prompt_name": "string", "system_prompt": "string", "user_prompt": "string", "assertions": [{ "field": "string", "equals": "P0", "contains": "string", "min_length": 30, "required": true }] }],
  "model": "gpt-4o-mini",
  "run_id": "string"
}
```

---

## 8. Output schema

```json
{
  "results": [{ "id": "string", "prompt_name": "string", "passed": true, "response": {}, "assertion_results": [{ "field": "string", "checks": [{ "check": "string", "passed": true }], "passed": true }] }],
  "meta": { "total": 3, "passed": 3, "failed": 0 }
}
```

---

## 9. Estimated AI cost

Depends on test suite size. 3 simple prompts: ~500 tokens | gpt-4o-mini | ~$0.001/run.

---

## 10. Privacy and security

- Test prompts sent to LLM — do not include real PII in test cases.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM response malformed | Assertion fails for that test case |
| Email fails | Retries 3 times |
| Approval timeout | Report not sent |

---

## 12. Customization examples

### Schedule before each deployment

Trigger this workflow from your CI/CD pipeline (GitHub Actions → POST to n8n webhook). Fail the deployment if `meta.failed > 0`.

### Add golden-output comparison

Store expected full outputs in a database (e.g., Airtable). After each LLM call, compare with a cosine similarity check (using embeddings) to catch semantic drift, not just structural failures.

---

## 13. How to test

1. Click **Manual Trigger** — 3 test cases loaded with simulated responses.
2. "Run Regression Tests" — `meta.passed: 3`, `meta.failed: 0`.
3. Approve → engineering receives 3/3 pass report.

---

## 14. Known limitations

- **Not runtime-tested.**
- **"Run Regression Tests" uses simulated responses** — replace with real HTTP Request loop for production.
- **Assertions are structural, not semantic** — `contains` and `equals` don't catch subtle output drift.
- **No parallel execution** — tests run sequentially in sample mode. For large suites, use SplitInBatches.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `code`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
