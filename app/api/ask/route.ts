import { NextResponse, NextRequest } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabaseServer'
import { embedText } from '@/lib/embeddings'   // your existing embeddings helper
import { z } from 'zod'
import crypto from 'crypto'

export const runtime = 'nodejs'

/**
 * POST /api/ask
 * Body: { q: string }
 *
 * Retrieval:
 *  - embed query with the same model used for chunks
 *  - call match_chunks(...) with filters (public by default)
 *  - compose a short prompt and ask the LLM to answer strictly from context
 *
 * Logging (optional):
 *  - if LOG_WEBHOOK_URL is set, we POST a small JSON payload (no PII)
 *  - includes: timestamp, duration, route, env, hashed client fingerprint,
 *    question text, and top doc_ids with scores
 */

// ---- Tunables ----
const TOP_K = 6
const MIN_SCORE = 0      // rely on ranking; raise later if you want a cutoff
const GEN_MAX_TOKENS = 300

const Body = z.object({
  q: z.string().min(2, 'Question is too short'),
})

// ===== Types for RPC + ranking =====
type RpcChunkRow = {
  doc_id: string
  idx: number
  content: string | null
  source: string | null
  url: string | null
  // from pgvector <=> (cosine distance); smaller is closer
  distance: number | null
}

type RankedRow = {
  doc_id: string
  idx: number
  content: string
  source: string | null
  url: string | null
  score: number
}

// ===== Helpers =====

/** Minimal Cohere text generation – mirrors your existing pattern */
async function generateWithCohere(prompt: string, maxTokens: number) {
  const key = process.env.COHERE_API_KEY
  if (!key) throw new Error('Missing COHERE_API_KEY')

  const res = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command',
      prompt,
      max_tokens: maxTokens,
      temperature: 0.2,
    }),
  })
  if (!res.ok) {
    throw new Error(`Cohere generate error ${res.status}: ${await res.text()}`)
  }
  const data = await res.json()
  const text = data?.generations?.[0]?.text
  if (typeof text !== 'string') throw new Error('Unexpected Cohere response')
  return text.trim()
}

/** fire-and-forget JSON POST to a webhook (no throw on failure) */
function logEvent(payload: any) {
  const url = process.env.LOG_WEBHOOK_URL
  if (!url) return // optional
  fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}

/** Build an anon fingerprint (hash of a few headers) to track volumes w/o PII */
function anonFingerprint(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      '' // empty if none
    const ua = req.headers.get('user-agent') || ''
    const seed = `${ip}::${ua}`
    return crypto.createHash('sha256').update(seed).digest('hex').slice(0, 24)
  } catch {
    return 'na'
  }
}

// ===== Route =====

export async function POST(req: NextRequest) {
  const t0 = Date.now()
  let log: any = {
    t: t0,
    route: '/api/ask',
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
  }

  try {
    const json = await req.json()
    const { q } = Body.parse(json)
    log.q = q
    log.fp = anonFingerprint(req)

    // 1) Embed the user query
    const qVec = await embedText(q)

    // 2) Retrieve from Supabase via RPC (public docs only by default)
    const supabase = getSupabaseAnon()
    const { data: rows, error } = await supabase.rpc('match_chunks', {
      query_embedding: qVec,
      match_count: TOP_K,
      p_access: 'public',
      p_source: null,
      p_url: null,
    })

    if (error) throw error

    // Explicitly type the incoming rows and the derived ranking
    const ranked: RankedRow[] = ((rows ?? []) as RpcChunkRow[])
      .map((r): RankedRow => ({
        doc_id: r.doc_id,
        idx: r.idx,
        content: (r.content ?? '').toString(),
        source: r.source,
        url: r.url,
        // pgvector returns cosine distance when using `<=>` (smaller is closer)
        score: 1 - (typeof r.distance === 'number' ? r.distance : 0),
      }))
      .filter((r) => r.score >= MIN_SCORE)

    const top: RankedRow[] = ranked
      .slice(0, TOP_K)
      .filter((r) => r.content.trim().length > 0)

    // store summary for the log
    log.retrieved = top.map((t) => ({
      doc_id: t.doc_id,
      idx: t.idx,
      score: Number(t.score.toFixed(3)),
    }))

    const context = top
      .map(
        (r, i) =>
          `# Chunk ${i + 1}\nSource: ${r.source ?? 'unknown'}\nURL: ${
            r.url ?? ''
          }\n${r.content}`
      )
      .join('\n\n---\n\n')

    if (!context) {
      const body = { answer: "I don't have that information yet.", sources: [] as any[] }
      log.status = 'no_context'
      log.ms = Date.now() - t0
      logEvent({ ...log, body })
      return NextResponse.json(body)
    }

    // 3) Generate answer constrained to context
    const prompt = `You are the assistant for the Summit Chronicles site.
Answer ONLY using the context blocks. If the context doesn't contain the answer, say you don't have it yet.
Be concise and precise.

Context:
${context}

Question: ${q}

Answer:`

    const answer = await generateWithCohere(prompt, GEN_MAX_TOKENS)
    const sources = top.map((r) => ({ source: r.source ?? 'unknown', url: r.url ?? '' }))

    const body = { answer, sources }
    log.status = 'ok'
    log.ms = Date.now() - t0
    logEvent({ ...log, body })
    return NextResponse.json(body)
  } catch (e: any) {
    const msg = e?.message || 'failed'
    const body = { error: msg }
    log.status = 'error'
    log.err = msg
    log.ms = Date.now() - t0
    logEvent({ ...log, body })
    return NextResponse.json(body, { status: 400 })
  }
}