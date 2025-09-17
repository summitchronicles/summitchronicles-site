import { NextResponse } from 'next/server';
import { getSupabaseAnon } from '@/lib/supabaseServer';

/**
 * GET /api/db/list
 * Lists the most recent documents with a tiny summary.
 * Query params (optional):
 *   - limit (number, default 20, max 100)
 *   - access ('public' | 'private' | undefined)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(
      Math.max(Number(searchParams.get('limit') ?? 20), 1),
      100
    );
    const access = searchParams.get('access') || undefined;

    const supabase = getSupabaseAnon();

    let q = supabase
      .from('documents')
      .select('id, source, url, access_level, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (access === 'public' || access === 'private') {
      q = q.eq('access_level', access);
    }

    const { data, error } = await q;
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      count: data?.length ?? 0,
      items: data,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || 'failed' },
      { status: 500 }
    );
  }
}
