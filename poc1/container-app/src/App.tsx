import { BrowserRouter, NavLink } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const MFEApp = lazy(() => import('mfe-app/App'))
const HeaderApp = lazy(() => import('header-app/Header'))

const navStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  fontWeight: isActive ? 'bold' : 'normal',
  textDecoration: 'none',
  padding: '0.4rem 0.8rem',
  borderRadius: '4px',
  background: isActive ? '#eee' : 'transparent',
})

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>

        {/* Shell-level nav — links to each MFE's basePath */}
        <header style={{ borderBottom: '2px solid #ccc', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <h1 style={{ margin: '0 0 0.5rem' }}>Container App — MFE Routing Demo</h1>
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <NavLink to="/header" style={navStyle}>Header MFE</NavLink>
            <NavLink to="/mfe" style={navStyle}>MFE App</NavLink>
          </nav>
        </header>

        {/*
          Both MFEs are mounted at all times and own their sub-route matching internally.
          The container just passes the basePath each MFE should anchor to.
        */}
        <Suspense fallback={<p>Loading Header App…</p>}>
          <HeaderApp basePath="/header" />
        </Suspense>

        <Suspense fallback={<p>Loading MFE App…</p>}>
          <MFEApp basePath="/mfe" />
        </Suspense>

      </div>
    </BrowserRouter>
  )
}

export default App
