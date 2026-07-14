# Roadmap Dependency Mapper

> Map roadmap item dependencies, detect cycles, identify the critical path, and surface the biggest blockers — no LLM required.

---

## 1. Overview

Reads roadmap items with their dependency declarations, runs graph analysis (cycle detection, longest path, top blockers), and delivers a dependency report. On-demand via Manual Trigger or webhook, or call it before quarterly planning. No LLM — deterministic graph traversal.

**Status:** beta  
**Collection:** 07 — Roadmap & Planning  
**Workflow number:** 62

---

## 2. The problem

Dependencies in roadmaps are usually informal — buried in Notion comments or Jira links. Before a planning cycle, nobody has a clear view of what blocks what, what the critical path is, or whether there are circular dependencies. This workflow makes the dependency graph explicit in minutes.

---

## 3. How it works

```
Manual Trigger (sample) ─┐
                          ├─→ Analyse Dependencies ─→ Format Report ─→ Send Report (email)
Webhook: Trigger ─────────┘
```

No LLM. Graph traversal: DFS cycle detection + longest path (critical path) + blocker ranking.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Report delivery |

No LLM. No Google Sheets credential required for testing.

---

## 5. Five-minute setup

```
Step 1: Create credential
  - SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  DEPENDENCY_EMAIL_TO = product@yourcompany.com

Step 3: Test with Manual Trigger
  - 10 sample items with real dependency structure
  - Report shows critical path, blockers, cycle status

Step 4 (production): Connect to your roadmap data
  Add a Google Sheets read node before "Analyse Dependencies"
  to load items from a planning sheet.
  Required columns: id, title, team, estimated_weeks, status, depends_on (comma-separated IDs), blocks (comma-separated IDs)
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DEPENDENCY_EMAIL_TO` | Required | — | Report recipient |
| `NOTIFICATION_EMAIL_FROM` | Optional | `automation@example.com` | Sender |

---

## 7. Input schema

```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "team": "string",
      "estimated_weeks": 4,
      "status": "planned | in-progress | done",
      "depends_on": ["id1", "id2"],
      "blocks": ["id3", "id4"]
    }
  ]
}
```

---

## 8. Output schema

```json
{
  "cycles": [["I001", "I003", "I001"]],
  "has_cycles": false,
  "critical_path": [{ "id": "string", "title": "string", "cumulative_weeks": 18 }],
  "blockers": [{ "id": "string", "title": "string", "blocks_count": 3, "blocks": ["string"] }],
  "roots": ["I001", "I010"]
}
```

---

## 9. Estimated AI cost

**$0.00** — no LLM used.

---

## 10. Privacy and security

- Roadmap item titles are sent in the email.
- No customer data is processed.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No items | Analyse Dependencies processes empty array; report shows 0 items |
| Circular dependency found | `has_cycles: true`; cycles listed in report and email subject |
| Email fails | n8n retries 3 times |

---

## 12. Customization examples

### Flag cycles in email subject

Add an IF node after "Format Dependency Report" checking `has_cycles`. If true, change the email subject to "⚠️ CYCLE DETECTED: Roadmap Dependency Map".

### Export to Google Sheets

After "Analyse Dependencies", add a Sheets write node to log the `critical_path` and `blockers` arrays with the run date.

### Connect to Linear or Jira

Replace the sample data Code node with an HTTP Request to the Linear or Jira API. Parse the dependency/blocking relationship fields into the required schema.

---

## 13. How to test

1. Click **Manual Trigger** — 10 items loaded.
2. Inspect "Analyse Dependencies" — `has_cycles: false`, critical path and blockers populated.
3. Email received with dependency report.
4. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Cycle detection is DFS-based** — correct for DAG checking but does not handle all edge cases in large graphs (>100 nodes).
- **Longest path algorithm uses simple relaxation**, not true topological sort. Correct for acyclic graphs but may produce incorrect results if cycles exist.
- **No Gantt or visual output** — report is plain text only.
- **`blocks` and `depends_on` must be kept consistent** — if I001 blocks I002, I002 should also declare `depends_on: ['I001']`.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `webhook`, `code`, `emailSend`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
