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

type IngestBody = {
  title: string
  source: string
  url: string
  access: 'public' | 'private'
  text: string
}

function bad(msg: string, code = 400) {
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
  const access_level = (access === 'private' ? 'private' : 'public') as
    | 'public'
    | 'private'

  // 3) Insert document
  const supa = getSupabaseAdmin()
  const { data: docRow, error: insDocErr } = await supa
    .from('documents')
    .insert([{ title, source, url, access_level }])
    .select('id')
    .single()
  if (insDocErr || !docRow) return bad(`Insert document failed: ${insDocErr?.message || 'unknown'}`, 500)
  const doc_id: string = docRow.id

  // 4) Chunk + embed
  const chunks = chunkText(text)
  const vectors = await embedText(chunks) // returns number[][] of equal length
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