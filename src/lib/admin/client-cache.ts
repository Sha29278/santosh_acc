/**
 * Client-side localStorage cache for admin panels.
 * On Vercel, different serverless instances don't share in-memory state.
 * This ensures saved data persists across page navigations and component remounts.
 */

const PREFIX = "admin_cache_";

/** Load cached data from localStorage */
export function loadCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Save data to localStorage */
export function saveCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — ignore
  }
}

/** Load from cache first, then fetch from API. Updates cache with API response. */
export async function cachedFetch<T>(
  cacheKey: string,
  apiUrl: string,
  fallback: T,
): Promise<T> {
  // 1. Return cached data immediately (if available)
  const cached = loadCache<T>(cacheKey);
  
  // 2. Fetch from API in background to get any server-side updates
  try {
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = (await res.json()) as T;
      if (data) {
        saveCache(cacheKey, data);
        return data;
      }
    }
  } catch {
    // Network error — fall through to cache
  }
  
  return cached ?? fallback;
}
