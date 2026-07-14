# Feature Request Prioritiser

> Cluster 20+ feature requests by theme, assess strategic fit, and produce an approved top-10 shortlist — moving faster from raw votes to roadmap decision.

---

## 1. Overview

Takes a list of feature requests with vote counts, segments, and sources, clusters them into themes, and uses an LLM to rank the top 10 by strategic value (not just votes). Produces a quick-wins list and a defer list. Requires approval before distribution.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 64

---

## 2. The problem

Feature request lists grow to hundreds of items. Sorting by votes gives you the most-requested, not the most valuable. Items from sales ("enterprise must-have") are mixed with community wishlist items. No one has time to read 200 requests before a planning session.

---

## 3. How it works

```
Manual Trigger ─→ Load Sample Requests ─→ Prepare Prompt ─→ LLM: Prioritise ─→ Validate ─→ Format
                                                                                                  │
                                                                                     Send for Approval
                                                                                                  │
                                                                                         Wait (48h)
                                                                                                  │
                                                                                            Approved?
                                                                                     ┌────────┴──────┐
                                                                                   Yes              No
                                                                                     │                │
                                                                           Send Report         Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Theme clustering and prioritisation |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  FEATURE_EMAIL_TO = product@yourcompany.com
  AI_MODEL         = gpt-4o-mini

Step 3: Load your real feature requests (production)
  Option A: Replace "Load Sample Requests" Code node with a Productboard API call
  Option B: Use a Google Sheets read with your feature request export
  Option C: POST via webhook from Intercom or Zendesk tags export

Step 4: Test with Manual Trigger
  - 20 embedded requests across SMB, mid-market, enterprise segments
  - Approve → top-10 shortlist distributed
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `FEATURE_EMAIL_TO` | Required | — | Report recipient |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
[{ "id": "string", "title": "string", "segment": "enterprise|mid-market|smb", "votes": 142, "source": "intercom|productboard|sales|zendesk", "created_at": "YYYY-MM-DD" }]
```

---

## 8. Output schema

```json
{
  "clusters": [{ "cluster_name": "string", "request_ids": ["string"], "theme": "string", "total_votes": 500, "primary_segment": "string" }],
  "top_10_ranked": [{ "rank": 1, "id": "string", "title": "string", "rationale": "string", "estimated_impact": "high|medium|low", "strategic_fit": "core|adjacent|opportunistic" }],
  "quick_wins": ["string"],
  "defer": ["string"],
  "confidence": "low|medium|high"
}
```

---

## 9. Estimated AI cost

20 requests: ~2,500 tokens | gpt-4o-mini | ~$0.003/run.

---

## 10. Privacy and security

- Feature request titles and metadata are sent to your LLM.
- No customer PII processed.
- Report requires approval before distribution.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No requests | LLM receives empty list; minimal output |
| LLM invalid JSON | Error handler; no report |
| Email fails | Retries 3 times |
| Approval timeout | Not sent |

---

## 12. Customization examples

### Connect to Productboard via API

Replace the sample data Code node with an HTTP Request to the Productboard Features API. Filter by status `new` or `under-consideration`. Map fields to the input schema.

### Add ARR weight to votes

If your feature request tool stores customer ARR, add an `arr_weight` multiplier to each request before sending to the LLM: `weighted_votes = votes × log(arr_usd/1000)`.

---

## 13. How to test

1. Click **Manual Trigger** — 20 requests loaded.
2. Inspect "Validate LLM Output" — `_error: false`.
3. Receive approval email → approve.
4. Top-10 shortlist delivered.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM prioritisation is advisory** — the PM must review and adjust the shortlist.
- **Votes are treated as equal across segments.** A 100-vote enterprise request may be more valuable than a 300-vote SMB request.
- **No integration with request tools out of the box.**

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
