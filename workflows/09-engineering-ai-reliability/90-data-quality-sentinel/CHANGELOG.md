# Changelog — Data Quality Sentinel

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Daily Schedule trigger (07:00) + Manual Trigger
- 6-check sample across 5 tables: events.page_views (2 failures), users.accounts, billing.transactions, nps.responses, product.feature_flags
- Supported check types: freshness, volume, completeness, uniqueness
- "Any Failures?" guard — no email when all checks pass
- Failure detail: actual vs threshold per check type
- By-table summary showing failure distribution
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- No LLM (by design)
- Check results are static sample — replace with BigQuery/Snowflake HTTP Request queries for production
- Volume check requires external baseline calculation — hardcoded in sample
- No trend storage for pass rate over time
