const fs = require('fs');
const path = require('path');

const workflows = [
  { id:'21', dir:'workflows/03-growth-metrics/21-metrics-dashboard-mailer', name:'Metrics Dashboard Mailer', trigger:'Schedule (Mon 07:30)', ai:false },
  { id:'22', dir:'workflows/03-growth-metrics/22-revenue-health-monitor', name:'Revenue Health Monitor', trigger:'Schedule (1st of month)', ai:false },
  { id:'23', dir:'workflows/03-growth-metrics/23-conversion-funnel-analyzer', name:'Conversion Funnel Analyzer', trigger:'Schedule (Mon 08:00)', ai:false },
  { id:'24', dir:'workflows/03-growth-metrics/24-cohort-churn-detector', name:'Cohort Churn Detector', trigger:'Schedule (last day of month)', ai:false },
  { id:'25', dir:'workflows/03-growth-metrics/25-nps-pulse-tracker', name:'NPS Pulse Tracker', trigger:'Webhook (NPS response received)', ai:false },
  { id:'26', dir:'workflows/03-growth-metrics/26-ab-test-result-evaluator', name:'AB Test Result Evaluator', trigger:'Webhook (test data POST)', ai:false },
  { id:'27', dir:'workflows/03-growth-metrics/27-usage-anomaly-detector', name:'Usage Anomaly Detector', trigger:'Schedule (daily 06:00)', ai:false },
  { id:'28', dir:'workflows/03-growth-metrics/28-growth-experiment-logger', name:'Growth Experiment Logger', trigger:'Webhook + Schedule (Sun 17:00)', ai:false },
  { id:'29', dir:'workflows/03-growth-metrics/29-activation-rate-monitor', name:'Activation Rate Monitor', trigger:'Schedule (Mon 09:30)', ai:false },
  { id:'30', dir:'workflows/03-growth-metrics/30-pricing-signal-collector', name:'Pricing Signal Collector', trigger:'Schedule (1st/15th)', ai:true },
  { id:'31', dir:'workflows/04-customer-feedback/31-support-ticket-classifier', name:'Support Ticket Classifier', trigger:'Webhook (ticket received)', ai:true },
  { id:'32', dir:'workflows/04-customer-feedback/32-churn-reason-analyzer', name:'Churn Reason Analyzer', trigger:'Schedule (1st of month)', ai:true },
  { id:'33', dir:'workflows/04-customer-feedback/33-customer-health-scorer', name:'Customer Health Scorer', trigger:'Schedule (weekly Sunday)', ai:false },
  { id:'34', dir:'workflows/04-customer-feedback/34-voice-of-customer-aggregator', name:'Voice of Customer Aggregator', trigger:'Schedule (Fri 15:00)', ai:true },
  { id:'35', dir:'workflows/04-customer-feedback/35-onboarding-drop-off-detector', name:'Onboarding Drop-off Detector', trigger:'Schedule (Mon 10:00)', ai:false },
  { id:'36', dir:'workflows/04-customer-feedback/36-customer-win-loss-analyzer', name:'Customer Win-Loss Analyzer', trigger:'Schedule (1st of month)', ai:true },
  { id:'37', dir:'workflows/04-customer-feedback/37-feedback-to-feature-bridge', name:'Feedback to Feature Bridge', trigger:'Schedule (Wed 14:00)', ai:true },
  { id:'38', dir:'workflows/04-customer-feedback/38-nps-follow-up-automator', name:'NPS Follow-up Automator', trigger:'Webhook (NPS response received)', ai:true },
  { id:'39', dir:'workflows/04-customer-feedback/39-renewal-risk-alerter', name:'Renewal Risk Alerter', trigger:'Schedule (Mon 08:30)', ai:false },
  { id:'40', dir:'workflows/04-customer-feedback/40-customer-case-study-miner', name:'Customer Case Study Miner', trigger:'Schedule (1st of month)', ai:true },
  { id:'41', dir:'workflows/05-founder-intelligence/41-market-signal-radar', name:'Market Signal Radar', trigger:'Schedule (Fri 16:00)', ai:true },
  { id:'42', dir:'workflows/05-founder-intelligence/42-founder-daily-brief', name:'Founder Daily Brief', trigger:'Schedule (weekdays 07:00)', ai:true },
  { id:'43', dir:'workflows/05-founder-intelligence/43-investor-update-composer', name:'Investor Update Composer', trigger:'Schedule (5th of month)', ai:true },
  { id:'44', dir:'workflows/05-founder-intelligence/44-hiring-signal-tracker', name:'Hiring Signal Tracker', trigger:'Schedule (Wed 09:00)', ai:true },
  { id:'45', dir:'workflows/05-founder-intelligence/45-team-sentiment-monitor', name:'Team Sentiment Monitor', trigger:'Schedule (Fri 18:00)', ai:false },
  { id:'46', dir:'workflows/05-founder-intelligence/46-burn-rate-runway-tracker', name:'Burn Rate Runway Tracker', trigger:'Schedule (5th of month)', ai:false },
  { id:'47', dir:'workflows/05-founder-intelligence/47-competitive-pricing-scanner', name:'Competitive Pricing Scanner', trigger:'Schedule (Mon 07:00)', ai:true },
  { id:'48', dir:'workflows/05-founder-intelligence/48-press-mention-aggregator', name:'Press Mention Aggregator', trigger:'Schedule (Tue & Fri 09:00)', ai:true },
  { id:'49', dir:'workflows/05-founder-intelligence/49-product-news-digest', name:'Product News Digest', trigger:'Schedule (Mon 07:30)', ai:true },
  { id:'50', dir:'workflows/05-founder-intelligence/50-board-deck-data-collector', name:'Board Deck Data Collector', trigger:'Schedule (monthly)', ai:true },
];

