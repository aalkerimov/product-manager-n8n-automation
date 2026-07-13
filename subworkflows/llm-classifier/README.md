# LLM Classifier Subworkflow

Shared subworkflow for classifying text items using an OpenAI-compatible API.

## Purpose

This subworkflow is called by the three main workflows to perform AI classification. It is not triggered directly in production.

## Supported modes

| Mode | Called by | Output fields |
|---|---|---|
| `feedback` | Customer Feedback Brain | problem_category, sentiment, urgency, segment, product_area, is_feature_request, is_bug_report, key_quote |
| `competitor` | Competitor Change Monitor | change_type, importance_score, possible_reason, product_impact, recommended_response |
| `brief` | Weekly Product Brief | category, priority, summary, impact, action_required |

## Input

```json
{
  "mode": "feedback | competitor | brief",
  "items": [
    { "id": "unique-id", "text": "content to classify", "metadata": {} }
  ]
}
```

## Output

```json
{
  "mode": "feedback",
  "results": [
    {
      "id": "unique-id",
      "classification": { "problem_category": "onboarding", "sentiment": "negative", "urgency": "high", "...": "..." },
      "confidence": 0.92,
      "reasoning": "The user describes a specific pain point during the first-time setup...",
      "error": false
    }
  ],
  "total": 1,
  "classified": 1,
  "failed": 0
}
```

## Setup

1. Import this workflow
2. Create an `OpenAI API` credential in n8n
3. Copy this workflow's ID from the URL bar
4. Paste the ID into the "Call: LLM Classifier" node in each main workflow

## Error handling

If the AI call fails after 3 retries, the subworkflow returns an empty results array with `error: true`. Main workflows handle this gracefully and continue without the classification.
