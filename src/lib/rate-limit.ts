// lib/rate-limit.ts
interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: Date;
}

interface RateLimitOptions {
  interval: number; // milliseconds
  uniqueTokenPerInterval: number;
}

class RateLimiter {
  private requests = new Map<string, number[]>();

  constructor(private options: RateLimitOptions) {}

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const requestTimestamps = this.requests.get(identifier) || [];

    // Filter out timestamps outside the interval
    const recentTimestamps = requestTimestamps.filter(
      (timestamp) => now - timestamp < this.options.interval,
    );

    // Check if limit is exceeded
    if (recentTimestamps.length >= this.options.uniqueTokenPerInterval) {
      const oldestTimestamp = recentTimestamps[0];
      const reset = new Date(oldestTimestamp + this.options.interval);

      return {
        success: false,
        remaining: 0,
        reset,
      };
    }

    // Add current timestamp
    recentTimestamps.push(now);
    this.requests.set(identifier, recentTimestamps);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    return {
      success: true,
      remaining: this.options.uniqueTokenPerInterval - recentTimestamps.length,
      reset: new Date(now + this.options.interval),
    };
  }

  private cleanup() {
    const now = Date.now();

    for (const [key, timestamps] of this.requests.entries()) {
      const recent = timestamps.filter((t) => now - t < this.options.interval);

      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }
}

// Pre-configured rate limiters
export const apiLimiter = new RateLimiter({
  interval: 60_000, // 1 minute
  uniqueTokenPerInterval: 10, // 10 requests per minute
});

export const checkoutLimiter = new RateLimiter({
  interval: 3600_000, // 1 hour
  uniqueTokenPerInterval: 5, // 5 checkouts per hour
});

export const uploadLimiter = new RateLimiter({
  interval: 3600_000, // 1 hour
  uniqueTokenPerInterval: 20, // 20 uploads per hour
});
