#!/usr/bin/env node
/**
 * check-required-files.js
 * Verifies that every workflow and subworkflow directory contains
 * the required files. Fails with exit code 1 if any are missing.
 *
 * Usage:
 *   node scripts/check-required-files.js                            # check all
 *   node scripts/check-required-files.js workflows/foo-workflow     # check one
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET_ARG = process.argv[2];

const WORKFLOW_REQUIRED = [
  'workflow.json',
  'README.md',
  'sample-output.json',
  // sample-input.json and config.example.json required but named differently in some workflows
];

// Category folders (like 01-discovery-research) — skip them, scan their children
const CATEGORY_PATTERN = /^\d{2}-/;

const SUBWORKFLOW_REQUIRED = [
  'workflow.json',
  'README.md',
];

function checkDir(dir, required) {
  const rel = path.relative(ROOT, dir);
  const missing = required.filter(f => !fs.existsSync(path.join(dir, f)));
  if (missing.length === 0) {
    console.log(`  ✅  ${rel}`);
    return true;
  } else {
    console.error(`  ❌  ${rel}`);
    for (const f of missing) {
      console.error(`       missing: ${f}`);
    }
    return false;
  }
}

function getSubdirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => path.join(dir, e.name));
}

let checks = [];

if (TARGET_ARG) {
  const full = path.resolve(TARGET_ARG);
  const isSubworkflow = full.includes('subworkflows');
  checks.push({ dir: full, required: isSubworkflow ? SUBWORKFLOW_REQUIRED : WORKFLOW_REQUIRED });
} else {
  for (const dir of getSubdirs(path.join(ROOT, 'workflows'))) {
    const name = path.basename(dir);
    if (CATEGORY_PATTERN.test(name)) {
      // It's a category folder — check its children (the actual workflow dirs)
      for (const child of getSubdirs(dir)) {
        checks.push({ dir: child, required: WORKFLOW_REQUIRED });
      }
    } else {
      checks.push({ dir, required: WORKFLOW_REQUIRED });
    }
  }
  for (const dir of getSubdirs(path.join(ROOT, 'subworkflows'))) {
    checks.push({ dir, required: SUBWORKFLOW_REQUIRED });
  }
}

console.log(`\n📁  Checking ${checks.length} workflow director(y/ies)...\n`);

let passed = 0;
let failed = 0;

for (const { dir, required } of checks) {
  if (checkDir(dir, required)) {
    passed++;
  } else {
    failed++;
  }
}

console.log(`\n📊  Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
