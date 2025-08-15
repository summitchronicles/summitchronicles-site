// scripts/index-rag.js
// Build a tiny local RAG index from your pages into data/rag-index.json
// Uses Hugging Face Inference API (free) for embeddings.

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import fs from 'fs'
import path from 'path'
import process from 'process'

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
if (!HF_API_KEY) {
  console.error('Missing HUGGINGFACE_API_KEY in .env.local')
  process.exit(1)
}

// Solid, small model (384‑dim)
const HF_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'

// Add more files here as your content grows
const TARGETS = [
  { file: 'app/page.tsx',       source: 'page:home',  url: '/' },
  { file: 'app/about/page.tsx', source: 'page:/about', url: '/about' }
]

// Characters per chunk (simple and good enough for now)
const CHUNK_SIZE = 1200

// Call HF with the feature-extraction pipeline and return a 1-D vector
async function hfEmbed(text) {
  const res = await fetch(
    `https://api-inference.huggingface.co/pipeline/feature-extraction/${HF_MODEL}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text })
    }
  )

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`HF error ${res.status}: ${t}`)
  }

  const json = await res.json()
  let vec = json

  // HF can return:
  // - [dim] (already pooled)
  // - [[dim], ...] (token-level)  -> average-pool
  // - [[[dim], ...]] (extra nesting) -> unwrap then average-pool
  if (Array.isArray(vec) && Array.isArray(vec[0])) {
    const tokens = Array.isArray(vec[0][0]) ? vec[0] : vec // unwrap if needed
    const L = tokens.length
    const D = tokens[0].length
    const pooled = new Array(D).fill(0)
    for (let i = 0; i < L; i++) {
      for (let j = 0; j < D; j++) pooled[j] += tokens[i][j]
    }
    for (let j = 0; j < D; j++) pooled[j] /= L
    return pooled
  }

  if (!Array.isArray(vec) || typeof vec[0] !== 'number') {
    throw new Error('Unexpected HF embedding shape')
  }
  return vec
}

// Strip JSX/HTML crudely and collapse whitespace
function strip(str) {
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
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
      console.warn(`Skip missing: ${t.file}`)
      continue
    }
    const raw = fs.readFileSync(full, 'utf-8')
    const txt = strip(raw)
    for (let i = 0; i < txt.length; i += CHUNK_SIZE) {
      const content = txt.slice(i, i + CHUNK_SIZE)
      if (content.trim()) chunks.push({ ...t, content })
    }
  }

  console.log(`Embedding ${chunks.length} chunk(s) with ${HF_MODEL}…`)
  let dim = 0
  for (let i = 0; i < chunks.length; i++) {
    const emb = await hfEmbed(chunks[i].content)
    if (!dim) dim = emb.length
    chunks[i].embedding = emb
    console.log(`  ${i + 1}/${chunks.length}`)
  }

  fs.writeFileSync(outFile, JSON.stringify({ model: HF_MODEL, dim: dim || 384, chunks }, null, 2))
  console.log(`✔ Wrote ${outFile}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})