/**
 * Rate Limiter Utility
 *
 * Generic rate limiting implementation for email services
 */

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if the key is within rate limits
   * @param key - Unique identifier for rate limiting (e.g., email address)
   * @returns true if within limits, false if exceeded
   */
  check(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(
      (time) => now - time < this.config.windowMs
    );

    if (recentAttempts.length >= this.config.maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  /**
   * Reset rate limit for a specific key
   * @param key - Unique identifier to reset
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all rate limit data
   */
  clearAll(): void {
    this.attempts.clear();
  }

  /**
   * Get remaining attempts for a key
   * @param key - Unique identifier
   * @returns number of remaining attempts
   */
  getRemainingAttempts(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const recentAttempts = attempts.filter(
      (time) => now - time < this.config.windowMs
    );
    return Math.max(0, this.config.maxAttempts - recentAttempts.length);
  }
}
