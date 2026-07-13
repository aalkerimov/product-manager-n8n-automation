#!/usr/bin/env node
/**
 * list.js
 * Lists all available workflows with their status, category, and setup time.
 * Usage: npm run list
 *        npm run list -- --category discovery-research
 *        npm run list -- --status stable
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'catalog', 'workflows.json');

const args = process.argv.slice(2);
const filterCategory = args.find((a, i) => args[i - 1] === '--category');
const filterStatus   = args.find((a, i) => args[i - 1] === '--status');
const filterDiff     = args.find((a, i) => args[i - 1] === '--difficulty');

function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error('❌  catalog/workflows.json not found. Run: npm run catalog:build');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
}

const catalog = loadCatalog();
let workflows = catalog.workflows;

if (filterCategory) {
  workflows = workflows.filter(w =>
    w.category.toLowerCase().includes(filterCategory.toLowerCase())
  );
}
if (filterStatus) {
  workflows = workflows.filter(w =>
    w.status.toLowerCase() === filterStatus.toLowerCase()
  );
}
if (filterDiff) {
  workflows = workflows.filter(w =>
    w.difficulty.toLowerCase() === filterDiff.toLowerCase()
  );
}

const statusIcon = { stable: '✅', beta: '🔶', building: '🔨', planned: '📋' };
const col = (s, w) => String(s).padEnd(w);

console.log(`\n📦  Product & Founder Automation OS — ${catalog.meta.totalWorkflows} workflows\n`);
console.log(
  col('ID', 4) +
  col('Name', 40) +
  col('Category', 24) +
  col('Status', 10) +
  col('Difficulty', 12) +
  'Setup'
);
console.log('─'.repeat(100));

for (const w of workflows) {
  const icon = statusIcon[w.status] || '❓';
  console.log(
    col(w.id, 4) +
    col(w.name, 40) +
    col(w.category, 24) +
    col(`${icon} ${w.status}`, 12) +
    col(w.difficulty, 12) +
    w.setupTime
  );
}

console.log(`\n  Showing ${workflows.length} of ${catalog.meta.totalWorkflows} workflows`);
console.log(`  Filter: npm run list -- --category <name> --status <stable|beta> --difficulty <beginner|intermediate|advanced>\n`);
