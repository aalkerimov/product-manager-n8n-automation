# Changelog — Tech Debt Register

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 4 tech debt items (auth middleware, frontend re-render, raw SQL routes, unused CSS)
- LLM: debt items → blast radius, velocity tax, risk trajectory, priority rank, story point estimate, recommended action (pay-now/schedule/monitor/accept), rationale
- Sprint paydown recommendation given capacity constraint
- Total effort estimate across all items
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- Story point estimates are LLM guesses — validate with engineering
- Blast radius requires runtime traffic data — LLM estimates from description context only
- Scoring is relative to items in the batch — include all significant debt for accurate ranking
