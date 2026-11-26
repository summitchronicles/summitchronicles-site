const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_INCLUDE_DIRS = [
  'app',
  'pages',
  'lib',
  'modules',
  'shared',
  'content',
  'blog-content',
  'public'
];

const DEFAULT_EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'tests',
  'scripts',
  'scripts-disabled',
  'components-disabled',
  'lib-disabled',
  'archive',
  'docs',
  'e2e',
  'playwright-report',
  'test-results'
];

const DEFAULT_EXTS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.mdx',
  '.html',
  '.txt'
];

const WORD_NUMBERS = {
  0: ['zero'],
  1: ['one', 'a'],
  2: ['two'],
  3: ['three'],
  4: ['four'],
  5: ['five'],
  6: ['six'],
  7: ['seven']
};

function normalizeLine(line) {
  return line.replace(/\s+/g, ' ').trim();
}

function containsAny(haystack, needles) {
  const lower = haystack.toLowerCase();
  return needles.some((n) => lower.includes(n.toLowerCase()));
}

function inSevenSummitsContext(line) {
  const lower = line.toLowerCase();
  return lower.includes('seven summits') || /\bof\s+7\b/i.test(line) || /\b\/\s*7\b/.test(line);
}

function detectHigherSummitCountLine(line, canonicalCompleted) {
  const text = normalizeLine(line);
  if (!inSevenSummitsContext(text)) return false;

  // Numeric forms: e.g. 4/7, 4 of 7. Ignore scale ticks "0/7" and "7/7".
  let numericHigher = false;
  const mSlash = text.match(/\b([0-9]+)\s*\/\s*7\b/);
  if (mSlash) {
    const num = parseInt(mSlash[1], 10);
    if (!Number.isNaN(num) && num !== 0 && num !== 7 && num > canonicalCompleted) {
      numericHigher = true;
    }
  }
  const mOf = text.match(/\b([0-9]+)\s+of\s+7\b/i);
  if (!numericHigher && mOf) {
    const num = parseInt(mOf[1], 10);
    if (!Number.isNaN(num) && num > canonicalCompleted) {
      numericHigher = true;
    }
  }
  if (numericHigher) return true;

  const higherWordNumbers = [];
  for (let n = canonicalCompleted + 1; n <= 7; n++) {
    for (const w of WORD_NUMBERS[n] || []) {
      higherWordNumbers.push(w);
    }
  }
  if (higherWordNumbers.length > 0) {
    const words = higherWordNumbers.join('|');
    const spelled = new RegExp(`\\b(${words})\\b\\s+of\\s+the\\s+seven\\s+summits\\b`, 'i').test(text);
    if (spelled) return true;
  }

  return false;
}

function detectDenali2025Misdescribed(line) {
  const text = normalizeLine(line).toLowerCase();
  if (!text.includes('denali') || !text.includes('2025')) return false;
  const summitTerms = ['summit', 'summited', 'reached the top', 'reached the summit', 'success', 'successful'];
  if (!containsAny(text, summitTerms)) return false;
  const negateTerms = ['turnaround', 'turned around', 'turned back', 'no summit', 'did not summit', "didn't summit", 'abort', 'aborted'];
  if (containsAny(text, negateTerms)) return false;
  return true;
}

function detectAnnapurnaSummitClaim(line) {
  const text = normalizeLine(line).toLowerCase();
  if (!text.includes('annapurna')) return false;
  const summitTerms = ['summit', 'summited', 'reached the top', 'reached the summit', 'success', 'successful', 'topped out', 'stood on top'];
  if (!containsAny(text, summitTerms)) return false;
  const negateTerms = ['no summit', 'did not', "didn't", 'never', 'not a', 'without', 'goal', 'aiming', 'plan', 'training'];
  if (containsAny(text, negateTerms)) return false;
  return true;
}

function isPathAllowlisted(filePath, allowlist) {
  if (!allowlist || !allowlist.paths || !allowlist.paths.length) return false;
  const loweredPath = filePath.toLowerCase();
  return allowlist.paths.some((p) => loweredPath.includes(p.toLowerCase()));
}

function isMatchAllowlisted(filePath, contentLine, allowlist) {
  if (!allowlist || !allowlist.ignores || !allowlist.ignores.length) return false;
  const loweredPath = filePath.toLowerCase();
  const line = contentLine.toLowerCase();
  return allowlist.ignores.some((ig) => {
    const pat = ig.pattern.toLowerCase();
    const pathOk = ig.path ? loweredPath.includes(ig.path.toLowerCase()) : true;
    return pathOk && line.includes(pat);
  });
}

