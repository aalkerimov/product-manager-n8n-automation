# 05 — Research Repository Updater

## 1. What this workflow does
Normalizes any research item — interviews, surveys, support conversations, field notes — into a consistent format with AI-generated tags, summaries, and themes, then saves it to your Google Sheets research repository and notifies the team.

## 2. Who it is for
Product managers and UX researchers who collect research from 3+ sources and need one searchable place to find past insights.

## 3. Example result
```
New item added: Interview note from Sam (startup segment)
Themes: onboarding, search, research-ops
Sentiment: negative
Key insight: Lack of tagging standards causes research to be unfindable at point of need
```

## 4. How it works
`Webhook/Manual → Normalise (type, source, segment) → AI tagging + summary → Merge → Save to Sheets → Notify Slack`

## 5. Required integrations
| Integration | Purpose | Required |
|---|---|---|
| OpenAI API | Tagging and summarisation | ✅ |
| Google Sheets | Research repository | ✅ |
| Slack API | Team notification | Optional |

## 6. Five-minute setup
```bash
# 1. Create a Google Sheet with columns:
#    id, type, source, content, segment, date, author, tags, summary, themes, sentiment, key_insight, problems_mentioned, product_areas, ai_confidence, added_to_repository_at
# 2. Import workflow, set RESEARCH_SHEET_ID env var
# 3. Create Google Sheets OAuth2 + OpenAI credentials
# 4. Test with Manual Trigger
```

## 7. Configuration
| Variable | Default | Required | Description |
|---|---|---|---|
| `RESEARCH_SHEET_ID` | — | ✅ | Google Sheet ID for the repository |
| `AI_MODEL_FAST` | `gpt-4o-mini` | ✅ | Model for tagging (fast/cheap model works well) |
| `SLACK_CHANNEL_RESEARCH` | `#research` | Optional | Slack channel for new item alerts |

## 8. How to run it
POST to webhook or use Manual Trigger with the input JSON below.

## 9. Input schema
```json
{ "type": "interview|survey|support|note|review|document", "source": "string", "content": "string (max 8000 chars)", "segment": "enterprise|growth|startup|consumer", "date": "YYYY-MM-DD", "author": "string", "tags": ["optional existing tags"] }
```

## 10. Output schema
```json
{ "id": "res_...", "type": "...", "summary": "...", "themes": ["..."], "sentiment": "...", "key_insight": "...", "problems_mentioned": ["..."], "product_areas": ["..."], "ai_confidence": 0.88 }
```

## 11. Human approval points
None — items are saved automatically after AI tagging. Review flagged items via the Slack notification.

## 12. Cost estimate
~$0.02–0.10 per item with gpt-4o-mini. Monthly: $0.20–10.00 for 10–100 items.

## 13. Privacy and security
Content is sent to OpenAI for tagging. Avoid storing full PII in the content field. Use PII Redaction subworkflow for sensitive interviews.

## 14. Error and retry behaviour
AI failure: retries 3×. Sheets write failure: retries 3×. Invalid input: logged and skipped.

## 15. Customisation examples
**Add Notion:** Replace the Google Sheets node with a Notion Create Page node. Map fields to your Notion database properties.

## 16. Troubleshooting
- **Themes are generic:** Content field is too short. Send the full item.
- **Sheets write fails:** Check the credential and RESEARCH_SHEET_ID. Ensure the "Repository" sheet tab exists.

## 17. Known limitations
Max content length: 8,000 characters. Items connected with cross-references require manual linking.

## 18. Tested versions
| n8n | Status |
|---|---|
| 2.30.0 | Statically validated — Beta |
