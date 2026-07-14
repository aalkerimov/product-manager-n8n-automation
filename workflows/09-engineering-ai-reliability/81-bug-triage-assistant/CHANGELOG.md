# Changelog — Bug Triage Assistant

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 3 sample bugs (P0 dashboard timeout, P2 mobile Safari, P2 CSV regression)
- Webhook trigger for Linear/GitHub/Jira integration
- LLM: raw bug reports → P0–P3 severity with rationale, engineering area, likely cause, reproduction steps, difficulty, suggested owner, workaround, regression flag
- P0 count surfaced in approval email subject line
- Bugs sorted by severity in formatted report
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- P0 determination is LLM judgment — verify against your severity SLA definition
- Regression flag requires version reference in description to be reliable
- No auto-write back to Linear/GitHub/Jira — add HTTP Request nodes after approval
