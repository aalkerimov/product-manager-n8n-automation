# Contributing to Product & Founder Automation OS

Thank you for helping make automation accessible to product teams and founders.

---

## Ways to contribute

- **Submit a new workflow** — see the checklist below
- **Improve an existing workflow** — bug fixes, better error handling, new integrations
- **Improve documentation** — clearer setup steps, diagrams, examples
- **Report a bug** — open a GitHub Issue with the template
- **Request a workflow** — open a GitHub Issue tagged `workflow-request`

---

## Before you start

1. Check open issues and PRs to avoid duplicate work
2. For large changes, open an issue first to discuss the approach
3. Keep the [design principles](README.md#design-principles) in mind

---

## Submitting a new workflow

### Required files

Each workflow must be in its own directory under `workflows/`:

```
workflows/your-workflow-name/
├── workflow.json            # Valid, importable n8n JSON (REQUIRED)
├── README.md                # Full documentation (REQUIRED)
├── sample-input.json        # Mock input data (REQUIRED)
├── sample-output.json       # Expected output (REQUIRED)
├── configuration.example.json # All config variables documented (REQUIRED)
└── screenshot.png           # Optional but strongly encouraged
```

### README must include

- [ ] Problem description (1–3 sentences)
- [ ] How the workflow works (step-by-step)
- [ ] Required integrations
- [ ] Installation in under 5 minutes
- [ ] Configuration variables table
- [ ] Input and output schemas
- [ ] Estimated AI and infrastructure cost
- [ ] Privacy and security considerations
- [ ] Failure behaviour
- [ ] At least one customisation example
- [ ] How to test it
- [ ] Known limitations

### Workflow quality checklist

- [ ] `workflow.json` is valid JSON (`scripts/validate-json.js`)
- [ ] No credentials, API keys, real emails, or real customer data in any file
- [ ] All placeholders use the format `YOUR_PLACEHOLDER_NAME` in UPPER_SNAKE_CASE
- [ ] Environment variables used for configurable values
- [ ] Sticky Notes explain setup steps and non-obvious logic
- [ ] Error handling on every HTTP call (retry + error branch)
- [ ] Human approval gate before any external write action
- [ ] Works with sample data without paid integrations
- [ ] Node names are clear and descriptive (not "HTTP Request 3")
- [ ] No invented or unsupported n8n node properties
- [ ] Tested on n8n 2.30.0 or documented if not runtime-tested
- [ ] `scripts/check-secrets.js` passes (no accidental secrets)
- [ ] `scripts/check-required-files.js` passes

### Pull request checklist

- [ ] PR title follows the format: `feat(workflow): <short description>`
- [ ] Description explains the problem, the solution, and any design decisions
- [ ] All CI checks pass
- [ ] No merge conflicts
- [ ] Requested a review from at least one maintainer

---

## Code style

- Use 2-space indentation in JSON files
- Use kebab-case for directory names
- Use `UPPER_SNAKE_CASE` for placeholder values
- Keep node names under 50 characters
- Add a comment in Sticky Notes for anything non-obvious

---

## Improving existing workflows

- Follow the same quality checklist above
- Include a `## Changelog` entry in the workflow README
- Bump the version field in `workflow.json` if it exists

---

## Reporting bugs

Open a GitHub Issue with:
1. n8n version (`Settings → About`)
2. Workflow name and version
3. Steps to reproduce
4. Expected vs. actual behaviour
5. Any error messages (redact sensitive data)

---

## Code of conduct

Be kind. Assume good intent. Focus on the work.
This project follows a simple rule: constructive criticism only, no personal attacks.

---

## License

By contributing, you agree that your contributions are licensed under MIT.
