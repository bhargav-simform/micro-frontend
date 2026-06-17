import { lazy, Suspense } from 'react'
import HeaderApp from 'header-app/Header'
import CacheInspector from './components/CacheInspector'
import VueMfeWrapper from './components/VueMfeWrapper'
import WorkflowOrchestrator from './components/WorkflowOrchestrator'

const MFEApp = lazy(() => import('mfe-app/App'))

const sectionStyle: React.CSSProperties = {
  padding: '20px 24px',
  borderBottom: '1px solid #e5e7eb',
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#9ca3af',
  marginBottom: 8,
}

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '0 auto' }}>

      {/* Existing: Header MFE */}
      <div style={sectionStyle}>
        <HeaderApp />
      </div>

      {/* Existing: MFE App with lazy load */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>React MFE — mfe-app</div>
        <Suspense fallback={<div style={{ color: '#6b7280', fontSize: 13 }}>Loading mfe-app...</div>}>
          <MFEApp />
        </Suspense>
      </div>

      {/* Feature 1 + 2: Vue MFE via Web Component (cache strategy applied internally) */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Multi-Framework Integration — Vue 3 MFE</div>
        <VueMfeWrapper />
      </div>

      {/* Feature 3: Workflow Simulation */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Workflow Simulation</div>
        <WorkflowOrchestrator />
      </div>

      {/* Feature 1: Cache Inspector (fixed bottom-right) */}
      <CacheInspector />
    </div>
  )
}

export default App
