# Changelog — Discovery Session Scheduler

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 3-participant, 3-timezone sample (UTC+2, UTC+0, UTC-8)
- Deterministic scheduling code: day overlap matching + UTC/local time conversion
- Reasonable hours filter (07:00–18:00 participant local)
- Unscheduled participant list with reason when no overlap found
- PM approval gate with 48h timeout
- Confirmed schedule delivered to researcher
- Rejection logging

### Known issues at release
- Not runtime-tested
- No LLM (by design)
- Simple timezone algorithm — UTC±N only, no daylight saving time
- Suggests scheduling day but not exact date — no calendar date assignment
- Does not detect double-booking — integrate with Calendly/Google Calendar for real-time availability
- Researcher must send actual invitations manually after approval (unless Calendly API integrated)
