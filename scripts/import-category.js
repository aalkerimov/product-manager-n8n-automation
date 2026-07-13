#!/usr/bin/env node
/**
 * import-category.js
 * Imports all workflows from a single category into n8n.
 *
 * Usage:
 *   npm run import:category -- --category discovery-research
 *   npm run import:category -- --category 01
 *   npm run import:category -- --category planning-execution --dry-run
 */
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const ROOT         = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'catalog', 'workflows.json');

const args = process.argv.slice(2);
function arg(flag) { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; }

const catArg  = arg('--category');
const hostArg = arg('--host')  || process.env.N8N_HOST    || 'http://localhost:5678';
const keyArg  = arg('--key')   || process.env.N8N_API_KEY || '';
const dryRun  = args.includes('--dry-run');

if (!catArg) {
  console.error('\nUsage: npm run import:category -- --category <slug>\n');
  console.error('  Categories:');
  console.error('    01  discovery-research');
  console.error('    02  planning-execution');
  console.error('    03  analytics-experiments');
  console.error('    04  customer-growth');
  console.error('    05  operations-leadership\n');
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

const workflows = catalog.workflows.filter(w =>
  w.categorySlug.includes(catArg.replace(/^0?/, '')) ||
  w.categorySlug === catArg ||
  w.category.toLowerCase().includes(catArg.toLowerCase()) ||
  w.path.includes(catArg)
);

if (workflows.length === 0) {
  console.error(`\n❌  No workflows found for category: "${catArg}"\n`);
  process.exit(1);
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`📦  Workflows to import (${workflows.length}):`);
for (const w of workflows) {
  console.log(`    ${String(w.id).padStart(2,'0')}  ${w.name}  [${w.status}]`);
}
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

if (dryRun) {
  console.log('🔍  DRY RUN — nothing imported. Remove --dry-run to proceed.\n');
  process.exit(0);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question(`Import all ${workflows.length} workflows into ${hostArg}? [y/N] `, (answer) => {
  rl.close();
  if (answer.toLowerCase() !== 'y') { console.log('Cancelled.\n'); process.exit(0); }

  let ok = 0; let fail = 0;
  for (const w of workflows) {
    const idStr = String(w.id).padStart(2, '0');
    const keyFlag = keyArg ? `--key ${keyArg}` : '';
    try {
      execSync(
        `node ${path.join(__dirname, 'import-workflow.js')} --id ${idStr} --host ${hostArg} ${keyFlag}`,
        { stdio: 'inherit', input: 'y\n' }
      );
      ok++;
    } catch {
      fail++;
      console.error(`  ❌  Failed to import workflow ${idStr}`);
    }
  }
  console.log(`\n📊  Imported: ${ok}  Failed: ${fail}\n`);
  if (fail > 0) process.exit(1);
});
