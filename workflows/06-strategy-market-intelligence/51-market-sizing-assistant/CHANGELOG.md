# Changelog — Market Sizing Assistant

All notable changes to this workflow are documented here.

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with embedded sample data for zero-account testing
- Webhook intake for real market briefs
- Input validation: required fields, type coercion
- LLM prompt that requests TAM/SAM/SOM with explicit numbered assumptions, confidence ratings, and source references
- JSON schema validation on LLM output with error routing
- SAM > TAM sanity check
- Bull/base/bear sensitivity ranges on all three estimate tiers
- Plain-text report formatter (converts USD values to B/M/K notation)
- Human approval gate via email (approve/reject links with n8n Wait node)
- 48-hour approval timeout (no action = report not sent)
- Optional Google Sheets logging of each run
- Rejection logging with timestamp

### Known issues at release
- Not runtime-tested against a live n8n instance
- LLM output accuracy depends on quality of revenue proxies provided
- Google Sheets node typeVersion and column mapping require manual verification after import
