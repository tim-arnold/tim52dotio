// Rate limiting helper using Cloudflare KV

interface RateLimitConfig {
  maxRequests: number;  // Max requests allowed
  windowSeconds: number; // Time window in seconds
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

export async function checkRateLimit(
  kv: any | undefined,  // KVNamespace from Cloudflare Workers
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // If KV isn't configured, allow the request (fail open for development)
  if (!kv) {
    return { allowed: true, remaining: config.maxRequests, resetIn: 0 };
  }

  const key = `ratelimit:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - config.windowSeconds;

  try {
    // Get existing request timestamps
    const data = await kv.get(key, 'json') as number[] | null;
    let timestamps = data || [];

    // Filter to only requests within the current window
    timestamps = timestamps.filter(ts => ts > windowStart);

    if (timestamps.length >= config.maxRequests) {
      // Rate limited
      const oldestInWindow = Math.min(...timestamps);
      const resetIn = oldestInWindow + config.windowSeconds - now;

      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.max(0, resetIn),
      };
    }

    // Add current request timestamp
    timestamps.push(now);

    // Store updated timestamps (expire after window + buffer)
    await kv.put(key, JSON.stringify(timestamps), {
      expirationTtl: config.windowSeconds + 60,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - timestamps.length,
      resetIn: config.windowSeconds,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow request if KV errors
    return { allowed: true, remaining: config.maxRequests, resetIn: 0 };
  }
}

export function getClientIP(request: Request): string {
  // Cloudflare provides the real client IP in this header
  return request.headers.get('CF-Connecting-IP') ||
         request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
         'unknown';
}