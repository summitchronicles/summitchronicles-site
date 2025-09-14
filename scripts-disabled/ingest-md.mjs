// scripts/ingest-md.mjs
// Ingest local Markdown files by POSTing JSON to your /api/db/ingest endpoint.

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import glob from 'fast-glob';

// ---------- Arg & env parsing (robust) ----------
/**
 * We often invoke this script like:
 *   node -r dotenv/config scripts/ingest-md.mjs content dotenv_config_path=.env.local
 * Some shells reorder args. We:
 *  - ignore any key=value args,
 *  - choose the first arg that is an existing directory,
 *  - otherwise default to "content".
 */
const argv = process.argv.slice(2);

// Helper: returns the first arg that looks like a directory and is not key=value
async function pickRootArg(args) {
  for (const a of args) {
    if (!a || a.includes('=')) continue;            // ignore key=value
    const p = a.trim();
    try {
      const st = await fs.stat(p);
      if (st.isDirectory()) return p;               // choose first directory that exists
    } catch {
      // not a path we can stat; skip
    }
  }
  return null;
}

const ROOT = (await pickRootArg(argv)) ?? 'content';
const ENDPOINT = process.env.INGEST_ENDPOINT;
const SECRET   = process.env.INGEST_SECRET || '';   // optional; required on prod if your route enforces it

// Debug banner so we can see exactly what the script received
console.log('argv:', JSON.stringify(argv));
if (!ENDPOINT) {
  console.error('INGEST_ENDPOINT is required (e.g. http://localhost:3000/api/db/ingest)');
  process.exit(1);
}
console.log(`📥 Ingesting Markdown from: ${path.resolve(ROOT)}`);
console.log(`→ Endpoint: ${ENDPOINT}`);
if (SECRET) console.log('→ Using x-ingest-secret header');

const mdFiles = await glob(['**/*.md', '**/*.mdx'], { cwd: ROOT, absolute: true });

if (mdFiles.length === 0) {
  console.error(`⚠️  No Markdown files found under "${ROOT}".`);
  console.error('    Tips:');
  console.error('      • Ensure you run from the project root (where the "content" folder lives).');
  console.error('      • Pass the content root as the first non key=value arg, e.g.:');
  console.error('        node -r dotenv/config scripts/ingest-md.mjs content dotenv_config_path=.env.local');
  process.exit(2);
}

let ok = 0;
let failed = 0;

for (const abs of mdFiles) {
  const rel = path.relative(ROOT, abs);
  try {
    const raw = await fs.readFile(abs, 'utf8');
    const { data: fm, content } = matter(raw);

    // Required fields expected by the API
    const payload = {
      title:  fm.title  ?? '',
      source: fm.source ?? '',
      url:    fm.url    ?? '',
      access: fm.access ?? 'public',
      // send as explicit chunks so the API accepts uniformly
      chunks: [{ text: content }],
    };

    // Client-side validation to avoid 400s
    const missing = [];
    if (!payload.title)  missing.push('title');
    if (!payload.source) missing.push('source');
    if (!payload.url)    missing.push('url');
    if (!content.trim()) missing.push('text');
    if (missing.length) {
      throw new Error(`${missing.join(', ')} are required`);
    }

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(SECRET ? { 'x-ingest-secret': SECRET } : {})
      },
      redirect: 'follow',
      body: JSON.stringify(payload)
    });

    // Some hosts return HTML error pages (405/308/etc.)
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} – Non-JSON response: ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    if (!res.ok || json.ok === false) {
      throw new Error((json && (json.error || json.message)) || `HTTP ${res.status}`);
    }

    console.log(`✔ ${rel}  → doc:${json.document_id ?? 'n/a'} chunks:${json.chunks ?? 'n/a'}`);
    ok++;
  } catch (err) {
    console.error(`✖ ${rel}  (${err.message})`);
    failed++;
  }
}

console.log('—'.repeat(64));
console.log(`Done. files:${mdFiles.length}  ok:${ok}  failed:${failed}`);
process.exit(failed > 0 ? 1 : 0);