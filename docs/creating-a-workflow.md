# Creating a New Workflow

This guide walks you through building and submitting a new workflow for this project.

---

## Step 1: Start with the problem

Write one sentence: **What repeated problem does this workflow solve?**

If you cannot answer in one sentence, the scope is too broad. Split it.

Good: "Notify the team when a competitor publishes a new job posting for engineers."
Too broad: "Monitor the entire competitive landscape."

---

## Step 2: Choose your trigger

| Trigger type | When to use |
|---|---|
| **Schedule** | Runs on a fixed cadence (cron) |
| **Webhook** | Triggered by an external event (form submit, Zapier, etc.) |
| **Manual** | Run by a person on demand |

Most workflows in this project use a Schedule trigger with a manual override.

---

## Step 3: Design the data flow

Sketch the flow on paper first:

```
Trigger → Collect data → Normalise → Process / AI → Approval? → Notify → Store
```

Ask:
- What data do I need and where does it come from?
- What is the single output — a message, a file, a ticket?
- Is there a consequential external action that needs human approval?
- What happens if a step fails?

---

## Step 4: Create the directory

```bash
mkdir workflows/your-workflow-name
cd workflows/your-workflow-name
touch workflow.json README.md sample-input.json sample-output.json configuration.example.json
```

---

## Step 5: Build in n8n

1. Open n8n → **Workflows → New**
2. Build and test your workflow with sample data
3. Export: **⋮ → Download**
4. Save the exported JSON as `workflow.json`

### Required workflow properties

Make sure the exported JSON contains:
```json
{
  "name": "Your Workflow Name",
  "nodes": [...],
  "connections": {...},
  "settings": {
    "executionOrder": "v1",
    "saveManualExecutions": true,
    "saveExecutionProgress": true,
    "errorWorkflow": ""
  }
}
```

### Node naming conventions

| Pattern | Example |
|---|---|
| Action + subject | "Fetch GitHub PRs" |
| Decision | "Is change important?" |
| Storage | "Save to Sheets: Feedback" |
| AI step | "Classify: Sentiment + Urgency" |
| Integration | "Notify: Slack #product-alerts" |

Avoid generic names: "HTTP Request 3", "Set 2", "IF 1"

---

## Step 6: Add Sticky Notes

Add at least one Sticky Note at the top of the workflow:
```
📌 SETUP REQUIRED
1. Create OpenAI credential named "OpenAI API"
2. Set SLACK_CHANNEL_ALERTS in environment
3. Test with the Manual Trigger first
```

Add Sticky Notes near complex nodes explaining the logic.

---

## Step 7: Add error handling

For every HTTP Request node:
1. Set **Retry on fail**: 3 times
2. Set **Wait between tries**: 1000 ms (exponential)
3. Add an error branch (right-click → Add error output)
4. In the error branch: log to storage + send a low-priority alert

---

## Step 8: Write the README

Use this template:

```markdown
# Workflow Name

> One sentence: what problem this solves.

## How it works
1. Step one
2. Step two
...

## Required integrations
- OpenAI API (required)
- Slack (optional — falls back to email)

## Installation (5 minutes)
1. Import workflow.json
2. Create credentials
3. Set environment variables
4. Test with Manual Trigger

## Configuration variables
| Variable | Default | Description |
|---|---|---|
| MY_VAR | value | What it controls |

## Input schema
...

## Output schema
...

## Estimated cost
- AI: ~$0.05 per run (gpt-4o-mini)
- Infrastructure: none beyond n8n

## Privacy and security
...

## Failure behaviour
...

## Customisation examples
...

## Testing
1. Use the Manual Trigger
2. Paste content from sample-input.json
3. Compare output to sample-output.json

## Known limitations
...
```

---

## Step 9: Add sample data

`sample-input.json` — realistic but fictional data. No real customer names or emails.
`sample-output.json` — what the workflow produces given that input.
`configuration.example.json` — all configurable variables with example values.

---

## Step 10: Validate and submit

```bash
# Validate JSON syntax
node scripts/validate-json.js workflows/your-workflow-name/workflow.json

# Check for accidental secrets
node scripts/check-secrets.js workflows/your-workflow-name/

# Check required files exist
node scripts/check-required-files.js workflows/your-workflow-name/
```

Then open a pull request following the [CONTRIBUTING.md](../CONTRIBUTING.md) checklist.
