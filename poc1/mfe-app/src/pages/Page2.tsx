import { useEffect, useState } from 'react'

function Page2() {
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    // Simulate a network call — chunk loads instantly, data takes 800 ms
    const t = setTimeout(() => {
      setItems(['Create report', 'Review PRs', 'Deploy v2.1', 'Update docs', 'Team standup'])
    }, 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ padding: '1.5rem', background: '#fdf4ff', borderRadius: '8px', minHeight: '160px' }}>
      <h2 style={{ margin: '0 0 0.5rem', color: '#7e22ce' }}>Page 2 — Task List</h2>
      <p style={{ color: '#581c87', fontSize: '0.85rem', marginBottom: '1rem' }}>
        This is a separate federation chunk (Page2.js). It was only downloaded when you
        navigated here — not on initial load.
      </p>
      {items.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item) => (
            <li key={item} style={{
              padding: '0.5rem 0.75rem', background: '#ede9fe', borderRadius: '5px',
              color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ color: '#7c3aed' }}>✓</span> {item}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[200, 160, 200, 160, 200].map((w, i) => (
            <div key={i} style={{
              height: '36px', width: `${w}px`, borderRadius: '5px',
              background: 'linear-gradient(90deg, #e9d5ff 25%, #f5f3ff 50%, #e9d5ff 75%)',
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

export default Page2
