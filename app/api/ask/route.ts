import { NextResponse } from 'next/server'
import index from '@/data/rag-index.json' assert { type: 'json' }

/* =======================
   Config (tunable knobs)
   ======================= */
const COHERE_API_KEY = process.env.COHERE_API_KEY
const COHERE_EMBED_MODEL =
  (index as any)?.model?.startsWith('cohere:')
    ? (index as any).model.split(':')[1]
    : 'embed-english-v3.0'

// Retrieval knobs
const TOP_K = 8;            // how many best chunks to keep
const MIN_SCORE = 0.15;     // drop chunks below this cosine similarity

// Safety guard
function requireEnv(name: string, val?: string) {
  if (!val) throw new Error(`Missing ${name} env var`)
}

/* =======================
   Utils
   ======================= */
function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

/* =======================
   Cohere v1 – Embeddings
   ======================= */
async function cohereEmbed(text: string, inputType: 'search_document' | 'search_query') {
  const res = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: COHERE_EMBED_MODEL,   // 'embed-english-v3.0' or 'embed-multilingual-v3.0'
      input_type: inputType,
      texts: [text],
    }),
  })
  if (!res.ok) throw new Error(`Cohere embed error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  const first = Array.isArray(json.embeddings) ? json.embeddings[0] : null
  const vec = Array.isArray(first) ? first : (first?.embedding || first?.values || first?.float)
  if (!Array.isArray(vec)) throw new Error('Unexpected Cohere embed response shape')
  return vec as number[]
}

/* =======================
   Cohere v1 – Generation
   ======================= */
// 'command' is available on free tier; you can switch to 'command-light' if you hit limits.
async function cohereGenerate(prompt: string) {
  const res = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command',
      prompt,
      max_tokens: 400,
      temperature: 0.2,
    }),
  })
  if (!res.ok) throw new Error(`Cohere generate error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  const text = json?.generations?.[0]?.text
  if (typeof text !== 'string') throw new Error('Unexpected Cohere generate response shape')
  return text.trim()
}

/* =======================
   Route
   ======================= */
export async function POST(req: Request) {
  try {
    requireEnv('COHERE_API_KEY', COHERE_API_KEY)

    const body = await req.json().catch(() => ({}))
    const q = body?.q as string
    const debug = !!body?.debug // send { debug: true } to see scores/slices

    if (!q || typeof q !== 'string') {
      return NextResponse.json({ error: 'No question provided' }, { status: 400 })
    }

    // 1) Embed user question
    const qVec = await cohereEmbed(q, 'search_query')

    // 2) Retrieve top chunks from local index
    const chunks: any[] = (index as any)?.chunks || []
    let scored = chunks.map(ch => ({
      ...ch,
      score: cosine(qVec, ch.embedding as number[]),
    }))

    // filter + sort + slice
    scored = scored
      .filter(ch => ch.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_K)

    // If nothing passes threshold, fail gracefully early
    if (scored.length === 0) {
      return NextResponse.json({
        answer: "Sorry, I don't have that information yet.",
        sources: [],
        ...(debug ? { debug: { note: 'no chunks met MIN_SCORE', MIN_SCORE } } : {}),
      })
    }

    // 3) Build context from selected chunks
    const context = scored.map(ch => `Source: ${ch.source}\n${ch.content}`).join('\n---\n')
    const sources = scored.map(s => ({ source: s.source, url: s.url, score: Number(s.score.toFixed(3)) }))

    const prompt =
`You are the assistant for the Summit Chronicles website.
Answer the user's question ONLY using the context below. If the context does not contain the answer,
say you don't have that information yet. Be concise and precise.

Context:
${context}

Question: ${q}

Answer:`

    // 4) Generate answer (Cohere free tier)
    const answer = await cohereGenerate(prompt)

    return NextResponse.json({ answer, sources, ...(debug ? { debug: { TOP_K, MIN_SCORE } } : {}) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}