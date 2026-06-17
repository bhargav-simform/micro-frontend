import { lazy, Suspense, useEffect, useState } from 'react'
import { onWorkflowEvent, emitWorkflowEvent, type WorkflowEventPayload } from '../utils/eventBus'
import WorkflowResult from './WorkflowResult'

// Each step is owned by a different MFE — lazy loaded on demand
const WorkflowSubmit = lazy(() => import('mfe-app/WorkflowSubmit'))
const WorkflowReview = lazy(() => import('header-app/WorkflowReview'))

type WorkflowStep = 'idle' | 'submit' | 'review' | 'result'

const STEP_LABELS: Record<WorkflowStep, string> = {
  idle: 'Start',
  submit: 'Submit',
  review: 'Review',
  result: 'Result',
}

const STEP_ORDER: WorkflowStep[] = ['idle', 'submit', 'review', 'result']

export default function WorkflowOrchestrator() {
  const [step, setStep] = useState<WorkflowStep>('idle')
  const [submission, setSubmission] = useState<WorkflowEventPayload['workflow:submitted'] | null>(null)

  useEffect(() => {
    const unsubSubmit = onWorkflowEvent('workflow:submitted', (payload) => {
      setSubmission(payload)
      setStep('review')
    })
    const unsubApprove = onWorkflowEvent('workflow:approved', () => setStep('result'))
    const unsubReject = onWorkflowEvent('workflow:rejected', () => setStep('result'))
    return () => { unsubSubmit(); unsubApprove(); unsubReject() }
  }, [])

  function handleReset() {
    emitWorkflowEvent('workflow:reset', {})
    setSubmission(null)
    setStep('idle')
  }

  const currentIndex = STEP_ORDER.indexOf(step)

  return (
    <section style={{ padding: '16px 0', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15 }}>Approval Workflow Simulation</h3>

      {/* Step progress bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {STEP_ORDER.map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '5px 0',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: i === currentIndex ? 700 : 400,
              background: i < currentIndex ? '#6366f1' : i === currentIndex ? '#818cf8' : '#e5e7eb',
              color: i <= currentIndex ? 'white' : '#6b7280',
              transition: 'all 0.2s',
            }}
          >
            {STEP_LABELS[s]}
          </div>
        ))}
      </div>

      {step === 'idle' && (
        <div>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>
            A multi-step approval workflow where each step is handled by a different MFE.
            Communication happens via a shared event bus (window CustomEvents).
          </p>
          <button
            onClick={() => setStep('submit')}
            style={{
              background: '#6366f1',
              color: 'white',
              border: 'none',
              padding: '10px 22px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Start Workflow
          </button>
        </div>
      )}

      {step === 'submit' && (
        <Suspense fallback={<div style={{ color: '#6b7280', fontSize: 13 }}>Loading mfe-app/WorkflowSubmit...</div>}>
          <WorkflowSubmit />
        </Suspense>
      )}

      {step === 'review' && (
        <Suspense fallback={<div style={{ color: '#6b7280', fontSize: 13 }}>Loading header-app/WorkflowReview...</div>}>
          <WorkflowReview submission={submission} />
        </Suspense>
      )}

      {step === 'result' && (
        <WorkflowResult onReset={handleReset} />
      )}
    </section>
  )
}
