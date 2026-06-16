import { useEffect, useRef, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import styles from './App.module.css'

let _store: typeof import('mfe-app/authStore')['default'] | null = null
import('mfe-app/authStore').then((m) => { _store = m.default })

type AuthUser = { name: string; role: string }

function LoginForm({ onLogin }: Readonly<{ onLogin: (name: string, pw: string) => boolean }>) {
  const nameRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const submit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const ok = onLogin(nameRef.current!.value, pwRef.current!.value)
    if (ok) {
      setError('')
    } else {
      setError('Invalid credentials. Try admin/admin123 or alice/alice123')
    }
  }

  return (
    <form onSubmit={submit} className={styles.loginForm}>
      <input ref={nameRef} placeholder="Username" className={styles.input} />
      <input ref={pwRef} type="password" placeholder="Password" className={styles.input} />
      <button type="submit" className={styles.btn}>Login</button>
      {error && <span className={styles.error}>{error}</span>}
    </form>
  )
}

function Header() {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (_store) {
      setUser(_store.getState().user)
      return _store.subscribe((s) => setUser(s.user))
    }
    const timer = setInterval(() => {
      if (_store) {
        clearInterval(timer)
        setUser(_store.getState().user)
        _store.subscribe((s) => setUser(s.user))
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = (name: string, pw: string) => _store?.login(name, pw) ?? false
  const handleLogout = () => _store?.logout()

  return (
    <ErrorBoundary>
      <div className={styles.header}>
        <span className={styles.brand}>Header MFE</span>
        {user ? (
          <div className={styles.userBar}>
            <span className={styles.badge} data-role={user.role}>
              {user.role === 'admin' ? '🔑' : '👤'} {user.name} ({user.role})
            </span>
            <button className={styles.btnOutline} onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default Header
