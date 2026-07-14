# Changelog — Sprint Retrospective Analyser

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 14 embedded sample retro items
- Webhook trigger for integration with retro board tools
- LLM theme extraction: went-well themes, improvement themes (with root cause), and recurring flag
- Team health signal (improving/stable/declining)
- Prioritised action list with owner, timeline, and addressed theme
- JSON validation with error routing
- Human approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- LLM recurring flag based on single-sprint analysis — no cross-sprint data
- No integration with retro tools out of the box
