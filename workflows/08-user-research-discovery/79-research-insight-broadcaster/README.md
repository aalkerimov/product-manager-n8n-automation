# Research Insight Broadcaster

> Package a research insight into audience-appropriate versions for engineering, design, sales, and all-hands — reviewed before sending.

---

## 1. Overview

Takes a single research insight and a set of pre-written audience-specific summaries (engineering, design, sales, all-hands), and formats each into a broadcast message with appropriate urgency framing. Uses deterministic code formatting — no LLM. Requires approval before sending.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 79

---

## 2. The problem

Research insights get trapped with the PM. Engineering gets a Slack mention. Design never hears about it. Sales keeps pitching with outdated talking points. This workflow ensures a single insight is packaged appropriately for each audience and sent — with mandatory approval so nothing accidentally goes to all-hands.

---

## 3. How it works

```
Manual Trigger ─→ Load Sample Insight ─→ Format Broadcast Messages ─→ Send for Approval ─→ Wait (48h) ─→ Approved? ─→ Send Broadcast
```

> **No LLM.** Message formatting is deterministic code. The audience summaries are PM-authored in the input.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Approval and broadcast |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  BROADCAST_EMAIL_TO       = team@yourcompany.com (combined distribution list or per-group routing)
  BROADCAST_APPROVER_EMAIL = pm@yourcompany.com

Step 3: Author your insight
  Edit "Load Sample Insight" Code node with your insight and per-audience summaries.
  
  To send per-group emails:
  - After "Approved?", add a SplitInBatches node
  - Each batch item targets a specific group email address
  - Add a Send Email node that reads the batch item's subject and body
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `BROADCAST_EMAIL_TO` | Required | — | Broadcast recipients |
| `BROADCAST_APPROVER_EMAIL` | Optional | Same as `BROADCAST_EMAIL_TO` | PM approver |

---

## 7. Input schema

```json
{
  "insight_title": "string",
  "source_study": "string",
  "insight_type": "string",
  "core_insight": "string",
  "implication": "string",
  "confidence": "high|medium|low",
  "action_required": true,
  "audiences": [{ "group": "string", "summary": "string — PM-authored per-audience version", "urgency": "high|normal" }]
}
```

---

## 8. Output schema

```json
{
  "formatted_messages": [{ "group": "string", "urgency": "string", "subject": "string", "body": "string" }],
  "meta": { "broadcast_count": 4, "generated_at": "ISO8601" }
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- Insight content must be anonymised before broadcasting.
- Review audience list carefully before approval — all-hands messages go wide.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Email fails | Retries 3 times |
| Approval timeout | Broadcast not sent |

---

## 12. Customization examples

### Per-group email routing

After "Approved?", add a SplitInBatches node (batch size 1). For each item, read `$json.group` to look up the group's email list from an environment variable or HTTP Request to your directory. Send each formatted message to the correct list.

### Slack broadcasting

After "Approved?", add HTTP Request nodes to the Slack API posting each formatted message to the appropriate channel (`#engineering`, `#design`, `#sales`).

---

## 13. How to test

1. Click **Manual Trigger** — 4 audience versions of the recurring tasks insight loaded.
2. "Format Broadcast Messages" — 4 messages with subject and body formatted.
3. Approval email shows preview of all 4 versions.
4. Approve → broadcast sent.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Audience summaries are PM-authored** — the workflow does not generate them (by design — keeps the PM in control of the message).
- **Base version sends to one combined TO address** — add SplitInBatches for per-group routing.
- **No LLM** — formatting is deterministic. If you want LLM-generated audience adaptations, integrate an LLM call before "Format Broadcast Messages".

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
