# Changelog — 1:1 Prep Assistant

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with Alex Chen context (recurring tasks delivery, design spec blocker, Staff Engineer goal)
- LLM at temperature 0.5: opening check-in, agenda with coaching questions, recognition moment, manager follow-ups
- Coaching theme as overarching framing for the conversation
- JSON validation with error routing
- Sent to manager only — no approval gate

### Known issues at release
- Not runtime-tested
- Context requires manual update before each 1:1
- No calendar integration — add Schedule trigger for recurring 1:1 slots
- One person per run — add SplitInBatches for batch weekly prep across all direct reports
