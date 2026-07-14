# Product & Founder Automation OS

> ⚠️ **This project has zero affiliation with n8n GmbH.** It is fully independent, 100% open-source, and non-profit. No sponsorship, no endorsement, no commercial relationship — just workflows built by practitioners for practitioners.

<div align="center">

**100 production-ready n8n workflows for product managers, founders, and small teams.**
*Stop building systems. Start shipping product.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![n8n version](https://img.shields.io/badge/n8n-1.50.0%2B-orange)](https://n8n.io)
[![Workflows](https://img.shields.io/badge/workflows-100-blue)](#workflows)
[![Status](https://img.shields.io/badge/status-beta-yellow)](#quality-status)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Made by Arthur Kerimov](https://img.shields.io/badge/made%20by-Arthur%20Kerimov-blueviolet)](https://arthurkerimov.com)

</div>

---

## What this is

**Product & Founder Automation OS** is an open-source collection of 100 complete, importable [n8n](https://n8n.io) workflows built for people who run products and build companies.

Every workflow solves a real, repeated problem — the kind that costs founders and PMs hours every week. They're designed to be **imported in minutes, not configured for days**.

---

## The problems this solves

| Without automation | With this OS |
|---|---|
| Feedback scattered across Intercom, Slack, App Store, and surveys | One weekly AI-synthesised insight report |
| Competitor pricing changed — you found out from a customer | Automated diff → alert within hours |
| Friday stand-up prep takes 2 hours | Weekly product brief generated in minutes |
| Investor updates written from scratch every month | AI drafts it from your data → you approve |
| Board deck data collected manually the night before | Auto-assembled 10 days before every meeting |
| AI outputs trusted blindly | Every AI conclusion shows confidence + source evidence |
| Approvals skipped because it's "just a notification" | Human-in-the-loop gate before any external action |
| Team skill gaps discovered mid-sprint | Weekly gap analysis mapped to upcoming roadmap work |
| Founder network decays between busy weeks | Weekly outreach drafts for overdue relationships |
| No visibility into which automations are broken | Weekly pass-rate + hours-saved dashboard |

---

## Quality status

All workflows in this collection are currently in **beta** — fully implemented, reviewed, and locally validated, but not yet runtime-tested against a live n8n instance. See individual `CHANGELOG.md` files for known limitations per workflow.

---

## Shared Subworkflows

Three reusable building blocks are called by the main workflows — **import these first**.

| Subworkflow | Purpose | Called by |
|---|---|---|
| `subworkflows/llm-classifier` | AI text classification with confidence scores and source evidence | Workflows using AI classification |
| `subworkflows/human-approval` | Pause execution → email approve/reject link → resume on decision or timeout | Any workflow with an approval gate |
| `subworkflows/notification-router` | Route an alert to Slack, Email, Telegram, or all three | Most scheduled workflows |

> **Setup order:** Import the 3 subworkflows first, note their n8n workflow IDs, then paste those IDs into each main workflow that references them.

---

## 100 Workflows

### 01 — Discovery & Research

| # | Workflow | What it does |
|---|---|---|
| 01 | Customer Feedback Brain | Collects feedback from any source, classifies it, and generates a weekly insights report |
| 02 | Competitor Change Monitor | Detects meaningful changes on competitor pages and delivers an AI-analysed alert |
| 03 | Weekly Product Brief | Combines tickets, metrics, feedback, and blockers into one concise weekly update |
| 04 | User Interview Processor | Turns transcripts into structured problems, quotes, and segments |
| 05 | Research Repository Updater | Normalises interviews, surveys, and notes into a tagged repository |
| 06 | Feature Request Analyzer | Deduplicates requests, estimates frequency, maps to problems |
| 07 | Survey Response Analyzer | Pattern-finds across quant + qual, compares segments |
| 08 | Review & Community Monitor | Scans App Store, G2, Reddit, Hacker News daily for signals |
| 09 | Product Opportunity Miner | Surfaces underserved problems from aggregated research |
| 10 | Research Recruitment Manager | Manages participant sourcing, scheduling, and follow-up |

### 02 — Planning & Execution

| # | Workflow | What it does |
|---|---|---|
| 11 | Roadmap Prioritization Engine | RICE scoring on feature candidates from a Sheet |
| 12 | Sprint Planning Assistant | Capacity-aware sprint loader with team velocity tracking |
| 13 | PRD Auto-Drafter | Generates structured PRD from a brief → human review gate |
| 14 | OKR Progress Tracker | Weekly OKR health email with RAG status |
| 15 | Stakeholder Update Generator | Turns Jira/Linear progress into stakeholder digest |
| 16 | Meeting to Action Converter | Transcript → decisions + owners + deadlines |
| 17 | Risk & Dependency Tracker | Weekly risk register with severity scoring |
| 18 | Launch Checklist Automator | Pre-launch gate with parallel track verification |
| 19 | Decision Log Keeper | Captures decisions with context and rationale |
| 20 | Retrospective Insight Extractor | Sprint retro → themes + action items |

### 03 — Growth & Metrics

| # | Workflow | What it does |
|---|---|---|
| 21 | Metrics Dashboard Mailer | Weekly KPI email with trend arrows |
| 22 | Revenue Health Monitor | MRR / ARR / churn vs target with alerts |
| 23 | Conversion Funnel Analyzer | Step-by-step CR with biggest drop-off highlighted |
| 24 | Cohort Churn Detector | Ranks cohorts by 30 / 90-day churn |
| 25 | NPS Pulse Tracker | Live score tracking with segment breakdown |
| 26 | A/B Test Result Evaluator | Two-proportion z-test → SHIP / CONTINUE / STOP decision |
| 27 | Usage Anomaly Detector | Z-score vs 14-day rolling baseline — no threshold tuning needed |
| 28 | Growth Experiment Logger | Logs experiments; Sunday win-rate digest |
| 29 | Activation Rate Monitor | 7 / 14 / 30-day cohort activation triage |
| 30 | Pricing Signal Collector | AI synthesis of WTP signals from research + competitor data |

### 04 — Customer & Feedback

| # | Workflow | What it does |
|---|---|---|
| 31 | Support Ticket Classifier | Tags, prioritises, and routes tickets by type + severity |
| 32 | Churn Reason Analyzer | Clusters exit survey responses into loss themes |
| 33 | Customer Health Scorer | 5-signal health score with triage routing |
| 34 | Voice of Customer Aggregator | Weekly VoC digest from all feedback sources |
| 35 | Onboarding Drop-off Detector | Flags users stuck at each activation step |
| 36 | Customer Win-Loss Analyzer | Patterns wins and losses into strategic insight |
| 37 | Feedback to Feature Bridge | Maps raw feedback to roadmap candidates |
| 38 | NPS Follow-up Automator | Routes promoters to referral flow, detractors to recovery |
| 39 | Renewal Risk Alerter | Flags accounts approaching renewal with risk score |
| 40 | Customer Case Study Miner | Finds ideal case study candidates → human approval gate |

### 05 — Founder Intelligence

| # | Workflow | What it does |
|---|---|---|
| 41 | Market Signal Radar | Weekly AI synthesis of market signals from curated RSS feeds |
| 42 | Founder Daily Brief | Weekday 07:00 email: metrics + blockers + decision of the day |
| 43 | Investor Update Composer | AI drafts monthly investor email → founder review gate |
| 44 | Hiring Signal Tracker | Competitor job listings → strategic intent analysis |
| 45 | Team Sentiment Monitor | Anonymous weekly pulse with threshold alert |
| 46 | Burn Rate Runway Tracker | Monthly burn, runway, default rate with runway alert |
| 47 | Competitive Pricing Scanner | Detects competitor price changes from historical snapshots |
| 48 | Press Mention Aggregator | Brand + competitor monitoring with sentiment classification |
| 49 | Product News Digest | Monday curation of 5–7 top product stories with PM insight |
| 50 | Board Deck Data Collector | Auto-assembles board brief with data gaps + prep checklist |

### 06 — Strategy & Market Intelligence

| # | Workflow | What it does |
|---|---|---|
| 51 | Market Sizing Assistant | TAM / SAM / SOM modelling with bottom-up and top-down views |
| 52 | Win-Loss Analysis Engine | Structures win/loss call notes into competitive insight |
| 53 | Battlecard Generator | Auto-drafts sales battlecards from competitive data |
| 54 | Analyst Review Tracker | Monitors G2, Capterra, and Trustpilot for category shifts |
| 55 | Regulatory Change Monitor | Tracks regulatory news relevant to your product category |
| 56 | Technology Trend Radar | Weekly AI synthesis of emerging tech relevant to your roadmap |
| 57 | Funding & M&A Tracker | Monitors competitor funding rounds and acquisition signals |
| 58 | ICP Drift Detector | Flags when new customers diverge from your ideal profile |
| 59 | Strategy Assumption Auditor | Challenges your core strategy assumptions with market evidence |
| 60 | Competitive Pricing Monitor | Tracks pricing page changes across the competitive landscape |

### 07 — Roadmap & Planning

| # | Workflow | What it does |
|---|---|---|
| 61 | Opportunity Scoring Engine | Scores opportunities using impact, confidence, and effort |
| 62 | Roadmap Dependency Mapper | Surfaces cross-team dependencies before sprint planning |
| 63 | Sprint Retrospective Analyser | Extracts themes and action items from retro notes |
| 64 | Feature Request Prioritiser | Weights feature requests by frequency, segment, and revenue impact |
| 65 | Release Notes Generator | Drafts release notes from PRs and commit messages |
| 66 | Product Spec Reviewer | Reviews spec drafts against quality criteria → feedback report |
| 67 | Stakeholder Update Composer | Generates stakeholder-appropriate summaries from raw progress |
| 68 | Quarterly Planning Assistant | Structures quarterly planning inputs into a decision-ready brief |
| 69 | OKR Progress Tracker | Weekly OKR health with RAG status and trend tracking |
| 70 | Roadmap Communication Planner | Generates comms plan for a roadmap update across audiences |

### 08 — User Research & Discovery

| # | Workflow | What it does |
|---|---|---|
| 71 | Interview Question Generator | Drafts JTBD-framed interview guides for any problem area |
| 72 | Survey Response Analyser | Extracts themes and sentiment from open-text survey responses |
| 73 | Usability Test Summariser | Turns session notes into structured findings and severity ratings |
| 74 | Persona Generator | Synthesises research data into PM-ready persona documents |
| 75 | JTBD Extractor | Extracts Jobs-to-be-Done from interview transcripts |
| 76 | Research Repository Tagger | Auto-tags research artefacts with problem areas and segments |
| 77 | Participant Recruitment Screener | Screens research participants against your ICP criteria |
| 78 | Synthesis Report Builder | Combines tagged research into an executive synthesis report |
| 79 | Research Insight Broadcaster | Distributes approved research insights to team channels |
| 80 | Discovery Session Scheduler | Coordinates scheduling and reminders for user research sessions |

### 09 — Engineering & AI Reliability

| # | Workflow | What it does |
|---|---|---|
| 81 | Bug Triage Assistant | Classifies, prioritises, and routes incoming bug reports |
| 82 | Error Spike Translator | Converts technical error spikes into plain-English PM summaries |
| 83 | Tech Debt Register | Maintains a scored tech debt backlog with impact estimates |
| 84 | Engineering Digest for PMs | Weekly plain-English summary of engineering activity |
| 85 | Dependency & API Deprecation Watcher | Monitors for deprecated dependencies and upstream API changes |
| 86 | LLM Prompt Regression Tester | Runs prompt regression tests and flags quality regressions |
| 87 | AI Cost Monitor | Tracks AI API spend vs budget with threshold alerts |
| 88 | AI Output Quality Sampler | Samples AI outputs weekly and scores them for quality drift |
| 89 | Uptime & SLA Reporter | Weekly uptime and SLA compliance report with incident history |
| 90 | Data Quality Sentinel | Monitors key data pipelines for schema drift and anomalies |

### 10 — Team & Founder Operations

| # | Workflow | What it does |
|---|---|---|
| 91 | Weekly Priorities Planner | Structures your top 3 weekly priorities with success criteria |
| 92 | Calendar Audit & Focus Protector | Analyses calendar data and flags focus time erosion |
| 93 | 1:1 Prep Assistant | Generates coaching questions and agenda from relationship context |
| 94 | Team Pulse Analyzer | Weekly mood and blocker analysis — flags at-risk team members |
| 95 | New Hire Onboarding Tracker | Tracks onboarding milestones and alerts on overdue items |
| 96 | Knowledge Gap Finder | Maps team skills against upcoming roadwork — quarterly gap report |
| 97 | Documentation Freshness Checker | Flags stale docs by severity before they mislead the team |
| 98 | Founder Network Nurturer | Weekly outreach drafts for overdue network relationships |
| 99 | Founder Weekly Review | Friday reflection: pattern, leverage point, coaching question |
| 100 | Automation Health Dashboard | Weekly pass rate, time saved, and failing workflow report |

---

## Quick Start

### Step 1 — Import subworkflows first

```
subworkflows/llm-classifier/workflow.json
subworkflows/human-approval/workflow.json
subworkflows/notification-router/workflow.json
```

Note the n8n workflow ID for each after import. Workflows that call them reference these IDs.

### Step 2 — Import a main workflow

#### Option A — n8n Cloud (fastest)

1. Sign in to [app.n8n.cloud](https://app.n8n.cloud)
2. Open any workflow folder → copy `workflow.json`
3. In n8n: **Workflows → ⋮ → Import from clipboard**
4. Follow the setup steps in the workflow's `README.md`

#### Option B — Self-hosted (Docker)

```bash
git clone https://github.com/aalkerimov/product-manager-n8n-automation
cd product-manager-n8n-automation

cp .env.example .env
# Edit .env with your values

docker compose up -d
open http://localhost:5678
```

Then import any `workflow.json` via **Workflows → ⋮ → Import from file**.

#### Option C — Existing n8n instance

Drop any `workflow.json` into your n8n via **Workflows → Import from file**.

### Step 3 — Configure credentials

Each workflow uses named credentials (e.g., `YOUR_OPENAI_CREDENTIAL`, `YOUR_SMTP_CREDENTIAL`). Create these in n8n under **Settings → Credentials** before activating.

See [`docs/installation.md`](docs/installation.md) for the full credential setup guide.

---

## Stack

### Minimum (no paid infra)

| Layer | Tool |
|---|---|
| Orchestration | n8n self-hosted or Cloud |
| Storage | Google Sheets |
| Notifications | SMTP Email |
| AI | OpenAI gpt-4o-mini (~$0.001–0.01/run) |

### Recommended (full stack)

| Layer | Tool |
|---|---|
| Storage | PostgreSQL |
| Notifications | Slack |
| Issue tracking | Linear or Jira |
| Code context | GitHub API |
| AI | Any OpenAI-compatible provider |

---

## Repository structure

```
product-manager-n8n-automation/
├── subworkflows/                         # Import these FIRST
│   ├── human-approval/
│   ├── llm-classifier/
│   └── notification-router/
├── workflows/
│   ├── 01-discovery-research/            # Workflows 01–10
│   ├── 02-planning-execution/            # Workflows 11–20
│   ├── 03-growth-metrics/                # Workflows 21–30
│   ├── 04-customer-feedback/             # Workflows 31–40
│   ├── 05-founder-intelligence/          # Workflows 41–50
│   ├── 06-strategy-market-intelligence/  # Workflows 51–60
│   ├── 07-roadmap-planning/              # Workflows 61–70
│   ├── 08-user-research-discovery/       # Workflows 71–80
│   ├── 09-engineering-ai-reliability/    # Workflows 81–90
│   └── 10-team-founder-operations/       # Workflows 91–100
├── docs/
│   ├── installation.md
│   ├── architecture.md
│   ├── creating-a-workflow.md
│   └── customization.md
├── scripts/
│   ├── check-required-files.js
│   ├── check-secrets.js
│   └── validate-json.js
├── .env.example
└── docker-compose.yml
```

### Per-workflow file set

Every workflow and subworkflow ships with exactly 6 files:

```
<id>-<workflow-name>/
├── workflow.json          # Import directly into n8n
├── README.md              # 18-section setup guide, env vars, failure behaviour
├── config.example.json    # All environment variables with types and defaults
├── sample-input.json      # Test payload to trigger the workflow manually
├── sample-output.json     # What a successful run produces
└── CHANGELOG.md           # Version history (starts at 0.1.0)
```

---

## Design principles

1. **Useful before impressive** — every workflow solves a real repeated problem
2. **Modular over duplicated** — shared subworkflows for AI, approvals, and notifications
3. **Human approval for consequential actions** — no tickets, messages, or outbound emails without an explicit gate
4. **Transparent AI** — every AI conclusion shows confidence score + source evidence
5. **Determinism over LLMs** — if arithmetic or rule-based logic can do the job, no LLM is used
6. **Easy to import and test** — sample data included, no paid infra required to start

---

## Privacy and data handling

- No customer data leaves your n8n instance without your explicit configuration
- All AI calls go to the provider you set — n8n does not proxy them
- Competitor URLs and pricing snapshots stay in your own storage
- All fallback email addresses in workflows use `@example.com` placeholders — replace with your own before activating
- See [SECURITY.md](SECURITY.md) for credential and secret guidance

---

## Validation scripts

```bash
# Check all 103 directories have the required 6 files
node scripts/check-required-files.js

# Validate all JSON files are syntactically correct
node scripts/validate-json.js

# Scan for hardcoded secrets or real email addresses
node scripts/check-secrets.js
```

All three scripts exit `0` on a clean repository.

---

## Documentation

| Doc | Contents |
|---|---|
| [`docs/installation.md`](docs/installation.md) | Full setup guide — n8n Cloud, Docker, credentials |
| [`docs/architecture.md`](docs/architecture.md) | Subworkflow contracts, data flow diagrams, error handling |
| [`docs/creating-a-workflow.md`](docs/creating-a-workflow.md) | How to contribute a new workflow |
| [`docs/customization.md`](docs/customization.md) | Adapting workflows to your stack and data sources |

---

## About the author

This project was built by **[Arthur Kerimov](https://arthurkerimov.com)** — AI Product Leader & Founder.

**Connect:**
- 🌐 [arthurkerimov.com](https://arthurkerimov.com)
- 💼 [linkedin.com/in/aalkerimov](https://www.linkedin.com/in/aalkerimov/)
- 🐦 [@aalkerimov](https://x.com/aalkerimov)
- ✈️ [Telegram @kerimoff_artur](https://t.me/kerimoff_artur)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow submission process, naming conventions, and PR checklist.

---

## License

MIT — see [LICENSE](LICENSE).

---

## ⚠️ Disclaimer

**This project is completely independent and non-profit.**

- 🚫 **No affiliation** with [n8n GmbH](https://n8n.io) — not sponsored, not endorsed, not officially supported by them in any way
- 🔓 **Fully open-source** under the MIT licence — fork it, extend it, redistribute it freely
- 💸 **Non-profit** — built by a practitioner to solve real problems, not to sell anything
- 🏷️ "n8n" is a trademark of n8n GmbH — used here purely as a descriptive term for the automation platform this project runs on
