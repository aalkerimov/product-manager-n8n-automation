# Changelog — Survey Response Analyser

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 15 sample NPS responses
- Webhook trigger for survey export integration
- Deterministic NPS calculation (promoters/passives/detractors/score) — no LLM
- LLM: open-text → themes (sentiment, frequency, quotes, response IDs), top 3 insights, critical issues, delight signals, feature requests, recommended actions
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- Theme frequency counts are LLM-estimated, not exact — use response_ids for exact matching
- Large surveys (500+ responses) may need chunking — token limit applies
- Requires participant consent for open-text LLM processing
