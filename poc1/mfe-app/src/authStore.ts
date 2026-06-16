export type AuthUser = { name: string; role: 'admin' | 'viewer' }
export type AuthState = { user: AuthUser | null; token: string | null }
export type AuthListener = (state: AuthState) => void

const state: AuthState = { user: null, token: null }
const listeners = new Set<AuthListener>()

function notify() {
  listeners.forEach((fn) => fn({ ...state }))
}

const authStore = {
  getState(): AuthState {
    return { ...state }
  },
  subscribe(fn: AuthListener): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  login(name: string, password: string): boolean {
    // Simulated credential check — in real MFE this calls an auth service
    const MOCK_USERS: Record<string, { password: string; role: 'admin' | 'viewer' }> = {
      admin: { password: 'admin123', role: 'admin' },
      alice: { password: 'alice123', role: 'viewer' },
    }
    const found = MOCK_USERS[name.toLowerCase()]
    if (!found || found.password !== password) return false
    state.user = { name, role: found.role }
    state.token = btoa(`${name}:${Date.now()}`)
    notify()
    return true
  },
  logout() {
    state.user = null
    state.token = null
    notify()
  },
}

export default authStore
