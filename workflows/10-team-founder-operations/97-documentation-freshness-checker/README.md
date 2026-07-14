# Documentation Freshness Checker

> Scan your doc inventory weekly, flag stale docs by severity (critical/warning/stale), and notify owners before bad documentation silently misleads the team.

---

## 1. Overview

Runs weekly. Takes a doc inventory with `last_updated` dates and per-doc `stale_threshold_days`. Computes staleness ratio (days since update / threshold) and assigns severity: `critical` (3× past due), `warning` (2× past due), `stale` (past threshold), `fresh`. Skips notification if all docs are fresh. Requires approval before notifying document owners.

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 97

> **No LLM.** All freshness analysis is deterministic date arithmetic.

---

## 2. The problem

Stale documentation is invisible until it causes a bug or a team member wastes two hours on an outdated guide. The Incident Response Runbook written in January, never updated, is sitting next to a Q1 onboarding spec from February. Nobody reviews them until something breaks.

---

## 3. How it works

```
Schedule (Mon 9am) ─┐
                     ├─→ Load Docs ─→ Check Freshness ─→ Any Stale? ─→ Format ─→ Approval ─→ Notify Owners
Manual Trigger ──────┘                                         ↓
                                                     All Fresh (no email)
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Approval gate + owner notifications |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  DOCS_EMAIL_TO       = team@yourcompany.com
  DOCS_APPROVER_EMAIL = pm@yourcompany.com (if different)

Step 3: Populate doc inventory
  Edit "Load Doc Inventory" with your actual documents.
  Per-doc fields: title, owner, category, last_updated, stale_threshold_days.
  Set today to new Date().toISOString().slice(0,10) for production.

Step 4: Automate via Notion/Confluence API (optional)
  Replace the Code node with an HTTP Request to Notion's pages API.
  Filter by database: document_type = internal | last_edited_time ascending.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DOCS_EMAIL_TO` | Required | — | Doc owners / team |
| `DOCS_APPROVER_EMAIL` | Optional | Same | Manager approver |

---

## 7. Input schema

```json
{
  "docs": [{ "title": "string", "owner": "string", "category": "strategy|technical|product|design|process|operations", "last_updated": "YYYY-MM-DD", "stale_threshold_days": 30 }],
  "today": "YYYY-MM-DD"
}
```

---

## 8. Output schema

```json
{
  "stale": [{ "title": "string", "severity": "critical|warning|stale", "days_since_update": 154, "staleness_ratio": 5.13 }],
  "meta": { "total": 7, "stale_count": 4, "critical_count": 1, "fresh_count": 3 },
  "by_owner": { "Maria Santos": ["Incident Response Runbook"] }
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- Doc titles and owner names only — no doc content sent anywhere.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| All docs fresh | "All Docs Fresh" node; no email sent |
| Email fails | Retries 3 times |
| Approval timeout | Owners not notified |

---

## 12. Customization examples

### Notion API integration

Add HTTP Request to `GET https://api.notion.com/v1/databases/{id}/query`. Filter pages where `doc_type` is "internal". Map `last_edited_time` to `last_updated`. Set `stale_threshold_days` from a Notion property.

### Severity-based routing

Add If node to split `critical` severity docs into a separate Slack alert (immediate) while `stale` and `warning` go through the standard weekly email.

---

## 13. How to test

1. Click **Manual Trigger** — 7 docs with today=2026-07-14.
2. "Check Freshness" — Incident Response Runbook is 185d stale (6×), Onboarding Flow Spec is 144d (4×+), API Auth Guide is 90d (1.5×).
3. Approve → owners notified.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No LLM (by design)** — all analysis is date arithmetic.
- **Doc inventory requires manual maintenance** — integrate with Notion/Confluence API.
- **No auto-update of last_updated** — owners must update docs and then update the inventory.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
