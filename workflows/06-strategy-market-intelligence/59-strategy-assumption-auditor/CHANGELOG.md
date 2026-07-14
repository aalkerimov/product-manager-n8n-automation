# Changelog — Strategy Assumption Auditor

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Quarterly schedule trigger (1st of Jan, Apr, Jul, Oct)
- Manual Trigger with 5 embedded sample assumptions with realistic new evidence
- LLM prompt: verdict (confirmed/weakened/contradicted/insufficient-evidence), confidence change, strategic risk, recommended action
- JSON validation with error routing
- Formatted plain-text audit report
- Human approval gate (email) with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- LLM quality entirely dependent on `new_evidence` field — must be populated before each run
- No automatic evidence gathering
- No rollup across quarters without additional Sheets logging
