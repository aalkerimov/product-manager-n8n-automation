#!/usr/bin/env node
/**
 * import-workflow.js
 * Imports a single workflow into a running n8n instance via the REST API.
 *
 * Usage:
 *   npm run import:workflow -- --id 04
 *   npm run import:workflow -- --id user-interview-processor
 *   npm run import:workflow -- --id 04 --host http://localhost:5678 --key YOUR_API_KEY
 */
const fs   = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const readline = require('readline');

const ROOT         = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'catalog', 'workflows.json');

const args = process.argv.slice(2);
function arg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
}

const idArg   = arg('--id');
const hostArg = arg('--host')   || process.env.N8N_HOST    || 'http://localhost:5678';
const keyArg  = arg('--key')    || process.env.N8N_API_KEY || '';
const dryRun  = args.includes('--dry-run');

if (!idArg) {
  console.error('\nUsage: npm run import:workflow -- --id <ID or name>\n');
  console.error('  --id          Workflow ID (e.g. 04) or folder name (e.g. user-interview-processor)');
  console.error('  --host        n8n base URL (default: http://localhost:5678)');
  console.error('  --key         n8n API key (or set N8N_API_KEY env var)');
  console.error('  --dry-run     Show what would be imported without importing\n');
  process.exit(1);
}

function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error('❌  catalog/workflows.json not found. Run: npm run catalog:build');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
}

const catalog = loadCatalog();

// Find the workflow by ID or name
const workflow = catalog.workflows.find(w =>
  String(w.id).padStart(2, '0') === String(idArg).padStart(2, '0') ||
  w.folderName === idArg ||
  w.name.toLowerCase().includes(idArg.toLowerCase())
);

if (!workflow) {
  console.error(`\n❌  Workflow not found: "${idArg}"`);
  console.error('    Run "npm run list" to see all available workflow IDs.\n');
  process.exit(1);
}

const workflowPath = path.join(ROOT, workflow.path, 'workflow.json');
if (!fs.existsSync(workflowPath)) {
  console.error(`\n❌  workflow.json not found at: ${workflowPath}\n`);
  process.exit(1);
}

const workflowJson = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📦  Workflow to import:`);
console.log(`    ID:         ${workflow.id}`);
console.log(`    Name:       ${workflow.name}`);
console.log(`    Category:   ${workflow.category}`);
console.log(`    Status:     ${workflow.status}`);
console.log(`    Path:       ${workflow.path}`);
console.log(`    Target:     ${hostArg}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (workflow.requiredIntegrations && workflow.requiredIntegrations.length > 0) {
  console.log('⚠️   Required credentials to configure manually after import:');
  for (const cred of workflow.requiredIntegrations) {
    console.log(`    • ${cred}`);
  }
  console.log('');
}

if (dryRun) {
  console.log('🔍  DRY RUN — nothing was imported. Remove --dry-run to import.\n');
  process.exit(0);
}

if (!keyArg) {
  console.log('ℹ️   No API key provided. Attempting to use n8n import CLI instead...');
  console.log('    (Set N8N_API_KEY or pass --key to use the REST API)\n');
  console.log('    Manual import steps:');
  console.log(`    1. Open ${hostArg}`);
  console.log(`    2. Workflows → Import from file`);
  console.log(`    3. Select: ${workflowPath}\n`);
  process.exit(0);
}

// Confirm before importing
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question(`Import "${workflow.name}" into ${hostArg}? [y/N] `, (answer) => {
  rl.close();
  if (answer.toLowerCase() !== 'y') {
    console.log('Cancelled.\n');
    process.exit(0);
  }

  const payload = JSON.stringify({ workflowData: workflowJson });
  const url = new URL('/api/v1/workflows', hostArg);
  const lib = url.protocol === 'https:' ? https : http;

  const options = {
    hostname: url.hostname,
    port:     url.port || (url.protocol === 'https:' ? 443 : 80),
    path:     url.pathname,
    method:   'POST',
    headers: {
      'Content-Type':   'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'X-N8N-API-KEY':  keyArg,
    },
  };

  const req = lib.request(options, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const result = JSON.parse(data);
        console.log(`\n✅  Imported successfully! Workflow ID in n8n: ${result.id || 'see UI'}`);
        console.log(`    Open: ${hostArg}/workflow/${result.id || ''}\n`);
      } else {
        console.error(`\n❌  Import failed (HTTP ${res.statusCode}): ${data}\n`);
        process.exit(1);
      }
    });
  });
  req.on('error', (e) => { console.error(`\n❌  Request error: ${e.message}\n`); process.exit(1); });
  req.write(payload);
  req.end();
});
