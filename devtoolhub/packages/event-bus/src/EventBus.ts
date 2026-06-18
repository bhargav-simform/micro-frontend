import type { EventName, EventPayloadMap } from '@devtoolhub/shared-types';

type Handler<E extends EventName> = (payload: EventPayloadMap[E]) => void;

class EventBus {
  private listeners = new Map<string, Set<Function>>();

  on<E extends EventName>(event: E, handler: Handler<E>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.listeners.get(event)?.delete(handler);
  }

  emit<E extends EventName>(event: E, payload: EventPayloadMap[E]): void {
    this.listeners.get(event)?.forEach(h => (h as Handler<E>)(payload));
  }

  off<E extends EventName>(event: E, handler: Handler<E>): void {
    this.listeners.get(event)?.delete(handler);
  }

  clear(event?: EventName): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

export const eventBus = new EventBus();
export type { EventBus };
