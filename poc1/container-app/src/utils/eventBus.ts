export type WorkflowEventType =
  | 'workflow:submitted'
  | 'workflow:approved'
  | 'workflow:rejected'
  | 'workflow:reset'

export interface WorkflowEventPayload {
  'workflow:submitted': { submitterName: string; description: string; timestamp: number }
  'workflow:approved': { approverNote: string; timestamp: number }
  'workflow:rejected': { reason: string; timestamp: number }
  'workflow:reset': Record<string, never>
}

export function emitWorkflowEvent<T extends WorkflowEventType>(
  type: T,
  payload: WorkflowEventPayload[T]
): void {
  window.dispatchEvent(new CustomEvent(type, { detail: payload, bubbles: false }))
}

export function onWorkflowEvent<T extends WorkflowEventType>(
  type: T,
  handler: (payload: WorkflowEventPayload[T]) => void
): () => void {
  const listener = (e: Event) => handler((e as CustomEvent).detail)
  window.addEventListener(type, listener)
  return () => window.removeEventListener(type, listener)
}
