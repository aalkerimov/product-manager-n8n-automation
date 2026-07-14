# Founder Network Nurturer

> Score your network contacts by outreach urgency, draft personalised outreach for overdue relationships, and review drafts before sending anything.

---

## 1. Overview

Runs every Monday at 8am. Takes a contact list with last-contact dates, cadence targets, and relationship context. Computes urgency score (days overdue × priority weight). LLM drafts personalised 3–5 sentence outreach messages for overdue contacts, framed warmly, not transactionally. Approval gate before the draft list is delivered to you — **the workflow never sends messages directly.** You send them manually after reviewing.

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 98

---

## 2. The problem

Founder networks decay. You mean to follow up with the Series B advisor, the potential enterprise buyer intro, and the technical advisor from March — but the week swallows it. This workflow makes relationship maintenance a weekly ritual with zero research overhead.

---

## 3. How it works

```
Schedule (Mon 8am) ─┐
                     ├─→ Load Contacts ─→ Prioritise ─→ LLM: Draft Outreach ─→ Validate ─→ Format ─→ Approval → Mark Reviewed
Manual Trigger ──────┘
```

> **No messages sent automatically.** Drafts go to you for personalisation and manual sending.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Personalised outreach drafts |
| SMTP Email | Basic | Yes | Deliver draft list for review |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  NETWORK_EMAIL_TO = founder@yourcompany.com (yourself)
  AI_MODEL         = gpt-4o-mini

Step 3: Add your contacts
  Edit "Load Network Contacts". For each contact:
  - name, role, relationship type, last_contact (YYYY-MM-DD)
  - outreach_cadence_days: how often to reach out (e.g., 45 for investors)
  - context: what you last discussed, what they offered
  - current_news: any recent news about them (funding, launch, etc.)
  - priority: high|medium|low

Step 4: Update my_context
  - name, company, recent_win, looking_for (what you need from your network)
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `NETWORK_EMAIL_TO` | Required | — | Your email |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "contacts": [{ "name": "string", "role": "string", "relationship": "peer|investor_adjacent|technical_advisor|competitor_friendly", "last_contact": "YYYY-MM-DD", "outreach_cadence_days": 60, "context": "string", "current_news": "string|null", "priority": "high|medium|low" }],
  "my_context": { "name": "string", "company": "string", "recent_win": "string", "looking_for": "string" }
}
```

---

## 8. Output schema

```json
{
  "outreach_list": [{ "name": "string", "channel": "LinkedIn|Email|Twitter", "draft_message": "string", "ask_or_offer": "string", "why_now": "string" }],
  "skip_list": [{ "name": "string", "reason": "string" }],
  "weekly_networking_goal": "string"
}
```

---

## 9. Estimated AI cost

~1,500 tokens | gpt-4o-mini | ~$0.002/week. ~$0.10/month.

---

## 10. Privacy and security

- Contact names, relationship context, and personal notes sent to LLM — do not include legally sensitive conversations (term sheets, NDAs).
- Sent to your email only.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; drafts not sent |
| No overdue contacts | Still runs — LLM receives empty to_contact list; returns empty outreach_list |
| Email fails | Retries 3 times |
| Draft not approved | Discarded; no messages sent |

---

## 12. Customization examples

### CRM integration

Add HTTP Request to HubSpot/Pipedrive to pull contacts with `last_contact_date` and custom `outreach_cadence` property. Map to the contacts schema automatically.

### News peg automation

Add HTTP Request to a news aggregator (e.g., NewsAPI, Crunchbase API) to auto-populate `current_news` for contacts based on their company name.

---

## 13. How to test

1. Click **Manual Trigger** — 4 contacts: 3 overdue (Sarah Chen 95d, Marcus Obi 55d, James Walton 180d).
2. "Prioritise & Prepare Drafts" — sorted by urgency score.
3. Approve → you receive personalised draft outreach for Sarah (Series B congrats), Marcus (investor follow-up), James (competitor friendly).

---

## 14. Known limitations

- **Not runtime-tested.**
- **Does not send messages** — drafts must be personalised and sent manually.
- **Contact data manually maintained** — integrate with CRM for production use.
- **No news peg automation** — `current_news` must be manually entered.

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
