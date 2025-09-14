import { NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabaseServer'

/**
 * GET /api/db/chunks?doc_id=<uuid>
 * Lists chunks for a given document.
 * Query params (optional):
 *   - limit (number, default 50, max 200)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const docId = searchParams.get('doc_id')
    const limit = Math.min(
      Math.max(Number(searchParams.get('limit') ?? 50), 1),
      200
    )

    if (!docId || !/^[0-9a-fA-F-]{36}$/.test(docId)) {
      return NextResponse.json(
        { ok: false, error: 'Missing or invalid doc_id (must be a UUID)' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAnon()

    // We only need a preview; don’t ship embeddings.
    const { data, error } = await supabase
      .from('chunks')
      .select('idx, content, created_at')
      .eq('doc_id', docId)
      .order('idx', { ascending: true })
      .limit(limit)

    if (error) throw error

    const items = (data ?? []).map(c => ({
      idx: c.idx,
      preview: (c.content || '').slice(0, 200),
      created_at: c.created_at
    }))

    return NextResponse.json({ ok: true, count: items.length, items })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'failed' }, { status: 500 })
  }
}