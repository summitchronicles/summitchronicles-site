"use client";

import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { 
  MagnifyingGlassIcon,
  ClockIcon,
  StarIcon,
  LinkIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import { GlassCard, StatusIndicator, ProgressBar } from "@/app/components/ui";

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  category: string;
  relevance: number;
  timestamp?: Date;
  type: 'page' | 'blog' | 'gear' | 'training' | 'expedition';
  tags?: string[];
  author?: string;
  readTime?: number;
}

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  totalResults?: number;
  searchTime?: number;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

const getResultTypeIcon = (type: string) => {
  switch (type) {
    case 'blog': return '📝';
    case 'gear': return '🎒';
    case 'training': return '💪';
    case 'expedition': return '🏔️';
    default: return '📄';
  }
};

const getResultTypeColor = (type: string) => {
  switch (type) {
    case 'blog': return 'text-blue-400';
    case 'gear': return 'text-green-400';
    case 'training': return 'text-purple-400';
    case 'expedition': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export default function SearchResults({
  query,
  results,
  isLoading,
  totalResults,
  searchTime,
  onResultClick,
  className = ""
}: SearchResultsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
  };

  if (isLoading) {
    return (
      <div className={clsx("space-y-6", className)}>
        {/* Loading skeleton */}
        {Array.from({ length: 5 }).map((_, index) => (
          <GlassCard key={index} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-1/5" />
                </div>
              </div>
              <div className="h-5 bg-gray-700 rounded w-3/4 mb-2" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded" />
                <div className="h-3 bg-gray-700 rounded w-5/6" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-3 bg-gray-700 rounded w-1/4" />
                <div className="h-6 bg-gray-700 rounded w-16" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={clsx("text-center py-12", className)}
      >
        <GlassCard className="p-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-400 mb-6">
            We couldn&apos;t find anything matching <span className="text-summitGold">&ldquo;{query}&rdquo;</span>
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Try:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Checking your spelling</li>
              <li>Using different keywords</li>
              <li>Being more specific about what you&apos;re looking for</li>
            </ul>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className={clsx("space-y-6", className)}>
      {/* Search Stats */}
      {(totalResults || searchTime) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between text-sm text-gray-400 px-2"
        >
          <div className="flex items-center space-x-4">
            {totalResults && (
              <span>
                About {totalResults.toLocaleString()} results
              </span>
            )}
            {searchTime && (
              <span className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>({searchTime}ms)</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span>for &ldquo;{query}&rdquo;</span>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            variants={item}
            whileHover={{ scale: 1.01, y: -2 }}
            className="cursor-pointer"
          >
            <GlassCard 
              className="p-6 hover:bg-white/5 transition-colors duration-300"
              onClick={() => handleResultClick(result)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getResultTypeIcon(result.type)}
                  </div>
                  <div className="flex-1">
                    <StatusIndicator
                      status="info"
                      text={result.category}
                      size="sm"
                      pulse={false}
                    />
                    {result.author && (
                      <div className="text-xs text-gray-500 mt-1">
                        by {result.author}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Relevance Score */}
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-400">
                    {Math.round(result.relevance * 100)}% match
                  </div>
                  <ProgressBar
                    value={result.relevance * 100}
                    variant="gradient"
                    size="sm"
                    animated={false}
                    showValue={false}
                    className="w-16"
                  />
                </div>
              </div>

              {/* Title */}
              <motion.h3 
                className="text-lg font-semibold text-white mb-2 hover:text-summitGold transition-colors"
                whileHover={{ x: 4 }}
              >
                {result.title}
              </motion.h3>

              {/* Snippet */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {result.snippet}
              </p>

              {/* Tags */}
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-white/5 rounded-full text-xs text-gray-400"
                    >
                      <TagIcon className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="w-3 h-3" />
                    <span>{result.url}</span>
                  </div>
                  
                  {result.readTime && (
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{result.readTime} min read</span>
                    </div>
                  )}
                  
                  {result.timestamp && (
                    <div>
                      {result.timestamp.toLocaleDateString()}
                    </div>
                  )}
                </div>

                <motion.div
                  className="flex items-center space-x-1 text-summitGold opacity-0 group-hover:opacity-100"
                  whileHover={{ x: 2 }}
                >
                  <span>View</span>
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </motion.div>
              </div>
              
              {/* Hover effect overlay */}
              <motion.div
                className="absolute inset-0 rounded-inherit pointer-events-none"
                style={{ 
                  background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' 
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Results (if applicable) */}
      {results.length > 0 && totalResults && results.length < totalResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-6"
        >
          <button className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
            Load more results
          </button>
        </motion.div>
      )}
    </div>
  );
}