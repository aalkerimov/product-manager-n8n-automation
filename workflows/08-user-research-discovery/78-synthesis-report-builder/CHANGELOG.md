# Changelog — Synthesis Report Builder

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 4-study Q3 onboarding/adoption research sample
- LLM: study findings → executive summary, cross-study patterns (with confidence and strategic implication), reconciled findings, prioritised recommendations (priority × effort × evidence strength), open questions, next studies suggested
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- Pattern confidence is LLM judgment — low-confidence patterns need manual validation
- Synthesis quality proportional to input quality — vague findings produce vague synthesis
- No PDF export in base version — add HTTP Request to PDF service after approval
