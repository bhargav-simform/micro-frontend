import { useEffect, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import eventBus from './eventBus'

function App(_: Readonly<{ basePath?: string }>) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  useEffect(() => {
    const unsub = eventBus.on<{ user: string }>('user:selected', ({ user }) => {
      setSelectedUser(user)
    })
    return unsub
  }, [])

  return (
    <ErrorBoundary>
      <div style={{ padding: '0.75rem', background: '#f9f9f9', borderRadius: '6px' }}>
        <strong>MFE App</strong>
        <p style={{ marginTop: '0.5rem', color: '#333' }}>
          {selectedUser
            ? <>Active user: <strong>{selectedUser}</strong> — received via event bus</>
            : 'Waiting for user selection from Header MFE…'}
        </p>
      </div>
    </ErrorBoundary>
  )
}

export default App
