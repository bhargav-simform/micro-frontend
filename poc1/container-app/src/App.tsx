import MFEApp from 'mfe-app/App'
import HeaderApp from 'header-app/Header'

function App() {

  return (
    <div>
      <HeaderApp />
      <p>Loaded from container app</p>
      <MFEApp />
    </div>
  )
}

export default App
