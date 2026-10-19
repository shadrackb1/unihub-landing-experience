// @ts-nocheck
/*
 * Offline read cache for Firestore-backed reads.
 *
 * Why here and not in the service worker: Firestore traffic goes through an
 * SDK that the SW deliberately leaves alone (see `public/sw.js`). These
 * helpers persist the last successful read per key into localStorage so that
 * public pages keep working with real data while offline, and so a failed or
 * hung read (retriable "database not found") falls back to the last-known
 * data instead of hanging or blanking the UI.
 */
const PREFIX = "unihub:cache:";
const CACHE_GENERATION = "v1";
// Stale cache is dropped after two weeks; fresher-than-that is always preferred.
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14;

/**
 * Reads that can hang (Firestore keeps retrying a missing database instead of
 * failing) are cut off after this many milliseconds; the UI then serves the
 * last cached value. Must be shorter than any user-visible loader state.
 */
export const DATA_READ_TIMEOUT = 6000;

export interface CacheEntry<T> {
  ts: number;
  data: T;
}

function storageKey(name: string): string {
  return `${PREFIX}${CACHE_GENERATION}:${name}`;
}

/**
 * Firestore `Timestamp` values serialize as plain `{seconds, nanoseconds}`
 * through JSON. This walks a value and re-attaches a working `toMillis()` /
 * `toDate()` / `isEqual()` to anything with that exact shape, so cached
 * documents keep behaving like real documents in client code.
 */
export function reviveTimestamps(value: any): any {
  if (Array.isArray(value)) return value.map(reviveTimestamps);
  if (value && typeof value === "object") {
    const restored: any = {};
    for (const [subkey, subvalue] of Object.entries(value)) {
      restored[subkey] = reviveTimestamps(subvalue);
    }
    const keys = Object.keys(value);
    if (keys.length === 2 && typeof restored.seconds === "number" && typeof restored.nanoseconds === "number") {
      restored.toMillis = () => restored.seconds * 1000 + Math.floor(restored.nanoseconds / 1e6);
      restored.toDate = () => new Date(restored.toMillis());
      restored.isEqual = (other: any) => Boolean(other) && other.seconds === restored.seconds;
    }
    return restored;
  }
  return value;
}

export function readCacheEntry<T = any>(name: string): CacheEntry<T> | null {
  try {
    const raw = window.localStorage.getItem(storageKey(name));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== "number") return null;
    if (Date.now() - parsed.ts > MAX_AGE_MS) {
      window.localStorage.removeItem(storageKey(name));
      return null;
    }
    return { ts: parsed.ts, data: reviveTimestamps(parsed.data) };
  } catch {
    return null;
  }
}

export function writeCacheEntry<T = any>(name: string, data: T): void {
  try {
    // Methods (toMillis etc.) and undefined values are dropped by JSON —
    // exactly what we want on the way in; reviveTimestamps restores them.
    window.localStorage.setItem(storageKey(name), JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // Quota exceeded or private mode — offline cache is best-effort.
  }
}

function timedOut(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`offline-cache: read timed out after ${ms}ms`)), ms);
  });
}

export interface CachedReadOptions {
  /**
   * Predicate for "this fresh result would be a downgrade" (e.g. an empty
   * list). When true the cache is left untouched so a transient empty read
   * never evicts good offline data, and `null` is returned instead.
   */
  isEmpty?: (result: any) => boolean;
}

/**
 * Run a Firestore read with an offline fallback:
 *   1. Fresh read wins; success rewrites the cache.
 *   2. A read that errors OR hangs past DATA_READ_TIMEOUT (Firestore keeps
 *      retrying "database not found" forever, so hangs are the common
 *      failure mode here) falls back to the last cached value.
 *   3. No cache either — returns null. Callers already treat null as
 *      "no data available", e.g. useListings keeps its sample data.
 */
export async function cachedRead<T = any>(
  name: string,
  fetcher: () => Promise<T>,
  options: CachedReadOptions = {},
): Promise<T | null> {
  let fresh: T | null = null;
  let succeeded = false;
  let degraded = false;
  try {
    fresh = (await Promise.race([fetcher(), timedOut(DATA_READ_TIMEOUT)])) as T | null;
    succeeded = true;
  } catch {
    degraded = true;
  }

  const isEmpty = options.isEmpty ? options.isEmpty(fresh) : fresh == null;
  if (succeeded && !isEmpty) {
    writeCacheEntry(name, fresh);
  }
  if (!degraded && fresh != null && !isEmpty) return fresh;

  // Degraded path (or nothing usable from the network): serve cache.
  const cached = readCacheEntry<T>(name);
  if (cached) return cached.data as T;
  if (!degraded) return fresh; // genuine "no data" from Firestore, no cache
  return null;
}
