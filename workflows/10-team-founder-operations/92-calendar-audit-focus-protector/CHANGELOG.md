# Changelog — Calendar Audit & Focus Protector

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Monday 06:00) + Manual Trigger
- 9-event sample across 5 days, 6 categories
- Deterministic analysis: meeting hours, focus %, recurring vs. one-off split
- Heaviest day identification
- By-category hour breakdown
- Focus threshold alert (configurable, default 40%)
- Rule-based recommendations: light days → deep work, high recurring % → review, heavy days → protect mornings
- No LLM (by design)
- No approval gate (personal audit)

### Known issues at release
- Not runtime-tested
- Calendar events must be manually entered — integrate with Google Calendar API for production
- No cross-week trend tracking
