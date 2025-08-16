import { NextResponse } from 'next/server'
import index from '@/data/rag-index.json' assert { type: 'json' }
import facts from '@/data/facts.json' assert { type: 'json' }

/* =======================
   Config (scales well)
   ======================= */
const COHERE_API_KEY = process.env.COHERE_API_KEY

// Embeddings (first-pass recall)
const COHERE_EMBED_MODEL =
  (index as any)?.model?.startsWith('cohere:')
    ? (index as any).model.split(':')[1]
    : 'embed-english-v3.0'

// Rerank (precision)
const COHERE_RERANK_MODEL = 'rerank-english-v3.0'

// Retrieval knobs (kept reasonably strict)
const MIN_SCORE_EMBED = 0.20
const FIRST_PASS_K    = 20
const RERANK_TOP_K    = 5
const RERANK_MIN      = 0.35

/* =======================
   Helpers
   ======================= */
function requireEnv(name: string, val?: string) {
  if (!val) throw new Error(`Missing ${name} env var`)
}

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

// Very small intent detector for mission-critical answers
function factMatch(q: string) {
  const s = q.toLowerCase()
  if (
    /next\s+(expedition|climb|objective)/.test(s) ||
    /(what|which)\s+is\s+the\s+next\s+(expedition|climb|objective)/.test(s)
  ) {
    return {
      key: 'next_expedition',
      answer: (facts as any)?.statement ||
        `Next Expedition: ${(facts as any)?.next_expedition ?? '—'} — target year ${(facts as any)?.target_year ?? '—'}.`,
      sources: [{ source: 'facts.json', url: '/expeditions' }]
    }
  }
  return null
}

/* =======================
   Cohere APIs
   ======================= */
async function cohereEmbed(text: string, inputType: 'search_document' | 'search_query') {
  const res = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: COHERE_EMBED_MODEL,
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

async function cohereRerank(query: string, documents: string[]) {
  const res = await fetch('https://api.cohere.ai/v1/rerank', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: COHERE_RERANK_MODEL,
      query,
      documents,
      top_n: Math.min(RERANK_TOP_K, documents.length),
    }),
  })
  if (!res.ok) throw new Error(`Cohere rerank error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return (json?.results ?? []) as Array<{ index: number; relevance_score: number }>
}

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
    const debug = !!body?.debug

    if (!q || typeof q !== 'string') {
      return NextResponse.json({ error: 'No question provided' }, { status: 400 })
    }

    // 0) FACTS-FIRST: deterministic answers for key intents
    const hit = factMatch(q)
    if (hit) {
      return NextResponse.json({
        answer: hit.answer,
        sources: hit.sources,
        ...(debug ? { debug: { route: 'facts-first' } } : {})
      })
    }

    // 1) First-pass: embeddings recall
    const qVec = await cohereEmbed(q, 'search_query')
    const chunks: any[] = (index as any)?.chunks || []

    const firstPass = chunks
      .map(ch => ({ ...ch, embedScore: cosine(qVec, ch.embedding as number[]) }))
      .filter(ch => ch.embedScore >= MIN_SCORE_EMBED)
      .sort((a, b) => b.embedScore - a.embedScore)
      .slice(0, FIRST_PASS_K)

    if (firstPass.length === 0) {
      return NextResponse.json({
        answer: "Sorry, I don't have that information yet.",
        sources: [],
        ...(debug ? { debug: { note: 'no chunks met MIN_SCORE_EMBED', MIN_SCORE_EMBED } } : {}),
      })
    }

    // 2) Precision: rerank
    const docs = firstPass.map(ch => `${ch.content}\n[Source: ${ch.source}]`)
    const reranked = await cohereRerank(q, docs)

    const selected = reranked
      .map(r => ({ ...firstPass[r.index], rerankScore: r.relevance_score }))
      .filter(ch => ch.rerankScore >= RERANK_MIN)
      .sort((a, b) => b.rerankScore - a.rerankScore)
      .slice(0, RERANK_TOP_K)

    if (selected.length === 0) {
      return NextResponse.json({
        answer: "Sorry, I don't have that information yet.",
        sources: [],
        ...(debug ? { debug: { note: 'no chunks met RERANK_MIN', RERANK_MIN } } : {}),
      })
    }

    // 3) Build final context
    const context = selected.map(ch => `Source: ${ch.source}\n${ch.content}`).join('\n---\n')
    const sources = selected.map(s => ({
      source: s.source,
      url: s.url,
      embedScore: Number(s.embedScore.toFixed(3)),
      rerankScore: Number(s.rerankScore.toFixed(3)),
    }))

    const prompt =
`You are the assistant for the Summit Chronicles website.
Answer the user's question ONLY using the context below. If the context contains an explicit fact
(e.g., "Next Expedition: Everest — 2026"), extract and state it directly. If the context does not
contain the answer, say you don't have that information yet. Be concise and precise.

Context:
${context}

Question: ${q}

Answer:`

    const answer = await cohereGenerate(prompt)

    return NextResponse.json({
      answer,
      sources,
      ...(debug ? {
        debug: {
          route: 'rag',
          FIRST_PASS_K,
          MIN_SCORE_EMBED,
          RERANK_TOP_K,
          RERANK_MIN,
          firstPassCount: firstPass.length,
          rerankedCount: reranked.length,
          selectedCount: selected.length,
        }
      } : {})
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}