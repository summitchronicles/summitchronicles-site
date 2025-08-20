'use client'

import React, { useState } from 'react'

type Source = {
  source?: string
  url?: string
  preview?: string
}

type AskResponse = {
  ok?: boolean
  answer?: string
  sources?: Source[]
  error?: string
}

export default function SearchPage() {
  const [q, setQ] = useState('What is the next expedition?')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [sources, setSources] = useState<Source[]>([])
  const [err, setErr] = useState<string | null>(null)

  async function onAsk(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setAnswer(null)
    setSources([])
    setErr(null)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q }),
      })

      const json: AskResponse = await res.json().catch(() => ({} as AskResponse))

      if (!res.ok) {
        setErr(json?.error || `Request failed: ${res.status}`)
      } else {
        setAnswer(json?.answer || '')
        setSources(Array.isArray(json?.sources) ? json!.sources! : [])
      }
    } catch (e: any) {
      setErr(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Search</h1>

      <form onSubmit={onAsk} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask anything…"
          aria-label="Question"
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #ccc',
            borderRadius: 6,
            outline: 'none',
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          disabled={loading || !q.trim()}
          style={{
            padding: '10px 14px',
            borderRadius: 6,
            border: '1px solid #333',
            background: loading ? '#ddd' : '#111',
            color: loading ? '#333' : '#fff',
            cursor: loading ? 'default' : 'pointer',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {loading ? 'Asking…' : 'Ask'}
        </button>
      </form>

      {err && (
        <div
          role="alert"
          style={{
            background: '#fee',
            border: '1px solid #f99',
            padding: 12,
            borderRadius: 6,
            marginBottom: 12,
            color: '#900',
          }}
        >
          {err}
        </div>
      )}

      {answer && (
        <section style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Answer</h2>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              border: '1px solid #e5e5e5',
              borderRadius: 6,
              padding: 12,
            }}
          >
            {answer}
          </div>
        </section>
      )}

      {!!sources.length && (
        <section style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Sources</h3>
          <ul style={{ paddingLeft: 18, lineHeight: 1.6 }}>
            {sources.map((s, i) => (
              <li key={i}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                    {s.source || s.url}
                  </a>
                ) : (
                  <span>{s.source || '(no url)'}</span>
                )}
                {s.preview ? <span style={{ color: '#666' }}> — {s.preview}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}