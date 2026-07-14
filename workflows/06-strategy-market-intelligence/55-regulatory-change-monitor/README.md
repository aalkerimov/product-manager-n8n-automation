# Regulatory Change Monitor

> Track regulation and compliance updates in configured jurisdictions and map them to affected product areas. Urgent items go as immediate alerts; routine updates go as digests.

---

## 1. Overview

Reads regulatory feeds (RSS, gov websites) twice a week, uses an LLM to map each update to your product areas, and routes the result: high-priority items get an urgent email alert; lower-priority items go into a routine digest. No approval gate by default — the LLM's mapping is informational. If you want a legal review gate before alerts go out, see the customization section.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 55

---

## 2. The problem

Regulatory changes in AI, data privacy, and fintech move faster than most teams can track. A new FTC rule on AI-generated content, an ICO guidance update on automated decisions, or a state law taking effect in 90 days — these affect your product and you often find out late.

---

## 3. How it works

```
Schedule (Mon + Thu) ─┐
                       ├─→ Filter by Jurisdiction ─→ Prepare Prompt ─→ LLM: Map to Product Areas
Manual Trigger ────────┘   (Load Sample Changes)
                                                                              │
                                                                   Validate LLM Output
                                                                      │          │
                                                                   (pass)      (fail)
                                                                      │          │
                                                               Format Alert  Error Handler
                                                                      │
                                                              Any High Priority?
                                                             ┌────────┴─────────┐
                                                           Yes                  No
                                                            │                    │
                                                   Send Urgent Alert      Send Routine Digest
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Map changes to product areas |
| SMTP Email | Basic | Yes | Alerts and digests |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  REGULATORY_JURISDICTIONS  = US,EU,UK   (comma-separated ISO codes)
  REGULATORY_PRODUCT_AREAS  = data-privacy,ai-model-outputs,billing,user-data
  REGULATORY_EMAIL_TO       = legal@yourcompany.com
  NOTIFICATION_EMAIL_FROM   = automation@yourcompany.com
  AI_MODEL                  = gpt-4o-mini
  REGULATORY_SCHEDULE       = 0 9 * * 1,4   (Mon + Thu at 09:00)

Step 3: Add real RSS feeds (production)
  Replace the "Load Sample Changes" Code node path with HTTP Request nodes
  reading RSS from EUR-Lex, FTC.gov/news, ICO.org.uk/news, NIST.gov, etc.
  Parse feed items into the changes array format (see Input Schema).

Step 4: Test with Manual Trigger
  - Runs with 6 embedded sample changes across EU, US, US-CA
  - Check "Validate LLM Output" for mapping results
  - If any high-priority items: urgent email sent
  - Otherwise: routine digest sent
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `REGULATORY_JURISDICTIONS` | Optional | (all) | Comma-separated jurisdiction codes to filter |
| `REGULATORY_PRODUCT_AREAS` | Required | `data-privacy,ai-model-outputs,billing,user-data` | Product areas for LLM mapping |
| `REGULATORY_EMAIL_TO` | Required | — | Alert/digest recipient |
| `NOTIFICATION_EMAIL_FROM` | Optional | `automation@example.com` | Sender |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `REGULATORY_SCHEDULE` | Optional | `0 9 * * 1,4` | Run schedule |

---

## 7. Input schema

Each change in the `changes` array:

```json
{
  "id": "string",
  "title": "string",
  "source": "string — e.g. EUR-Lex, FTC.gov",
  "jurisdiction": "string — e.g. EU, US, UK, US-CA",
  "url": "string",
  "published_at": "YYYY-MM-DD",
  "summary": "string — 1-3 sentences"
}
```

---

## 8. Output schema

```json
{
  "assessed_changes": [
    {
      "id": "string",
      "title": "string",
      "jurisdiction": "string",
      "relevance": "high|medium|low|none",
      "affected_product_areas": ["string"],
      "required_action": "string",
      "deadline": "string or null",
      "confidence": "low|medium|high"
    }
  ],
  "high_priority_count": 2,
  "summary": "string"
}
```

---

## 9. Estimated AI cost

| Changes per run | Tokens (approx.) | Model | Cost |
|---|---|---|---|
| 5 changes | ~2,500 | gpt-4o-mini | ~$0.003 |
| 20 changes | ~8,000 | gpt-4o-mini | ~$0.010 |

**Assumption:** 2 runs/week = 8/month. Monthly cost under $0.10.

---

## 10. Privacy and security

- Regulatory update summaries (public information) are sent to your LLM provider.
- No customer data is processed.
- High-priority alerts send immediately without a human approval gate. Add a Wait node if you want legal review before distribution.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No changes found | Filter node returns `_skip: true`; downstream nodes do not run |
| LLM mapping fails | Error Handler catches it; no alert sent |
| Email delivery fails | n8n retries 3 times |

---

## 12. Customization examples

### Add a legal approval gate for high-priority items

Between "Format Alert" and "Send Urgent Alert", add:
1. An Email Send node with approve/reject links (as in #51)
2. A Wait node (48h timeout)
3. An IF node checking the decision

### Add more RSS sources

In production, replace "Load Sample Changes" with:
```
HTTP Request → EUR-Lex RSS → Code (parse feed items) → Merge
HTTP Request → FTC.gov RSS → Code (parse feed items) → Merge
HTTP Request → ICO.org.uk RSS → Code (parse feed items) → Merge
```

### Slack alerts for high priority

Replace "Send Urgent Alert" with an HTTP Request to Slack's `chat.postMessage`.

---

## 13. How to test

1. Click **Manual Trigger**.
2. "Filter by Jurisdiction" — confirm 6 items pass through (no jurisdiction filter set in test).
3. "Validate LLM Output" — confirm `_error: false` and `assessed_changes` populated.
4. "Any High Priority?" — routes based on `high_priority_count > 0`.
5. Check inbox for alert or digest.
6. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No real RSS feed reading in base version.** Must be added manually.
- **LLM mapping quality depends on summary length.** Very short summaries may produce low-confidence mappings.
- **No deduplication across runs.** The same regulatory update may appear in multiple bi-weekly runs.
- **Jurisdiction matching is prefix-based.** "US" matches "US" and "US-CA".

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