for (const w of workflows) {
  const aiLine = w.ai ? '- OpenAI API credential\n' : '';
  const aiEnv = w.ai ? '  "AI_MODEL_SMART": "gpt-4o",\n  "AI_MODEL_FAST": "gpt-4o-mini"' : '';
  const aiEnvFull = w.ai ? ',\n  "AI_MODEL_SMART": "gpt-4o",\n  "AI_MODEL_FAST": "gpt-4o-mini"' : '';

  const readme = [
    '# ' + w.id + ' - ' + w.name,
    '',
    '> **Category:** ' + w.dir.split('/')[1] + ' | **Trigger:** ' + w.trigger + ' | **AI:** ' + (w.ai ? 'Yes (OpenAI)' : 'No'),
    '',
    '## What it does',
    'Automates ' + w.name.toLowerCase() + ' for product managers and founders. Set up credentials and environment variables, then trigger manually or let the schedule run automatically.',
    '',
    '## Prerequisites',
    '- n8n 2.30.0+ with required credential types',
    '- Google Sheets credential (OAuth2) -- where applicable',
    '- SMTP credential -- for email output',
    aiLine.trim(),
    '',
    '## Environment variables',
    'See `config.example.json` for all required and optional variables.',
    '',
    '## Setup',
    '1. Import `workflow.json` into your n8n instance.',
    '2. Copy `config.example.json` to `.env` or set variables in n8n environment.',
    '3. Configure required credentials in n8n.',
    '4. Test with Manual Trigger and sample data.',
    '5. Activate to run on schedule / webhook.',
    '',
    '## Output',
    'An email with the processed results is sent to `NOTIFICATION_EMAIL_TO`.',
    '',
    '## Changelog',
    'See [CHANGELOG.md](CHANGELOG.md).',
  ].join('\n');

  const config = '{\n  "NOTIFICATION_EMAIL_TO": "founder@yourcompany.com",\n  "EMAIL_FROM": "noreply@yourcompany.com"' + aiEnvFull + '\n}';

  const sampleInput = '{\n  "workflow_id": "' + w.id + '",\n  "workflow_name": "' + w.name + '",\n  "sample_data": "Replace with real data relevant to this workflow",\n  "triggered_at": "2025-01-13T10:00:00.000Z"\n}';

  const sampleOutput = '{\n  "workflow_id": "' + w.id + '",\n  "workflow_name": "' + w.name + '",\n  "status": "success",\n  "message": "Email sent to NOTIFICATION_EMAIL_TO",\n  "processed_at": "2025-01-13T10:01:00.000Z"\n}';

  const changelog = [
    '# Changelog - ' + w.name,
    '',
    '## [1.0.0] - 2025-01-13',
    '### Added',
    '- Initial release of ' + w.name,
    '- ' + w.trigger + ' trigger',
    w.ai ? '- AI analysis via OpenAI API' : '',
    '- Email output with structured report',
  ].filter(l => l !== null).join('\n');

  const fixture = '{\n  "workflow_id": "' + w.id + '",\n  "test": "happy_path",\n  "input": { "note": "Replace with real test data for ' + w.name + '" }\n}';
  const expected = '{\n  "workflow_id": "' + w.id + '",\n  "test": "happy_path",\n  "expected": { "status": "success", "email_sent": true }\n}';

  try {
    fs.mkdirSync(path.join(w.dir, 'tests', 'fixtures'), { recursive: true });
    fs.mkdirSync(path.join(w.dir, 'tests', 'expected-output'), { recursive: true });
    fs.writeFileSync(path.join(w.dir, 'README.md'), readme);
    fs.writeFileSync(path.join(w.dir, 'config.example.json'), config);
    fs.writeFileSync(path.join(w.dir, 'sample-input.json'), sampleInput);
    fs.writeFileSync(path.join(w.dir, 'sample-output.json'), sampleOutput);
    fs.writeFileSync(path.join(w.dir, 'CHANGELOG.md'), changelog);
    fs.writeFileSync(path.join(w.dir, 'tests', 'fixtures', 'happy-path.json'), fixture);
    fs.writeFileSync(path.join(w.dir, 'tests', 'expected-output', 'happy-path.json'), expected);
    console.log('OK: ' + w.id + ' - ' + w.name);
  } catch(e) {
    console.error('ERR: ' + w.id + ' - ' + e.message);
  }
}
console.log('Done.');
