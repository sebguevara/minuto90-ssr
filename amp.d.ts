import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'amp-auto-ads': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type: string
        'data-ad-client': string
      }
    }
  }
}
