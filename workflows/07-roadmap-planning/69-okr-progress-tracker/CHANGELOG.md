# Changelog — OKR Progress Tracker

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Monday schedule trigger
- Manual Trigger with 3 sample objectives (10 KRs total)
- Four KR types: numeric, binary, numeric_inverse, binary_inverse
- Per-KR progress and status (on-track/at-risk/off-track)
- Per-objective progress (average of KR scores)
- Portfolio overall progress percentage
- At-risk / off-track call-out section in report
- Weekly email with emoji-coded status indicators

### Known issues at release
- Not runtime-tested
- KR values must be updated manually — no automatic pull from tracking tools
- Status thresholds are hard-coded (70%/40%) — adjustable in Code node
- No historical tracking without additional Sheets logging
