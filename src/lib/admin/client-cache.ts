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

/**
 * React hook pattern: Load from cache instantly, then fetch from API in background.
 *
 * Usage in useEffect:
 *   const cached = loadCache("my-key");
 *   if (cached) { setData(cached); setLoading(false); }
 *   fetchFromAPI().then(data => { setData(data); saveCache("my-key", data); setLoading(false); });
 */
