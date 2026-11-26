#!/usr/bin/env node
/**
 * Summit Chronicles — Truth Check
 *
 * Fails the build when public-facing content contradicts canonical records.
 *
 * Rules:
 *  - COUNT_TOO_HIGH: Any claim of Seven Summits count higher than canonical (e.g., 4/7, "four of the Seven Summits", "4 of 7").
 *  - DENALI_2025_NOT_TURNAROUND: Any description of Denali 2025 as a summit/success rather than a turnaround.
 *  - ANNAPURNA_SUMMIT_CLAIM: Any claim of an Annapurna summit.
 *
 * Allowlist (optional):
 *  Create scripts/truth-allowlist.json with:
 *  {
 *    "paths": ["relative/path/to/skip"],          // skip entire file/folder (substring match)
 *    "ignores": [{ "pattern": "literal text", "path": "relative/path" }] // ignore specific hits
 *  }
 *
 * The checker reads ONLY data/canonical-climbs.json for the facts.
 */

const path = require('node:path');
const { scanForViolations, loadCanonicalFromFile, loadAllowlist, formatViolations } = require('./truth-core');

const ROOT = process.cwd();
const CANONICAL_PATH = path.join(ROOT, 'data', 'canonical-climbs.json');
const ALLOWLIST_PATH = path.join(ROOT, 'scripts', 'truth-allowlist.json');

function main() {
  let canonical;
  try {
    canonical = loadCanonicalFromFile(CANONICAL_PATH);
  } catch (err) {
    console.error('❌ Failed to load canonical data:', err?.message ?? err);
    process.exit(1);
  }

  const allowlist = loadAllowlist(ALLOWLIST_PATH);
  const violations = scanForViolations(canonical, {
    rootDir: ROOT,
    allowlist
  });
  const report = formatViolations(violations, ROOT);
  console.log(report);
  if (violations.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

