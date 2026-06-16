import { Routes, Route, NavLink } from 'react-router-dom'
import styles from './App.module.css'
import ErrorBoundary from './ErrorBoundary'
import HeaderHome from './pages/HeaderHome'
import HeaderAbout from './pages/HeaderAbout'
import HeaderContact from './pages/HeaderContact'

interface Props {
  readonly basePath?: string
}

function App({ basePath = '/header' }: Props) {
  return (
    <ErrorBoundary>
      <div style={{ border: '2px solid #007bff', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
        <h3 style={{ margin: '0 0 0.75rem', color: '#007bff' }}>Header App (owns sub-routes)</h3>

        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <NavLink to={basePath} end style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            Home
          </NavLink>
          <NavLink to={`${basePath}/about`} style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            About
          </NavLink>
          <NavLink to={`${basePath}/contact`} style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            Contact
          </NavLink>
          <button className={styles.btn}>Header App</button>
        </nav>

        <Routes>
          <Route path={basePath} element={<HeaderHome />} />
          <Route path={`${basePath}/about`} element={<HeaderAbout />} />
          <Route path={`${basePath}/contact`} element={<HeaderContact />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default App
