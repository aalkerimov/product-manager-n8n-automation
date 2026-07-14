# Changelog — ICP Drift Detector

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Monthly schedule trigger (1st of month)
- Manual Trigger with 12 embedded sample customers (11 valid, 1 edge case)
- Google Sheets reader for production use
- Distribution analysis: segment, industry, region, employee size (active vs churned)
- Drift flag output: top actual values vs stated ICP definition
- Monthly report email (no approval gate — informational)

### Known issues at release
- Not runtime-tested
- No automated drift scoring — human judgment required
- No month-over-month comparison without additional Sheets logging
