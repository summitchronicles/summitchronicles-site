'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  ClockIcon,
  FireIcon,
  MapPinIcon,
  BookOpenIcon,
  XMarkIcon,
  MicrophoneIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import {
  GlassCard,
  StatusIndicator,
  ContentSkeleton,
} from '@/app/components/ui';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'completion' | 'trending' | 'recent';
  category?: string;
  icon?: React.ReactNode;
  popularity?: number;
}

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  category: string;
  relevance: number;
}

interface SmartSearchProps {
  placeholder?: string;
  showVoiceSearch?: boolean;
  showTrending?: boolean;
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  className?: string;
}

export default function SmartSearch({
  placeholder = 'Ask about training, gear, expeditions...',
  showVoiceSearch = false,
  showTrending = true,
  onSearch,
  onSelect,
  className = '',
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [recentQueries] = useState<string[]>([
    "What's the best training plan for Everest?",
    'Which boots for technical climbing?',
    'How to prepare mentally for high altitude?',
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock trending queries
  const trendingQueries: SearchSuggestion[] = [
    {
      id: '1',
      text: 'Everest training plan',
      type: 'trending',
      category: 'Training',
      icon: <FireIcon className="w-4 h-4" />,
      popularity: 95,
    },
    {
      id: '2',
      text: 'Technical climbing boots',
      type: 'trending',
      category: 'Gear',
      icon: <MapPinIcon className="w-4 h-4" />,
      popularity: 87,
    },
    {
      id: '3',
      text: 'Altitude acclimatization',
      type: 'trending',
      category: 'Health',
      icon: <BookOpenIcon className="w-4 h-4" />,
      popularity: 82,
    },
  ];

  // Debounced search for suggestions
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        if (!searchQuery.trim()) {
          setSuggestions(showTrending ? trendingQueries : []);
          setResults([]);
          return;
        }

        setIsLoading(true);

        try {
          // Simulate API call for suggestions
          await new Promise((resolve) => setTimeout(resolve, 300));

          const mockSuggestions: SearchSuggestion[] = [
            // Query completions
            ...generateQueryCompletions(searchQuery),
            // Recent matching queries
            ...recentQueries
              .filter((recent) =>
                recent.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, 2)
              .map((recent, index) => ({
                id: `recent-${index}`,
                text: recent,
                type: 'recent' as const,
                icon: <ClockIcon className="w-4 h-4" />,
              })),
            // Trending if no better matches
            ...(searchQuery.length < 3 ? trendingQueries.slice(0, 2) : []),
          ];

          setSuggestions(mockSuggestions.slice(0, 6));

          // Also fetch actual search results
          if (searchQuery.length > 2) {
            const mockResults: SearchResult[] = [
              {
                id: '1',
                title: 'Complete Everest Training Guide',
                snippet:
                  'Comprehensive training plan for Mount Everest including fitness, altitude preparation...',
                url: '/blog/everest-training-guide',
                category: 'Training',
                relevance: 0.95,
              },
              {
                id: '2',
                title: 'Essential High Altitude Gear',
                snippet:
                  'Must-have equipment for high altitude mountaineering expeditions...',
                url: '/gear/high-altitude',
                category: 'Gear',
                relevance: 0.87,
              },
            ];
            setResults(mockResults);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    },
    [recentQueries, showTrending, trendingQueries]
  );

  const generateQueryCompletions = (query: string): SearchSuggestion[] => {
    const completions = [
      `${query} training plan`,
      `${query} gear recommendations`,
      `${query} expedition tips`,
      `${query} safety guidelines`,
      `${query} techniques`,
    ];

    return completions
      .filter((completion) => completion !== query)
      .slice(0, 3)
      .map((completion, index) => ({
        id: `completion-${index}`,
        text: completion,
        type: 'completion' as const,
        icon: <SparklesIcon className="w-4 h-4" />,
      }));
  };

  useEffect(() => {
    debouncedSearch(query);
    setSelectedIndex(-1);
  }, [query, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = suggestions.length + results.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            const suggestion = suggestions[selectedIndex];
            handleSuggestionClick(suggestion);
          } else {
            const result = results[selectedIndex - suggestions.length];
            handleResultClick(result);
          }
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    onSearch?.(suggestion.text);
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    onSelect?.(result);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setIsOpen(false);
      onSearch?.(query);
    }
  };

  const handleVoiceSearch = () => {
    if (
      !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      alert('Voice search not supported in this browser');
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsVoiceActive(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsVoiceActive(false);
    };

    recognition.onerror = () => {
      setIsVoiceActive(false);
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
    };

    recognition.start();
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions(showTrending ? trendingQueries : []);
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div
      className={clsx('search-enhanced relative w-full max-w-2xl', className)}
    >
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-20 py-4 text-white placeholder-gray-400 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:bg-white/5 focus:border-alpineBlue focus:ring-2 focus:ring-alpineBlue/20 transition-all duration-300"
        />

        {/* Right side controls */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}

          {showVoiceSearch && (
            <button
              onClick={handleVoiceSearch}
              disabled={isVoiceActive}
              className={clsx(
                'p-2 rounded-lg transition-all duration-300',
                isVoiceActive
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              )}
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="p-2 bg-summitGold text-charcoal rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Suggestions & Results Dropdown */}
      <AnimatePresence>
        {isOpen &&
          (suggestions.length > 0 || results.length > 0 || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="search-suggestions absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50"
            >
              <GlassCard className="p-2">
                {isLoading && (
                  <div className="p-4">
                    <ContentSkeleton variant="text" lines={3} animate />
                  </div>
                )}

                {/* Suggestions Section */}
                {!isLoading && suggestions.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      {query ? 'Suggestions' : 'Trending'}
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={clsx(
                          'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200',
                          selectedIndex === index
                            ? 'bg-alpineBlue text-white'
                            : 'text-gray-300 hover:bg-white/5'
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div
                          className={clsx(
                            'flex-shrink-0',
                            suggestion.type === 'trending' && 'text-summitGold',
                            suggestion.type === 'recent' && 'text-gray-400',
                            suggestion.type === 'completion' &&
                              'text-glacierBlue'
                          )}
                        >
                          {suggestion.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="truncate">{suggestion.text}</div>
                          {suggestion.category && (
                            <div className="text-xs opacity-60">
                              {suggestion.category}
                            </div>
                          )}
                        </div>

                        {suggestion.type === 'trending' &&
                          suggestion.popularity && (
                            <div className="flex-shrink-0 text-xs text-gray-400">
                              {suggestion.popularity}%
                            </div>
                          )}

                        <ArrowRightIcon className="w-4 h-4 opacity-30" />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Results Section */}
                {!isLoading && results.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide border-t border-white/10">
                      Results
                    </div>
                    {results.map((result, index) => (
                      <motion.button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={clsx(
                          'w-full flex items-start space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200',
                          selectedIndex === suggestions.length + index
                            ? 'bg-alpineBlue text-white'
                            : 'text-gray-300 hover:bg-white/5'
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: (suggestions.length + index) * 0.05,
                        }}
                      >
                        <StatusIndicator
                          status="info"
                          text={result.category}
                          size="sm"
                          pulse={false}
                          className="flex-shrink-0 mt-1"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate mb-1">
                            {result.title}
                          </div>
                          <div className="text-sm opacity-70 line-clamp-2">
                            {result.snippet}
                          </div>
                          <div className="text-xs opacity-50 mt-1">
                            {result.url}
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-xs text-gray-400">
                          {Math.round(result.relevance * 100)}%
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {!isLoading &&
                  suggestions.length === 0 &&
                  results.length === 0 &&
                  query && (
                    <div className="p-4 text-center text-gray-400">
                      <SparklesIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <div>No suggestions found</div>
                      <div className="text-sm">Try a different search term</div>
                    </div>
                  )}
              </GlassCard>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
