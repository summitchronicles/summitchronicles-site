import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

/**
 * Health + visibility check for the RAG tables.
 * Uses the ADMIN (service role) client so counts are accurate even with RLS.
 * This runs only on the server (route handler), never in the browser.
 */
export async function GET() {
  try {
    const supa = getSupabaseAdmin();

    const { count: docCount, error: docErr } = await supa
      .from('documents')
      .select('*', { count: 'exact', head: true });
    if (docErr) {
      return NextResponse.json(
        { ok: false, where: 'documents', error: docErr.message },
        { status: 500 }
      );
    }

    const { count: chunkCount, error: chunkErr } = await supa
      .from('chunks')
      .select('*', { count: 'exact', head: true });
    if (chunkErr) {
      return NextResponse.json(
        { ok: false, where: 'chunks', error: chunkErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      documents: docCount ?? 0,
      chunks: chunkCount ?? 0,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'ping failed' },
      { status: 500 }
    );
  }
}
