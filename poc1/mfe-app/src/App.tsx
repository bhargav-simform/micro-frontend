// Import the COMPILED tailwind as a raw string so we can inject it into
// the shadow root. `?inline` returns the CSS text instead of adding a
// <style> tag to the document head.
import tailwind from './tailwind.css?inline'
import ShadowRoot from './ShadowRoot'
import ErrorBoundary from './ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <ShadowRoot css={tailwind}>
        {/* `demo-box` is here too, but because we're inside a Shadow DOM
            the container's global `.demo-box { outline: red }` rule CANNOT
            reach in — proving true isolation. Tailwind utilities are
            unprefixed yet still never collide with the container's. */}
        <div className="demo-box flex flex-col items-center gap-2 rounded-xl bg-emerald-600 p-6 text-white shadow-lg">
          <span className="text-lg font-bold">MFE App</span>
          <span className="text-sm opacity-80">strategy: Shadow DOM (sealed)</span>
          <button className="rounded bg-white px-4 py-1 font-medium text-emerald-600 hover:bg-emerald-50">
            shadow button
          </button>
        </div>
      </ShadowRoot>
    </ErrorBoundary>
  )
}

export default App
