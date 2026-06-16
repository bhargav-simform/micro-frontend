// Import the prefixed tailwind as a raw string. Federated modules don't
// auto-load their stylesheet in the host, so we inject it into the document
// head ourselves. Because every class is `hdr:`-prefixed, sharing the global
// scope is safe — no collisions with the container or other MFEs.
import tailwind from './tailwind.css?inline'
import { useEffect } from 'react'
import ErrorBoundary from './ErrorBoundary'

const STYLE_ID = 'header-app-tailwind'

function useInjectStyles(css: string) {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = css
    document.head.appendChild(style)
  }, [css])
}

function App() {
  useInjectStyles(tailwind)

  return (
    <ErrorBoundary>
      {/* All utilities are `hdr:`-prefixed → cannot collide with the
          container's or mfe-app's tailwind classes. `demo-box` is the
          shared global hook: the container's red-outline rule WILL apply
          here, showing prefix isolation namespaces utilities but still
          lives in the global scope. */}
      <div className="demo-box hdr:flex hdr:flex-col hdr:items-center hdr:gap-2 hdr:rounded-xl hdr:bg-blue-600 hdr:p-6 hdr:text-white hdr:shadow-lg">
        <span className="hdr:text-lg hdr:font-bold">Header App</span>
        <span className="hdr:text-sm hdr:opacity-80">
          strategy: Tailwind <code>hdr:</code> prefix
        </span>
        <button className="hdr:rounded hdr:bg-white hdr:px-4 hdr:py-1 hdr:font-medium hdr:text-blue-600 hover:hdr:bg-blue-50">
          hdr: button
        </button>
      </div>
    </ErrorBoundary>
  )
}

export default App
