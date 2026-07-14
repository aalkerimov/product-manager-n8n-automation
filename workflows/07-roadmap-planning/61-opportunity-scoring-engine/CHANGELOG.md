# Changelog — Opportunity Scoring Engine

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Monthly schedule trigger
- Manual Trigger with 10 embedded sample opportunities
- Google Sheets reader for production use
- RICE scoring: Reach × Impact × Confidence% / Effort with division-by-zero guard
- Strategic fit modifier (±0 to ±0.5 adjustment)
- Sort by adjusted score descending
- Rank assignment (1 = highest priority)
- Monthly email report with full ranked list
- Skipped record counting

### Known issues at release
- Not runtime-tested
- No historical score tracking without additional Sheets logging
- No approval gate — report is informational
