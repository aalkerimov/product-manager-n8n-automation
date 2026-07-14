# Error Spike Translator

> Translate technical production error spikes into plain-English impact statements for PMs and stakeholders — reviewed before notifying the business.

---

## 1. Overview

Takes raw error spike data from Datadog, Sentry, or any alerting system and uses an LLM to translate it into: an executive summary (what is broken, who is affected), per-error plain-English descriptions (what the user sees and cannot do), estimated user impact percentage, and a recommended PM action. Requires approval before stakeholder notification.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 82

---

## 2. The problem

When Datadog fires a `TimeoutError: pg.query statement timeout after 30000ms` alert, the on-call engineer understands it immediately — the PM doesn't. This workflow bridges that gap automatically: by the time a PM gets the incident email, it is already translated into "your enterprise customers cannot load their dashboards."

---

## 3. How it works

```
Manual Trigger ─→ Load Sample Spike ─→ Prepare Prompt ─→ LLM: Translate ─→ Validate ─→ Format ─→ Approval ─→ Notify Stakeholders
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Technical → plain English translation |
| SMTP Email | Basic | Yes | Approval and stakeholder notification |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  ERROR_SPIKE_EMAIL_TO       = product@yourcompany.com
  ERROR_SPIKE_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL                   = gpt-4o-mini

Step 3: Connect your alerting system
  Datadog: configure a webhook monitor notification to POST to /webhook/error-spike-translator (add this trigger node).
  Sentry: use the webhooks integration with issue alert rules.
  Map alert fields to the spikes array schema in a Code node.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `ERROR_SPIKE_EMAIL_TO` | Required | — | PM and stakeholder recipients |
| `ERROR_SPIKE_APPROVER_EMAIL` | Optional | Same as above | Approver (often same as TO) |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "service": "string",
  "alert_triggered_at": "ISO8601",
  "spikes": [{ "error_type": "string", "error_message": "string", "count_last_5min": 847, "count_baseline": 12, "endpoints": ["string"], "severity": "critical|high|medium|low" }],
  "deployment_context": "string"
}
```

---

## 8. Output schema

```json
{
  "executive_summary": "string",
  "translated_errors": [{ "technical_error": "string", "plain_english": "string", "user_impact": "string", "affected_feature": "string", "severity": "string", "is_regression": true }],
  "recommended_action": "string",
  "estimated_user_impact_pct": "string"
}
```

---

## 9. Estimated AI cost

~1,500 tokens | gpt-4o-mini | ~$0.002/incident.

---

## 10. Privacy and security

- Error messages may include stack traces with internal paths — review before sending to LLM.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no notification sent |
| Email fails | Retries 3 times |
| Approval timeout | Stakeholders not notified |

---

## 12. Customization examples

### Datadog webhook → translator

In Datadog, create a webhook monitor with the n8n webhook URL as the endpoint. Add a Code node that maps `@is_alert`, `@log.message`, `@error.type`, and `@http.url` to the spike schema.

### Slack stakeholder notification

After "Approved?", add an HTTP Request to the Slack API to post the plain-English summary to `#incidents` or `#product-updates`.

---

## 13. How to test

1. Click **Manual Trigger** — 3 error spikes loaded (critical timeout, high TypeError, low auth error).
2. "Validate LLM Output" — `_error: false`, `translated_errors` present.
3. Approve → stakeholders receive plain-English incident report.

---

## 14. Known limitations

- **Not runtime-tested.**
- **User impact % is LLM estimate** — treat as order-of-magnitude, not precise measurement.
- **Baseline comparison requires actual monitoring data** — sample uses hardcoded baselines.
- **No auto-Slack integration** — add HTTP Request node for Slack posting.

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
