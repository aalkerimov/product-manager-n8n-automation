# Dependency & API Deprecation Watcher

> Monitor package versions and API contracts weekly — flag critical and warning-level deprecations for review before alerting engineering.

---

## 1. Overview

Runs every Monday at 8am. Checks a curated list of npm packages against simulated latest-version data (extend with real npm registry API calls). Classifies each package as `ok`, `warning` (1 major behind), or `critical` (2+ majors behind). Skips notification if all dependencies are current. Requires approval before alerting engineering.

**Status:** beta  
**Collection:** 09 — Engineering & AI Reliability  
**Workflow number:** 85

> **No LLM.** All version comparison is deterministic code.

---

## 2. The problem

Dependency drift accumulates silently. A library that's 2 major versions behind becomes a security risk and a migration cliff — the longer you wait, the more breaking changes accumulate. This workflow creates a weekly forcing function to catch drift early.

---

## 3. How it works

```
Schedule (Mon 8am) ─┐
                     ├─→ Load Watch List ─→ Check Versions ─→ Any Warnings? ─→ Format ─→ Approval ─→ Send to Engineering
Manual Trigger ──────┘                                                ↓
                                                             All Current (no email)
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| SMTP Email | Basic | Yes | Approval and engineering alert |

---

## 5. Five-minute setup

```
Step 1: Create credential
  a. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  DEPRECATION_EMAIL_TO       = engineering@yourcompany.com
  DEPRECATION_APPROVER_EMAIL = pm@yourcompany.com (if different)

Step 3: Update watch list
  Edit "Load Watch List" Code node.
  Add your actual dependencies with current_version and notes.

Step 4: Activate real version checking
  In "Check Package Versions" Code node, replace the hardcoded latestVersions map
  with HTTP Request calls to: GET https://registry.npmjs.org/{package}/latest
  This returns { "version": "x.y.z" } — map to latestVersions[dep.name].
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DEPRECATION_EMAIL_TO` | Required | — | Engineering team recipients |
| `DEPRECATION_APPROVER_EMAIL` | Optional | Same as above | PM approver |

---

## 7. Input schema

```json
{
  "dependencies": [{ "name": "string", "current_version": "12.3.0", "package_registry": "npm", "notes": "string" }]
}
```

---

## 8. Output schema

```json
{
  "version_warnings": [{ "name": "string", "current_version": "string", "latest_version": "string", "majors_behind": 2, "status": "critical|warning|ok", "notes": "string" }],
  "meta": { "total": 4, "critical": 1, "warning": 2 }
}
```

---

## 9. Estimated AI cost

None. No LLM.

---

## 10. Privacy and security

- No sensitive data processed. Package names and version numbers are public.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| All dependencies current | "All Dependencies Current" node; no email sent |
| Email fails | Retries 3 times |
| Approval timeout | Alert not sent |

---

## 12. Customization examples

### Real npm registry calls

Replace the hardcoded `latestVersions` map with HTTP Request nodes (one per package): `GET https://registry.npmjs.org/{{dep.name}}/latest`. Extract `json.version`. Use SplitInBatches to process the dependency list one at a time.

### PyPI support

For Python packages: `GET https://pypi.org/pypi/{package}/json`. Extract `info.version`.

---

## 13. How to test

1. Click **Manual Trigger** — 4 packages loaded with simulated version data.
2. "Any Warnings?" — routes to Format (stripe 2 majors behind = critical, openai/express/react 1 major = warning).
3. Approve → engineering receives prioritised upgrade list.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Version comparison uses simulated data** — replace hardcoded `latestVersions` map with real npm HTTP Request calls for production use.
- **No API sunset header probing** — add HTTP Request nodes for each `api_contracts` entry to check `Sunset` response headers.
- **npm only** — add PyPI/Maven/rubygems endpoints for polyglot stacks.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `scheduleTrigger`, `manualTrigger`, `code`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
