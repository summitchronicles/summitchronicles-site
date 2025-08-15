// scripts/index-rag.cjs
// Build a tiny local RAG index into data/rag-index.json using Cohere Embeddings (free tier).
// CommonJS script (no ESM needed). Requires Node 18+ (global fetch).

const dotenv = require('dotenv')
dotenv.config({ path: '.env.local' })

const fs = require('fs')
const path = require('path')

// ====== ENV / CONFIG ======
const COHERE_API_KEY = process.env.COHERE_API_KEY
if (!COHERE_API_KEY) {
  console.error('❌ Missing COHERE_API_KEY in .env.local')
  process.exit(1)
}

// Cohere models:
// - 'embed-english-v3.0' (1024‑dim, English)
// - 'embed-multilingual-v3.0' (1024‑dim, multi‑lang)
const COHERE_MODEL = 'embed-english-v3.0'

// Files to index — add more as your site grows
const TARGETS = [
  { file: 'app/page.tsx',       source: 'page:home',  url: '/' },
  { file: 'app/about/page.tsx', source: 'page:/about', url: '/about' } // ok if missing
]

// Simple character chunking (good enough for MVP)
const CHUNK_SIZE = 1200
// ===========================

// Strip JSX/HTML crudely and collapse whitespace
function strip(str) {
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// --- Cohere v1 embed (stable shape): { embeddings: [[...]] } ---
async function cohereEmbed(text) {
  const res = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: COHERE_MODEL,
      input_type: 'search_document',  // for corpus/doc chunks
      texts: [text]
    })
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Cohere error ${res.status}: ${t}`)
  }

  const json = await res.json()

  // Robust extraction (handles standard v1 + a few nesting variants)
  let emb = null
  if (Array.isArray(json.embeddings)) {
    const e0 = json.embeddings[0]
    if (Array.isArray(e0)) emb = e0
    else if (Array.isArray(e0?.embedding)) emb = e0.embedding
    else if (Array.isArray(e0?.values)) emb = e0.values
    else if (Array.isArray(e0?.float)) emb = e0.float
  }

  if (!Array.isArray(emb)) {
    throw new Error(
      `Unexpected Cohere embed shape: keys=${Object.keys(json).join(',')}`
    )
  }
  return emb
}

async function main() {
  const root = process.cwd()
  const outDir = path.join(root, 'data')
  const outFile = path.join(outDir, 'rag-index.json')
  fs.mkdirSync(outDir, { recursive: true })

  const chunks = []
  for (const t of TARGETS) {
    const full = path.join(root, t.file)
    if (!fs.existsSync(full)) {
      console.warn(`↷ Skip missing: ${t.file}`)
      continue
    }
    const raw = fs.readFileSync(full, 'utf-8')
    const txt = strip(raw)
    for (let i = 0; i < txt.length; i += CHUNK_SIZE) {
      const content = txt.slice(i, i + CHUNK_SIZE)
      if (content.trim()) chunks.push({ ...t, content })
    }
  }

  console.log(`Embedding ${chunks.length} chunk(s) with Cohere ${COHERE_MODEL}…`)
  let dim = 0
  for (let i = 0; i < chunks.length; i++) {
    const emb = await cohereEmbed(chunks[i].content)
    if (!dim) dim = emb.length
    chunks[i].embedding = emb
    console.log(`  ${i + 1}/${chunks.length}`)
  }

  fs.writeFileSync(
    outFile,
    JSON.stringify({ model: `cohere:${COHERE_MODEL}`, dim: dim || 1024, chunks }, null, 2)
  )
  console.log(`✔ Wrote ${outFile}`)
}

main().catch(err => {
  console.error('❌', err.message || err)
  process.exit(1)
})