import { lazy, Suspense, useEffect, useState } from 'react'

const MFEApp = lazy(() => import('mfe-app/App'))
const HeaderApp = lazy(() => import('header-app/Header'))

function App() {
  const [activeUser, setActiveUser] = useState<string | null>(null)

  useEffect(() => {
    let unsub: (() => void) | undefined
    import('mfe-app/eventBus').then((m) => {
      unsub = m.default.on<{ user: string }>('user:selected', ({ user }) => {
        setActiveUser(user)
      })
    })
    return () => unsub?.()
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>

      <header style={{ borderBottom: '2px solid #ccc', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: '0 0 0.5rem' }}>Cross-App Communication Demo</h2>
        {/* Global status bar — updated via event bus */}
        <div style={{
          padding: '0.4rem 0.75rem',
          background: activeUser ? '#d4edda' : '#f8f9fa',
          border: '1px solid',
          borderColor: activeUser ? '#c3e6cb' : '#dee2e6',
          borderRadius: '4px',
          fontSize: '0.85rem',
          color: activeUser ? '#155724' : '#6c757d',
          transition: 'all 0.2s',
        }}>
          {activeUser
            ? <>Container sees active user: <strong>{activeUser}</strong></>
            : 'No user selected yet — try clicking a name in the Header MFE'}
        </div>
      </header>

      <Suspense fallback={<p>Loading Header App…</p>}>
        <HeaderApp basePath="/header" />
      </Suspense>

      <Suspense fallback={<p>Loading MFE App…</p>}>
        <MFEApp basePath="/mfe" />
      </Suspense>

    </div>
  )
}

export default App
