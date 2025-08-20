'use client'

import React from 'react'

export default function SearchPage() {
  const [q, setQ] = React.useState('')
  const [answer, setAnswer] = React.useState<string | null>(null)
  const [sources, setSources] = React.useState<{source:string; url:string}[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function onAsk(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnswer(null)
    setSources([])
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Request failed')
      setAnswer(json.answer)
      setSources(json.sources || [])
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Ask Summit Chronicles</h1>

      <form onSubmit={onAsk} className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Ask a question..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={!q || loading}
        >
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {answer && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Answer</h2>
          <p className="whitespace-pre-wrap">{answer}</p>

          {sources?.length > 0 && (
            <div className="space-y-1">
              <h3 className="font-medium">Sources</h3>
              <ul className="list-disc pl-5">
                {sources.map((s, i) => (
                  <li key={i}>
                    {s.source}{' '}
                    {s.url ? (
                      <a className="text-blue-600 underline" href={s.url} target="_blank">
                        link
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  )
}