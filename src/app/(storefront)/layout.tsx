import type { Metadata } from 'next'
import { Suspense, type ReactNode } from 'react'

import { NavigationProgress } from '@/components/NavigationProgress'

import { CartSync } from '@/components/account/AccountClient'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Analytics } from '@/components/layout/Analytics'
import { SiteJsonLd } from '@/components/layout/SiteJsonLd'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { DraftBanner, WhatsAppFloat } from '@/components/layout/Extras'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LivePreviewListener } from '@/components/layout/LivePreviewListener'
import { ThemeStyle } from '@/components/layout/ThemeStyle'
import { StoreProvider } from '@/components/StoreProvider'
import { getQuantityRules, getSite } from '@/lib/data'
import { getCustomer } from '@/lib/session'
import { toImage } from '@/lib/utils'

import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite()
  const name = settings.siteName || 'Real Bengal Sweets'
  const og = toImage(settings.ogImage, 'card')
  const favicon = toImage(settings.favicon)
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: {
      default: settings.tagline ? `${name} — ${settings.tagline}` : name,
      template: settings.titleTemplate || `%s | ${name}`,
    },
    description: settings.metaDescription || undefined,
    openGraph: { siteName: name, type: 'website', images: og ? [og.src] : undefined },
    icons: favicon ? { icon: favicon.src } : undefined,
  }
}

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const [site, customer, qtyRules] = await Promise.all([getSite(), getCustomer(), getQuantityRules()])

  return (
    <html lang={site.locale}>
      <head>
        <ThemeStyle theme={site.theme} />
      </head>
      <body className="flex min-h-screen flex-col">
        <StoreProvider strings={site.strings} currency={site.settings.currency || 'INR'} qtyRules={qtyRules}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-surface focus:px-4 focus:py-2">
            Skip to content
          </a>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          {customer && <CartSync />}
          <WhatsAppFloat />
          <SiteJsonLd />
          <Analytics />
          {site.draft && (
            <>
              <LivePreviewListener />
              <DraftBanner />
            </>
          )}
        </StoreProvider>
      </body>
    </html>
  )
}
