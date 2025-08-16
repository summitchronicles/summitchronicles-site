// app/api/db/ping/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = getSupabaseAnon()

    const { count: docCount, error: e1 } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
    if (e1) throw e1

    const { count: chunkCount, error: e2 } = await supabase
      .from('chunks')
      .select('*', { count: 'exact', head: true })
    if (e2) throw e2

    return NextResponse.json({ ok: true, documents: docCount ?? 0, chunks: chunkCount ?? 0 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? String(e) }, { status: 500 })
  }
}