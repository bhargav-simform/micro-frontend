import { useEffect, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import authStore, { type AuthState } from './authStore'

function App() {
  const [auth, setAuth] = useState<AuthState>(authStore.getState())

  useEffect(() => authStore.subscribe(setAuth), [])

  if (!auth.user) {
    return (
      <ErrorBoundary>
        <div style={{
          padding: '2rem', textAlign: 'center', background: '#fef2f2',
          borderRadius: '8px', color: '#991b1b',
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>🔒 Protected Area</p>
          <p style={{ fontSize: '0.9rem' }}>Please log in using the Header to access this content.</p>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#166534', fontWeight: 600 }}>
          ✅ MFE App — authenticated as <strong>{auth.user.name}</strong> ({auth.user.role})
        </p>
        {auth.user.role === 'admin' && (
          <p style={{ marginTop: '0.5rem', color: '#15803d', fontSize: '0.9rem' }}>
            🔑 Admin panel visible — only admins see this section.
          </p>
        )}
        <p style={{ marginTop: '0.5rem', color: '#166534', fontSize: '0.85rem' }}>
          Token: <code style={{ background: '#dcfce7', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
            {auth.token}
          </code>
        </p>
      </div>
    </ErrorBoundary>
  )
}

export default App
