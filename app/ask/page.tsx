'use client'
import React, { useState } from 'react'

export default function AskPage() {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [sources, setSources] = useState<{source:string; url?:string}[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onAsk(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null); setAnswer(null); setSources([])
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ q })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed')
      setAnswer(json.answer)
      setSources(json.sources || [])
    } catch (err:any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{maxWidth: 800, margin: '80px auto', padding: 16}}>
      <h1 style={{fontSize: 32, fontWeight: 800, marginBottom: 16}}>Ask Summit Chronicles</h1>
      <form onSubmit={onAsk} style={{display:'flex', gap:8, marginBottom:16}}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Ask about mission, story, expeditions…"
          style={{flex:1, padding:12, borderRadius:8, border:'1px solid #333', background:'#111', color:'#fff'}}
        />
        <button disabled={loading || !q.trim()} style={{padding:'12px 16px', borderRadius:8, background:'#fff', color:'#000'}}>
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </form>
      {error && <div style={{color:'#f66', marginBottom:12}}>Error: {error}</div>}
      {answer && (
        <div style={{background:'#111', border:'1px solid #333', padding:16, borderRadius:12, whiteSpace:'pre-wrap'}}>
          {answer}
        </div>
      )}
      {!!sources.length && (
        <div style={{marginTop:12, opacity:0.8}}>
          <div style={{fontSize:12, marginBottom:6}}>Sources</div>
          <ul>
            {sources.map((s,i)=>(
              <li key={i} style={{fontSize:12}}>
                {s.url ? <a href={s.url} style={{textDecoration:'underline'}}>{s.source}</a> : s.source}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}