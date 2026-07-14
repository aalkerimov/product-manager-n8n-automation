# Changelog — New Hire Onboarding Tracker

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Monday 09:00) + Manual Trigger
- Sofia Park sample: Day 14, 4/7 milestones complete, all on track
- Deterministic milestone tracking: due_date = start_date + due_day, overdue = today > due_date AND not completed
- Overdue vs. on-track branching
- On-track: direct HR report (no approval gate)
- Overdue: manager approval gate before HR alert
- pct_complete, days_overdue, next_due per hire
- No LLM (by design)

### Known issues at release
- Not runtime-tested
- Milestone data must be updated manually — integrate with Airtable or Google Sheets
- Single hire in sample — extend hires array for multiple simultaneous onboarding
- today is hardcoded in sample — replace with new Date().toISOString().slice(0,10) in production
