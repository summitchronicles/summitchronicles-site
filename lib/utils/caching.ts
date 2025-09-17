// Comprehensive caching strategy for Peak Performance Summit Chronicles
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  staleWhileRevalidate?: number; // SWR timeout in milliseconds
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  staleWhileRevalidate?: number;
}

// Browser storage cache implementation
export class BrowserCache {
  private static instance: BrowserCache;
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private readonly maxMemorySize: number = 100; // Max items in memory

  static getInstance(): BrowserCache {
    if (!this.instance) {
      this.instance = new BrowserCache();
    }
    return this.instance;
  }

  // Memory cache methods
  set<T>(key: string, data: T, config: CacheConfig): void {
    // Clean up memory cache if it's too large
    if (this.memoryCache.size >= this.maxMemorySize) {
      this.cleanupMemoryCache();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: config.ttl,
      staleWhileRevalidate: config.staleWhileRevalidate,
    };

    this.memoryCache.set(key, entry);

    // Also store in localStorage for persistence
    this.setLocalStorage(key, entry);
  }

  get<T>(key: string): T | null {
    // Try memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && this.isValid(memoryEntry)) {
      return memoryEntry.data;
    }

    // Fall back to localStorage
    const localEntry = this.getLocalStorage<T>(key);
    if (localEntry && this.isValid(localEntry)) {
      // Restore to memory cache
      this.memoryCache.set(key, localEntry);
      return localEntry.data;
    }

    return null;
  }

  // Check if entry is stale but within SWR window
  isStaleButRevalidate<T>(key: string): boolean {
    const entry = this.memoryCache.get(key) || this.getLocalStorage<T>(key);
    if (!entry) return false;

    const now = Date.now();
    const age = now - entry.timestamp;
    const isExpired = age > entry.ttl;
    const withinSWR =
      entry.staleWhileRevalidate &&
      age < entry.ttl + entry.staleWhileRevalidate;

    return isExpired && !!withinSWR;
  }

  private isValid<T>(entry: CacheEntry<T>): boolean {
    const now = Date.now();
    return now - entry.timestamp < entry.ttl;
  }

  private cleanupMemoryCache(): void {
    // Remove oldest entries
    const entries = Array.from(this.memoryCache.entries());
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);

    // Remove oldest 20% of entries
    const toRemove = Math.ceil(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.memoryCache.delete(entries[i][0]);
    }
  }

  private setLocalStorage<T>(key: string, entry: CacheEntry<T>): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`summit_cache_${key}`, JSON.stringify(entry));
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private getLocalStorage<T>(key: string): CacheEntry<T> | null {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(`summit_cache_${key}`);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
    }
    return null;
  }

  clear(pattern?: string): void {
    if (pattern) {
      // Clear matching keys
      for (const key of this.memoryCache.keys()) {
        if (key.includes(pattern)) {
          this.memoryCache.delete(key);
        }
      }

      // Clear localStorage
      if (typeof window !== 'undefined') {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith('summit_cache_') && key.includes(pattern)) {
            localStorage.removeItem(key);
          }
        }
      }
    } else {
      this.memoryCache.clear();

      // Clear all summit cache from localStorage
      if (typeof window !== 'undefined') {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith('summit_cache_')) {
            localStorage.removeItem(key);
          }
        }
      }
    }
  }
}

// API response cache with SWR support
export class APICache {
  private cache = BrowserCache.getInstance();

  async fetchWithCache<T>(
    url: string,
    options: RequestInit = {},
    cacheConfig: CacheConfig = { ttl: 5 * 60 * 1000 } // 5 minutes default
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(url, options);

    // Check cache first
    const cached = this.cache.get<T>(cacheKey);
    if (cached) {
      // If stale but within revalidate window, return cached data and fetch in background
      if (this.cache.isStaleButRevalidate(cacheKey)) {
        this.backgroundRevalidate(url, options, cacheConfig, cacheKey);
      }
      return cached;
    }

    // Fetch fresh data
    return this.fetchAndCache<T>(url, options, cacheConfig, cacheKey);
  }

  private async fetchAndCache<T>(
    url: string,
    options: RequestInit,
    cacheConfig: CacheConfig,
    cacheKey: string
  ): Promise<T> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, data, cacheConfig);
      return data;
    } catch (error) {
      console.error('API fetch failed:', error);
      throw error;
    }
  }

  private async backgroundRevalidate<T>(
    url: string,
    options: RequestInit,
    cacheConfig: CacheConfig,
    cacheKey: string
  ): Promise<void> {
    try {
      await this.fetchAndCache<T>(url, options, cacheConfig, cacheKey);
    } catch (error) {
      console.warn('Background revalidation failed:', error);
    }
  }

  private generateCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `api_${method}_${url}_${btoa(body)}`;
  }

  invalidate(pattern: string): void {
    this.cache.clear(pattern);
  }
}

