# Changelog — Win/Loss Analysis Engine

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Monthly Schedule Trigger (configurable cron)
- Manual Trigger with 10 embedded sample deals (1 intentional edge case)
- Google Sheets reader for CRM deal export
- Input validation: skips records missing deal_id, outcome, or segment
- LLM prompt for pattern detection: win themes, loss themes, competitor analysis, segment breakdown
- JSON schema validation on LLM output with error routing
- Plain-text report formatter
- Human approval gate with 48-hour timeout
- Rejection logging

### Known issues at release
- Not runtime-tested against live n8n
- Google Sheets column mapping requires manual verification after import
- Deal note truncation at 500 chars may cut off critical context
