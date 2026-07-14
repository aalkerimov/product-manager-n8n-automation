# Changelog — Documentation Freshness Checker

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Monday 09:00) + Manual Trigger
- 7-doc inventory with per-doc stale_threshold_days
- Severity computation: critical (≥3× past due), warning (≥2×), stale (past threshold), fresh
- "All Docs Fresh" no-email guard
- By-owner grouping for action accountability
- PM approval gate before notifying owners
- No LLM (by design)

### Known issues at release
- Not runtime-tested
- Doc inventory requires manual maintenance — integrate with Notion/Confluence API
- today is hardcoded in sample — replace with dynamic date in production
