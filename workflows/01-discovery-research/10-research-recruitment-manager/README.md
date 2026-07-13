# 10 — Research Recruitment Manager

## 1. What this workflow does
Accepts research participant applications (from a Typeform, web form, or webhook), checks the applicant against your participant database to prevent fatigue (configurable cooldown), screens eligibility, and notifies the researcher. Never contacts participants automatically.

## 2. Who it is for
UX researchers and PMs running ongoing research programs who need to track who they've spoken to and prevent over-recruiting the same people.

## 3. Example result
```
New applicant: Tom (Startup segment, 0 previous interviews)
Decision: ✅ Eligible — new participant
Action: Researcher notified → schedules manually
```

## 4. How it works
`Webhook → Normalise → Check Participant DB → Screen (cooldown + interview count) → Route → Notify Researcher + Add to DB`

## 5. Required integrations
| Integration | Purpose | Required |
|---|---|---|
| Google Sheets | Participant database | ✅ |
| SMTP Email | Researcher notification | ✅ |
| Calendly | Optional scheduling link in email | Optional |

## 6. Five-minute setup
```bash
# 1. Create a Google Sheet "Participants" with columns:
#    email, name, company, segment, role, status, interview_count, last_contacted, applied_at
# 2. Set PARTICIPANT_SHEET_ID, NOTIFICATION_EMAIL_TO
# 3. Connect your screening form's webhook to n8n
# 4. Test with Manual Trigger using sample-input.json
```

## 7. Configuration
| Variable | Required | Description |
|---|---|---|
| `PARTICIPANT_SHEET_ID` | ✅ | Participant tracking sheet |
| `NOTIFICATION_EMAIL_TO` | ✅ | Researcher's email |
| `RESEARCH_COOLDOWN_DAYS` | Optional | Days before re-contacting (default: 60) |
| `CALENDLY_LINK` | Optional | Included in researcher email |

## 8. How to run it
Triggered by form webhook. Test via Manual Trigger.

## 9. Input schema
```json
{ "email": "participant@company.com", "name": "Tom", "company": "Example Corp", "segment": "startup", "role": "CTO", "use_case": "We use it for...", "date": "2025-01-13" }
```

## 10. Output schema (Sheets row)
`email, name, company, segment, role, status=pending_scheduling, interview_count=0, applied_at`

## 11. Human approval points
Researcher is notified but must manually schedule. No participant is contacted automatically — ever.

## 12. Cost estimate
$0.00 — no AI required. Only Sheets lookups and email.

## 13. Privacy and security
Participant emails stored in your own Google Sheet — not shared with any third party by this workflow.

## 14. Error and retry behaviour
Sheets lookup failure: retries 3×. Email failure: retries 3×.

## 15. Customisation examples
**Add Calendly link:** Set CALENDLY_LINK env var — it will appear in the researcher notification email.

## 16. Troubleshooting
- **Duplicate entries:** Ensure the "Check Participant Database" filter is correctly matching by email.
- **Cooldown not working:** Verify `last_contacted` column is updated after each interview.

## 17. Known limitations
`last_contacted` must be updated manually after each interview (or connect to your calendar to automate this).

## 18. Tested versions
n8n 2.30.0 — Statically validated — **Beta**
