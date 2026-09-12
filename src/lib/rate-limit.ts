import type { NextRequest } from "next/server";

/**
 * In-memory sliding-window rate limiter.
 *
 * NOTE: On serverless/multi-instance deployments each instance keeps its own
 * counters, so this is best-effort protection against casual abuse and
 * single-source floods — not a hard guarantee. For strict enforcement use a
 * shared store (Upstash Redis, Supabase table, or edge WAF rules).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically drop expired buckets so the map can't grow unboundedly.
const SWEEP_INTERVAL_MS = 60_000;
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the window resets — only set when ok === false */
  retryAfter?: number;
}

/**
 * Returns { ok: true } while the key is under `limit` requests per
 * `windowMs`; otherwise { ok: false, retryAfter }.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
}

/** Best-effort client IP extraction (works behind Vercel/Cloudflare proxies).
 *  Accepts a NextRequest, a fetch Request, or the plain-headers object that
 *  next-auth v4 passes to `authorize()`. */
export function clientIp(request: NextRequest | Request | { headers?: unknown }): string {
  const h = request.headers as
    | { get?: (key: string) => string | null }
    | Record<string, string | string[] | undefined>
    | undefined;

  const read = (name: string): string | undefined => {
    if (!h) return undefined;
    if (typeof (h as { get?: unknown }).get === "function") {
      return (h as { get: (k: string) => string | null }).get(name) ?? undefined;
    }
    const v = (h as Record<string, string | string[] | undefined>)[name];
    return Array.isArray(v) ? v[0] : v;
  };

  const fwd = read("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return read("x-real-ip") ?? read("cf-connecting-ip") ?? "unknown";
}
