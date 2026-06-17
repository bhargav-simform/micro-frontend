import { useState, useEffect, useCallback } from 'react'
import {
  getCacheEntry,
  setCacheEntry,
  isCacheValid,
  type RemoteCacheEntry,
} from '../utils/remoteCache'

interface RemoteConfig {
  remoteName: string
  remoteUrl: string
  version: string
  ttlMs?: number
}

interface UseRemoteCacheResult {
  resolvedUrl: string
  reachable: boolean   // false when network failed AND no cache entry exists
  fromCache: boolean
  isStale: boolean
  probing: boolean     // true while the HEAD probe is in-flight
  refresh: () => void
}

export function useRemoteCache(config: RemoteConfig): UseRemoteCacheResult {
  const { remoteName, remoteUrl, version, ttlMs = 60_000 } = config
  const [resolvedUrl, setResolvedUrl] = useState(remoteUrl)
  const [reachable, setReachable] = useState(true)
  const [fromCache, setFromCache] = useState(false)
  const [isStale, setIsStale] = useState(false)
  const [probing, setProbing] = useState(true)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setProbing(true)

    async function resolve() {
      const existing = getCacheEntry(remoteName)

      // Fresh valid cache hit — skip the network probe entirely
      if (existing && isCacheValid(existing) && existing.version === version) {
        if (!cancelled) {
          setResolvedUrl(existing.url)
          setReachable(true)
          setFromCache(true)
          setIsStale(false)
          setProbing(false)
        }
        return
      }

      try {
        const res = await fetch(remoteUrl, { method: 'HEAD', cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const entry: RemoteCacheEntry = { url: remoteUrl, version, cachedAt: Date.now(), ttlMs }
        setCacheEntry(remoteName, entry)

        if (!cancelled) {
          setResolvedUrl(remoteUrl)
          setReachable(true)
          setFromCache(false)
          setIsStale(false)
          setProbing(false)
        }
      } catch {
        if (!cancelled) {
          if (existing) {
            // Stale-cache fallback — still usable
            setResolvedUrl(existing.url)
            setReachable(true)
            setFromCache(true)
            setIsStale(!isCacheValid(existing))
            console.warn(`[MFE Cache] Falling back to stale cache for "${remoteName}"`)
          } else {
            // No network, no cache — mark unreachable
            setReachable(false)
          }
          setProbing(false)
        }
      }
    }

    resolve()
    return () => { cancelled = true }
  }, [remoteName, remoteUrl, version, ttlMs, tick])

  return { resolvedUrl, reachable, fromCache, isStale, probing, refresh }
}
