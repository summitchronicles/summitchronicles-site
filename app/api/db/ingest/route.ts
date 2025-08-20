// app/api/db/ingest/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { chunkText } from '@/lib/chunk'
import { embedText } from '@/lib/embeddings'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

// Important on Vercel: prevent static optimization & ensure Node runtime
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Optional: small GET to sanity-check the route exists in prod
export async function GET() {
  return NextResponse.json({ ok: true, route: 'db/ingest' })
}

// Incoming payload shape
type IngestBody = {
  title: string
  source: string
  url: string
  access: 'public' | 'private'
  text: string
}

function bad(msg: string, code = 400) {
  // Surface the error in server logs as well to make debugging easier
  console.error(`[ingest] ${code} ${msg}`)
  return NextResponse.json({ ok: false, error: msg }, { status: code })
}

export async function POST(req: NextRequest) {
  // 1) Auth header
  const headerSecret = req.headers.get('x-ingest-secret') || ''
  const envSecret = process.env.INGEST_SECRET || ''
  if (!envSecret) return bad('Server not configured: missing INGEST_SECRET', 500)
  if (headerSecret !== envSecret) return bad('Unauthorized', 401)

  // 2) Parse & validate
  let body: IngestBody
  try {
    body = (await req.json()) as IngestBody
  } catch {
    return bad('Invalid JSON body', 400)
  }
  const { title, source, url, access, text } = body || {}
  if (!title || !source || !url || !text) {
    return bad('title, source, url, text are required', 400)
  }
  const access_level = (access === 'private' ? 'private' : 'public') as 'public' | 'private'

  // 3) Insert document row first so we can attach chunk rows to it
  const supa = getSupabaseAdmin()
  const { data: docRow, error: insDocErr } = await supa
    .from('documents')
    .insert([{ title, source, url, access_level }])
    .select('id')
    .single()
  if (insDocErr || !docRow) {
    return bad(`Insert document failed: ${insDocErr?.message || 'unknown'}`, 500)
  }
  const doc_id: string = docRow.id

  // 4) Chunk + embed
  const chunks = chunkText(text)
  if (!chunks.length) return bad('No chunks produced from text', 400)

  // NOTE: call embedText per chunk so we always pass a single string to the
  // embedding provider (fixes SDKs that expect `text` rather than `texts`).
  let vectors: number[][]
  try {
    const perChunk = await Promise.all(
      chunks.map(async (c, i) => {
        const v = (await embedText(c)) as unknown
        if (!Array.isArray(v)) throw new Error(`embedText returned non-array at chunk ${i}`)
        return v as number[]
      })
    )
    vectors = perChunk
  } catch (e: any) {
    return bad(`Embedding failed: ${e?.message || e}`, 500)
  }

  if (vectors.length !== chunks.length) {
    return bad('Embedding length mismatch', 500)
  }

  // 5) Prepare rows
  const rows = chunks.map((content, idx) => ({
    doc_id,
    idx,
    content,
    embedding: vectors[idx],
    metadata: { title, source, url },
  }))

  // 6) Insert chunks
  const { error: insChunksErr } = await supa.from('chunks').insert(rows)
  if (insChunksErr) return bad(`Insert chunks failed: ${insChunksErr.message}`, 500)

  return NextResponse.json({ ok: true, document_id: doc_id, chunks: rows.length })
}