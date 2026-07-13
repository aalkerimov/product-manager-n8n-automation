# 29 - Activation Rate Monitor

> **Category:** 03-growth-metrics | **Trigger:** Schedule (Mon 09:30) | **AI:** No

## What it does
Automates activation rate monitor for product managers and founders. Set up credentials and environment variables, then trigger manually or let the schedule run automatically.

## Prerequisites
- n8n 2.30.0+ with required credential types
- Google Sheets credential (OAuth2) -- where applicable
- SMTP credential -- for email output


## Environment variables
See `config.example.json` for all required and optional variables.

## Setup
1. Import `workflow.json` into your n8n instance.
2. Copy `config.example.json` to `.env` or set variables in n8n environment.
3. Configure required credentials in n8n.
4. Test with Manual Trigger and sample data.
5. Activate to run on schedule / webhook.

## Output
An email with the processed results is sent to `NOTIFICATION_EMAIL_TO`.

## Changelog
See [CHANGELOG.md](CHANGELOG.md).