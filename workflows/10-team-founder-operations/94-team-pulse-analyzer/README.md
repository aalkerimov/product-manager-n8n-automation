# Team Pulse Analyzer

> Compute weekly team mood distribution, flag at-risk members, surface blocker themes, and celebrate wins — sent to the manager every Friday.

---

## 1. Overview

Runs every Friday at 4pm. Takes weekly check-in responses (mood score 1–5, blockers, wins, load, needs-help flag). Computes: average mood, at-risk members (mood ≤ 2 or needs_help flag), mood distribution, blocker themes (recurring patterns), wins list. Sent directly to the manager — no approval gate.

**Status:** beta  
**Collection:** 10 — Team & Founder Operations  
**Workflow number:** 94

> **No LLM.** Analysis is deterministic threshold-based logic.

---

## 2. The problem

Without systematic collection, team wellbeing signals are invisible until they become attrition. A Friday pulse gives the manager early warning to intervene before morale issues compound over weeks.

---

## 3. How it works

```
Schedule (Fri 4pm) ─┐
                     ├─→ Load Responses ─→ Analyse Pulse ─→ Format ─→ Send to Manager
Manual Trigger ──────┘
```

> No approval gate — personal manager insight.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Pulse report delivery |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  PULSE_EMAIL_TO = pm@yourcompany.com (yourself)

Step 3: Collect responses
  Two options:
  a. Manual: Edit "Load Pulse Responses" weekly with team member data
  b. Automated: Send a Typeform/Tally form each Friday morning with
     mood_score (1-5), blockers (text), wins (text), load (high/medium/low)
     Trigger this workflow from the form's webhook

Step 4: Activate
  Turn on the workflow. It runs every Friday at 16:00.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PULSE_EMAIL_TO` | Required | — | Manager's email (yourself) |

---

## 7. Input schema

```json
{
  "responses": [{ "name": "string", "role": "string", "mood_score": 4, "blockers": "string|null", "wins": "string", "load": "high|medium|low", "needs_help": false }],
  "week": "string"
}
```

---

## 8. Output schema

```json
{
  "metrics": { "avg_mood": 3.2, "at_risk_count": 1, "high_load_count": 2, "blocker_count": 3 },
  "mood_dist": { "1": 0, "2": 1, "3": 2, "4": 2, "5": 0 },
  "at_risk": [{ "name": "string", "mood_score": 2, "needs_help": true }],
  "blocker_themes": ["design spec", "API contract"],
  "wins": ["string"]
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- Individual mood scores and blockers are sensitive — send to manager email only. Never distribute team-wide.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| No responses | Zero-response report — "No responses this week" |
| Email fails | Retries 3 times |

---

## 12. Customization examples

### Typeform webhook trigger

Replace the Schedule trigger with a Webhook node. Connect your Typeform "Friday Pulse" form to POST to the webhook URL. Map response fields to the check-in schema.

### Trend tracking

Add a Google Sheets HTTP Request after "Analyse Pulse" to append the weekly average mood. Build a chart to spot trends: if avg_mood drops >0.5 over 3 consecutive weeks, trigger an alert.

---

## 13. How to test

1. Click **Manual Trigger** — 5 team members, week of July 7–11.
2. "Analyse Pulse" — avg 3.2, 2 at-risk (Alex mood 2, David needs_help), blocker themes: design spec + API contract.
3. Manager receives pulse with at-risk callout and wins.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No LLM (by design)** — analysis is rule-based.
- **Responses are static sample** — connect to Typeform/Slack weekly check-in form for automation.
- **Blocker theme matching is keyword-based** — not semantic; add LLM step for nuanced theme extraction.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `emailSend`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
