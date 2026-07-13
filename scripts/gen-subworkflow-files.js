const fs = require('fs');
const path = require('path');

const entries = [
  {
    id: '01', dir: 'workflows/01-discovery-research/01-llm-classifier',
    name: 'LLM Classifier',
    desc: 'Shared AI subworkflow. Classifies batches of text (feedback, competitor changes, brief items) using OpenAI. Called by other workflows via Execute Workflow node.',
    trigger: 'Called by another workflow', ai: true
  },
  {
    id: '02', dir: 'workflows/01-discovery-research/02-human-approval-gate',
    name: 'Human Approval Gate',
    desc: 'Shared approval subworkflow. Pauses execution, sends an approval email with Approve/Reject buttons, resumes when the approver responds or the timeout expires.',
    trigger: 'Called by another workflow', ai: false
  },
  {
    id: '03', dir: 'workflows/01-discovery-research/03-notification-router',
    name: 'Notification Router',
    desc: 'Shared routing subworkflow. Delivers a notification to Slack, Email, Telegram, or all three based on the channel parameter.',
    trigger: 'Called by another workflow', ai: false
  }
];

for (const w of entries) {
  const aiExtra = w.ai ? '\n  "AI_MODEL_SMART": "gpt-4o",\n  "AI_MODEL_FAST": "gpt-4o-mini"' : '';

  const readme = '# ' + w.id + ' - ' + w.name + '\n\n' +
    '> **Type:** Shared Subworkflow | **Trigger:** ' + w.trigger + ' | **AI:** ' + (w.ai ? 'Yes (OpenAI)' : 'No') + '\n\n' +
    '## What it does\n' + w.desc + '\n\n' +
    '## Usage\nImport into n8n, note its workflow ID, then reference that ID in any calling workflow via the **Execute Workflow** node.\n\n' +
    '## Prerequisites\n- n8n 2.30.0+\n- SMTP credential ("SMTP Email")\n' + (w.ai ? '- OpenAI API credential\n' : '') + '\n' +
    '## Environment variables\nSee `config.example.json`.\n\n## Changelog\nSee [CHANGELOG.md](CHANGELOG.md).\n';

  const config = '{\n  "NOTIFICATION_EMAIL_TO": "founder@yourcompany.com",\n  "EMAIL_FROM": "noreply@yourcompany.com",\n  "SLACK_CHANNEL_ALERTS": "#product-alerts",\n  "TELEGRAM_CHAT_ID": "YOUR_TELEGRAM_CHAT_ID"' + aiExtra + '\n}';

  const sampleInput = '{\n  "workflow_id": "' + w.id + '",\n  "workflow_name": "' + w.name + '",\n  "note": "See README for input schema",\n  "triggered_at": "2025-01-13T10:00:00.000Z"\n}';
  const sampleOutput = '{\n  "workflow_id": "' + w.id + '",\n  "workflow_name": "' + w.name + '",\n  "status": "success",\n  "message": "Subworkflow completed successfully",\n  "processed_at": "2025-01-13T10:01:00.000Z"\n}';

  const changelog = '# Changelog - ' + w.name + '\n\n## [1.0.0] - 2025-01-13\n### Added\n- Initial release as shared subworkflow\n- Invoked via Execute Workflow node\n' + (w.ai ? '- AI classification via OpenAI API\n' : '');

  const fixture = '{\n  "workflow_id": "' + w.id + '",\n  "test": "happy_path",\n  "input": { "note": "Replace with real test data" }\n}';
  const expected = '{\n  "workflow_id": "' + w.id + '",\n  "test": "happy_path",\n  "expected": { "status": "success" }\n}';

  try {
    fs.mkdirSync(path.join(w.dir, 'tests', 'fixtures'), { recursive: true });
    fs.mkdirSync(path.join(w.dir, 'tests', 'expected-output'), { recursive: true });

    const writeIfMissing = (p, c) => { if (!fs.existsSync(p)) fs.writeFileSync(p, c); };

    writeIfMissing(path.join(w.dir, 'README.md'), readme);
    writeIfMissing(path.join(w.dir, 'config.example.json'), config);
    writeIfMissing(path.join(w.dir, 'sample-input.json'), sampleInput);
    writeIfMissing(path.join(w.dir, 'sample-output.json'), sampleOutput);
    writeIfMissing(path.join(w.dir, 'CHANGELOG.md'), changelog);
    writeIfMissing(path.join(w.dir, 'tests', 'fixtures', 'happy-path.json'), fixture);
    writeIfMissing(path.join(w.dir, 'tests', 'expected-output', 'happy-path.json'), expected);

    console.log('OK: ' + w.id + ' - ' + w.name);
  } catch(e) {
    console.error('ERR: ' + w.id + ' - ' + e.message);
  }
}
console.log('Done.');
