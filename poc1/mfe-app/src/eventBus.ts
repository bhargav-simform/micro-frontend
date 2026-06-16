type Listener<T = unknown> = (payload: T) => void

const listeners: Record<string, Listener[]> = {}

const eventBus = {
  emit<T>(event: string, payload: T) {
    ;(listeners[event] ?? []).forEach((fn) => fn(payload))
  },
  on<T>(event: string, listener: Listener<T>) {
    if (!listeners[event]) listeners[event] = []
    listeners[event].push(listener as Listener)
    return () => this.off(event, listener)
  },
  off<T>(event: string, listener: Listener<T>) {
    listeners[event] = (listeners[event] ?? []).filter((fn) => fn !== listener)
  },
}

export default eventBus
