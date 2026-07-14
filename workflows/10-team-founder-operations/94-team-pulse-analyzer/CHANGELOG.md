# Changelog — Team Pulse Analyzer

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Friday 16:00) + Manual Trigger
- 5-member sample: mood scores, blockers, wins, load, needs_help flags
- Avg mood, at-risk detection (mood ≤2 or needs_help=true), mood distribution bar
- Blocker theme extraction (keyword matching across blocker text)
- Wins list aggregation
- No LLM (by design)
- No approval gate (personal manager insight)

### Known issues at release
- Not runtime-tested
- Responses require manual entry — connect to Typeform/Slack webhook
- Blocker theme matching is keyword-based — add LLM step for semantic theme clustering
- No cross-week trend tracking
