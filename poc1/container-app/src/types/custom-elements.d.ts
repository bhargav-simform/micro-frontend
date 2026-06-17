import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'vue-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { 'workflow-step'?: string },
        HTMLElement
      >
    }
  }
}
