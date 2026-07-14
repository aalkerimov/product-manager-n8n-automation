# Changelog — AI Cost Monitor

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Monday 09:00) + Manual Trigger
- Sample week with 4 workflows, 2 models (gpt-4o, gpt-4o-mini)
- Deterministic cost calculation: input/output token pricing per model
- Per-workflow over-budget flag
- Total budget burn rate with configurable alert threshold
- Cost sorted descending by workflow
- Model cost breakdown
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- No LLM (by design)
- Usage data is static sample — replace with OpenAI usage API call or n8n log aggregation
- Pricing is hardcoded — update pricing map when OpenAI changes rates
- No month-over-month trend tracking — add Google Sheets/Airtable persistence
