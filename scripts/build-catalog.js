#!/usr/bin/env node
/**
 * build-catalog.js
 * Scans all workflow directories and builds catalog/workflows.json
 * from the metadata embedded in each workflow.json.
 *
 * Usage: npm run catalog:build
 */
const fs   = require('fs');
const path = require('path');

const ROOT        = path.resolve(__dirname, '..');
const CATALOG_DIR = path.join(ROOT, 'catalog');
const OUTPUT_PATH = path.join(CATALOG_DIR, 'workflows.json');

// Category directories (in order)
const CATEGORY_DIRS = [
  { slug: 'discovery-research',     label: 'Discovery & Research',             dir: '01-discovery-research' },
  { slug: 'planning-execution',     label: 'Planning & Execution',             dir: '02-planning-execution' },
  { slug: 'analytics-experiments',  label: 'Analytics & Experiments',          dir: '03-analytics-experiments' },
  { slug: 'customer-growth',        label: 'Customer Success & Growth',        dir: '04-customer-growth' },
  { slug: 'operations-leadership',  label: 'Releases, Operations & Leadership',dir: '05-operations-leadership' },
];

const workflows = [];

for (const cat of CATEGORY_DIRS) {
  const catDir = path.join(ROOT, 'workflows', cat.dir);
  if (!fs.existsSync(catDir)) continue;

  const entries = fs.readdirSync(catDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const wfDir      = path.join(catDir, entry.name);
    const wfJsonPath = path.join(wfDir, 'workflow.json');
    if (!fs.existsSync(wfJsonPath)) continue;

    let wf;
    try { wf = JSON.parse(fs.readFileSync(wfJsonPath, 'utf8')); }
    catch { console.warn(`  ⚠️  Invalid JSON: ${wfJsonPath}`); continue; }

    const meta = wf.meta || {};
    const catalogEntry = {
      id:                   meta.id || entry.name.split('-')[0],
      name:                 meta.name || wf.name || entry.name,
      folderName:           entry.name,
      description:          meta.description || '',
      category:             cat.label,
      categorySlug:         cat.slug,
      status:               meta.status || 'beta',
      version:              meta.version || '1.0.0',
      testedN8nVersion:     meta.testedN8nVersion || '2.30.0',
      difficulty:           meta.difficulty || 'intermediate',
      setupTime:            meta.setupTime || '15 min',
      estimatedMonthlyCost: meta.estimatedMonthlyCost || 'varies',
      requiredIntegrations: meta.requiredIntegrations || [],
      optionalIntegrations: meta.optionalIntegrations || [],
      triggerType:          meta.triggerType || 'schedule',
      inputTypes:           meta.inputTypes || [],
      outputTypes:          meta.outputTypes || [],
      aiRequired:           meta.aiRequired !== undefined ? meta.aiRequired : true,
      humanApproval:        meta.humanApproval || false,
      selfHosted:           meta.selfHosted !== undefined ? meta.selfHosted : true,
      n8nCloud:             meta.n8nCloud !== undefined ? meta.n8nCloud : true,
      path:                 `workflows/${cat.dir}/${entry.name}`,
      tags:                 meta.tags || [],
      docLink:              `workflows/${cat.dir}/${entry.name}/README.md`,
    };
    workflows.push(catalogEntry);
  }
}

if (!fs.existsSync(CATALOG_DIR)) fs.mkdirSync(CATALOG_DIR, { recursive: true });

const catalog = {
  meta: {
    version:          '2.0.0',
    generatedAt:      new Date().toISOString(),
    totalWorkflows:   workflows.length,
    testedN8nVersion: '2.30.0',
    repository:       'https://github.com/YOUR_ORG/product-founder-automation-os',
  },
  workflows,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(catalog, null, 2));
console.log(`\n✅  Catalog built: ${workflows.length} workflows → catalog/workflows.json\n`);
