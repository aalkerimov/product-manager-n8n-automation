# Changelog — Participant Recruitment Screener

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 5 sample applicants and mid-market PM study criteria
- Webhook trigger for Typeform/Google Forms integration
- Deterministic code scoring: company_size, role, months_using, weekly_tasks, willing_to_interview
- "Any Qualified?" guard node — no email sent when zero qualify
- PM approval gate with 48h timeout
- Qualified applicant outreach list with timezone and email
- Rejected applicant failure reason breakdown
- Rejection logging

### Known issues at release
- Not runtime-tested
- No LLM — entirely deterministic (by design)
- Applicant PII in execution data — review n8n data retention settings
- Binary criteria only — no weighted scoring in base version
- Does not auto-send scheduling links — add Calendly HTTP Request after approval
