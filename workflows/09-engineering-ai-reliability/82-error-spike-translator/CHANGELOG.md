# Changelog — Error Spike Translator

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 3-spike Datadog alert sample (critical timeout, high TypeError, low auth error)
- LLM: technical error logs → executive summary, plain-English per-error descriptions, user impact, affected feature, regression flag, estimated user impact %, recommended PM action
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- User impact % is LLM estimate — treat as order-of-magnitude
- Requires mapping from actual Datadog/Sentry webhook payloads to the spike schema in a Code node
- No auto-Slack integration — add HTTP Request for Slack channel posting
