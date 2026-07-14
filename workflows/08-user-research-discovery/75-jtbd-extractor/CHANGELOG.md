# Changelog — Jobs-to-be-Done Extractor

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 9 mid-market team lead interview excerpts
- LLM: raw excerpts → functional jobs (When/I want/so I can), emotional jobs (positive/negative valence), social jobs (perceived as / by), pain points with severity
- Underserved job flagging
- Evidence index traceability back to input quotes
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- JTBD quality is proportional to excerpt quality — vague quotes produce vague jobs
- Evidence indexes are LLM-assigned — verify against source quotes manually
- Underserved flag is LLM judgment, not quantitative validation
