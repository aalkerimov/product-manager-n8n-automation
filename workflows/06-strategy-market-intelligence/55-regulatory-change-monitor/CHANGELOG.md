# Changelog — Regulatory Change Monitor

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Bi-weekly schedule (Monday + Thursday at 09:00, configurable)
- Manual Trigger with 6 sample regulatory changes across EU, US, US-CA
- Jurisdiction filter from environment variable
- LLM mapping of each change to configured product areas
- JSON validation with error routing
- Priority routing: high-priority → urgent email, lower → routine digest
- Formatted plain-text alert and digest output

### Known issues at release
- Not runtime-tested
- No real RSS feed reading — must be added manually
- No deduplication of changes across bi-weekly runs
- Jurisdiction filter is prefix-match only (US matches US-CA)
