import { useEffect, useState } from 'react'
import { onWorkflowEvent } from '../utils/eventBus'
import type { WorkflowEventPayload } from '../utils/eventBus'

type Outcome =
  | { type: 'approved'; data: WorkflowEventPayload['workflow:approved'] }
  | { type: 'rejected'; data: WorkflowEventPayload['workflow:rejected'] }
  | null

interface Props {
  onReset: () => void
}

export default function WorkflowResult({ onReset }: Props) {
  const [outcome, setOutcome] = useState<Outcome>(null)

  useEffect(() => {
    const unsubApprove = onWorkflowEvent('workflow:approved', data =>
      setOutcome({ type: 'approved', data })
    )
    const unsubReject = onWorkflowEvent('workflow:rejected', data =>
      setOutcome({ type: 'rejected', data })
    )
    return () => { unsubApprove(); unsubReject() }
  }, [])

  if (!outcome) {
    return <div style={{ fontStyle: 'italic', color: '#6b7280', fontSize: 13 }}>Awaiting decision...</div>
  }

  const approved = outcome.type === 'approved'

  return (
    <div style={{
      padding: 20,
      borderRadius: 8,
      border: `2px solid ${approved ? '#16a34a' : '#dc2626'}`,
      background: approved ? '#f0fdf4' : '#fef2f2',
      maxWidth: 400,
    }}>
      <div style={{
        display: 'inline-block',
        background: approved ? '#16a34a' : '#dc2626',
        color: 'white',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 11,
        marginBottom: 8,
      }}>
        container-app
      </div>
      <h3 style={{ margin: '0 0 8px', color: approved ? '#166534' : '#991b1b', fontSize: 15 }}>
        Step 3: {approved ? '✓ Approved' : '✗ Rejected'}
      </h3>
      {approved && (
        <p style={{ fontSize: 13, margin: '0 0 8px' }}>
          Note: <em>{outcome.data.approverNote || '(no note provided)'}</em>
        </p>
      )}
      {!approved && (
        <p style={{ fontSize: 13, margin: '0 0 8px' }}>
          Reason: <em>{(outcome.data as WorkflowEventPayload['workflow:rejected']).reason}</em>
        </p>
      )}
      <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 12px' }}>
        Decided: {new Date(outcome.data.timestamp).toLocaleString()}
      </p>
      <button
        onClick={onReset}
        style={{ background: '#374151', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
      >
        Start Over
      </button>
    </div>
  )
}
