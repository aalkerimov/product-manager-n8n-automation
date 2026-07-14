# Changelog — Dependency & API Deprecation Watcher

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Monday 08:00) + Manual Trigger
- Watch list with 4 npm packages (stripe, openai, express, react)
- Deterministic version comparison: ok / warning (1 major behind) / critical (2+ majors behind)
- "Any Warnings?" guard — no email when all dependencies are current
- PM approval gate with 48h timeout
- Engineering alert with upgrade priority list
- Rejection logging

### Known issues at release
- Not runtime-tested
- No LLM (by design)
- Version check uses simulated latestVersions map — replace with npm registry HTTP Request calls for production
- No API sunset header probing — add HTTP Request nodes for each api_contracts entry
- npm only — add PyPI/Maven endpoints for polyglot stacks
