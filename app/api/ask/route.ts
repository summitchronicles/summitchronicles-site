import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import index from '@/data/rag-index.json' assert { type: 'json' }

// ---- Cohere embeddings (free tier) ----
const COHERE_API_KEY = process.env.COHERE_API_KEY
const COHERE_MODEL =
  (index as any)?.model?.startsWith('cohere:') ? (index as any).model.split(':')[1] : 'embed-english-v3.0'

async function cohereEmbedQ(text: string) {
  const res = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: COHERE_MODEL,
      input_type: 'search_query', // queries = search_query
      texts: [text],
    }),
  })
  if (!res.ok) throw new Error(`Cohere error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  let emb: any = null
  if (Array.isArray(json.embeddings)) {
    const e0 = json.embeddings[0]
    emb = Array.isArray(e0) ? e0 : (e0?.embedding || e0?.values || e0?.float)
  }
  if (!Array.isArray(emb)) throw new Error('Unexpected Cohere embed shape for query')
  return emb as number[]
}

// ---- Optional OpenAI generation (leave key empty to use snippet fallback) ----
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i]*a[i]; nb += b[i]*b[i] }
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

export async function POST(req: Request) {
  try {
    const { q } = await req.json()
    if (!q) return NextResponse.json({ error: 'No question' }, { status: 400 })
    if (!COHERE_API_KEY) return NextResponse.json({ error: 'Missing COHERE_API_KEY' }, { status: 500 })

    // 1) Embed the user question
    const queryVec = await cohereEmbedQ(q)

    // 2) Retrieve top chunks from local index
    const scored = (index as any).chunks
      .map((ch: any) => ({ ...ch, score: cosine(queryVec, ch.embedding) }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 6)

    const context = scored.map((ch: any) => `Source: ${ch.source}\n${ch.content}`).join('\n---\n')
    const sources = scored.map((s: any) => ({ source: s.source, url: s.url }))

    // 3) If no OpenAI key, return snippets (still useful)
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        answer: 'AI answer disabled (no OpenAI key). Here are the most relevant snippets:\n\n' + context,
        sources
      })
    }

    // 4) Otherwise, compose an answer
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'Answer ONLY from the provided context. If not present, say you do not have that info yet.' },
        { role: 'user', content: `Context:\n${context}\n\nQuestion: ${q}\n\nAnswer:` }
      ]
    })
    const answer = completion.choices[0].message.content
    return NextResponse.json({ answer, sources })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'failed' }, { status: 500 })
  }
}