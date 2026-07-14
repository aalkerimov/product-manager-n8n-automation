# Changelog — Automation Health Dashboard

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Monday 06:00) + Manual Trigger
- 9-workflow sample across 5 collections
- Deterministic computation: pass rate, total hours saved, most active, highest-value, failing workflows sorted by error rate
- By-collection breakdown
- No LLM (by design)
- No approval gate (operational insight to founder only)
- Note: workflow #100 of 100 — final workflow in the Product & Founder Automation OS

### Known issues at release
- Not runtime-tested
- Execution stats are static sample — replace with n8n API HTTP Request for production
- manual_minutes_saved_per_run requires manual calibration per workflow
- No historical trend tracking
