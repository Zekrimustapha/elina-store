interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory rate limiting map
const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired entries (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks if a given identifier (e.g. client IP) exceeds the allowed request limit.
 * @param identifier - e.g. IP address
 * @param maxRequests - Max requests allowed within window (default: 5 requests)
 * @param windowMs - Time window in milliseconds (default: 60,000ms = 1 minute)
 * @returns boolean - true if allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 6,
  windowMs: number = 60 * 1000
): boolean {
  if (!identifier) return true;

  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false; // Exceeded limit
  }

  record.count += 1;
  return true;
}
