# Analyst and Review Platform Tracker

> Monitor G2, Capterra, industry reports, and category rankings for your company and competitors weekly. No LLM required — this is structured data comparison.

---

## 1. Overview

Tracks review ratings, review counts, category ranks, and recent reviews for your company and configured competitors across G2 and Capterra. Sends a weekly summary email. Delta tracking (what changed vs last week) requires storing snapshots in Google Sheets or a database — see customization section.

**Status:** beta  
**Collection:** 06 — Strategy & Market Intelligence  
**Workflow number:** 54

---

## 2. The problem

Review platform rankings shift quietly. A competitor runs a review campaign and jumps two spots. Your rating drops 0.2 points from a bad month. You find out when a prospect mentions it in a demo. This workflow surfaces those changes proactively.

---

## 3. How it works

```
Weekly Schedule ─┐
                  ├─→ Validate Snapshot ─→ Build Report ─→ Send Weekly Report (email)
Manual Trigger ──┘   (or Load Sample Data)
```

No LLM used. This workflow does structured data aggregation, not language generation.

> [!NOTE]
> In the current version, the "Validate Snapshot Data" node passes through data from the sample or a manually-configured HTTP fetch. To enable live G2/Capterra reading, add HTTP Request nodes before "Validate Snapshot Data" that fetch the public profile pages and parse the structured data. G2 and Capterra do not have official APIs — HTML structure may change.

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Weekly report delivery |
| Google Sheets | Advanced | Optional | Store snapshots for delta tracking |

No LLM required.

---

## 5. Five-minute setup

```
Step 1: Create credential
  - SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  TRACKER_EMAIL_TO     = product@yourcompany.com
  NOTIFICATION_EMAIL_FROM = automation@yourcompany.com
  OUR_COMPANY_NAME     = Your Company Name (must match exactly in snapshot data)
  TRACKER_SCHEDULE     = 0 8 * * 1   (Monday 08:00)

Step 3: Test with Manual Trigger
  - Runs with embedded sample data for Acme Analytics, CompetitorX, CompetitorY
  - Report delivered to TRACKER_EMAIL_TO

Step 4 (production): Add HTTP Request nodes
  - Before "Validate Snapshot Data", add HTTP Request nodes to fetch
    G2 and Capterra public pages for each company
  - Parse ratings and review counts from the response HTML using a Code node
  - Replace the sample data path with the live fetch path
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `TRACKER_EMAIL_TO` | Required | — | Weekly report recipient |
| `NOTIFICATION_EMAIL_FROM` | Optional | `automation@acme-analytics.com` | Sender |
| `OUR_COMPANY_NAME` | Optional | `Acme Analytics` | Your company name in snapshot data |
| `TRACKER_SCHEDULE` | Optional | `0 8 * * 1` | Weekly cron |

---

## 7. Input schema

The "Load Sample Data" node produces a snapshot object. For live data, your HTTP fetch + parse code must produce the same shape:

```json
{
  "captured_at": "ISO 8601",
  "companies": [
    {
      "name": "string",
      "g2": {
        "rating": 4.6,
        "review_count": 312,
        "category_rank": 3,
        "top_tags": ["string"],
        "recent_reviews": [{ "stars": 5, "excerpt": "string", "date": "YYYY-MM-DD" }]
      },
      "capterra": {
        "rating": 4.5,
        "review_count": 187,
        "category_rank": 4,
        "recent_reviews": [{ "stars": 5, "excerpt": "string", "date": "YYYY-MM-DD" }]
      }
    }
  ]
}
```

---

## 8. Output schema

Plain-text email with:
- Your position: G2 and Capterra rating, review count, rank, top tags, recent reviews
- Per-competitor: same data
- Note about delta tracking configuration

---

## 9. Estimated AI cost

**$0.00** — no LLM used in this workflow.

---

## 10. Privacy and security

- No customer data is processed.
- Only public review platform data is read.
- Review excerpts in the report may be visible to email recipients — ensure report is sent to the right people.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| Snapshot data missing companies array | Validate node throws; execution stops |
| Email delivery fails | n8n retries 3 times |
| HTTP Request to G2/Capterra fails (if added) | n8n retries; check Executions for status |

---

## 12. Customization examples

### Add delta tracking

1. After "Build Tracker Report", add a Google Sheets read to get last week's snapshot.
2. In the "Build Tracker Report" Code node, compute the difference in rating and rank.
3. Add delta markers to the report (e.g., "G2: 4.6 ↑ +0.1 vs last week").

### Add Capterra profile reading

Add an HTTP Request node:
- URL: `https://www.capterra.com/p/YOUR_PROFILE_SLUG/`
- Method: GET
- Parse the response with a Code node to extract the rating and review count.

### Include analyst reports

Add an HTTP Request or RSS reader node for relevant analyst firm RSS feeds (Gartner, Forrester, G2 category reports) and append findings to the report.

---

## 13. How to test

1. Click **Manual Trigger**.
2. Inspect "Build Tracker Report" — report_text field contains the formatted output.
3. Check your inbox for the weekly report email.
4. Compare with `sample-output.json`.

---

## 14. Known limitations

- **Not runtime-tested.**
- **No live data fetching in base version.** The workflow uses sample data only until you add HTTP Request nodes.
- **G2/Capterra HTML structure may change.** Any HTML parsing you add is fragile.
- **No delta tracking by default.** Requires adding snapshot storage.
- **No approval gate.** This report is informational (no action triggered), so it sends directly. If you want approval before delivery, add a Wait node.

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
