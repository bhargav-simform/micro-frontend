import { useState, useCallback } from 'react'
import { getAllCacheEntries, invalidateCache, invalidateAllCaches } from '../utils/remoteCache'

export default function CacheInspector() {
  const [visible, setVisible] = useState(false)
  const [entries, setEntries] = useState(() => getAllCacheEntries())

  const refresh = useCallback(() => setEntries(getAllCacheEntries()), [])

  function handleInvalidate(name: string) {
    invalidateCache(name)
    refresh()
  }

  function handleInvalidateAll() {
    invalidateAllCaches()
    refresh()
  }

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999, fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => { setVisible(v => !v); refresh() }}
        style={{
          padding: '7px 14px',
          background: '#7c3aed',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 13,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        {visible ? 'Hide' : 'Cache Inspector'}
      </button>

      {visible && (
        <div style={{
          marginTop: 8,
          padding: 16,
          background: '#1e1e2e',
          color: '#cdd6f4',
          borderRadius: 10,
          minWidth: 340,
          fontSize: 12,
          fontFamily: 'monospace',
          boxShadow: '0 6px 28px rgba(0,0,0,0.5)',
          border: '1px solid #313244',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <strong style={{ fontSize: 13, color: '#cba6f7' }}>MFE Remote Cache</strong>
            <button
              onClick={handleInvalidateAll}
              style={{ background: '#f38ba8', color: '#1e1e2e', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
            >
              Invalidate All
            </button>
          </div>

          {Object.keys(entries).length === 0 && (
            <div style={{ color: '#6c7086', fontStyle: 'italic' }}>No cache entries yet. Load an MFE to populate.</div>
          )}

          {Object.entries(entries).map(([name, entry]) => (
            <div key={name} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #313244' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ color: entry.isValid ? '#a6e3a1' : '#f38ba8' }}>{name}</strong>
                <button
                  onClick={() => handleInvalidate(name)}
                  style={{ background: 'transparent', color: '#f38ba8', border: '1px solid #f38ba8', borderRadius: 4, padding: '1px 6px', cursor: 'pointer', fontSize: 10 }}
                >
                  Invalidate
                </button>
              </div>
              <div style={{ color: '#a6adc8' }}>Version: <span style={{ color: '#89b4fa' }}>{entry.version}</span></div>
              <div style={{ color: '#a6adc8' }}>Cached: {new Date(entry.cachedAt).toLocaleTimeString()}</div>
              <div style={{ color: '#a6adc8' }}>
                TTL: {entry.ttlMs / 1000}s — Status:{' '}
                <span style={{ color: entry.isValid ? '#a6e3a1' : '#f38ba8', fontWeight: 600 }}>
                  {entry.isValid ? 'FRESH' : 'STALE'}
                </span>
              </div>
              <div style={{ wordBreak: 'break-all', color: '#6c7086', marginTop: 2 }}>{entry.url}</div>
            </div>
          ))}

          <button
            onClick={refresh}
            style={{ marginTop: 4, background: '#313244', color: '#cdd6f4', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  )
}
