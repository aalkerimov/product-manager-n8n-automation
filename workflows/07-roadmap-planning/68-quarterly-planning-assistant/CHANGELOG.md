# Changelog — Quarterly Planning Assistant

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with sample Q3 2026 planning context
- LLM (gpt-4o recommended): recommended bets, tradeoffs, must-do list, suggested deferrals, capacity allocation, risk register, OKR suggestions
- JSON validation with error routing
- CPO approval gate with 72h timeout (larger than standard 48h for quarterly cadence)
- Separate approver and leadership email targets
- Rejection logging

### Known issues at release
- Not runtime-tested
- Status data must be manually populated — no automatic pull from Linear/Jira/metrics
- Capacity allocation is a rough estimate — does not account for individual skill profiles or PTO
