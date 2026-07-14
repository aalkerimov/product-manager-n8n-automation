# Changelog — Analyst and Review Platform Tracker

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule Trigger (configurable cron)
- Manual Trigger with embedded 3-company sample snapshot
- Snapshot validation with error on missing companies array
- Structured report builder: our position + competitor comparison
- Weekly email delivery (no approval gate — informational report)

### Known issues at release
- Not runtime-tested
- No live G2/Capterra data fetching — must be added manually (see README)
- No delta tracking — requires snapshot storage setup
- HTML parsing of review platforms is brittle if their page structure changes
