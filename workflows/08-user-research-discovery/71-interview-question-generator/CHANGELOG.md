# Changelog — Interview Question Generator

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with sample switching motivation research brief
- Webhook trigger for research request submissions
- LLM: research brief → complete semi-structured interview guide
- Screener questions, warm-up, topic sections with probes, closing questions
- Do-not-ask list based on researcher notes
- Analysis framework suggestion
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- LLM question quality must be reviewed for leading language before use
- Do-not-ask enforcement is manual — no technical enforcement
- No participant recruitment integration
