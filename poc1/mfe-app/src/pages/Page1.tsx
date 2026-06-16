import { useEffect, useState } from 'react'

// Simulates a heavy component that takes time to initialise
function useFakeDelay(ms: number) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms)
    return () => clearTimeout(t)
  }, [ms])
  return ready
}

function Page1() {
  const ready = useFakeDelay(1200)

  return (
    <div style={{ padding: '1.5rem', background: '#f0f9ff', borderRadius: '8px', minHeight: '160px' }}>
      <h2 style={{ margin: '0 0 0.5rem', color: '#0369a1' }}>Page 1 — Dashboard</h2>
      {ready ? (
        <>
          <p style={{ color: '#0c4a6e' }}>
            Loaded after simulated 1.2 s data fetch. This chunk was downloaded separately from
            the main bundle — open DevTools → Network to confirm.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {['Revenue', 'Users', 'Sessions'].map((label, i) => (
              <div key={label} style={{
                flex: '1 1 120px', padding: '1rem', borderRadius: '6px',
                background: '#0ea5e9', color: '#fff', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{(i + 1) * 1234}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
          {[180, 120, 80].map((w) => (
            <div key={w} style={{
              height: '16px', width: `${w}px`, borderRadius: '4px',
              background: 'linear-gradient(90deg, #bae6fd 25%, #e0f2fe 50%, #bae6fd 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.2s infinite',
            }} />
          ))}
          <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      )}
    </div>
  )
}

export default Page1
