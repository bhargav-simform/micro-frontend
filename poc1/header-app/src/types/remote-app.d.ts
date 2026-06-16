declare module 'mfe-app/eventBus' {
  type Listener<T = unknown> = (payload: T) => void
  interface EventBus {
    emit<T>(event: string, payload: T): void
    on<T>(event: string, listener: Listener<T>): () => void
    off<T>(event: string, listener: Listener<T>): void
  }
  const eventBus: EventBus
  export default eventBus
}
