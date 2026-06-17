export interface RemoteCacheEntry {
  url: string
  version: string
  cachedAt: number
  ttlMs: number
}

const CACHE_KEY_PREFIX = 'mfe_remote_cache_'

export function getCacheEntry(remoteName: string): RemoteCacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + remoteName)
    if (!raw) return null
    return JSON.parse(raw) as RemoteCacheEntry
  } catch {
    return null
  }
}

export function setCacheEntry(remoteName: string, entry: RemoteCacheEntry): void {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + remoteName, JSON.stringify(entry))
  } catch {
    // storage quota exceeded — silently skip
  }
}

export function isCacheValid(entry: RemoteCacheEntry): boolean {
  return Date.now() - entry.cachedAt < entry.ttlMs
}

export function invalidateCache(remoteName: string): void {
  localStorage.removeItem(CACHE_KEY_PREFIX + remoteName)
}

export function invalidateAllCaches(): void {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_KEY_PREFIX))
    .forEach(k => localStorage.removeItem(k))
}

export function getAllCacheEntries(): Record<string, RemoteCacheEntry & { isValid: boolean }> {
  const result: Record<string, RemoteCacheEntry & { isValid: boolean }> = {}
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_KEY_PREFIX))
    .forEach(k => {
      try {
        const entry = JSON.parse(localStorage.getItem(k)!) as RemoteCacheEntry
        const remoteName = k.replace(CACHE_KEY_PREFIX, '')
        result[remoteName] = { ...entry, isValid: isCacheValid(entry) }
      } catch {
        // skip malformed entries
      }
    })
  return result
}
