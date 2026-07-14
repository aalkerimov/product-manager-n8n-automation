# Changelog — Competitive Pricing Monitor

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Wednesday schedule trigger
- Manual Trigger with embedded 2-competitor snapshot (1 with changes, 1 without)
- Code-based diff engine: detects price changes (amount + direction + %), feature additions/removals, new plans
- Early exit if no changes detected (no LLM called, no email sent)
- LLM implications analysis (only on change detection)
- JSON validation with error routing
- Formatted plain-text alert with raw diff + analysis
- Human approval gate (email) with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- No automatic web scraping — snapshots must be maintained manually or via custom HTTP nodes
- No persistent snapshot storage — previous snapshot is embedded in sample data
