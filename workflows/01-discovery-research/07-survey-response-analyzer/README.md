# 07 — Survey Response Analyzer

## 1. What this workflow does
Accepts a batch of survey responses (Typeform webhook, JSON export, or CSV rows), identifies patterns and segment differences, highlights pain points and positive signals, and emails a concise research report without requiring human approval.

## 2. Who it is for
Product managers and researchers running periodic surveys (NPS, CSAT, post-onboarding, churn) who want instant AI-generated analysis.

## 3. Example result
```
Survey: Q1 2025 NPS + Open-text (5 responses)
NPS: Mixed — enterprise dragging it down (SSO blockers)
Top pain point: SSO not available (blocks enterprise rollout)
Top positive: Ease of setup for startups
Action: Prioritize SSO for enterprise segment
```

## 4. How it works
`Webhook/Manual → Normalise (supports Typeform, JSON, CSV) → AI Pattern Analysis → Build Report → Email Report`

## 5. Required integrations
| Integration | Purpose | Required |
|---|---|---|
| OpenAI API | Pattern analysis | ✅ |
| SMTP Email | Report delivery | ✅ |
| Typeform API | Webhook intake | Optional |

## 6. Five-minute setup
```bash
# 1. Set NOTIFICATION_EMAIL_TO env var
# 2. Import workflow, add OpenAI API + SMTP Email credentials
# 3. For Typeform: add your webhook URL to your Typeform settings
# 4. Test: Manual Trigger with sample-input.json
```

## 7. Configuration
| Variable | Required | Description |
|---|---|---|
| `NOTIFICATION_EMAIL_TO` | ✅ | Report recipient |
| `AI_MODEL_SMART` | ✅ | gpt-4o recommended |
| `AI_MODEL_FAST` | Optional | gpt-4o-mini for cost saving |

## 8. How to run it
Triggered by Typeform webhook automatically, or via Manual Trigger with a JSON payload.

## 9. Input schema
```json
{ "survey_id": "...", "survey_name": "...", "responses": [{ "segment": "...", "answers": { "nps_score": 8, "open_text": "..." } }] }
```
Typeform webhook payload is also accepted natively.

## 10. Output schema
```json
{ "executive_summary": "...", "top_patterns": [...], "segment_comparison": [...], "pain_points": [...], "recommended_actions": [...], "caveats": [...] }
```

## 11. Human approval points
None — report is sent directly. Add the human-approval subworkflow between "Build Report" and "Email Report" if you want to review before sending.

## 12. Cost estimate
~$0.05–0.20 per survey run with gpt-4o.

## 13. Privacy and security
Survey responses sent to OpenAI. Avoid including respondent names in the content field unless required.

## 14. Error and retry behaviour
AI failure: retries 3×. Invalid Typeform format: normalise node handles both Typeform and raw JSON.

## 15. Customisation examples
**Add Typeform scores:** Map `form_response.calculated_score` to the `answers.nps_score` field in the normalise node.

## 16. Troubleshooting
- **Empty patterns:** Fewer than 5 responses will give low-quality analysis. Minimum 20 responses recommended.
- **Typeform webhook not triggering:** Ensure your n8n webhook URL is publicly accessible.

## 17. Known limitations
Max 200 responses per run. For larger surveys, split by batch.

## 18. Tested versions
n8n 2.30.0 — Statically validated — **Beta**
