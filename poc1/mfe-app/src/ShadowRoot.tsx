import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Mounts children inside a real Shadow DOM root and injects the given
 * compiled CSS into that root. This fully seals styles in BOTH directions:
 *  - the injected tailwind cannot leak out to the host page
 *  - global host rules (e.g. container's `.demo-box` outline) cannot leak in
 */
export default function ShadowRoot({
  css,
  children,
}: Readonly<{
  css: string
  children: ReactNode
}>) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [shadow, setShadow] = useState<ShadowRoot | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    // Reuse an existing shadow root if one is already attached. React 19
    // StrictMode runs effects twice in dev, and attachShadow throws if the
    // host already hosts a shadow tree — so guard on the element, not state.
    const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' })
    if (!root.querySelector('style[data-mfe-tailwind]')) {
      const style = document.createElement('style')
      style.dataset.mfeTailwind = ''
      style.textContent = css
      root.appendChild(style)
    }
    setShadow(root)
  }, [css])

  return <div ref={hostRef}>{shadow && createPortal(children, shadow)}</div>
}
