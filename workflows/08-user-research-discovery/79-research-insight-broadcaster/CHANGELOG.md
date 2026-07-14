# Changelog — Research Insight Broadcaster

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 4-audience recurring tasks insight sample
- Deterministic code formatting: core insight + audience summaries → formatted broadcast messages with urgency-appropriate subject lines
- Approval email showing preview of all audience versions
- PM approval gate with 48h timeout
- Broadcast send to combined recipient list
- Rejection logging

### Known issues at release
- Not runtime-tested
- No LLM (by design) — audience summaries are PM-authored
- Base version sends to one combined TO address — add SplitInBatches for per-group email routing
- No Slack integration in base version — add HTTP Request for Slack channel posting
