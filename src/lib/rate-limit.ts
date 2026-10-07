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

/** Best-effort client IP extraction for rate limiting.
 *  Accepts a NextRequest, a fetch Request, or the plain-headers object that
 *  next-auth v4 passes to `authorize()`.
 *
 *  Spoofing note: the FIRST x-forwarded-for entry is client-controlled — an
 *  attacker can rotate it to dodge IP-keyed limits. Trust order here:
 *   1. `x-nf-client-connection-ip` — Netlify sets this at the edge and
 *      overwrites any client-supplied value, so it cannot be forged.
 *   2. The LAST x-forwarded-for entry — appended by our own edge proxy.
 *      Earlier entries may be attacker-supplied and are never trusted.
 *   3. `x-real-ip` / `cf-connecting-ip` fallbacks, else "unknown" — one
 *      shared bucket that still rate-limits rather than bypassing. */
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

  const nfIp = read("x-nf-client-connection-ip");
  if (nfIp) return nfIp.trim();

  const fwd = read("x-forwarded-for");
  if (fwd) {
    const parts = fwd.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return read("x-real-ip") ?? read("cf-connecting-ip") ?? "unknown";
}
