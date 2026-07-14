# Roadmap Communication Planner

> Match roadmap items to the right stakeholder groups with the right message, channel, and timing — reviewed before the plan goes to the team.

---

## 1. Overview

Takes a list of roadmap items (with confidentiality levels and audience impact) and a stakeholder map, then uses an LLM to build a tailored communication plan. Outputs: per-stakeholder message plans, a deferral notice section, a sensitive items list, and a communication calendar. Requires approval before sharing with the product team.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 70

---

## 2. The problem

PMs spend hours figuring out "who needs to know what, and when" at the start of each quarter. The answer changes by audience: sales needs clear ETAs, customers need benefit framing, the board needs business context. The same roadmap item requires 5 different messages. This workflow generates all five.

---

## 3. How it works

```
Manual Trigger ─→ Load Roadmap Context ─→ Prepare Prompt ─→ LLM: Build Comm Plan ─→ Validate ─→ Format Plan
                                                                                                           │
                                                                                              Send for Approval
                                                                                                           │
                                                                                                   Wait (48h)
                                                                                                           │
                                                                                                     Approved?
                                                                                               ┌──────────┴──────┐
                                                                                             Yes              No
                                                                                               │                │
                                                                                    Send Comm Plan       Log Rejection
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Communication plan generation |
| SMTP Email | Basic | Yes | Approval and plan delivery |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  COMMPLAN_APPROVER_EMAIL = cpo@yourcompany.com
  COMMPLAN_EMAIL_TO       = product@yourcompany.com
  AI_MODEL                = gpt-4o-mini

Step 3: Update roadmap context
  Edit "Load Sample Roadmap Context" Code node with your Q roadmap items and stakeholder map.
  Key fields per item: title, eta, audience_impact (all/enterprise/smb), confidentiality (public/internal)

Step 4: Click Manual Trigger → review plan → approve → team receives comm plan
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `COMMPLAN_APPROVER_EMAIL` | Required | — | CPO/PM approver |
| `COMMPLAN_EMAIL_TO` | Required | — | Recipient for approved plan |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |
| `OPENAI_BASE_URL` | Optional | `https://api.openai.com` | LLM base URL |

---

## 7. Input schema

```json
{
  "quarter": "Q3 2026",
  "roadmap_items": [{ "id": "string", "title": "string", "category": "string", "eta": "YYYY-MM-DD|Q4 2026", "audience_impact": "all|enterprise|smb", "confidentiality": "public|internal" }],
  "stakeholders": [{ "group": "string", "channel": "string", "cadence": "string", "sensitivity": "high|medium|low" }],
  "context": "string"
}
```

---

## 8. Output schema

```json
{
  "communication_plan": [{ "stakeholder_group": "string", "channel": "string", "messages": [{ "roadmap_item_ids": ["string"], "message_type": "announcement|update|expectation-setting|defer-notice", "suggested_timing": "string", "key_points": ["string"], "tone": "string", "do_not_share": ["string"] }] }],
  "sensitive_items": [{ "item_id": "string", "reason": "string", "recommended_handling": "string" }],
  "deferral_notices": [{ "item": "string", "affected_groups": ["string"], "suggested_message": "string" }],
  "communication_calendar": [{ "date_or_trigger": "string", "action": "string", "groups": ["string"] }]
}
```

---

## 9. Estimated AI cost

~3,000 tokens | gpt-4o-mini | ~$0.004/quarter.

---

## 10. Privacy and security

- Internal roadmap and stakeholder maps are sent to your LLM.
- Confidentiality levels guide what the LLM excludes per audience.
- Plan requires approval before team distribution.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no plan sent |
| Email fails | Retries 3 times |
| Approval timeout | Plan not sent |

---

## 12. Customization examples

### Export to Notion

After "Send Communication Plan", add an HTTP Request to the Notion API creating a new page in your Communications database with the full plan structured as blocks.

### Send per-stakeholder drafts

After validation, split the `communication_plan` array with a SplitInBatches node and send one draft email per stakeholder group — each with only the messages relevant to them.

---

## 13. How to test

1. Click **Manual Trigger** — Q3 2026 sample loaded.
2. "Validate LLM Output" — `_error: false`, `communication_plan` array present.
3. PM receives approval email with full plan.
4. Approve → plan sent to `COMMPLAN_EMAIL_TO`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **LLM respects confidentiality flags** only through prompt instruction — not cryptographic enforcement.
- **No per-stakeholder direct sending** — base version sends the full plan to the PM team. Add SplitInBatches for individual routing.
- **Deferral notice copy is a suggestion** — review carefully before sharing with customers.

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
