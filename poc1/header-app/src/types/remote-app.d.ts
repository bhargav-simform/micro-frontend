declare module 'mfe-app/authStore' {
  export type AuthUser = { name: string; role: 'admin' | 'viewer' }
  export type AuthState = { user: AuthUser | null; token: string | null }
  export type AuthListener = (state: AuthState) => void
  interface AuthStore {
    getState(): AuthState
    subscribe(fn: AuthListener): () => void
    login(name: string, password: string): boolean
    logout(): void
  }
  const authStore: AuthStore
  export default authStore
}
