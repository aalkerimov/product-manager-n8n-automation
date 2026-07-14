# Data Quality Sentinel

> Run daily data quality checks (freshness, volume, completeness, uniqueness) and alert on failures — reviewed before notifying data engineering.

---

## 1. Overview

Runs every day at 7am. Evaluates a set of configured data quality checks against your data warehouse tables. Checks four dimensions: **freshness** (how recently was data loaded?), **volume** (has the row count dropped unexpectedly?), **completeness** (are key columns NULL-free?), **uniqueness** (are there duplicate primary keys?). Skips notification if all checks pass. Requires approval before alerting data engineering.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 90

> **No LLM.** All quality evaluation is deterministic threshold-based logic.

---

## 2. The problem

PM-facing analytics dashboards silently break when an ETL pipeline fails. A freshness failure in `events.page_views` means the product team is making decisions on stale data — but nobody finds out until someone manually checks a timestamp. This workflow creates a daily automated circuit breaker.

---

## 3. How it works

```
Daily Schedule (7am) ─┐
                       ├─→ Load Checks ─→ Evaluate ─→ Any Failures? ─→ Format ─→ Approval ─→ Alert Data Engineering
Manual Trigger ────────┘                                      ↓
                                                   All Passed (no email)
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Approval and engineering alert |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  DATA_QUALITY_EMAIL_TO       = data@yourcompany.com
  DATA_QUALITY_APPROVER_EMAIL = pm@yourcompany.com (if different)

Step 3: Define your checks
  Edit "Load Data Quality Checks" with your actual table names and thresholds.
  Four check_type values supported: freshness, volume, completeness, uniqueness.

Step 4: Connect data warehouse
  For real checks, add HTTP Request nodes to your data warehouse query API:
  - BigQuery: POST to googleapis.com/bigquery/v2/projects/{id}/queries
  - Snowflake: POST to {account}.snowflakecomputing.com/api/v2/statements
  Map query results to the checks schema (passed: boolean, actual values).
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATA_QUALITY_EMAIL_TO` | Required | — | Data engineering recipients |
| `DATA_QUALITY_APPROVER_EMAIL` | Optional | Same as above | PM approver |

---

## 7. Input schema

```json
{
  "checks": [{ "table": "events.page_views", "check_type": "freshness|volume|completeness|uniqueness", "description": "string", "threshold_hours": 4, "actual_hours_since_last": 6.2, "passed": false }]
}
```

---

## 8. Output schema

```json
{
  "failed": [{ "table": "string", "check_type": "string", "description": "string", "passed": false }],
  "meta": { "total": 6, "passed": 4, "failed_count": 2, "pass_rate_pct": 66.7, "has_failures": true }
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- Check results contain table names and counts — no PII. Data warehouse credentials should be stored in n8n credentials, not in environment variables.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| All checks pass | "All Checks Passed" node; no email sent |
| Email fails | Retries 3 times |
| Approval timeout | Alert not sent |

---

## 12. Customization examples

### BigQuery integration

Add an HTTP Request for each check that calls the BigQuery Jobs API with a SQL query (e.g., `SELECT MAX(_ingestion_time) FROM events.page_views`). Compare the result with `NOW() - INTERVAL 4 HOURS` and set `passed: result > threshold`.

### dbt test integration

If you use dbt, add a Code node that parses the `target/run_results.json` file from a dbt test run. Map each test to the checks schema — `status: 'pass'` maps to `passed: true`.

---

## 13. How to test

1. Click **Manual Trigger** — 6 checks loaded, 2 fail (page_views freshness + volume drop).
2. "Any Failures?" — routes to Format Alert.
3. Approve → data engineering receives alert with specific failure detail.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No LLM (by design)** — all evaluation is threshold-based.
- **Check results are static sample** — replace with real data warehouse query HTTP Requests.
- **Volume check requires historical baseline** — static sample uses hardcoded expected values.
- **No trend tracking** — add persistence layer to track pass rates over time.

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
