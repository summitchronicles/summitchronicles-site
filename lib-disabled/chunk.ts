// Simple text chunker for RAG ingestion.
// Splits into ~900-char chunks with ~150-char overlap.
export function chunkText(
  raw: string,
  opts: { maxChars?: number; overlap?: number } = {}
): string[] {
  const maxChars = opts.maxChars ?? 900;
  const overlap  = opts.overlap  ?? 150;

  const text = (raw || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  if (!text) return [];

  const parts = text
    .split(/\n{2,}/)
    .flatMap(p => p.split(/(?<=[\.!?])\s+/));

  const chunks: string[] = [];
  let buf: string[] = [];
  let size = 0;

  const flush = () => {
    if (!buf.length) return;
    const chunk = buf.join(' ').trim();
    if (chunk) chunks.push(chunk);
    buf = [];
    size = 0;
  };

  for (const s of parts) {
    const nextLen = size + (size ? 1 : 0) + s.length;
    if (nextLen > maxChars) {
      const prev = buf.join(' ');
      flush();
      if (prev.length > 0 && overlap > 0) {
        const tail = prev.slice(-overlap);
        if (tail.trim().length) {
          buf.push(tail);
          size = tail.length;
        }
      }
    }
    buf.push(s);
    size += (size ? 1 : 0) + s.length;
  }
  flush();
  return chunks;
}