# Changelog — LLM Prompt Regression Tester

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Manual Trigger with 3 test cases (JTBD extractor, bug severity classifier, sentiment classifier)
- Test assertion types: equals, contains, min_length
- Simulated LLM responses for sample mode
- Pass/fail reporting with per-assertion detail
- Failure count surfaced in approval email subject
- PM approval gate with 48h timeout
- Rejection logging

### Known issues at release
- Not runtime-tested
- "Run Regression Tests" uses simulated responses — replace with real HTTP Request loop for production
- Assertions are structural, not semantic — add embedding cosine similarity for drift detection
- No parallel execution — add SplitInBatches for large test suites
- No CI/CD integration — add webhook trigger and GitHub Actions step for deployment-gated testing