// Database query cache (for client-side queries)
export class QueryCache {
  private cache = BrowserCache.getInstance();
  private pendingQueries: Map<string, Promise<any>> = new Map();

  async query<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    cacheConfig: CacheConfig = { ttl: 10 * 60 * 1000 } // 10 minutes default
  ): Promise<T> {
    // Check cache first
    const cached = this.cache.get<T>(queryKey);
    if (cached) {
      // If stale but within revalidate window, return cached and revalidate
      if (this.cache.isStaleButRevalidate(queryKey)) {
        this.backgroundRevalidate(queryKey, queryFn, cacheConfig);
      }
      return cached;
    }

    // Check if query is already pending
    const pending = this.pendingQueries.get(queryKey);
    if (pending) {
      return pending;
    }

    // Execute query
    const queryPromise = this.executeQuery(queryKey, queryFn, cacheConfig);
    this.pendingQueries.set(queryKey, queryPromise);

    try {
      const result = await queryPromise;
      return result;
    } finally {
      this.pendingQueries.delete(queryKey);
    }
  }

  private async executeQuery<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    cacheConfig: CacheConfig
  ): Promise<T> {
    try {
      const result = await queryFn();
      this.cache.set(queryKey, result, cacheConfig);
      return result;
    } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
    }
  }

  private async backgroundRevalidate<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    cacheConfig: CacheConfig
  ): Promise<void> {
    try {
      await this.executeQuery(queryKey, queryFn, cacheConfig);
    } catch (error) {
      console.warn('Background query revalidation failed:', error);
    }
  }

  invalidate(queryKey: string): void {
    this.cache.clear(queryKey);
    this.pendingQueries.delete(queryKey);
  }

  invalidatePattern(pattern: string): void {
    this.cache.clear(pattern);

    // Clear pending queries matching pattern
    for (const key of this.pendingQueries.keys()) {
      if (key.includes(pattern)) {
        this.pendingQueries.delete(key);
      }
    }
  }
}

// React hooks for caching
export const useAPICache = () => {
  const apiCache = React.useMemo(() => new APICache(), []);
  return apiCache;
};

export const useQueryCache = () => {
  const queryCache = React.useMemo(() => new QueryCache(), []);
  return queryCache;
};

// Cache-aware SWR hook
export const useCachedSWR = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    cacheConfig?: CacheConfig;
    refreshInterval?: number;
    revalidateOnFocus?: boolean;
  } = {}
) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const queryCache = useQueryCache();
  const cacheConfig = options.cacheConfig || {
    ttl: 5 * 60 * 1000,
    staleWhileRevalidate: 2 * 60 * 1000,
  };

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryCache.query(key, fetcher, cacheConfig);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, queryCache, cacheConfig]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh interval
  React.useEffect(() => {
    if (options.refreshInterval && options.refreshInterval > 0) {
      const interval = setInterval(fetchData, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, options.refreshInterval]);

  // Revalidate on focus
  React.useEffect(() => {
    if (options.revalidateOnFocus) {
      const handleFocus = () => fetchData();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [fetchData, options.revalidateOnFocus]);

  const mutate = React.useCallback(
    (newData?: T) => {
      if (newData) {
        setData(newData);
        queryCache.invalidate(key);
      } else {
        fetchData();
      }
    },
    [key, queryCache, fetchData]
  );

  return { data, loading, error, mutate };
};

// Cache warming utilities
export const warmupCache = async (
  endpoints: Array<{
    url: string;
    options?: RequestInit;
    cacheConfig?: CacheConfig;
  }>
) => {
  const apiCache = new APICache();

  const promises = endpoints.map(({ url, options, cacheConfig }) =>
    apiCache.fetchWithCache(url, options, cacheConfig).catch((error) => {
      console.warn(`Failed to warm up cache for ${url}:`, error);
    })
  );

  await Promise.allSettled(promises);
};

// Performance cache configurations
export const CACHE_CONFIGS = {
  // Static content (1 hour)
  static: { ttl: 60 * 60 * 1000, staleWhileRevalidate: 10 * 60 * 1000 },

  // API responses (5 minutes)
  api: { ttl: 5 * 60 * 1000, staleWhileRevalidate: 2 * 60 * 1000 },

  // User data (2 minutes)
  user: { ttl: 2 * 60 * 1000, staleWhileRevalidate: 1 * 60 * 1000 },

  // Real-time data (30 seconds)
  realtime: { ttl: 30 * 1000, staleWhileRevalidate: 10 * 1000 },

  // Long-term data (24 hours)
  longTerm: { ttl: 24 * 60 * 60 * 1000, staleWhileRevalidate: 60 * 60 * 1000 },
} as const;

// Export main cache instances
export const browserCache = BrowserCache.getInstance();
export const apiCache = new APICache();
export const queryCache = new QueryCache();

// React import
import React from 'react';
