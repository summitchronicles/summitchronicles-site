import { NextResponse } from 'next/server';
import { getSupabaseAnon } from '@/lib/supabaseServer';

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_EMBED_MODEL = 'embed-english-v3.0';

async function cohereEmbedQuery(text: string) {
  const res = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: COHERE_EMBED_MODEL,
      input_type: 'search_query',
      texts: [text],
    }),
  });
  if (!res.ok)
    throw new Error(`Cohere embed error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const emb = Array.isArray(json.embeddings?.[0]) ? json.embeddings[0] : null;
  if (!emb) throw new Error('Bad embedding response');
  return emb;
}

export async function POST(req: Request) {
  try {
    const { q, top } = await req.json();
    if (!q) return NextResponse.json({ error: 'missing q' }, { status: 400 });
    if (!COHERE_API_KEY)
      return NextResponse.json(
        { error: 'missing COHERE_API_KEY' },
        { status: 500 }
      );

    const supabase = getSupabaseAnon();
    const queryEmbedding = await cohereEmbedQuery(q);

    const { data, error } = await supabase.rpc('match_chunks', {
      query_embedding: queryEmbedding,
      match_count: Math.min(Number(top) || 8, 50),
    });
    if (error) throw error;

    return NextResponse.json({ results: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'failed' }, { status: 500 });
  }
}
