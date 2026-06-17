import { useState } from 'react'
import { emitWorkflowEvent } from '../utils/eventBus'
import styles from './WorkflowSubmit.module.css'

export default function WorkflowSubmit() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return

    emitWorkflowEvent('workflow:submitted', {
      submitterName: name.trim(),
      description: description.trim(),
      timestamp: Date.now(),
    })

    setSubmitted(true)
  }

  if (submitted) {
    return <div className={styles.success}>Submitted! Waiting for review...</div>
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <span className={styles.badge}>mfe-app</span>
      <h3>Step 1: Submit Request</h3>
      <label>
        Your Name
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe your request"
          required
        />
      </label>
      <button type="submit">Submit for Review</button>
    </form>
  )
}
