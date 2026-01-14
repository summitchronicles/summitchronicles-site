import { sanityWriteClient } from '../sanity/client';
import { scheduleContentIngestion } from '../rag/content-ingestion';

interface SyncConfig {
  intervalMinutes: number;
  enableWeather: boolean;
  enableCache: boolean;
  enableAI: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class DataSyncService {
  private config: SyncConfig;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(
    config: SyncConfig = {
      intervalMinutes: 60,
      enableWeather: true,
      enableCache: true,
      enableAI: true,
    }
  ) {
    this.config = config;
  }

  // Start automated sync
  start() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(
      () => this.performSync(),
      this.config.intervalMinutes * 60 * 1000
    );

    // Initial sync
    this.performSync();
    console.log(
      `Data sync service started with ${this.config.intervalMinutes}min intervals`
    );
  }

  // Stop automated sync
  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    console.log('Data sync service stopped');
  }

  // Manual sync trigger
  async performSync(): Promise<{
    success: boolean;
    synced: string[];
    errors: string[];
  }> {
    const results = {
      success: true,
      synced: [] as string[],
      errors: [] as string[],
    };

    try {
      // Sync weather data
      if (this.config.enableWeather) {
        try {
          await this.syncWeatherData();
          results.synced.push('weather');
        } catch (error) {
          results.errors.push(`Weather sync failed: ${error}`);
          results.success = false;
        }
      }

      // Sync AI knowledge base
      if (this.config.enableAI) {
        try {
          await this.syncAIKnowledgeBase();
          results.synced.push('ai-knowledge');
        } catch (error) {
          results.errors.push(`AI knowledge sync failed: ${error}`);
          results.success = false;
        }
      }

      // Clean expired cache entries
      if (this.config.enableCache) {
        this.cleanExpiredCache();
        results.synced.push('cache-cleanup');
      }

      console.log('Sync completed:', results);
      return results;
    } catch (error) {
      console.error('Sync service error:', error);
      return {
        success: false,
        synced: [],
        errors: [`Sync service error: ${error}`],
      };
    }
  }

  // Sync weather data for multiple locations
  private async syncWeatherData() {
    // Skip API calls during build phase
    if (
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.BUILDING
    ) {
      throw new Error('Skipping sync during build phase');
    }

    try {
      const locations = [
        'everest',
        'denali',
        'kilimanjaro',
        'rainier',
        'whitney',
      ];
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000';

      const weatherPromises = locations.map(async (location) => {
        const response = await fetch(
          `${baseUrl}/api/weather?location=${location}`
        );
        const data = await response.json();
        return { location, data: data.success ? data.data : null };
      });

      const weatherResults = await Promise.all(weatherPromises);

      // Cache weather data for each location
      weatherResults.forEach(({ location, data }) => {
        if (data) {
          this.setCache(`weather-${location}`, data, 60 * 60 * 1000); // 1hr TTL
        }
      });

      // Store aggregated weather summary in Sanity
      const weatherSummary = {
        _type: 'weatherSummary',
        _id: `weather-summary-${Date.now()}`,
        timestamp: new Date().toISOString(),
        locations: weatherResults
          .filter((r) => r.data)
          .map((r) => ({
            name: r.location,
            temperature: r.data?.weather.current.temperature,
            conditions: r.data?.weather.current.weather.description,
            climbingWindow: r.data?.conditions.climbingWindow.isOpen,
            avalancheRisk: r.data?.conditions.avalancheRisk,
          })),
      };

      await sanityWriteClient.createOrReplace(weatherSummary);
    } catch (error) {
      console.error('Weather sync error:', error);
      throw error;
    }
  }

  // Cache management
  setCache<T>(key: string, data: T, ttl: number = 60 * 60 * 1000): void {
    if (!this.config.enableCache) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  getCache<T>(key: string): T | null {
    if (!this.config.enableCache) return null;

    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Sync AI knowledge base with latest CMS content
  private async syncAIKnowledgeBase() {
    try {
      await scheduleContentIngestion();

      // Cache AI sync timestamp
      this.setCache(
        'ai-last-sync',
        new Date().toISOString(),
        24 * 60 * 60 * 1000
      ); // 24hr TTL
    } catch (error) {
      console.error('AI knowledge base sync error:', error);
      throw error;
    }
  }

  // Status and metrics
  getStatus() {
    return {
      isRunning: this.syncInterval !== null,
      config: this.config,
      cacheSize: this.cache.size,
      lastSync: this.getCache('last-sync-time'),
    };
  }
}

// Singleton instance
export const syncService = new DataSyncService();

// Auto-start in production runtime (not during build)
if (
  typeof window === 'undefined' &&
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PHASE !== 'phase-production-build' &&
  !process.env.BUILDING
) {
  syncService.start();
}
