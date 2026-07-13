# 09 — Product Opportunity Miner

## 1. What this workflow does
Reads the last 90 days of your research repository (from workflow 05), aggregates theme frequency and problems, asks AI to identify evidence-backed product opportunities with confidence scores, then sends the report for human review before sharing.

## 2. Who it is for
Product leads and founders doing quarterly strategy reviews who want to synthesise accumulated research evidence into prioritised opportunities.

## 3. Example result
```
3 opportunities identified (90-day research scan, 47 items):
1. Automated multi-source dashboard (confidence: 0.91, evidence: strong, effort: medium)
2. Bulk data export (confidence: 0.87, evidence: moderate, effort: low)
3. SSO/SAML support (confidence: 0.95, evidence: strong — blocks enterprise deals)
```

## 4. How it works
`Monthly Schedule → Load Repository (90 days) → Aggregate Themes + Problems → AI Opportunity Mining → Build Report → Human Approval → Send`

## 5. Required integrations
| Integration | Purpose | Required |
|---|---|---|
| OpenAI API | Opportunity synthesis | ✅ |
| Google Sheets | Research repository (from workflow 05) | ✅ |
| SMTP Email | Approval + report | ✅ |

## 6. Five-minute setup
```bash
# 1. Run workflow 05 first to populate your research repository
# 2. Set RESEARCH_SHEET_ID to your research repository sheet
# 3. Import human-approval subworkflow, copy ID
# 4. Import this workflow, update HUMAN_APPROVAL_WORKFLOW_ID
```

## 7. Configuration
| Variable | Required | Description |
|---|---|---|
| `RESEARCH_SHEET_ID` | ✅ | Research repository sheet ID |
| `AI_MODEL_SMART` | ✅ | gpt-4o for best opportunity quality |
| `NOTIFICATION_EMAIL_TO` | ✅ | Report recipient |

## 8. How to run it
Runs monthly on the first Monday. Click Manual Trigger to run on demand.

## 9. Input schema
Reads directly from your Google Sheets research repository.

## 10. Output schema
```json
{ "opportunities": [{ "title": "...", "description": "...", "evidence_strength": "strong", "confidence": 0.91, "affected_segments": ["enterprise"], "effort_signal": "medium", "assumptions_to_validate": ["..."] }], "research_gaps": [...] }
```

## 11. Human approval points
| Gate | Timeout |
|---|---|
| Opportunity report review | 72h |

## 12. Cost estimate
~$0.20–1.00 per monthly run with gpt-4o (large context).

## 13. Privacy and security
Research repository content (no customer PII required) is sent to OpenAI.

## 14. Error and retry behaviour
Empty repository: returns empty opportunities list. AI failure: retries 3×.

## 15. Customisation examples
**Add usage signals:** Extend the Aggregate Evidence node to also read from a Mixpanel or Amplitude export sheet.

## 16. Troubleshooting
- **No opportunities found:** Research repository may be too sparse (< 10 items). Run workflow 05 first.
- **All opportunities low confidence:** Normal if research is limited. AI correctly reflects evidence strength.

## 17. Known limitations
Only synthesises what's in your research repository. Does not access real-time market data or competitor intelligence.

## 18. Tested versions
n8n 2.30.0 — Statically validated — **Beta**
