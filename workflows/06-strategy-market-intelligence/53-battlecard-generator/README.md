# Battlecard Generator

> Turn competitor monitoring output into sales-ready battlecards with objection handling, discovery questions, and landmines — reviewed before going to sales.

---

## 1. Overview

The Battlecard Generator takes structured competitor intelligence (your product strengths, competitor claims, known objections, recent competitor moves) and produces a ready-to-use battlecard for your sales team. Output includes a win thesis, when-we-win/lose scenarios, objection handling with avoid-saying guidance, discovery questions, and landmines. Everything requires human approval before sales receives it.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 53

---

## 2. The problem

Battlecards get built once and go stale within weeks. When a competitor raises a round, cuts pricing, or ships a new feature, the battlecard is wrong. This workflow connects to your competitor monitoring output (or accepts webhook input) so battlecards can be regenerated on meaningful changes, reviewed, and distributed — not built from scratch in a slide deck at 11pm.

---

## 3. How it works

```
Manual Trigger (sample data) ─┐
                               ├─→ Validate Input ─→ Prepare Prompt ─→ LLM: Generate Battlecard
Webhook: Trigger Battlecard ───┘
                                                                              │
                                                                   Validate LLM Output
                                                                      │          │
                                                                   (pass)      (fail)
                                                                      │          │
                                                              Format Battlecard  LLM Error Handler
                                                                      │
                                                           Send Approval Request
                                                                      │
                                                            Wait for Approval (48h)
                                                                      │
                                                                  Approved?
                                                              ┌───────┴──────┐
                                                           Yes              No
                                                            │                │
                                                 Send to Sales           Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Generate battlecard content |
| SMTP Email | Basic | Yes | Approval and delivery to sales |

---

## 5. Five-minute setup

```
Step 1: Create credentials in n8n
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
     Header: Authorization: Bearer <key>
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  BATTLECARD_EMAIL_TO     = sales@yourcompany.com
  NOTIFICATION_EMAIL_FROM = automation@yourcompany.com
  AI_MODEL                = gpt-4o-mini
  OPENAI_BASE_URL         = https://api.openai.com

Step 3: Test with Manual Trigger
  - Runs with CompetitorX sample data
  - Receive approval email → click Approve
  - Battlecard delivered to BATTLECARD_EMAIL_TO

Step 4 (optional): Connect workflow #02 (Competitor Change Monitor)
  - Set that workflow's output webhook to /webhook/battlecard-generate
  - Battlecards are regenerated automatically on meaningful competitor changes
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `BATTLECARD_EMAIL_TO` | Required | — | Sales recipient email |
| `NOTIFICATION_EMAIL_FROM` | Optional | `automation@example.com` | Sender address |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM provider |

---

## 7. Input schema

POST to `/webhook/battlecard-generate`:

```json
{
  "competitor_name": "string — required",
  "competitor_category": "string — market category",
  "our_product_name": "string — required",
  "our_strengths": ["string"],
  "our_weaknesses": ["string"],
  "competitor_claims": ["string — their marketing claims"],
  "known_objections": ["string — objections from real prospects"],
  "recent_changes": ["string — funding, pricing, features"],
  "target_segment": "string"
}
```

---

## 8. Output schema

```json
{
  "headline": "string",
  "when_we_win": [{ "situation": "string", "reason": "string" }],
  "when_we_lose": [{ "situation": "string", "reason": "string" }],
  "objection_handling": [{ "objection": "string", "response": "string", "avoid_saying": "string" }],
  "discovery_questions": ["string"],
  "landmines": ["string"],
  "claims_rebuttal": [{ "their_claim": "string", "our_response": "string", "evidence": "string" }],
  "recent_changes_impact": "string",
  "confidence": "low|medium|high",
  "confidence_rationale": "string"
}
```

---

## 9. Estimated AI cost

| Input size | Tokens (approx.) | Model | Cost |
|---|---|---|---|
| Standard brief | ~2,000 | gpt-4o-mini | ~$0.002 |
| Detailed brief | ~3,500 | gpt-4o-mini | ~$0.004 |

---

## 10. Privacy and security

- Competitor intelligence (your strengths, weaknesses, objections) is sent to your LLM provider.
- The battlecard is not distributed until approved.
- Do not include confidential pricing or contract terms in the input.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Missing competitor_name or our_product_name | Validate Input throws; execution stops |
| LLM malformed JSON | Validate LLM Output routes to Error Handler |
| Email not delivered | n8n retries 3 times |
| Approval timeout (48h) | Report not sent; logged in Executions |

---

## 12. Customization examples

### Auto-trigger from Competitor Change Monitor (#02)

In workflow #02, add an HTTP Request node at the end that posts the competitor diff to `/webhook/battlecard-generate`. The Battlecard Generator runs automatically on meaningful changes.

### Save battlecards to Google Sheets

Add a Google Sheets node after "Send Battlecard to Sales" to store each approved battlecard with its timestamp and competitor name.

### Output to Notion

Replace the email send with an HTTP Request to the Notion API to create a new page in a battlecard database.

---

## 13. How to test

1. Click **Manual Trigger**.
2. Inspect "Validate LLM Output" — confirm `_error: false`.
3. Receive approval email.
4. Click Approve.
5. Battlecard delivered to `BATTLECARD_EMAIL_TO`.
6. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.** Verify node parameters after import.
- **Battlecard quality depends on input quality.** Vague strengths/weaknesses produce vague output. Be specific.
- **No versioning.** Each run creates a new battlecard. Previous versions are not compared or stored unless you add a Sheets logging step.
- **Objection handling may not match your sales style.** Edit the "Prepare Battlecard Prompt" node to add your tone guidelines.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `webhook`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
