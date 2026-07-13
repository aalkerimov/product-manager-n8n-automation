# 06 — Feature Request Analyzer

## 1. What this workflow does
Loads raw feature requests from a Google Sheet, uses AI to cluster duplicates and near-duplicates, identifies the underlying need behind each cluster, estimates total frequency and affected segments, and produces an approved analysis report.

## 2. Who it is for
Product managers who receive feature requests from multiple channels and need to deduplicate and prioritize them weekly.

## 3. Example result
```
8 requests → 2 clusters + 3 singletons
Cluster 1: CSV/Bulk Data Export (25 combined votes, enterprise+growth)
Cluster 2: SSO/SAML Authentication (18 combined votes, enterprise only — blocks sales)
```

## 4. How it works
`Schedule/Manual → Load Requests from Sheets → Prepare Batch → AI Deduplication + Clustering → Parse → Human Approval → Send Report`

## 5. Required integrations
| Integration | Purpose | Required |
|---|---|---|
| OpenAI API | Clustering and analysis | ✅ |
| Google Sheets | Raw requests source | ✅ |
| SMTP Email | Approval + report | ✅ |

## 6. Five-minute setup
```bash
# 1. Create a Google Sheet "Requests" with columns: text, segment, source, vote_count
# 2. Set FEATURE_REQUESTS_SHEET_ID env var
# 3. Import human-approval subworkflow first, copy its ID
# 4. Import this workflow, update the "Request Human Approval" node with the subworkflow ID
```

## 7. Configuration
| Variable | Required | Description |
|---|---|---|
| `FEATURE_REQUESTS_SHEET_ID` | ✅ | Sheet with raw feature requests |
| `AI_MODEL_SMART` | ✅ | Model (gpt-4o recommended for clustering) |
| `NOTIFICATION_EMAIL_TO` | ✅ | Approval + report recipient |

## 8. How to run it
Schedule: every Wednesday at 09:00. Or click Manual Trigger.

## 9. Input schema (Google Sheet row)
```
text, segment, source, vote_count
```

## 10. Output schema
```json
{ "clusters": [{ "cluster_id": "c01", "title": "...", "underlying_need": "...", "total_mentions": 25, "affected_segments": ["enterprise"], "confidence": 0.95, "recommended_action": "add_to_backlog" }], "singletons": [...] }
```

## 11. Human approval points
| Gate | Timeout |
|---|---|
| Cluster analysis review | 48h |

Prevents AI clustering errors from entering your backlog.

## 12. Cost estimate
~$0.10–0.50 per weekly run with gpt-4o (100 requests).

## 13. Privacy and security
Feature request text is sent to OpenAI. No customer names are required or extracted.

## 14. Error and retry behaviour
Load failure: skips run. AI failure: retries 3×. Approval timeout: analysis logged, not sent.

## 15. Customisation examples
**Auto-create Linear issues:** After approval, add a loop that creates a Linear issue for each "add_to_backlog" cluster.

## 16. Troubleshooting
- **No items loaded:** Check FEATURE_REQUESTS_SHEET_ID and that the "Requests" tab exists.
- **All requests in one cluster:** Transcript may be too similar — check for very generic phrasing.

## 17. Known limitations
AI clustering works best with 10–200 requests. Very large batches may hit token limits.

## 18. Tested versions
n8n 2.30.0 — Statically validated — **Beta**
