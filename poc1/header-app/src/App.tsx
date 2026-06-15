import styles from './App.module.css'
import ErrorBoundary from './ErrorBoundary'

function App() {

  return (
    <ErrorBoundary>
      <div>Header App</div>
      <button className={styles.btn}>Header App</button>
    </ErrorBoundary>
  )
}

export default App
