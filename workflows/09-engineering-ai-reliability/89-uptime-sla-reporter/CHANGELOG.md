# Changelog — Uptime & SLA Reporter

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Monday 09:00) + Manual Trigger
- 4-service sample (Web App 99.9%, API 99.95%, Webhook 99.5%, Data Export 99.0%)
- Deterministic SLA compliance calculation: uptime %, SLA gap, breach flag
- Breach count in approval email subject
- Per-service incident history
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- No LLM (by design)
- Uptime data is static sample — replace with Datadog/PagerDuty HTTP Request calls
- SLA is availability-based only — does not account for latency SLAs
- No monthly rollup or trend tracking
