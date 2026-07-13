# 17 — Risk and Dependency Tracker

## 1. What this workflow does
See workflow.json description and setup notes.

## 2. Who it is for
Product managers, founders, and small teams automating planning and execution tasks.

## 3. Required integrations
Google Sheets, SMTP Email

## 4. Five-minute setup
1. Import subworkflows (human-approval, notification-router) if required
2. Import this workflow
3. Create required credentials (see config.example.json)
4. Set environment variables
5. Test with Manual Trigger

## 5. Input
Risk register sheet

## 6. Output
Scored risk report with critical/high flags

## 7. Configuration
See config.example.json for all required and optional environment variables.

## 8. Human approval
See workflow.json — approval gates are documented in node names.

## 9. Cost estimate
See workflow.json meta.estimatedMonthlyCost.

## 10. Privacy and security
No secrets, API keys, or PII are stored in this workflow. Use placeholder values.

## 11. Tested versions
n8n 2.30.0 — Statically validated — **Beta**
