import Button from './Button';
import ErrorBoundary from './ErrorBoundary';

function App() {


  return (
    <ErrorBoundary>
      <div> Loaded from MFE App</div>
      <Button />
    </ErrorBoundary>
  )
}

export default App
