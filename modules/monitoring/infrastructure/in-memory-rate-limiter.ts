interface InMemoryWindowRateLimiterConfig {
  limit: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export class InMemoryWindowRateLimiter {
  private readonly store = new Map<string, RateLimitEntry>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(config: InMemoryWindowRateLimiterConfig) {
    this.limit = config.limit;
    this.windowMs = config.windowMs;
  }

  consume(key: string, now = Date.now()): RateLimitResult {
    this.cleanup(now);

    const current = this.store.get(key);
    if (!current || now >= current.resetAt) {
      const resetAt = now + this.windowMs;
      this.store.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: this.limit - 1,
        resetAt,
      };
    }

    if (current.count >= this.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: current.resetAt,
      };
    }

    current.count += 1;
    return {
      allowed: true,
      remaining: this.limit - current.count,
      resetAt: current.resetAt,
    };
  }

  size(): number {
    return this.store.size;
  }

  cleanup(now = Date.now()) {
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetAt) {
        this.store.delete(key);
      }
    }
  }
}
