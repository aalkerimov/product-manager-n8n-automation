#!/usr/bin/env node
/**
 * check-secrets.js
 * Scans files for patterns that look like leaked credentials or secrets.
 * Fails with exit code 1 if any are found.
 *
 * Usage:
 *   node scripts/check-secrets.js               # scan everything
 *   node scripts/check-secrets.js workflows/foo  # scan a specific directory
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET_ARG = process.argv[2];

// Patterns that are highly likely to be real secrets
const SECRET_PATTERNS = [
  // OpenAI keys
  { name: 'OpenAI API key', pattern: /sk-[A-Za-z0-9]{20,}/ },
  // Slack tokens
  { name: 'Slack token', pattern: /xox[baprs]-[0-9A-Za-z\-]{10,}/ },
  // GitHub tokens
  { name: 'GitHub PAT', pattern: /ghp_[A-Za-z0-9]{36}/ },
  { name: 'GitHub fine-grained token', pattern: /github_pat_[A-Za-z0-9_]{82}/ },
  // Generic high-entropy strings that look like tokens
  { name: 'Telegram bot token', pattern: /[0-9]{8,10}:[A-Za-z0-9_\-]{35}/ },
  // AWS
  { name: 'AWS access key', pattern: /AKIA[0-9A-Z]{16}/ },
  // Private keys
  { name: 'PEM private key', pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  // Passwords that look real (not placeholders)
  { name: 'Hardcoded password', pattern: /password["\s:=]+(?!changeme|your_|YOUR_|placeholder|PLACEHOLDER|<|{)[A-Za-z0-9!@#$%^&*]{8,}/ },
  // Real email addresses (not examples)
  // Real email — allowlist includes common docs/example domains
  { name: 'Real email (non-example domain)', pattern: /[a-zA-Z0-9._%+\-]+@(?!example\.com|example\.org|example\.net|yourcompany\.com|test\.com|local\.dev|acme\.com|examplestartup\.com|company\.com|streamlinecorp\.com|samplecorp\.com)[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g },
  // Linear API keys
  { name: 'Linear API key', pattern: /lin_api_[A-Za-z0-9]{40}/ },
];

// Files and directories to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git\//,
  /\.env$/,          // The actual .env — not tracked, but skip anyway
  /check-secrets\.js$/, // Skip this file itself
];

// Extensions to scan
const SCAN_EXTENSIONS = new Set([
  '.json', '.js', '.ts', '.md', '.yml', '.yaml', '.env', '.example', '.sh',
]);

function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(p => p.test(filePath.replace(/\\/g, '/')));
}

function scanFile(filePath) {
  const ext = path.extname(filePath);
  if (!SCAN_EXTENSIONS.has(ext) && !filePath.endsWith('.example')) return [];

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    return [];
  }

  const findings = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { name, pattern } of SECRET_PATTERNS) {
      if (pattern.test(line)) {
        // Reset lastIndex for global patterns
        if (pattern.global) pattern.lastIndex = 0;
        findings.push({
          file: path.relative(ROOT, filePath),
          line: i + 1,
          type: name,
          snippet: line.trim().substring(0, 100),
        });
      }
      if (pattern.global) pattern.lastIndex = 0;
    }
  }

  return findings;
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (shouldSkip(full)) continue;
    if (entry.isDirectory()) {
      results.push(...walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

const scanRoot = TARGET_ARG
  ? path.resolve(TARGET_ARG)
  : ROOT;

const files = fs.statSync(scanRoot).isDirectory()
  ? walkDir(scanRoot)
  : [scanRoot];

console.log(`\n🔐  Scanning ${files.length} file(s) for secrets...\n`);

const allFindings = files.flatMap(scanFile);

if (allFindings.length === 0) {
  console.log('  ✅  No secrets detected.\n');
  process.exit(0);
} else {
  console.error(`  ❌  Found ${allFindings.length} potential secret(s):\n`);
  for (const f of allFindings) {
    console.error(`  File:    ${f.file}:${f.line}`);
    console.error(`  Type:    ${f.type}`);
    console.error(`  Snippet: ${f.snippet}`);
    console.error('');
  }
  console.error('  Rotate any exposed credentials immediately.\n');
  process.exit(1);
}
