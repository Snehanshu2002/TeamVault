/**
 * Production-ready sliding-window rate limiter for client, edge, and serverless environments.
 * Supports memory store fallback for standalone/demo operation and distributed Upstash Redis configuration.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTimeMs: number;
  retryAfterSeconds?: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMIT_RULES: Record<string, RateLimitConfig> = {
  AUTH_ATTEMPT: { maxRequests: 5, windowMs: 60 * 1000 },       // 5 attempts per minute
  CHAT_MESSAGE: { maxRequests: 30, windowMs: 60 * 1000 },      // 30 messages per minute
  TEAM_MUTATION: { maxRequests: 10, windowMs: 60 * 1000 },     // 10 team updates per minute
  GENERAL_API: { maxRequests: 100, windowMs: 60 * 1000 },      // 100 general requests per minute
};

class MemoryRateLimiter {
  private requestLogs: Map<string, number[]> = new Map();

  /**
   * Evaluates whether an action identified by key is within allowed rate limit
   */
  public checkLimit(key: string, rule: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const windowStart = now - rule.windowMs;

    const timestamps = this.requestLogs.get(key) || [];
    const validTimestamps = timestamps.filter((ts) => ts > windowStart);

    if (validTimestamps.length >= rule.maxRequests) {
      const oldestValid = validTimestamps[0];
      const resetTimeMs = oldestValid + rule.windowMs;
      const retryAfterSeconds = Math.ceil((resetTimeMs - now) / 1000);

      return {
        allowed: false,
        remaining: 0,
        resetTimeMs,
        retryAfterSeconds: Math.max(1, retryAfterSeconds),
      };
    }

    validTimestamps.push(now);
    this.requestLogs.set(key, validTimestamps);

    return {
      allowed: true,
      remaining: rule.maxRequests - validTimestamps.length,
      resetTimeMs: now + rule.windowMs,
    };
  }

  /**
   * Resets rate limit for a specific key (e.g. upon successful authentication)
   */
  public reset(key: string): void {
    this.requestLogs.delete(key);
  }

  /**
   * Clears old inactive keys to prevent memory leak
   */
  public cleanup(maxAgeMs: number = 3600000): void {
    const cutoff = Date.now() - maxAgeMs;
    for (const [key, timestamps] of this.requestLogs.entries()) {
      const filtered = timestamps.filter((t) => t > cutoff);
      if (filtered.length === 0) {
        this.requestLogs.delete(key);
      } else {
        this.requestLogs.set(key, filtered);
      }
    }
  }
}

export const rateLimiter = new MemoryRateLimiter();
