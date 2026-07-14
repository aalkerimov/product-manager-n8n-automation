# Funding and M&A Tracker

> Detect competitor funding rounds, acquisitions, and key hires with implications for positioning — reviewed before distribution.

---

## 1. Overview

Reads weekly funding and M&A news for configured competitors, uses an LLM to assess positioning implications, and sends an approved alert to the strategy team. Covers funding rounds, acquisitions, and key executive hires.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 57

---

## 2. The problem

A competitor's $80M Series C and VP Enterprise Sales hire tells you they are about to move upmarket and increase outbound. If your sales team does not know this until a prospect mentions it, you are reacting instead of preparing.

---

## 3. How it works

```
Weekly Tuesday Schedule ─┐
                          ├─→ Prepare Prompt ─→ LLM: Assess Implications ─→ Validate ─→ Format
Manual Trigger ───────────┘   (Load Sample Events)
                                                                                           │
                                                                              Send for Approval
                                                                                           │
                                                                               Wait (48h)
                                                                                           │
                                                                                     Approved?
                                                                              ┌────────────┴────┐
                                                                            Yes                No
                                                                              │                  │
                                                                     Send Final Report    Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Implications analysis |
| SMTP Email | Basic | Yes | Approval and delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  FUNDING_EMAIL_TO    = strategy@yourcompany.com
  FUNDING_COMPETITORS = CompetitorX,CompetitorY
  FUNDING_SCHEDULE    = 0 9 * * 2   (Tuesday 09:00)
  AI_MODEL            = gpt-4o-mini

Step 3: Add real news sources (production)
  Replace "Load Sample Events" with HTTP Request nodes to:
  - Crunchbase News RSS: https://techcrunch.com/tag/fundings-exits/feed/
  - TechCrunch RSS filtered by competitor names
  Parse results into the events array format.

Step 4: Test with Manual Trigger
  - 4 sample events: CompetitorX Series C, CompetitorY acquisition, key hire, new entrant seed
  - Receive approval email → approve
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `FUNDING_EMAIL_TO` | Required | — | Alert recipient |
| `FUNDING_COMPETITORS` | Required | `CompetitorX,CompetitorY` | Comma-separated competitor names to track |
| `FUNDING_SCHEDULE` | Optional | `0 9 * * 2` | Tuesday 09:00 |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "events": [
    {
      "id": "string",
      "type": "funding | acquisition | key_hire",
      "company": "string",
      "amount_usd": 80000000,
      "round": "Series C",
      "investors": ["string"],
      "acquired": "string (for acquisitions)",
      "hire_name": "string (for key_hire)",
      "hire_role": "string (for key_hire)",
      "date": "YYYY-MM-DD",
      "source": "string",
      "url": "string",
      "notes": "string"
    }
  ]
}
```

---

## 8. Output schema

```json
{
  "event_assessments": [{ "id": "string", "company": "string", "event_type": "string", "significance": "high|medium|low", "positioning_implications": "string", "estimated_timeline_impact": "string", "recommended_response": "string" }],
  "aggregate_signal": "string",
  "our_biggest_risk": "string",
  "our_biggest_opportunity": "string",
  "confidence": "low|medium|high"
}
```

---

## 9. Estimated AI cost

4 events/run: ~2,000 tokens | gpt-4o-mini | ~$0.002/run | ~$0.008/month.

---

## 10. Privacy and security

- Publicly available news about competitors is sent to your LLM.
- No internal data processed.
- Report requires approval before distribution.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No events | Throws error; stops |
| LLM invalid JSON | Error handler; no report |
| Email fails | Retries 3 times |
| Approval timeout | Not sent |

---

## 12. Customization examples

### Add LinkedIn monitoring for key hires

Use an HTTP Request to LinkedIn's public profile RSS (if available) or a Google News search RSS for `"competitor name" site:linkedin.com`.

### Slack notification for high-significance events

After "Format Report", add an IF node checking for `significance === 'high'` in any event_assessment, then post to Slack before the approval email.

---

## 13. How to test

1. Click **Manual Trigger** — 4 events loaded.
2. Inspect "Validate LLM Output" — `_error: false`.
3. Receive approval email → approve.
4. Report delivered with assessment per event plus aggregate signal.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No real news fetching.** Must add RSS/API sources for production.
- **Key hire detection depends on news coverage.** Senior hires not covered by press will be missed.
- **No deduplication.** Same funding round may appear in multiple weekly reports.

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
