# Changelog — Stakeholder Update Composer

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Friday schedule trigger
- Manual Trigger with embedded sample status data
- LLM: structured status → professional stakeholder update in GFM Markdown
- TL;DR field for email preview
- JSON validation with error routing
- Human approval gate with 48h timeout
- Separate approver and stakeholder email targets
- Rejection logging

### Known issues at release
- Not runtime-tested
- Status data must be manually populated — no automatic pull from Linear/Jira/metrics
- LLM tone varies slightly between runs (temperature 0.4)
