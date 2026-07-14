# Research Repository Tagger

> Automatically tag research notes with themes, personas, sentiment, confidence, and insight statements — reviewed before writing back to your research repository.

---

## 1. Overview

Takes raw research notes (from usability tests, surveys, interviews) and tags them using a predefined taxonomy. Each note receives: theme tags, persona tags, sentiment, evidence type, confidence level, an actionability flag, a one-sentence insight statement, and a suggested follow-up question. Requires approval before results are sent to the research team.

**Status:** beta  
**Collection:** 08 — User Research & Discovery  
**Workflow number:** 76

---

## 2. The problem

Research notes pile up in Dovetail, Notion, or spreadsheets, untagged and unsearchable. Without consistent tags, researchers can't answer "what do we know about onboarding?" without reading every note. This workflow adds structured tags in seconds — making the research repository searchable and usable.

---

## 3. How it works

```
Manual Trigger (sample) ─┐
                          ├─→ Prepare Prompt ─→ LLM: Tag Notes ─→ Validate ─→ Format ─→ Approval ─→ Send to Team
Webhook: Research Note ───┘
```

---

## 4. Required integrations

| Integration | Stack | Required | Purpose |
|---|---|---|---|
| OpenAI-compatible LLM | Basic | Yes | Tag assignment and insight extraction |
| SMTP Email | Basic | Yes | Approval and team notification |

---

## 5. Five-minute setup

```
Step 1: Create credentials
  a. HTTP Header Auth named "YOUR_OPENAI_CREDENTIAL"
  b. SMTP named "YOUR_SMTP_CREDENTIAL"

Step 2: Set environment variables
  REPO_EMAIL_TO       = research@yourcompany.com
  REPO_APPROVER_EMAIL = pm@yourcompany.com (if different)
  AI_MODEL            = gpt-4o-mini

Step 3: Update your taxonomy
  Edit "Load Sample Notes" Code node → update the taxonomy object with your actual themes, personas, and evidence types.

Step 4: To write tags back to Dovetail/Notion
  After "Approved?", add HTTP Request nodes to the Dovetail API or Notion API to write the approved tags back to each note by ID.
```

---

## 6. Configuration reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `REPO_EMAIL_TO` | Required | — | Research team recipients |
| `REPO_APPROVER_EMAIL` | Optional | Same as `REPO_EMAIL_TO` | PM approver |
| `AI_MODEL` | Required | `gpt-4o-mini` | LLM model |

---

## 7. Input schema

```json
{
  "notes": [{ "id": "N001", "title": "string", "content": "string", "source": "string", "participant_code": "string" }],
  "taxonomy": { "themes": ["string"], "personas": ["string"], "evidence_types": ["string"] }
}
```

---

## 8. Output schema

```json
{
  "tagged_notes": [{ "id": "string", "themes": ["string"], "personas": ["string"], "sentiment": "positive|negative|neutral|mixed", "evidence_type": "string", "confidence": "high|medium|low", "actionable": true, "insight_statement": "string", "suggested_follow_up": "string|null" }]
}
```

---

## 9. Estimated AI cost

5 notes: ~1,500 tokens | gpt-4o-mini | ~$0.002. 50 notes: ~8,000 tokens | ~$0.01.

---

## 10. Privacy and security

- Research note content (may include participant quotes) sent to LLM.
- Use participant codes, not names.

---

## 11. Failure behaviour

| Failure | What happens |
|---|---|
| LLM invalid JSON | Error handler; no tags applied |
| Email fails | Retries 3 times |
| Approval timeout | Tags not written |

---

## 12. Customization examples

### Write tags to Dovetail

After approval, use Dovetail's API to update each note with the returned tag array. Map `themes` and `personas` to Dovetail insight tags.

### Write tags to Notion database

After approval, use the Notion API to update each note record's `Tags` multi-select property with the returned `themes` array.

---

## 13. How to test

1. Click **Manual Trigger** — 5 sample notes loaded.
2. "Validate LLM Output" — `_error: false`, `tagged_notes` array present.
3. Approve → research team notified with tag summary.

---

## 14. Known limitations

- **Not runtime-tested.**
- **Automated write-back to Dovetail/Notion requires additional HTTP Request nodes** — not included in base version.
- **Tags are constrained to taxonomy** — add new themes to the taxonomy object as your research grows.
- **Confidence is LLM judgment** — low-confidence tags should be reviewed manually.

---

## 15. Dependencies

n8n 1.50.0+. Node types: `manualTrigger`, `webhook`, `code`, `httpRequest`, `if`, `set`, `emailSend`, `wait`, `stickyNote`

---

## 16. Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

---

## 17. License

MIT — see [LICENSE](../../../../LICENSE).

---

## 18. Changelog

See `CHANGELOG.md`.
