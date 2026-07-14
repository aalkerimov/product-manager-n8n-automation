# Engineering Digest for PMs

> Translate weekly engineering activity (deployments, incidents, PRs) into a PM-readable digest — reviewed before distributing to the product team.

---

## 1. Overview

Runs every Friday at 9am (or on demand). Takes engineering activity data (deployments with their impact, incidents and root causes, merged PRs by area, upcoming work) and uses an LLM to produce a digest in plain English for PMs: what shipped, what broke and is resolved, what engineering is working on, and what requires PM action.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 84

---

## 2. The problem

PMs often learn about deployments or incidents after the fact, through Slack noise or support tickets. Engineering standups don't translate well to PM context. This workflow gives PMs a weekly structured summary they can read in 2 minutes, written in their language — customer impact, product implications, roadmap connections.

---

## 3. How it works

```
Schedule (Fri 9am) ─┐
                     ├─→ Load Activity ─→ Prepare Prompt ─→ LLM: Write Digest ─→ Validate ─→ Format ─→ Approval ─→ Distribute
Manual Trigger ──────┘
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Engineering → PM translation |
| SMTP Email | Basic | Yes | Approval and distribution |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  DIGEST_EMAIL_TO       = product@yourcompany.com
  DIGEST_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL              = gpt-4o-mini

Step 3: Feed engineering data
  Edit "Load Sample Engineering Activity" weekly:
  - deployments: versions, dates, what changed
  - incidents: severity, title, duration, root cause
  - prs_merged: PR title, area, author team
  - upcoming_this_week: planned work
  
  For automation: add HTTP Request nodes to pull this data from:
  - GitHub API (merged PRs this week)
  - Jira/Linear (resolved incidents)
  - Deployment tracking system (versions, dates)
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DIGEST_EMAIL_TO` | Required | — | PM recipients |
| `DIGEST_APPROVER_EMAIL` | Optional | Same as above | Approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "week": "string",
  "deployments": [{ "version": "string", "date": "string", "type": "major|minor|patch", "summary": "string" }],
  "incidents": [{ "id": "string", "severity": "P0|P1", "title": "string", "duration_minutes": 47, "resolved": true, "root_cause": "string" }],
  "prs_merged": [{ "id": "string", "title": "string", "author": "string", "area": "string" }],
  "upcoming_this_week": "string"
}
```

---

## 8. Output schema

```json
{
  "digest_title": "string",
  "tldr": "string",
  "what_shipped": [{ "item": "string", "customer_impact": "string" }],
  "what_broke_and_is_fixed": [{ "incident": "string", "customer_impact": "string", "status": "resolved|ongoing" }],
  "what_engineering_is_doing": [{ "work": "string", "why_it_matters": "string" }],
  "next_week_preview": "string",
  "action_required_from_pm": "string|null"
}
```

---

## 9. Estimated AI cost

~1,500 tokens | gpt-4o-mini | ~$0.002/digest. $0.10/month for weekly runs.

---

## 10. Privacy and security

- Incident descriptions may contain internal architecture details — review before LLM call.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; digest not sent |
| Email fails | Retries 3 times |
| Approval timeout | Digest not distributed |

---

## 12. Customization examples

### Auto-pull from GitHub

Add HTTP Request nodes before "Load Sample" that call the GitHub API for `GET /repos/{owner}/{repo}/pulls?state=closed&merged=true&since=<last-monday>`. Map title, number, and labels to the PR schema.

### Slack distribution

After "Approved?", add an HTTP Request to post the TL;DR to `#product` and the full digest to `#engineering-digest` on Slack.

---

## 13. How to test

1. Click **Manual Trigger** — week of July 7–11 with 2 deployments, 1 P0 incident, 3 PRs.
2. "Validate LLM Output" — `_error: false`, `tldr` present.
3. Approve → PM team receives plain-English engineering digest.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Engineering data must be updated weekly** — sample data is static unless GitHub/Linear HTTP Request integration is added.
- **LLM may misinterpret technical PR titles** — engineering area field helps; add descriptive PR summaries for best results.

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
