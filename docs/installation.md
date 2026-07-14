# Installation Guide

This guide covers every way to install and run the **Product & Founder Automation OS** workflows.

---

## Prerequisites

| Requirement | Minimum | Notes |
|---|---|---|
| n8n | 1.50.0 | Cloud or self-hosted |
| Node.js | 22.x | For local scripts only |
| Docker | 24.x | For local dev stack |
| OpenAI-compatible API | Any | Required for AI nodes |

---

## Method 1: n8n Cloud (fastest)

1. Sign in at [app.n8n.cloud](https://app.n8n.cloud)
2. Ensure your plan supports **AI nodes** (Starter or higher)
3. Open the workflow folder you want, e.g. `workflows/customer-feedback-brain/`
4. Copy the full contents of `workflow.json`
5. In n8n: **Workflows → ⋮ (three dots) → Import from clipboard**
6. Follow the workflow-specific README for credential setup

---

## Method 2: Docker Compose (local dev)

```bash
# Clone the repository
git clone https://github.com/aalkerimov/product-manager-n8n-automation
cd product-manager-n8n-automation

# Create your environment file
cp .env.example .env
# Open .env and fill in required values

# Start the full stack
docker compose up -d

# Check that n8n started
docker compose logs -f n8n

# Open the UI
open http://localhost:5678
# Default credentials: admin / changeme_local
```

### Import workflows from the n8n UI

After logging in:
1. **Workflows → Import from file**
2. Navigate to `workflows/customer-feedback-brain/workflow.json`
3. Click **Save**
4. Follow the workflow README for credential setup

---

## Method 3: Existing self-hosted n8n

If you already run n8n:

1. Download or clone this repository
2. In n8n: **Workflows → Import from file** → pick any `workflow.json`
3. Set up credentials as described in each workflow README

---

## Credential setup

### OpenAI / LLM provider (required for AI features)

All AI workflows use **HTTP Header Auth** (not the built-in OpenAI credential type) so that any OpenAI-compatible provider works without code changes.

1. Get an API key from [platform.openai.com](https://platform.openai.com) or your preferred provider
2. In n8n: **Credentials → Add credential → HTTP Header Auth**
   - Name: `YOUR_OPENAI_CREDENTIAL` (exact name used in all workflow JSONs)
   - Header name: `Authorization`
   - Header value: `Bearer YOUR_API_KEY`
3. Never commit the key — set it via the `OPENAI_API_KEY` env var or n8n Credentials only

### Google Sheets (Basic stack)

1. Create a Google Cloud project
2. Enable the Sheets API
3. Create a Service Account and download the JSON key
4. In n8n: **Credentials → Google Sheets OAuth2 or Service Account**
5. Share your target Google Sheet with the service account email

### Slack (Advanced stack)

1. Create a Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Add OAuth scopes: `chat:write`, `files:write`, `channels:read`
3. Install the app to your workspace
4. Copy the Bot User OAuth Token
5. In n8n: **Credentials → Slack API**

### PostgreSQL (Advanced stack)

1. Create a database: `createdb automation_os`
2. Run `scripts/init-db.sql` to create tables
3. In n8n: **Credentials → Postgres**
4. Use the connection details from your `.env`

### Linear (Advanced — optional)

1. Go to **Linear → Settings → API → Personal API Keys**
2. Create a key with read/write access
3. In n8n: **Credentials → HTTP Header Auth**
   - Header name: `Authorization`
   - Header value: `Bearer YOUR_LINEAR_KEY`

### GitHub (Advanced — optional)

1. Go to **GitHub → Settings → Developer settings → Personal access tokens**
2. Create a token with `repo:read` scope (read-only is enough)
3. In n8n: **Credentials → GitHub API**

### Telegram (Basic alternative to email)

1. Message `@BotFather` on Telegram → `/newbot`
2. Copy the token
3. Find your chat ID: message `@userinfobot`
4. In n8n: **Credentials → Telegram API**

---

## Database initialisation (PostgreSQL path)

Run this once after creating your database:

```bash
# Using psql
psql -U automation_os -d automation_os -f scripts/init-db.sql

# Or in Docker
docker compose exec postgres psql -U n8n -d automation_os -f /docker-entrypoint-initdb.d/01-init.sql
```

---

## Troubleshooting

### "Workflow failed to import"

- Check that the JSON is valid: `node scripts/validate-json.js`
- Ensure you are on n8n ≥ 1.50.0

### "AI node not found"

- Enable AI nodes in your n8n instance settings
- On n8n Cloud: upgrade to a plan that includes AI nodes

### "Credential not found"

- Credential names in workflows are placeholders — you must create them in n8n first
- Credential names are case-sensitive

### "Workflow runs but produces no output"

- Check the **Executions** tab for error details
- Run the workflow manually with the sample input from `sample-input.json`
- Set `N8N_LOG_LEVEL=debug` for verbose output

---

## Updating

```bash
git pull origin main
# Re-import any workflow.json files you have updated
# Credentials and execution history are preserved in n8n
```
