import { createHash } from "node:crypto";
import { isIP } from "node:net";

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

type WaitlistRateLimitGlobal = typeof globalThis & {
  __negoTrackWaitlistRateLimits?: Map<string, RateLimitEntry>;
};

const rateLimitGlobal = globalThis as WaitlistRateLimitGlobal;
const entries =
  rateLimitGlobal.__negoTrackWaitlistRateLimits ?? new Map<string, RateLimitEntry>();

rateLimitGlobal.__negoTrackWaitlistRateLimits = entries;

const MAX_TRACKED_KEYS = 5_000;

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function validForwardedIp(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const candidate = value.split(",", 1)[0]?.trim();
  return candidate && isIP(candidate) !== 0 ? candidate : undefined;
}

function pruneExpiredEntries(now: number): void {
  for (const [key, entry] of entries) {
    if (entry.expiresAt <= now) {
      entries.delete(key);
    }
  }

  if (entries.size <= MAX_TRACKED_KEYS) {
    return;
  }

  const numberToRemove = entries.size - MAX_TRACKED_KEYS;
  let removed = 0;

  for (const key of entries.keys()) {
    entries.delete(key);
    removed += 1;

    if (removed >= numberToRemove) {
      break;
    }
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function consumeRateLimit(
  key: string,
  limit: number,
  windowMilliseconds: number,
): RateLimitResult {
  const now = Date.now();

  if (entries.size >= MAX_TRACKED_KEYS) {
    pruneExpiredEntries(now);
  }

  const existing = entries.get(key);
  const entry =
    existing && existing.expiresAt > now
      ? existing
      : { count: 0, expiresAt: now + windowMilliseconds };

  entry.count += 1;
  entries.set(key, entry);

  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSeconds: Math.max(1, Math.ceil((entry.expiresAt - now) / 1_000)),
  };
}

export function clientRateLimitKey(request: Request): string | undefined {
  if (process.env.WAITLIST_TRUST_PROXY_HEADERS !== "true") {
    return undefined;
  }

  const ip =
    validForwardedIp(request.headers.get("cf-connecting-ip")) ??
    validForwardedIp(request.headers.get("x-real-ip")) ??
    validForwardedIp(request.headers.get("x-forwarded-for"));

  if (ip) {
    return `client:${hash(ip)}`;
  }

  return undefined;
}

export function emailRateLimitKey(normalizedEmail: string): string {
  return `email:${hash(normalizedEmail)}`;
}
