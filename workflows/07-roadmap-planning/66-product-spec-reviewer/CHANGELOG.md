# Changelog — Product Spec Reviewer

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with sample recurring tasks spec
- Webhook trigger for spec submission from Notion, Confluence, etc
- LLM PM checklist review: problem statement, user stories, metrics, scope, open questions, technical, launch plan, edge cases
- Overall quality rating and ready-for-engineering flag
- Strengths, critical gaps, and suggested improvements
- JSON validation with error routing
- PM approval gate before review sent to author
- Rejection logging

### Known issues at release
- Not runtime-tested
- LLM checklist items are not fixed — vary by spec content
- No spec version history tracking
