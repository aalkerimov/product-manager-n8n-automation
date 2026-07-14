# Changelog — Research Repository Tagger

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 5 sample notes (usability, NPS, interview sources)
- Webhook trigger for real-time note tagging from external tools
- LLM: notes → themes, personas, sentiment, evidence type, confidence, actionability flag, insight statement, suggested follow-up
- Taxonomy-constrained tagging (themes, personas, evidence types)
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- Write-back to Dovetail/Notion requires additional HTTP Request nodes — not included
- Taxonomy must be manually maintained in the Code node
- Low-confidence tags should be reviewed manually before writing to repo
