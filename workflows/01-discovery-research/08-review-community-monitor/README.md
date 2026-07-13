# 08 — Review and Community Monitor

## 1. What this workflow does
Runs every 12 hours to fetch reviews and community posts from configured sources (App Store RSS, Reddit, Product Hunt, G2), classifies each item, filters for high-importance signals (score ≥ 6), and sends immediate alerts.

## 2. Who it is for
PMs and founders who need to hear about product issues and competitive signals from review sites and communities without checking them manually.

## 3. Example result
```
⚠️ Alert: competitive_intel from reddit (score: 8/10)
"Competitor X just released a bulk import feature..."
Urgency: medium
```

## 4. How it works
`Schedule → Load Sources → Per-item AI Classification → Filter (importance ≥ threshold) → Alert`

## 5. Required integrations
| Integration | Purpose | Required |
|---|---|---|
| OpenAI API | Item classification | ✅ |
| Slack API or SMTP | Alerts | ✅ (one of these) |

## 6. Five-minute setup
```bash
# 1. Edit "Load Configured Sources" node — uncomment sources to monitor
# 2. Add your App Store app ID, subreddit, etc.
# 3. Create OpenAI API + Slack or SMTP credential
# 4. Set NOTIFICATION_ROUTER_WORKFLOW_ID
# 5. Test: Manual Trigger — see sample items classified
```

## 7. Configuration
| Variable | Required | Description |
|---|---|---|
| `AI_MODEL_FAST` | ✅ | gpt-4o-mini is fine here |
| `NOTIFICATION_CHANNEL` | ✅ | slack, email, or telegram |
| `REVIEW_IMPORTANCE_THRESHOLD` | Optional | Min score to alert (default: 6) |

## 8. How to run it
Runs automatically every 12h. Click Manual Trigger to test with sample items.

## 9. Input schema
Configure sources in the "Load Configured Sources" Code node. Each item needs: `{ text, source, url, date }`.

## 10. Output schema
```json
{ "text": "...", "source": "app_store", "url": "...", "category": "bug", "sentiment": "negative", "urgency": "high", "importance_score": 8, "summary": "..." }
```

## 11. Human approval points
None — alerts go out immediately when importance score ≥ threshold. Adjust threshold to tune noise.

## 12. Cost estimate
~$0.01–0.05 per run (gpt-4o-mini, 10–30 items). Monthly: $0.60–6.00 for twice-daily runs.

## 13. Privacy and security
Only public review/community content is fetched. No user authentication. Do not scrape sites that prohibit it in their ToS.

## 14. Error and retry behaviour
RSS fetch failure: skips source for that run. Classification failure: retries 3×.

## 15. Customisation examples
**Lower threshold during launch:** Set threshold to 4 to catch everything during a major launch week.

## 16. Troubleshooting
- **RSS not loading:** Check URL and ensure n8n can reach the internet. Test the URL manually in a browser.
- **Too many alerts:** Raise the importance threshold to 7 or 8.

## 17. Known limitations
RSS feeds may have a 15–60 minute lag. No deduplication across runs — same item may appear multiple times.

## 18. Tested versions
n8n 2.30.0 — Statically validated — **Beta**
