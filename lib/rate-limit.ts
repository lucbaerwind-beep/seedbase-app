type RateEntry = {
  count: number;
  expiresAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const globalForRateLimit = globalThis as unknown as {
  seedbaseRateLimit?: Map<string, RateEntry>;
};

const store = globalForRateLimit.seedbaseRateLimit ?? new Map<string, RateEntry>();

if (!globalForRateLimit.seedbaseRateLimit) {
  globalForRateLimit.seedbaseRateLimit = store;
}

export function isRateLimited(key: string) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.expiresAt < now) {
    store.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  entry.count += 1;
  store.set(key, entry);
  return false;
}
