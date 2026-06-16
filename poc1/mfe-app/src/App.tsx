import { Routes, Route, NavLink } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import MfeHome from './pages/MfeHome'
import MfePage1 from './pages/MfePage1'
import MfePage2 from './pages/MfePage2'

interface Props {
  readonly basePath?: string
}

function App({ basePath = '/mfe' }: Props) {

  return (
    <ErrorBoundary>
      <div style={{ border: '2px solid #e67e22', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
        <h3 style={{ margin: '0 0 0.75rem', color: '#e67e22' }}>MFE App (owns sub-routes)</h3>

        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <NavLink to={basePath} end style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            Home
          </NavLink>
          <NavLink to={`${basePath}/page1`} style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            Page 1
          </NavLink>
          <NavLink to={`${basePath}/page2`} style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            Page 2
          </NavLink>
        </nav>

        <Routes>
          <Route path={basePath} element={<MfeHome />} />
          <Route path={`${basePath}/page1`} element={<MfePage1 />} />
          <Route path={`${basePath}/page2`} element={<MfePage2 />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default App
