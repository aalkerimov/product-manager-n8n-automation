#!/usr/bin/env node
/**
 * validate-json.js
 * Validates that all workflow JSON files are syntactically valid.
 * Scans both flat (legacy) and category-nested directory structures.
 * Run: node scripts/validate-json.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET = process.argv[2];

const SEARCH_DIRS = [
  path.join(ROOT, 'workflows'),
  path.join(ROOT, 'subworkflows'),
];

function findJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findJsonFiles(full));
    } else if (entry.name.endsWith('.json')) {
      results.push(full);
    }
  }
  return results;
}

function validateFile(filePath) {
  const rel = path.relative(ROOT, filePath);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log(`  ✅  ${rel}`);
    return true;
  } catch (err) {
    console.error(`  ❌  ${rel}`);
    console.error(`       ${err.message}`);
    return false;
  }
}

let files;
if (TARGET) {
  files = [path.resolve(TARGET)];
} else {
  files = SEARCH_DIRS.flatMap(findJsonFiles);
  // Also check config files
  const extras = ['docker-compose.yml', '.env.example'];
  // Only validate JSON extras
  const jsonExtras = extras
    .map(f => path.join(ROOT, f))
    .filter(f => f.endsWith('.json'));
  files.push(...jsonExtras);
}

console.log(`\n🔍  Validating ${files.length} JSON file(s)...\n`);

let passed = 0;
let failed = 0;

for (const file of files) {
  if (validateFile(file)) {
    passed++;
  } else {
    failed++;
  }
}

console.log(`\n📊  Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
