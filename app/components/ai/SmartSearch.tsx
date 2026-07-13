'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  MessageCircle,
  BookOpen,
  Brain,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface SearchResult {
  document: {
    id: string;
    title: string;
    content: string;
    category: string;
    source: string;
    metadata: any;
  };
  similarity: number;
  relevanceScore: number;
}

interface AIResponse {
  question: string;
  answer: string;
  sources: Array<{
    title: string;
    category: string;
    similarity: number;
    relevanceScore: number;
  }>;
  contextUsed: string[];
  confidence: number;
  method: string;
}

interface SmartSearchProps {
  placeholder?: string;
  showExamples?: boolean;
  className?: string;
}

export function SmartSearch({
  placeholder = 'Ask Sunith about mountaineering techniques, training methods, and expedition strategies...',
  showExamples = true,
  className = '',
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'search' | 'ask'>('search');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<
    'checking' | 'ready' | 'error'
  >('checking');

  const inputRef = useRef<HTMLInputElement>(null);

  const checkSystemStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/status');
      const data = await response.json();

      if (
        data.capabilities?.semanticSearch &&
        data.capabilities?.ragResponses
      ) {
        setSystemStatus('ready');
      } else {
        setSystemStatus('error');
        setError(
          'AI system not fully operational. Initializing knowledge base...'
        );
        await initializeSystem();
      }
    } catch (error) {
      setSystemStatus('error');
      setError('Failed to connect to AI system');
    }
  }, []);

  // Check system status on mount
  useEffect(() => {
    checkSystemStatus();
  }, [checkSystemStatus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    const initialMode = params.get('mode');

    if (initialQuery) setQuery(initialQuery);
    if (initialMode === 'ask' || initialMode === 'search') {
      setMode(initialMode);
    }
  }, []);

  const initializeSystem = async () => {
    try {
      await fetch('/api/ai/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize' }),
      });
      setSystemStatus('ready');
      setError(null);
    } catch (error) {
      setError('Failed to initialize AI system');
    }
  };

  const handleSearch = async () => {
    if (!query.trim() || systemStatus !== 'ready') return;

    setHasSubmitted(true);
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    setAiResponse(null);

    try {
      if (mode === 'search') {
        // Semantic search mode
        const response = await fetch('/api/ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, limit: 8, threshold: 0.6 }),
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setSearchResults(data.results);
      } else {
        // AI question mode
        const response = await fetch('/api/ai/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: query, useRAG: true }),
        });

        if (!response.ok) {
          throw new Error('AI request failed');
        }

        const data = await response.json();
        setAiResponse(data);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const exampleQueries = [
    'How should I train for high altitude acclimatization?',
    "What are Sunith's preferred techniques for ice climbing?",
    'Best practices for avalanche risk assessment on expeditions',
    'Nutrition and hydration strategies for multi-day climbs',
    'How to design a 12-week expedition training program?',
    'What gear recommendations for technical alpine routes?',
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-300';
    if (confidence >= 0.6) return 'text-amber-300';
    return 'text-red-300';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High confidence';
    if (confidence >= 0.6) return 'Medium confidence';
    return 'Low confidence';
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* System Status */}
      <div className="mb-4 flex items-center justify-center">
        {systemStatus === 'checking' && (
          <div className="inline-flex items-center gap-2 rounded-md border border-alpine-blue-400/30 bg-alpine-blue-950/40 px-3 py-2 text-sm text-alpine-blue-100">
            <Loader2 className="w-4 h-4 animate-spin text-alpine-blue-200" />
            <span>Checking AI system status...</span>
          </div>
        )}
        {systemStatus === 'ready' && (
          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-950/35 px-3 py-2 text-sm text-emerald-100">
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>AI system ready</span>
          </div>
        )}
        {systemStatus === 'error' && (
          <div className="inline-flex items-center gap-2 rounded-md border border-red-400/30 bg-red-950/35 px-3 py-2 text-sm text-red-100">
            <AlertCircle className="w-4 h-4 text-red-300" />
            <span>AI system unavailable</span>
          </div>
        )}
      </div>

      {/* Search Interface */}
      <div className="rounded-md border border-white/10 bg-black/55 p-4 shadow-[0_24px_90px_-50px_rgba(212,175,55,0.65)] backdrop-blur-sm sm:p-6 mb-6">
        {/* Mode Selector */}
        <div className="flex justify-center mb-4">
          <div className="flex rounded-md border border-white/10 bg-white/[0.04] p-1">
            <button
              onClick={() => setMode('search')}
              aria-pressed={mode === 'search'}
              className={`flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                mode === 'search'
                  ? 'bg-summit-gold text-black shadow-sm'
                  : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Semantic Search</span>
            </button>
            <button
              onClick={() => setMode('ask')}
              aria-pressed={mode === 'ask'}
              className={`flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                mode === 'ask'
                  ? 'bg-summit-gold text-black shadow-sm'
                  : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask Sunith</span>
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
            className="w-full rounded-md border border-white/15 bg-obsidian px-4 py-4 pl-12 text-white placeholder-zinc-500 outline-none transition-colors focus:border-summit-gold/70 focus:ring-2 focus:ring-summit-gold/25 disabled:border-white/10 disabled:bg-white/[0.04] disabled:text-zinc-500"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {mode === 'search' ? (
              <Search className="w-5 h-5 text-zinc-500" />
            ) : (
              <Brain className="w-5 h-5 text-zinc-500" />
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading || systemStatus !== 'ready'}
            className="flex min-h-12 items-center gap-2 rounded-md bg-summit-gold px-6 py-3 font-oswald text-sm font-bold uppercase text-black transition-colors hover:bg-summit-gold-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'search' ? (
              <Search className="w-4 h-4" />
            ) : (
              <MessageCircle className="w-4 h-4" />
            )}
            <span>
              {isLoading
                ? 'Processing...'
                : mode === 'search'
                  ? 'Search'
                  : 'Ask Sunith'}
            </span>
          </button>
        </div>

        {/* Example Queries */}
        {showExamples && !query && (
          <div className="mt-6">
            <p className="text-sm text-zinc-400 mb-3">Suggested prompts</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:border-summit-gold/40 hover:text-white"
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
        <div className="rounded-md border border-red-400/30 bg-red-950/35 p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-300" />
            <p className="text-red-100">{error}</p>
          </div>
        </div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <div className="rounded-md border border-white/10 bg-white/[0.06] p-5 shadow-spa-soft mb-6 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-summit-gold" />
              <h3 className="text-lg font-medium text-white">
                Sunith's Expert Guidance
              </h3>
            </div>
            <div
              className={`text-sm ${getConfidenceColor(aiResponse.confidence)}`}
            >
              {getConfidenceText(aiResponse.confidence)}
            </div>
          </div>

          <div className="prose prose-blue max-w-none mb-4">
            <div className="whitespace-pre-wrap leading-relaxed text-zinc-200">
              {aiResponse.answer}
            </div>
          </div>

          {aiResponse.sources.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">
                Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {aiResponse.sources.map((source, index) => (
                  <span
                    key={index}
                    className="rounded-md border border-alpine-blue-300/20 bg-alpine-blue-950/30 px-2 py-1 text-xs font-medium text-alpine-blue-100"
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
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-summit-gold" />
            <h3 className="text-lg font-medium text-white">
              Search Results ({searchResults.length} found)
            </h3>
          </div>

          {searchResults.map((result) => (
            <div
              key={result.document.id}
              className="rounded-md border border-white/10 bg-white/[0.06] p-5 shadow-spa-soft sm:p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">
                    {result.document.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                    <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-zinc-300">
                      {result.document.category}
                    </span>
                    <span className="text-zinc-400">
                      Relevance: {Math.round(result.relevanceScore * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-zinc-200 leading-relaxed mb-3">
                {result.document.content}
              </p>

              <div className="text-xs text-zinc-500">
                Source: {result.document.source}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {hasSubmitted &&
        query &&
        !isLoading &&
        searchResults.length === 0 &&
        !aiResponse &&
        !error && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-300">No results found for "{query}"</p>
            <p className="text-sm text-zinc-500 mt-2">
              Try adjusting your search terms or ask a question instead
            </p>
          </div>
        )}
    </div>
  );
}
