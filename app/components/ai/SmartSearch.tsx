'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, MessageCircle, BookOpen, Brain, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface SearchResult {
  document: {
    id: string
    title: string
    content: string
    category: string
    source: string
    metadata: any
  }
  similarity: number
  relevanceScore: number
}

interface AIResponse {
  question: string
  answer: string
  sources: Array<{
    title: string
    category: string
    similarity: number
    relevanceScore: number
  }>
  contextUsed: string[]
  confidence: number
  method: string
}

interface SmartSearchProps {
  placeholder?: string
  showExamples?: boolean
  className?: string
}

export function SmartSearch({ 
  placeholder = "Ask anything about mountaineering and training...",
  showExamples = true,
  className = ""
}: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'search' | 'ask'>('search')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  
  const inputRef = useRef<HTMLInputElement>(null)

  // Check system status on mount
  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    try {
      const response = await fetch('/api/ai/status')
      const data = await response.json()
      
      if (data.capabilities?.semanticSearch && data.capabilities?.ragResponses) {
        setSystemStatus('ready')
      } else {
        setSystemStatus('error')
        setError('AI system not fully operational. Initializing knowledge base...')
        await initializeSystem()
      }
    } catch (error) {
      setSystemStatus('error')
      setError('Failed to connect to AI system')
    }
  }

  const initializeSystem = async () => {
    try {
      await fetch('/api/ai/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize' })
      })
      setSystemStatus('ready')
      setError(null)
    } catch (error) {
      setError('Failed to initialize AI system')
    }
  }

  const handleSearch = async () => {
    if (!query.trim() || systemStatus !== 'ready') return

    setIsLoading(true)
    setError(null)
    setSearchResults([])
    setAiResponse(null)

    try {
      if (mode === 'search') {
        // Semantic search mode
        const response = await fetch('/api/ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, limit: 8, threshold: 0.6 })
        })

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()
        setSearchResults(data.results)
      } else {
        // AI question mode
        const response = await fetch('/api/ai/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: query, useRAG: true })
        })

        if (!response.ok) {
          throw new Error('AI request failed')
        }

        const data = await response.json()
        setAiResponse(data)
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const exampleQueries = [
    "How do I train for high altitude climbing?",
    "What are the key techniques for ice climbing?",
    "Avalanche safety and risk assessment",
    "Nutrition strategies for expedition climbing",
    "Acclimatization protocols for big mountains"
  ]

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High confidence'
    if (confidence >= 0.6) return 'Medium confidence'
    return 'Low confidence'
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* System Status */}
      <div className="mb-4 flex items-center justify-center space-x-2 text-sm">
        {systemStatus === 'checking' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-gray-600">Checking AI system status...</span>
          </>
        )}
        {systemStatus === 'ready' && (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-600">AI system ready</span>
          </>
        )}
        {systemStatus === 'error' && (
          <>
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-600">AI system unavailable</span>
          </>
        )}
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-xl shadow-spa-soft p-6 mb-6">
        {/* Mode Selector */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setMode('search')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                mode === 'search'
                  ? 'bg-alpine-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Semantic Search</span>
            </button>
            <button
              onClick={() => setMode('ask')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                mode === 'ask'
                  ? 'bg-alpine-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={systemStatus !== 'ready'}
            className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-alpine-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {mode === 'search' ? (
              <Search className="w-5 h-5 text-gray-400" />
            ) : (
              <Brain className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading || systemStatus !== 'ready'}
            className="px-6 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'search' ? (
              <Search className="w-4 h-4" />
            ) : (
              <MessageCircle className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Processing...' : mode === 'search' ? 'Search' : 'Ask AI'}</span>
          </button>
        </div>

        {/* Example Queries */}
        {showExamples && !query && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Try these example queries:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <div className="bg-white rounded-xl shadow-spa-soft p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-alpine-blue" />
              <h3 className="text-lg font-medium text-spa-charcoal">AI Assistant Response</h3>
            </div>
            <div className={`text-sm ${getConfidenceColor(aiResponse.confidence)}`}>
              {getConfidenceText(aiResponse.confidence)}
            </div>
          </div>
          
          <div className="prose prose-blue max-w-none mb-4">
            <div className="whitespace-pre-wrap text-spa-charcoal leading-relaxed">
              {aiResponse.answer}
            </div>
          </div>

          {aiResponse.sources.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sources:</h4>
              <div className="flex flex-wrap gap-2">
                {aiResponse.sources.map((source, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                  >
                    {source.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-5 h-5 text-alpine-blue" />
            <h3 className="text-lg font-medium text-spa-charcoal">
              Search Results ({searchResults.length} found)
            </h3>
          </div>

          {searchResults.map((result, index) => (
            <div key={result.document.id} className="bg-white rounded-xl shadow-spa-soft p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-medium text-spa-charcoal mb-1">
                    {result.document.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {result.document.category}
                    </span>
                    <span>Relevance: {Math.round(result.relevanceScore * 100)}%</span>
                  </div>
                </div>
              </div>
              
              <p className="text-spa-charcoal leading-relaxed mb-3">
                {result.document.content}
              </p>
              
              <div className="text-xs text-gray-500">
                Source: {result.document.source}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {query && !isLoading && searchResults.length === 0 && !aiResponse && !error && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No results found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms or ask a question instead</p>
        </div>
      )}
    </div>
  )
}