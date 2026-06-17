import { useEffect, useRef, useState } from 'react'
import { setCacheEntry } from '../utils/remoteCache'
import { useRemoteCache } from '../hooks/useRemoteCache'

const VUE_MFE_URL = 'http://localhost:5003/assets/remoteEntry.js'

function sendMessageToVue() {
  globalThis.dispatchEvent(
    new CustomEvent('host:message', {
      detail: { message: `Hello from React @ ${new Date().toLocaleTimeString()}` },
    })
  )
}

export default function VueMfeWrapper() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [lastEvent, setLastEvent] = useState<string>('(none)')

  const { resolvedUrl, reachable, fromCache, isStale, probing, refresh } = useRemoteCache({
    remoteName: 'vue-mfe',
    remoteUrl: VUE_MFE_URL,
    version: '1.0.0',
    ttlMs: 60_000,
  })

  // Only attempt the federation import once the cache probe confirms the server is reachable
  useEffect(() => {
    if (probing || !reachable) return

    let cancelled = false

    import(/* @vite-ignore */ 'vue-mfe/bootstrap')
      .then(() => {
        if (!cancelled) {
          setCacheEntry('vue-mfe', {
            url: resolvedUrl,
            version: '1.0.0',
            cachedAt: Date.now(),
            ttlMs: 60_000,
          })
          setLoaded(true)
          setLoadError(null)
        }
      })
      .catch(err => {
        if (!cancelled) setLoadError(String(err))
      })

    return () => { cancelled = true }
  }, [probing, reachable, resolvedUrl])

  useEffect(() => {
    if (!loaded || !containerRef.current) return
    const el = containerRef.current

    function handleVueAction(e: Event) {
      setLastEvent(JSON.stringify((e as CustomEvent).detail))
    }

    el.addEventListener('vue-mfe:action', handleVueAction)
    return () => el.removeEventListener('vue-mfe:action', handleVueAction)
  }, [loaded])

  return (
    <section style={{ padding: '16px 0' }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>
        Vue 3 MFE — Web Component Integration
        {fromCache && (
          <span style={{
            marginLeft: 8, fontSize: 11,
            background: isStale ? '#fef3c7' : '#d1fae5',
            color: isStale ? '#92400e' : '#065f46',
            padding: '1px 6px', borderRadius: 10,
          }}>
            {isStale ? 'STALE cache' : 'FROM cache'}
          </span>
        )}
      </h3>

      {/* Server offline + no cache */}
      {!probing && !reachable && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 6,
          background: '#fef2f2', border: '1px solid #fecaca',
          fontSize: 13, color: '#991b1b',
        }}>
          <span style={{ fontSize: 16 }}>⚠</span>
          <span>
            <strong>vue-mfe is offline</strong> — start the preview server on port 5003 to load this MFE.
            <br />
            <code style={{ fontSize: 11, color: '#6b7280' }}>
              cd poc1/vue-mfe &amp;&amp; yarn build &amp;&amp; yarn preview
            </code>
          </span>
          <button
            onClick={refresh}
            style={{ marginLeft: 'auto', background: '#dc2626', color: 'white', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Load error after a reachable probe (e.g. federation resolution failure) */}
      {loadError && reachable && (
        <div style={{ color: '#dc2626', fontSize: 13 }}>
          Failed to load Vue MFE module: {loadError}
        </div>
      )}

      {/* Probing */}
      {probing && (
        <div style={{ color: '#6b7280', fontSize: 13 }}>Checking vue-mfe availability...</div>
      )}

      {/* Loading federation module */}
      {!probing && reachable && !loaded && !loadError && (
        <div style={{ color: '#6b7280', fontSize: 13 }}>Loading Vue MFE...</div>
      )}

      {/* Loaded */}
      {loaded && (
        <div ref={containerRef}>
          {/* React renders the HTML tag; Vue manages its internals via Custom Elements */}
          <vue-widget workflow-step="vue-section" />
        </div>
      )}

      {loaded && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={sendMessageToVue}
            style={{ background: '#0f766e', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
          >
            Send message to Vue
          </button>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Last Vue event: {lastEvent}</span>
        </div>
      )}
    </section>
  )
}
