# Changelog — Release Notes Generator

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 10 embedded sample tickets
- Webhook trigger for post-deploy automation
- LLM: technical ticket title → user-facing note translation
- Separate sections: What's New, Improvements, Bug Fixes, Security
- Full GFM markdown release notes in `full_text_markdown` field
- JSON validation with error routing
- Human approval gate with 48h timeout
- Rejection logging
- Separate distribution email (`RELEASE_DISTRIBUTION_EMAIL`)

### Known issues at release
- Not runtime-tested
- No direct publishing to Notion, Confluence, or changelog tools — email only
- Security descriptions are intentionally generic — review before publishing CVE details
