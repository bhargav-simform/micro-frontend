import styles from './App.module.css'
import ErrorBoundary from './ErrorBoundary'

let _emit: ((event: string, payload: unknown) => void) | null = null
import('mfe-app/eventBus').then((m) => { _emit = m.default.emit.bind(m.default) })

const USERS = ['Alice', 'Bob', 'Charlie', 'Diana']

function Header() {
  const handleSelectUser = (user: string) => {
    _emit?.('user:selected', { user })
  }

  return (
    <ErrorBoundary>
      <div className={styles.header}>
        <strong>Header MFE</strong>
        <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: '#555' }}>
          Select a user to notify other MFEs:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          {USERS.map((user) => (
            <button
              key={user}
              className={styles.btn}
              onClick={() => handleSelectUser(user)}
            >
              {user}
            </button>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Header