function listFiles(dir, opts) {
  const results = [];
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (opts.excludeDirs.some((ex) => full.includes(ex))) continue;
      results.push(...listFiles(full, opts));
    } else if (e.isFile()) {
      if (opts.extensions.includes(path.extname(e.name))) {
        results.push(full);
      }
    }
  }
  return results;
}

function scanForViolations(canonical, options) {
  const {
    rootDir,
    includeDirs = DEFAULT_INCLUDE_DIRS,
    excludeDirs = DEFAULT_EXCLUDE_DIRS,
    extensions = DEFAULT_EXTS,
    allowlist
  } = options;

  const filesToScan = [];
  for (const dir of includeDirs) {
    const full = path.join(rootDir, dir);
    if (fs.existsSync(full)) {
      filesToScan.push(
        ...listFiles(full, {
          excludeDirs,
          extensions
        })
      );
    }
  }

  const violations = [];
  const completed = canonical.sevenSummitsCompleted;

  const isInternalCheckerFile = (p) =>
    p.endsWith(path.normalize('/lib/tools/truth-checker.ts')) ||
    p.endsWith(path.normalize('/scripts/truth-core.js')) ||
    p.endsWith(path.normalize('/scripts/truth-check.js'));

  for (const file of filesToScan) {
    if (isInternalCheckerFile(file)) continue;
    if (isPathAllowlisted(file, allowlist)) continue;
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    lines.forEach((ln, idx) => {
      const lineNo = idx + 1;
      if (detectHigherSummitCountLine(ln, completed)) {
        if (!isMatchAllowlisted(file, ln, allowlist)) {
          violations.push({
            rule: 'COUNT_TOO_HIGH',
            file,
            line: lineNo,
            content: ln,
            snippet: extractSnippet(ln, /(of\s+the\s+seven\s+summits|\b[0-9]+\s*\/\s*7|\b[0-9]+\s+of\s+7)/i)
          });
          return;
        }
      }
      if (detectDenali2025Misdescribed(ln)) {
        if (!isMatchAllowlisted(file, ln, allowlist)) {
          violations.push({
            rule: 'DENALI_2025_NOT_TURNAROUND',
            file,
            line: lineNo,
            content: ln,
            snippet: extractSnippet(ln, /(denali|2025|summit|success)/i)
          });
          return;
        }
      }
      if (detectAnnapurnaSummitClaim(ln)) {
        if (!isMatchAllowlisted(file, ln, allowlist)) {
          violations.push({
            rule: 'ANNAPURNA_SUMMIT_CLAIM',
            file,
            line: lineNo,
            content: ln,
            snippet: extractSnippet(ln, /(annapurna|summit|success)/i)
          });
          return;
        }
      }
    });
  }

  return violations;
}

function extractSnippet(line, re) {
  const m = line.match(re);
  if (!m) return line.trim().slice(0, 200);
  const i = m.index || 0;
  const start = Math.max(0, i - 60);
  const end = Math.min(line.length, i + (m[0] ? m[0].length : 0) + 60);
  return line.slice(start, end).trim();
}

function loadCanonicalFromFile(canonicalPath) {
  const raw = fs.readFileSync(canonicalPath, 'utf8');
  const data = JSON.parse(raw);
  if (typeof data.sevenSummitsCompleted !== 'number' || !Array.isArray(data.records)) {
    throw new Error('Invalid canonical-climbs.json format');
  }
  return data;
}

function loadAllowlist(allowlistPath) {
  try {
    const raw = fs.readFileSync(allowlistPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function formatViolations(violations, rootDir) {
  if (violations.length === 0) {
    return '✅ Truth check passed: no violations found.';
  }
  const rel = (p) => {
    try {
      return path.relative(rootDir, p) || p;
    } catch {
      return p;
    }
  };
  const lines = ['❌ Truth check failed. Violations:', ''];
  for (const v of violations) {
    lines.push(`- [${v.rule}] ${rel(v.file)}:${v.line}`, `  ⤷ ${v.snippet}`.trim());
  }
  lines.push('', `Total violations: ${violations.length}`);
  return lines.join('\n');
}

module.exports = {
  // core detectors (exported for tests/types in TS layer)
  detectHigherSummitCountLine,
  detectDenali2025Misdescribed,
  detectAnnapurnaSummitClaim,
  // main API
  scanForViolations,
  loadCanonicalFromFile,
  loadAllowlist,
  formatViolations
};

