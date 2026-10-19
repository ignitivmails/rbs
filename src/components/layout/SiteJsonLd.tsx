import { getSite } from '@/lib/data'
import { toImage } from '@/lib/utils'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** Organization + WebSite (with site search) structured data for Google. */
export async function SiteJsonLd() {
  const { settings, header } = await getSite()
  const name = settings.siteName || 'Real Bengal Sweets'
  const logo = toImage(header.logo)
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name,
      url: BASE,
      logo: logo ? `${BASE}${logo.src}` : undefined,
      sameAs: (settings.socials ?? []).map((s) => s.url).filter(Boolean),
      contactPoint: settings.phone
        ? [{ '@type': 'ContactPoint', telephone: settings.phone, contactType: 'customer service', areaServed: 'IN', availableLanguage: ['en', 'bn', 'hi'] }]
        : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name,
      url: BASE,
      potentialAction: { '@type': 'SearchAction', target: `${BASE}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
    },
  ]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
