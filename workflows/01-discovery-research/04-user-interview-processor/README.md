# 04 — User Interview Processor

> Turn raw interview transcripts into structured research artefacts your whole team can use.

---

## 1. What this workflow does

Accepts a raw interview transcript (pasted text, webhook payload, or audio-to-text), extracts problems, motivations, current alternatives, key quotes, objections, and opportunities using AI — then sends the structured artefact for human approval before saving or sharing it. Every finding is linked back to the original participant and date.

## 2. Who it is for

Product managers and UX researchers running 5–50+ interviews per quarter who want consistent, searchable notes without spending an hour synthesising each conversation.

## 3. Example result

```
Participant: Sarah (Head of Operations, Acme Inc — Enterprise)
Date: 2025-01-10
Problems: 3 (2 high, 1 critical)
Opportunities: 2 (1 high-confidence)
Key quotes: 5
Sentiment: Negative
```

## 4. How it works

```
Webhook or Manual Trigger
    ↓ Normalise (ID, participant, segment, date)
    ↓ AI extraction (problems · motivations · quotes · objections · opportunities)
    ↓ Parse and structure
    ↓ Human approval (email, 48h timeout)
    ↓ Send artefact (email / Slack)
```

## 5. Required integrations

| Integration | Purpose | Required |
|---|---|---|
| OpenAI API | Extract artefacts from transcript | ✅ |
| SMTP Email | Approval email + artefact delivery | ✅ |
| Slack API | Post to research channel | Optional |
| Notion API | Save artefact to research database | Optional |

## 6. Five-minute setup

```bash
# 1. Import subworkflows first (human-approval, notification-router)
# 2. Import this workflow
# 3. Create credentials: OpenAI API, SMTP Email
# 4. Set environment variables:
#    NOTIFICATION_EMAIL_TO=pm@yourcompany.com
#    AI_MODEL_SMART=gpt-4o
# 5. Update workflow IDs in the "Request Human Approval" and "Send Research Artefact" nodes
# 6. Test: Manual Trigger → paste sample transcript → check output
```

## 7. Configuration

| Variable | Default | Required | Description |
|---|---|---|---|
| `NOTIFICATION_EMAIL_TO` | — | ✅ | Recipient for approval + artefact |
| `AI_MODEL_SMART` | `gpt-4o` | ✅ | Model for extraction |
| `NOTIFICATION_CHANNEL` | `email` | Optional | `email`, `slack`, `telegram`, `all` |
| `SLACK_CHANNEL_RESEARCH` | — | Optional | Slack channel for research team |

## 8. How to run it

**Via webhook:** Send a POST to `https://your-n8n.com/webhook/interview-processor` with the input JSON below.

**Manual:** Click "Manual Trigger", paste transcript JSON directly, execute.

**Via automation:** Connect to Otter.ai, Grain, or any transcription service that supports webhooks.

## 9. Input schema

```json
{
  "id":           "string (optional — generated if missing)",
  "participant":  "string — first name or pseudonym",
  "role":         "string — their job title",
  "company":      "string — company name",
  "segment":      "enterprise | growth | startup | consumer",
  "date":         "YYYY-MM-DD",
  "duration_min": "number (optional)",
  "interviewer":  "string (optional)",
  "transcript":   "string — the full interview text (max 15,000 characters)",
  "source":       "manual | otter | grain | rev | other"
}
```

## 10. Output schema

```json
{
  "interview_id": "int_1234567890",
  "participant":  "Sarah",
  "role":         "Head of Operations",
  "company":      "Acme Inc",
  "segment":      "enterprise",
  "date":         "2025-01-10",
  "processed_at": "2025-01-10T14:30:00Z",
  "artefacts": {
    "problems":              [{ "text": "...", "quote": "...", "frequency": "recurring", "severity": "high" }],
    "motivations":           [{ "text": "...", "quote": "..." }],
    "current_alternatives":  [{ "name": "...", "why_used": "...", "why_inadequate": "..." }],
    "key_quotes":            [{ "text": "...", "context": "...", "theme": "..." }],
    "objections":            [{ "text": "...", "quote": "..." }],
    "opportunities":         [{ "text": "...", "confidence": "high", "evidence": "..." }],
    "segment_signals":       [{ "signal": "...", "implication": "..." }],
    "recommended_follow_ups": ["..."],
    "overall_sentiment":     "negative",
    "themes":                ["onboarding", "integration", "reporting"]
  },
  "evidence_link": "Source: interview with Sarah on 2025-01-10"
}
```

## 11. Human approval points

| Gate | What is reviewed | Timeout |
|---|---|---|
| Artefact review | Full extracted artefact before saving or sharing | 48 hours |

Approval prevents AI hallucinations from entering your research repository.

## 12. Cost estimate

| Per interview | Model | Estimated |
|---|---|---|
| ~3,000 word transcript | gpt-4o | ~$0.05–0.15 |
| ~6,000 word transcript | gpt-4o | ~$0.10–0.30 |

Monthly: $0.50–15 for 10–50 interviews.

## 13. Privacy and security

- Transcript text is sent to OpenAI API for processing
- No participant names or emails are shared externally unless in the transcript itself
- Use PII Redaction subworkflow before AI processing if required by your policy
- Artefact is only sent after human approval
- Recommend using the Whisper node for audio rather than third-party services for maximum privacy

## 14. Error and retry behaviour

| Error | Behaviour |
|---|---|
| Invalid JSON input | Workflow logs error and stops |
| AI API failure | Retries 3× with 2s backoff |
| Approval timeout (48h) | Artefact is logged but not shared |
| Notification failure | Retries 3× |

## 15. Customisation examples

### Add audio input via Whisper
Add an HTTP Request node before Normalise Input to call Whisper API with an audio file, then pipe the transcript text into the standard normalise step.

### Save to Notion
Add a Notion node after approval, creating a page in your research database with properties mapped from the artefact output.

### Auto-tag with research themes
Add a Code node after Parse AI Response to cross-reference themes against your defined taxonomy and add structured tags.

## 16. Troubleshooting

| Symptom | Fix |
|---|---|
| AI returns empty arrays | Transcript may be too short (< 200 words). Check transcript field is populated. |
| Approval email not received | Check SMTP credential and NOTIFICATION_EMAIL_TO |
| JSON parse error | AI may have returned markdown code fences — the parse node strips these |
| `HUMAN_APPROVAL_WORKFLOW_ID` placeholder | Update with the actual subworkflow ID after import |

## 17. Known limitations

- Max transcript length: 15,000 characters. Longer transcripts are truncated. Split into segments for longer interviews.
- AI extracts only explicit statements. Implications and body language are not captured.
- Does not transcribe audio — use Whisper or a transcription service first.
- No cross-interview aggregation in this workflow — use workflow 06 (Feature Request Analyzer) for that.

## 18. Tested versions

| n8n | Node type | Status |
|---|---|---|
| 2.30.0 | All nodes in this workflow | Statically validated |

Status: **Beta** — JSON valid, not runtime-tested.
