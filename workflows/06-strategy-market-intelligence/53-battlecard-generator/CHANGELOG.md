# Changelog — Battlecard Generator

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with CompetitorX sample data
- Webhook trigger for integration with Competitor Change Monitor (#02)
- Input validation with required field checking
- LLM prompt: win/loss scenarios, objection handling, discovery questions, landmines, claims rebuttal
- JSON validation with error routing
- Formatted plain-text battlecard output
- Human approval gate (email approve/reject)
- 48-hour approval timeout

### Known issues at release
- Not runtime-tested
- No versioning or diff against previous battlecard for the same competitor
- Mobile app gap is hardcoded in sample data — replace with your real product state
