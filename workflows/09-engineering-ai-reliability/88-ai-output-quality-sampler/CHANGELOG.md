# Changelog — AI Output Quality Sampler

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 3 sample outputs (bug triage, survey analyser, JTBD extractor)
- LLM evaluator at temperature 0.1: accuracy, usefulness, format compliance (1-5 each)
- Issue identification for scores < 4
- Highlight identification for top-quality outputs
- Average overall score and low-quality count in approval subject
- Recommended actions for prompt improvement
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- LLM-as-evaluator has inherent biases — treat scores as directional, not ground truth
- Samples must be added manually — add n8n execution API integration for automated sampling
- No trend storage — add Google Sheets/Airtable persistence for week-over-week comparison
