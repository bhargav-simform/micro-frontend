import { useState } from 'react'
import { emitWorkflowEvent } from '../utils/eventBus'
import type { WorkflowEventPayload } from '../utils/eventBus'
import styles from './WorkflowReview.module.css'

type Submission = WorkflowEventPayload['workflow:submitted']

interface Props {
  readonly submission: Submission | null
}

export default function WorkflowReview({ submission }: Props) {
  const [note, setNote] = useState('')
  const [reason, setReason] = useState('')

  function handleApprove() {
    emitWorkflowEvent('workflow:approved', { approverNote: note.trim(), timestamp: Date.now() })
  }

  function handleReject() {
    if (!reason.trim()) return
    emitWorkflowEvent('workflow:rejected', { reason: reason.trim(), timestamp: Date.now() })
  }

  if (!submission) {
    return <div className={styles.waiting}>Waiting for a submission to review...</div>
  }

  return (
    <div className={styles.container}>
      <span className={styles.badge}>header-app</span>
      <h3>Step 2: Review Request</h3>
      <div className={styles.card}>
        <p><strong>From:</strong> {submission.submitterName}</p>
        <p><strong>Request:</strong> {submission.description}</p>
        <p><strong>Submitted:</strong> {new Date(submission.timestamp).toLocaleString()}</p>
      </div>
      <div className={styles.actions}>
        <div className={styles.approveSection}>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Approval note (optional)"
          />
          <button className={styles.approveBtn} onClick={handleApprove}>
            Approve
          </button>
        </div>
        <div className={styles.rejectSection}>
          <input
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Rejection reason (required)"
          />
          <button
            className={styles.rejectBtn}
            onClick={handleReject}
            disabled={!reason.trim()}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
