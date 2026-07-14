# Strategy Assumption Auditor

> Re-examine your strategic assumptions against new evidence quarterly — and flag any that have been contradicted before they silently drive bad decisions.

---

## 1. Overview

Reads your assumption register (embedded as sample data or from Google Sheets), feeds each assumption and its new evidence to an LLM, and asks: confirmed, weakened, or contradicted? The audit report requires human approval before it goes to leadership.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 59

---

## 2. The problem

Strategy is built on assumptions. Most teams write them down once, then never revisit them. Six months later, the market has moved, your ICP buyer has shifted, and three of your top-5 assumptions are wrong — but the strategy still runs on the old ones.

---

## 3. How it works

```
Quarterly Schedule ─┐
                     ├─→ Prepare Prompt ─→ LLM: Audit Assumptions ─→ Validate ─→ Format Report
Manual Trigger ──────┘   (Load Sample Assumptions)
                                                                                       │
                                                                          Send for Approval (email)
                                                                                       │
                                                                              Wait (48h)
                                                                                       │
                                                                                  Approved?
                                                                           ┌───────────┴──────┐
                                                                         Yes                  No
                                                                           │                    │
                                                                  Send to Leadership      Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Assumption re-assessment |
| SMTP Email | Basic | Yes | Approval and delivery |
| Google Sheets | Advanced | Optional | Read live assumption register |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  ASSUMPTION_EMAIL_TO = strategy@yourcompany.com
  AI_MODEL            = gpt-4o-mini
  ASSUMPTION_SCHEDULE = 0 9 1 1,4,7,10 *   (quarterly: Jan/Apr/Jul/Oct 1st at 09:00)

Step 3: Populate your assumption register
  For the base version: edit the "Load Sample Assumptions" Code node
  to replace the 5 sample assumptions with yours.
  
  For Google Sheets: add a Sheets read node before "Prepare Audit Prompt"
  and set ASSUMPTION_SHEET_ID env var.

Step 4: Test with Manual Trigger
  - 5 sample assumptions with realistic new evidence
  - Receive approval email → approve → report sent to leadership
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `ASSUMPTION_EMAIL_TO` | Required | — | Leadership recipient |
| `ASSUMPTION_SCHEDULE` | Optional | `0 9 1 1,4,7,10 *` | Quarterly cron |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

Each assumption in the register:

```json
{
  "id": "string",
  "assumption": "string",
  "category": "ICP | Pricing | GTM | Product | Competition | etc",
  "original_confidence": "low|medium|high",
  "last_reviewed": "YYYY-MM-DD",
  "evidence_at_creation": "string",
  "new_evidence": "string — what has changed since last review"
}
```

> [!IMPORTANT]
> The `new_evidence` field is critical. The LLM can only re-assess an assumption if it has new evidence to work with. Update this field in your assumption register before each quarterly run.

---

## 8. Output schema

```json
{
  "assessments": [
    {
      "id": "string",
      "assumption": "string",
      "verdict": "confirmed|weakened|contradicted|insufficient-evidence",
      "confidence_change": "increased|decreased|unchanged",
      "new_confidence": "low|medium|high",
      "reasoning": "string",
      "strategic_risk_if_wrong": "high|medium|low",
      "recommended_action": "string"
    }
  ],
  "assumptions_needing_action": 3,
  "summary": "string"
}
```

---

## 9. Estimated AI cost

5 assumptions: ~3,000 tokens | gpt-4o-mini | ~$0.003/run | ~$0.012/year (quarterly).

---

## 10. Privacy and security

- Assumption content and internal evidence are sent to your LLM provider.
- Do not include confidential customer names or pricing in assumption evidence if your provider does not have a data processing agreement with you.
- Report requires approval before leadership sees it.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No assumptions | Throws error; stops |
| LLM invalid JSON | Error handler; no report sent |
| Email fails | Retries 3 times |
| Approval timeout | Report not sent |

---

## 12. Customization examples

### Connect to a living assumption register in Notion

Replace "Load Sample Assumptions" with an HTTP Request to the Notion API querying a database where each page is an assumption. Map page properties to the assumption schema.

### Add a "contradicted only" filter before sending

Add an IF node after "Format Audit Report" that checks if any assessment has `verdict === 'contradicted'`. Route differently: contradicted items get a separate urgent email; confirmed items go into the routine approval queue.

### Auto-update confidence field in Google Sheets

After sending the final report, add a Google Sheets update node that writes the `new_confidence` value back to the assumption register for each assessed assumption.

---

## 13. How to test

1. Click **Manual Trigger** — 5 sample assumptions loaded.
2. Inspect "Validate LLM Output" — `_error: false`, `assessments` array populated.
3. Receive approval email → approve.
4. Report delivered to `ASSUMPTION_EMAIL_TO`.
5. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM quality depends entirely on `new_evidence` quality.** Empty or vague evidence produces "insufficient-evidence" verdicts for all assumptions.
- **No automatic evidence gathering.** You must populate `new_evidence` before each run.
- **No rollup across quarters.** Each run is independent unless you add Sheets logging.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
