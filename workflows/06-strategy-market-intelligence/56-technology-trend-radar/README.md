# Technology Trend Radar

> Scan launches, papers, and community discussions in your domain and produce a weekly "so what for us" digest — reviewed before it goes to the team.

---

## 1. Overview

Collects technology signals from configured RSS feeds and community sources, uses an LLM to identify relevance and practical implications for your product, and produces a concise weekly digest. Every digest requires human approval before the team receives it.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 56

---

## 2. The problem

Technology moves faster than most teams can track. New model releases, developer tool updates, and community discussions that are relevant to your roadmap happen constantly. Without a system, you either spend 3 hours reading feeds or miss things that matter.

---

## 3. How it works

```
Weekly Friday Schedule ─┐
                         ├─→ Prepare Prompt ─→ LLM: Generate Digest ─→ Validate ─→ Format
Manual Trigger ──────────┘   (Load Sample Signals)
                                                                                      │
                                                                           Send for Approval
                                                                                      │
                                                                            Wait (48h)
                                                                                      │
                                                                                 Approved?
                                                                           ┌──────────┴──────┐
                                                                         Yes                No
                                                                           │                  │
                                                                  Send Approved Digest    Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | "So what for us" analysis |
| SMTP Email | Basic | Yes | Approval and digest delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  TREND_EMAIL_TO      = product@yourcompany.com
  TREND_DOMAINS       = AI, developer tools, data infrastructure
  TREND_SCHEDULE      = 0 8 * * 5   (Friday 08:00)
  AI_MODEL            = gpt-4o-mini

Step 3: Add real signal sources (production)
  Replace "Load Sample Signals" Code node with HTTP Request nodes:
  - Hacker News Algolia API: https://hn.algolia.com/api/v1/search_by_date?query=<TOPIC>&tags=story
  - arXiv RSS: https://export.arxiv.org/rss/cs.AI
  - TechCrunch RSS: https://techcrunch.com/feed/
  Parse each into the signals array format (see Input Schema).

Step 4: Test with Manual Trigger
  - 7 embedded sample signals across AI models, developer tools, data engineering
  - Receive approval email → approve → digest sent
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `TREND_EMAIL_TO` | Required | — | Digest recipient |
| `TREND_DOMAINS` | Required | `AI, developer tools, data infrastructure` | Your domain focus (used in LLM prompt) |
| `TREND_SCHEDULE` | Optional | `0 8 * * 5` | Friday 08:00 cron |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "signals": [
    {
      "id": "string",
      "title": "string",
      "source": "string",
      "category": "string",
      "url": "string",
      "published_at": "YYYY-MM-DD",
      "excerpt": "string — 1-3 sentences"
    }
  ],
  "total": 7,
  "period": "week of YYYY-MM-DD to YYYY-MM-DD"
}
```

---

## 8. Output schema

```json
{
  "headline_insight": "string",
  "signals_analysed": [{ "id": "string", "title": "string", "category": "string", "relevance_to_us": "high|medium|low", "so_what": "string", "recommended_response": "investigate|monitor|ignore|act", "confidence": "string" }],
  "watch_list": ["string"],
  "actions_to_consider": [{ "action": "string", "urgency": "now|soon|later" }],
  "confidence_overall": "string",
  "what_we_dont_know": ["string"]
}
```

---

## 9. Estimated AI cost

7 signals per run: ~2,500 tokens | gpt-4o-mini | ~$0.003/run | ~$0.012/month (weekly).

---

## 10. Privacy and security

- Signal excerpts (public content from feeds) are sent to your LLM provider.
- No internal or customer data is processed.
- Digest requires approval before distribution.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No signals | Prepare Prompt throws; execution stops |
| LLM output invalid | Error Handler; no digest sent |
| Email fails | n8n retries 3 times |
| Approval timeout | Report not sent |

---

## 12. Customization examples

### Add Hacker News API

```javascript
// HTTP Request node: GET https://hn.algolia.com/api/v1/search_by_date?query=llm+production&tags=story&numericFilters=points>50
// Parse hits array into signals format
```

### Increase signal count

Adjust the Hacker News or arXiv query to return more results. The LLM handles up to ~50 signals before quality degrades; split into batches for larger volumes.

---

## 13. How to test

1. Click **Manual Trigger** — 7 sample signals loaded.
2. Inspect "Validate LLM Output" — confirm `_error: false`.
3. Receive approval email → approve.
4. Digest delivered with headline insight, per-signal so-what, and action items.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No real feed reading in base version.** Must be added manually.
- **LLM "so what" depends on TREND_DOMAINS accuracy.** Vague domains produce generic analysis.
- **No deduplication across weeks.** Same signal may appear in multiple digests.

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
