'use client'

import React from 'react'
import { useErrorReporting } from '@/lib/error-monitor'
import { trackAIQuery } from '@/app/components/GoogleAnalytics'

export default function SearchPage() {
  const [q, setQ] = React.useState('')
  const [answer, setAnswer] = React.useState<string | null>(null)
  const [sources, setSources] = React.useState<{source:string; url:string}[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { reportError } = useErrorReporting()

  async function onAsk(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnswer(null)
    setSources([])
    
    const startTime = Date.now()
    
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q: q }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Request failed')
      
      const responseTime = Date.now() - startTime
      
      setAnswer(json.answer || json.response)
      setSources(json.sources || [])
      
      // Track successful AI interaction
      trackAIQuery(q, responseTime)
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong'
      setError(errorMessage)
      
      // Report error to monitoring system
      reportError(err, {
        action: 'search_query',
        question: q,
        endpoint: '/api/ask'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-20 px-6">
      <div className="mx-auto max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Search Summit Chronicles
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Ask questions about mountaineering, training, expeditions, and adventure stories
          </p>
        </div>

        <form onSubmit={onAsk} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 text-lg focus:outline-none focus:border-summitGold/50"
            placeholder="Ask about training, gear, expeditions, or mountaineering advice..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="px-8 py-4 bg-summitGold text-black font-bold text-lg rounded-2xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!q || loading}
          >
            {loading ? 'Searching...' : 'Ask'}
          </button>
        </form>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300 mb-8">
            <h3 className="font-semibold mb-2">Error</h3>
            {error}
          </div>
        )}

        {answer && (
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-summitGold mb-4">Answer</h2>
            <div className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
              {answer}
            </div>
          </section>
        )}

        {sources && sources.length > 0 && (
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-summitGold mb-6">Sources</h2>
            <div className="space-y-4">
              {sources.map((src, i) => (
                <div key={i} className="bg-black/20 rounded-2xl p-4">
                  <div className="font-semibold text-white mb-2">{src.source || 'Summit Chronicles Knowledge'}</div>
                  {src.url && (
                    <a 
                      className="text-summitGold hover:text-yellow-300 transition-colors inline-flex items-center gap-2" 
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Source
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Suggested Questions */}
        {!answer && !loading && (
          <section className="text-center">
            <h3 className="text-xl font-semibold text-white mb-6">Try asking about:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "How do I train for high altitude?",
                "What gear do I need for mountaineering?",
                "How did you recover from TB?",
                "What's the cost of climbing Everest?",
                "Best training exercises for climbing?",
                "How to manage fear on mountains?"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setQ(suggestion)}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}