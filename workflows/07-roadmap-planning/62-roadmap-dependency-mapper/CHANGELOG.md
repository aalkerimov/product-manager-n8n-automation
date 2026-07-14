# Changelog — Roadmap Dependency Mapper

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 10 embedded sample roadmap items
- Webhook trigger for on-demand mapping from external tools
- DFS-based circular dependency detection
- Longest-path (critical path) computation via relaxation
- Blocker ranking by downstream impact count
- Root node identification (items with no dependencies)
- Formatted plain-text report delivered by email

### Known issues at release
- Not runtime-tested
- Critical path algorithm uses simple relaxation, not topological sort — accurate for acyclic graphs only
- No approval gate — report is informational
- `blocks` and `depends_on` must be manually kept consistent in source data
