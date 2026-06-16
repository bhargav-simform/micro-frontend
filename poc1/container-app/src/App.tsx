import { lazy, Suspense, useEffect, useState } from 'react'

// ─── Feature 1: Auth ──────────────────────────────────────────────────────────
// authStore singleton is owned by mfe-app and shared across all MFEs via federation
let _authStore: typeof import('mfe-app/authStore')['default'] | null = null
import('mfe-app/authStore').then((m) => { _authStore = m.default })

// ─── Feature 2: Lazy Loading ──────────────────────────────────────────────────
// Each page is a separate federation chunk — only downloaded when the tab is clicked
const HeaderApp = lazy(() => import('header-app/Header'))
const MFEApp    = lazy(() => import('mfe-app/App'))
const Page1     = lazy(() => import('mfe-app/Page1'))
const Page2     = lazy(() => import('mfe-app/Page2'))

// ─── Feature 3: Production Build Info ────────────────────────────────────────
const BUILD_INFO = {
  env:     import.meta.env.VITE_APP_ENV     ?? 'development',
  version: import.meta.env.VITE_APP_VERSION ?? 'local',
  name:    import.meta.env.VITE_APP_NAME    ?? 'Container App',
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <div style={{ padding: '1.5rem', background: '#f1f5f9', borderRadius: '8px', minHeight: '120px' }}>
      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
        ⏳ Loading {label}…
      </div>
      {[240, 180, 140].map((w) => (
        <div key={w} style={{
          height: '14px', width: `${w}px`, borderRadius: '4px', marginBottom: '0.5rem',
          background: 'linear-gradient(90deg,#e2e8f0 25%,#f8fafc 50%,#e2e8f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.2s infinite',
        }} />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  )
}

type Tab = 'mfe' | 'page1' | 'page2'

const TAB_LABELS: Record<Tab, string> = {
  mfe:   'MFE App (Auth)',
  page1: 'Page 1 — Dashboard',
  page2: 'Page 2 — Tasks',
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('mfe')
  const [authUser, setAuthUser] = useState<{ name: string; role: string } | null>(null)

  // Feature 1: subscribe to authStore once it's loaded
  useEffect(() => {
    const poll = setInterval(() => {
      if (_authStore) {
        clearInterval(poll)
        setAuthUser(_authStore.getState().user)
        _authStore.subscribe((s) => setAuthUser(s.user))
      }
    }, 50)
    return () => clearInterval(poll)
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '960px', margin: '0 auto', padding: '1rem' }}>

      {/* ── Feature 3: Build Info Banner ─────────────────────────────────── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.3rem 0.75rem', background: '#0f172a', borderRadius: '5px',
        marginBottom: '0.75rem', fontSize: '0.75rem', color: '#94a3b8',
      }}>
        <span>
          <strong style={{ color: '#e2e8f0' }}>{BUILD_INFO.name}</strong>
          {' '}v{BUILD_INFO.version}
        </span>
        <span style={{
          padding: '0.1rem 0.5rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700,
          background: BUILD_INFO.env === 'production' ? '#16a34a' : '#d97706',
          color: '#fff',
        }}>
          {BUILD_INFO.env.toUpperCase()}
        </span>
      </div>

      {/* ── Feature 1: Auth status (driven by shared authStore) ─────────── */}
      <div style={{
        padding: '0.4rem 0.75rem', marginBottom: '0.75rem', borderRadius: '5px',
        background: authUser ? '#f0fdf4' : '#fef2f2',
        border: `1px solid ${authUser ? '#bbf7d0' : '#fecaca'}`,
        fontSize: '0.85rem', color: authUser ? '#166534' : '#991b1b',
      }}>
        {authUser
          ? <>Container sees: <strong>{authUser.name}</strong> ({authUser.role}) — logged in</>
          : '🔒 Not authenticated — log in via the Header MFE below'}
      </div>

      {/* ── Header MFE (always mounted — owns the login form) ───────────── */}
      <Suspense fallback={<Skeleton label="Header App" />}>
        <HeaderApp />
      </Suspense>

      {/* ── Feature 2: Tab nav — each tab is a separately lazy-loaded chunk ─ */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.4rem 0.9rem', borderRadius: '5px', border: 'none',
              background: activeTab === tab ? '#3b82f6' : '#e2e8f0',
              color: activeTab === tab ? '#fff' : '#334155',
              fontWeight: activeTab === tab ? 700 : 400,
              cursor: 'pointer', fontSize: '0.85rem',
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'mfe' && (
        <Suspense fallback={<Skeleton label="MFE App" />}>
          <MFEApp />
        </Suspense>
      )}
      {activeTab === 'page1' && (
        <Suspense fallback={<Skeleton label="Page 1" />}>
          <Page1 />
        </Suspense>
      )}
      {activeTab === 'page2' && (
        <Suspense fallback={<Skeleton label="Page 2" />}>
          <Page2 />
        </Suspense>
      )}

      {/* ── Feature 2: Lazy loading explanation ─────────────────────────── */}
      <div style={{
        marginTop: '1.5rem', padding: '0.75rem', background: '#fffbeb',
        borderRadius: '6px', border: '1px solid #fde68a', fontSize: '0.8rem', color: '#92400e',
      }}>
        <strong>Lazy Loading Demo:</strong> Page 1 and Page 2 chunks are only fetched from{' '}
        <code>localhost:5001</code> when their tab is first clicked. Check the Network tab in
        DevTools — you'll see the chunk appear on demand, not on initial load.
      </div>

    </div>
  )
}

export default App
