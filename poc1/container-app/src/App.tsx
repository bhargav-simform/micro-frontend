import './tailwind.css'
import MFEApp from 'mfe-app/App'
import HeaderApp from 'header-app/Header'

function App() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8 text-left">
      <header>
        <h1 className="text-2xl font-bold">CSS Isolation Strategies — Tailwind v4</h1>
        <p className="text-sm text-gray-500">
          Each panel below is a separately-built micro-frontend. The container
          ships a leaky global rule:{' '}
          <code className="rounded bg-gray-100 px-1">.demo-box {'{ outline: 3px dashed red }'}</code>.
          Watch which panels it can reach.
        </p>
      </header>

      {/* CONTAINER baseline — plain, unprefixed tailwind in the global scope. */}
      <section>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Container (plain Tailwind, global)
        </p>
        <div className="demo-box flex flex-col items-center gap-2 rounded-xl bg-purple-600 p-6 text-white shadow-lg">
          <span className="text-lg font-bold">Container App</span>
          <span className="text-sm opacity-80">strategy: none (baseline)</span>
          <span className="text-xs opacity-70">↑ red outline = the global rule applied</span>
        </div>
      </section>

      {/* HEADER remote — prefix isolation. Red outline DOES apply (same global
          scope) but its tailwind utilities never collide. */}
      <section>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          header-app remote (prefix isolation) — outline applies, utilities don't collide
        </p>
        <HeaderApp />
      </section>

      {/* MFE remote — Shadow DOM. Red outline does NOT apply: the global rule
          cannot pierce the shadow boundary. */}
      <section>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          mfe-app remote (Shadow DOM) — sealed: NO red outline gets in
        </p>
        <MFEApp />
      </section>
    </div>
  )
}

export default App
