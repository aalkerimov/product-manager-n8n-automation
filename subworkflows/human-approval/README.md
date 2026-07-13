# Human Approval Gate Subworkflow

Pauses workflow execution and sends an approval email. Resumes when the approver clicks Approve or Reject, or after a configurable timeout.

## Purpose

Any action that creates tickets, sends public messages, or modifies external systems should go through this gate. It ensures a human reviews AI-generated content before it reaches the team or customers.

## Setup

1. Import this workflow
2. Create an `SMTP Email` credential in n8n
3. Set `NOTIFICATION_EMAIL_TO` environment variable
4. Ensure n8n's webhook URL is publicly accessible (or accessible from the approver's network)
5. Copy this workflow's ID and paste it into each main workflow's "Request Human Approval" node

## Input

```json
{
  "title": "Approve: Weekly Feedback Report",
  "summary": "3 critical insights, 12 feature requests...",
  "details": {},
  "approver_email": "pm@yourcompany.com",
  "timeout_hours": 24
}
```

## Output

```json
{
  "decision": "approved | rejected | timeout",
  "decided_at": "2025-01-13T10:00:00Z",
  "comment": "",
  "approved": true,
  "timeout": false
}
```

## Timeout behaviour

If the approver does not respond within `timeout_hours`, the decision is `timeout` and `approved` is `false`. Main workflows log this and do not send the report.

## Notes on the Wait node

The Wait node generates a unique resume URL for each execution. The approval email embeds this URL in the Approve/Reject buttons. When the approver clicks a button, n8n resumes the execution from the Wait node.

This requires n8n to be accessible from the approver's browser. On localhost-only setups, you can click the resume URL directly in the n8n execution log.
