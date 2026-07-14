# Changelog — Weekly Priorities Planner

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Monday 07:00) + Manual Trigger
- Context: OKRs, 5-item backlog with urgency/estimates, committed deliverables, key meetings
- LLM at temperature 0.4: weekly theme, top 3 priorities with rationale and suggested day
- Defer list, delegate list, focus time allocation, weekly risks, end-of-week success criteria
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- Weekly context requires manual update each Sunday
- LLM does not have access to real calendar — meeting data must be manually entered
- No Linear/Jira auto-pull — integrate with API for automated backlog ingestion
