import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { MobileHeader } from '@/modules/core/components/Header/MobileHeader'
import { DesktopHeader } from '@/modules/core/components/Header/DesktopHeader'
import { SearchOverlay } from '@/modules/core/components/Header/SearchOverlay'
import ErrorBoundary from '@/modules/core/components/errors/ErrorBoundary'
import { GlobalProvider } from '@/modules/core/providers/global-provider'
import Script from 'next/script'
import { Footer } from '@/modules/core/components/Footer/Footer'
import { Suspense } from 'react'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
})

const APP_NAME = 'Minuto 90'
const APP_DEFAULT_TITLE = 'Minuto 90'
const APP_TITLE_TEMPLATE = '%s - Minuto 90'
const APP_DESCRIPTION = 'Minuto 90'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f1419" />
        <link rel="icon" href="/icons/logo/90x192.svg" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3487972130233225"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script async custom-element="amp-auto-ads"
        strategy="afterInteractive"
        src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        id="amp-auto-ads"
        crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className={`${roboto.variable} antialiased`}>
        <GlobalProvider>
          <Suspense fallback={null}>
            <MobileHeader title="Minuto 90" />
            <DesktopHeader title="Minuto 90" />
          </Suspense>
          <div className="flex min-h-screen flex-col items-center">
            <div className="w-full max-w-7xl px-2 md:px-4 mt-14 lg:mt-0">
              <main className="flex-grow pt-2 md:pt-4 pb-8">
                <ErrorBoundary>{children}</ErrorBoundary>
              </main>
            </div>
            {/* <SearchOverlay /> */}
            <Footer />
          </div>
        </GlobalProvider>
        <amp-auto-ads type="adsense"
          data-ad-client="ca-pub-3487972130233225">
        </amp-auto-ads>
      </body>
    </html>
  )
}
