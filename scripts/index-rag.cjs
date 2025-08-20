#!/usr/bin/env node
/**
 * Memory-safe RAG indexer for Supabase + Cohere
 * - Crawls ONLY small text files under /app and /data (you can add more)
 * - Skips heavy dirs: node_modules, .next, public, .git, etc.
 * - Batches embeds to keep RAM low
 * - Uses Supabase REST with service_role (local only) + RLS remains ON
 */

require('dotenv').config({ path: '.env.local' });

const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const crypto = require('node:crypto');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;

if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
if (!COHERE_API_KEY) throw new Error('Missing COHERE_API_KEY');

const ROOT = process.cwd();

/** ===== Crawl settings (safe defaults) ===== */
const INCLUDE_DIRS = ['app', 'data']; // add "content" later if you create it
const INCLUDE_EXTS = new Set(['.md', '.mdx', '.tsx', '.ts', '.jsx', '.js', '.txt']);
const EXCLUDE_DIRS = new Set([
  'node_modules', '.next', '.git', '.husky', 'public', 'e2e', 'scripts', '.vercel'
]);

const MAX_FILE_BYTES = 200 * 1024;       // skip files > 200 KB
const CHUNK_CHARS = 1500;                // ~400 tokens
const EMBED_BATCH = 8;                   // small to keep memory stable
const MODEL_EMBED = 'embed-english-v3.0';// free-tier Cohere embed model

const DEBUG = process.env.DEBUG === '1';

/** ===== Helpers ===== */
function isTextFile(p) {
  return INCLUDE_EXTS.has(path.extname(p).toLowerCase());
}

async function* walk(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (EXCLUDE_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(p);
    } else if (isTextFile(p)) {
      const st = await fsp.stat(p);
      if (st.size <= MAX_FILE_BYTES) yield p;
      else if (DEBUG) console.log('skip(big file)', p, st.size);
    }
  }
}

function chunkText(text, size = CHUNK_CHARS) {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}

async function cohereEmbedBatch(texts, inputType = 'search_document') {
  const res = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_EMBED,
      input_type: inputType,
      texts,
    }),
  });
  if (!res.ok) throw new Error(`Cohere embed ${res.status}: ${await res.text()}`);
  const json = await res.json();

  const arr = Array.isArray(json.embeddings) ? json.embeddings : json?.results || [];
  const vectors = arr.map(e => Array.isArray(e) ? e : (e?.embedding || e?.values || e?.float));
  if (!vectors.every(v => Array.isArray(v))) throw new Error('Unexpected Cohere embed response');
  return vectors;
}

async function upsertDocuments(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/documents`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`insert documents ${res.status}: ${await res.text()}`);
}

async function upsertChunks(rows) {
  // pgvector via PostgREST: JSON array is accepted for vector columns
  const res = await fetch(`${SUPABASE_URL}/rest/v1/chunks`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`insert chunks ${res.status}: ${await res.text()}`);
}

// Infer a stable doc id & web URL from repo path
function docInfoFromPath(absPath) {
  const rel = path.relative(ROOT, absPath).replace(/\\/g, '/'); // e.g. app/ask/page.tsx
  // crude URL inference, good enough for /app routes:
  let url = '/';
  if (rel.startsWith('app/')) {
    url =
      '/' +
      rel
        .slice(4)
        .replace(/\/page\.(tsx|jsx|mdx?|ts|js)$/i, '')
        .replace(/index\.(tsx|jsx|mdx?|ts|js)$/i, '')
        .replace(/\/+/g, '/')
        .replace(/^\/*/, '');
    url = '/' + url.replace(/^\//, '');
    if (url === '//') url = '/';
  }
  const id = crypto.createHash('sha1').update(rel).digest('hex');
  return { id, source: rel, url };
}

async function main() {
  // Build a small, explicit file list
  const files = [];
  for (const d of INCLUDE_DIRS) {
    const full = path.join(ROOT, d);
    if (fs.existsSync(full)) {
      for await (const p of walk(full)) files.push(p);
    }
  }

  if (files.length === 0) {
    console.log('No eligible files found under', INCLUDE_DIRS.join(', '));
    return;
  }
  if (DEBUG) {
    console.log('Indexing files:\n', files.map(f => ' - ' + path.relative(ROOT, f)).join('\n'));
  }

  let totalChunks = 0;

  for (const file of files) {
    const { id: doc_id, source, url } = docInfoFromPath(file);
    // 1) ensure a document row exists
    await upsertDocuments([{ id: doc_id, source, url, access_level: 'public' }]);

    // 2) read + chunk
    const text = await fsp.readFile(file, 'utf8');
    const pieces = chunkText(text);

    // 3) embed + insert in small batches
    for (let i = 0; i < pieces.length; i += EMBED_BATCH) {
      const slice = pieces.slice(i, i + EMBED_BATCH);
      const embeds = await cohereEmbedBatch(slice, 'search_document');
      const rows = slice.map((content, j) => ({
        doc_id,
        source,
        url,
        ord: i + j,
        content,
        embedding: embeds[j],
      }));
      await upsertChunks(rows);
      totalChunks += rows.length;
      if (DEBUG) console.log(`  upserted ${rows.length} chunk(s) from ${source}`);
    }
  }

  console.log(`✅ Indexed ${files.length} file(s) into ${totalChunks} chunk(s).`);
}

main().catch((e) => {
  console.error('❌ Indexing failed:', e.stack || e.message || e);
  process.exit(1);
});