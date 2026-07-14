# Changelog — Usability Test Summariser

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 3-task, 5-participant onboarding test sample
- LLM: observer notes → executive summary, task severity ratings, systemic issues, positive findings, prioritised design recommendations
- Per-task success rate and average time passthrough
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- Use participant codes, not real names — PII risk
- Success rates must be pre-computed before input
- Systemic issue detection may miss patterns in large multi-session tests
