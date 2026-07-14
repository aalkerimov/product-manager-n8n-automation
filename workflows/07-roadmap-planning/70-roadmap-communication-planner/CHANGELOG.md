# Changelog — Roadmap Communication Planner

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with Q3 2026 sample roadmap context
- LLM communication plan: per-stakeholder messages with tone, timing, and do-not-share guidance
- Message types: announcement, update, expectation-setting, defer-notice
- Sensitive items flagging with recommended handling
- Deferral notices with suggested customer-facing copy
- Communication calendar (date/trigger, action, groups)
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- Confidentiality enforcement is prompt-based, not structural
- Base version sends full plan to PM team — add SplitInBatches for per-stakeholder routing
- Deferral copy is a first draft — review before sending to customers
