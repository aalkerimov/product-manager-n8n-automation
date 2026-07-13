# Examples

This directory contains additional example files, templates, and reference payloads.

## Contents

### Webhook payloads

Paste these into any HTTP client (Postman, Insomnia, curl) to test the webhook:

**Customer Feedback Brain — single item:**
```bash
curl -X POST http://localhost:5678/webhook/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_001",
    "text": "The onboarding is really confusing",
    "source": "typeform",
    "customer_segment": "startup",
    "rating": 2,
    "created_at": "2025-01-13T09:00:00Z"
  }'
```

**Customer Feedback Brain — batch:**
```bash
curl -X POST http://localhost:5678/webhook/feedback \
  -H "Content-Type: application/json" \
  -d @workflows/customer-feedback-brain/sample-input.json
```

## Adding examples

Add realistic example files here — webhook payloads, CSV templates, mock API responses. No real customer data.
