# Changelog — Engineering Digest for PMs

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Friday 09:00) + Manual Trigger
- Sample week with 2 deployments, 1 P0 incident (resolved), 3 merged PRs
- LLM: engineering activity → PM digest with TL;DR, what shipped, what broke/is fixed, engineering work with rationale, next week preview, action required from PM
- JSON validation with error routing
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- Engineering data must be updated weekly — static sample until GitHub/Linear API integration is added
- No auto-pull from GitHub API — add HTTP Request nodes for automated PR and deployment data ingestion
