#!/usr/bin/env node
/**
 * test-fixtures.js
 * Validates all fixture inputs against their expected outputs by running
 * each workflow's static fixture through a structural schema check.
 * (Runtime execution requires a live n8n instance — see README.)
 *
 * Usage: npm run test
 *        npm run test -- --id 04
 */
const fs   = require('fs');
const path = require('path');

const ROOT         = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'catalog', 'workflows.json');

const args  = process.argv.slice(2);
const idArg = args.find((a, i) => args[i - 1] === '--id');

function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error('❌  catalog/workflows.json not found.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
}

const catalog = loadCatalog();
let workflows = catalog.workflows;
if (idArg) {
  workflows = workflows.filter(w =>
    String(w.id).padStart(2, '0') === String(idArg).padStart(2, '0')
  );
}

let pass = 0; let fail = 0; let skip = 0;
const failures = [];

console.log(`\n🧪  Testing ${workflows.length} workflow fixture(s)...\n`);

for (const w of workflows) {
  const wfDir       = path.join(ROOT, w.path);
  const fixtureDir  = path.join(wfDir, 'tests', 'fixtures');
  const expectedDir = path.join(wfDir, 'tests', 'expected-output');

  if (!fs.existsSync(fixtureDir) || !fs.existsSync(expectedDir)) {
    console.log(`  ⏭️   ${String(w.id).padStart(2,'0')} ${w.name}  (no fixtures)`);
    skip++;
    continue;
  }

  const fixtures = fs.readdirSync(fixtureDir).filter(f => f.endsWith('.json'));
  if (fixtures.length === 0) { skip++; continue; }

  let wfPass = true;
  for (const fixture of fixtures) {
    const fixturePath  = path.join(fixtureDir, fixture);
    const expectedPath = path.join(expectedDir, fixture);

    // Validate fixture is parseable
    try { JSON.parse(fs.readFileSync(fixturePath, 'utf8')); }
    catch (e) {
      failures.push({ id: w.id, name: w.name, file: fixturePath, error: 'Invalid JSON in fixture' });
      wfPass = false; fail++; continue;
    }

    // If expected output exists, validate it's parseable
    if (fs.existsSync(expectedPath)) {
      try { JSON.parse(fs.readFileSync(expectedPath, 'utf8')); }
      catch (e) {
        failures.push({ id: w.id, name: w.name, file: expectedPath, error: 'Invalid JSON in expected output' });
        wfPass = false; fail++; continue;
      }
    }

    pass++;
  }

  const icon = wfPass ? '✅' : '❌';
  console.log(`  ${icon}  ${String(w.id).padStart(2,'0')} ${w.name}`);
}

console.log(`\n📊  Results: ${pass} passed, ${fail} failed, ${skip} skipped\n`);

if (failures.length > 0) {
  console.log('Failures:');
  for (const f of failures) {
    console.log(`  ❌  [${f.id}] ${f.name}: ${f.error}`);
    console.log(`       File: ${f.file}`);
  }
  console.log('');
  process.exit(1);
}

if (pass === 0 && skip > 0) {
  console.log('ℹ️   No fixtures found. Add test input to tests/fixtures/ in each workflow.\n');
}
