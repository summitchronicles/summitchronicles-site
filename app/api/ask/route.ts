import { NextResponse } from 'next/server'
import index from '@/data/rag-index.json' assert { type: 'json' }

// ========== Config ==========
const COHERE_API_KEY = process.env.COHERE_API_KEY
const COHERE_EMBED_MODEL =
  (index as any)?.model?.startsWith('cohere:') ? (index as any).model.split(':')[1] : 'embed-english-v3.0'

// Safety guard
function requireEnv(name: string, val?: string) {
  if (!val) throw new Error(`Missing ${name} env var`)
}

// Cosine similarity
function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

// ===== Embeddings (Cohere v1) =====
async function cohereEmbed(text: string, inputType: 'search_document' | 'search_query') {
  const res = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: COHERE_EMBED_MODEL,   // 'embed-english-v3.0' or 'embed-multilingual-v3.0'
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

// ===== Text generation (Cohere v1) =====
// Model 'command' works well on the free tier. (You can try 'command-light' if you hit limits.)
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
      // Optional: stop_sequences: ["</answer>"]
    }),
  })
  if (!res.ok) throw new Error(`Cohere generate error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  // Cohere v1 returns { generations: [{ text: "..."}], ... }
  const text = json?.generations?.[0]?.text
  if (typeof text !== 'string') throw new Error('Unexpected Cohere generate response shape')
  return text.trim()
}

export async function POST(req: Request) {
  try {
    requireEnv('COHERE_API_KEY', COHERE_API_KEY)

    const { q } = await req.json()
    if (!q || typeof q !== 'string') {
      return NextResponse.json({ error: 'No question provided' }, { status: 400 })
    }

    // 1) Embed the user question
    const qVec = await cohereEmbed(q, 'search_query')

    // 2) Retrieve top chunks from the local index
    const chunks: any[] = (index as any)?.chunks || []
    const top = chunks
      .map(ch => ({ ...ch, score: cosine(qVec, ch.embedding as number[]) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    // 3) Build a context block from top chunks
    const context = top.map(ch => `Source: ${ch.source}\n${ch.content}`).join('\n---\n')
    const sources = top.map(s => ({ source: s.source, url: s.url }))

    // Keep prompt concise to avoid token waste
    const prompt =
`You are the assistant for the Summit Chronicles website.
Answer the user's question ONLY using the context below. If the context does not contain the answer,
say you don't have that information yet. Be concise and precise.

Context:
${context}

Question: ${q}

Answer:`

    // 4) Generate an answer with Cohere (free)
    const answer = await cohereGenerate(prompt)

    return NextResponse.json({ answer, sources })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}