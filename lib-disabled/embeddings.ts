// lib/embeddings.ts
// Cohere embeddings (free tier). Returns a 1024-d vector of numbers.
const COHERE_API_KEY = process.env.COHERE_API_KEY;
const MODEL = 'embed-english-v3.0';

export async function embedText(text: string): Promise<number[]> {
  if (!COHERE_API_KEY) throw new Error('Missing COHERE_API_KEY');
  const res = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      input_type: 'search_document',
      texts: [text],
    }),
  });
  if (!res.ok) throw new Error(`Cohere embed error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const vec = json?.embeddings?.[0];
  if (!Array.isArray(vec)) throw new Error('Unexpected Cohere embed response shape');
  return vec as number[];
}