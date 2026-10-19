import { getSite } from '@/lib/data'
import { getCustomer } from '@/lib/session'
import type { Product } from '@/lib/types'
import { isObject, resolveLink, toImage } from '@/lib/utils'

import { HeaderClient, type NavItem } from './HeaderClient'
import { UtilityBar } from './UtilityBar'

/** Resolves the Header global into plain data for the interactive client header. */
export async function Header() {
  const [site, customer] = await Promise.all([getSite(), getCustomer()])
  const h = site.header

  const nav: NavItem[] = (h.navItems ?? []).map((item) => {
    const link = resolveLink(item.link)
    const promoLink = resolveLink(item.promo?.link)
    return {
      label: item.label ?? '',
      href: link?.href ?? null,
      newTab: link?.newTab ?? false,
      layout: item.layout ?? 'link',
      columns: (item.columns ?? []).map((col) => ({
        heading: col.heading ?? '',
        href: resolveLink(col.headingLink)?.href ?? null,
        items: (col.items ?? [])
          .map((i) => resolveLink(i.link))
          .filter((r): r is NonNullable<typeof r> => Boolean(r))
          .map((r) => ({ label: r.label, href: r.href, newTab: r.newTab })),
        products: (col.products ?? [])
          .filter((p): p is Product => isObject(p))
          .map((p) => ({ name: p.name, href: `/products/${p.slug}`, image: toImage(p.gallery?.[0], 'thumbnail') })),
      })),
      promo:
        item.layout === 'mega' && item.promo && (item.promo.image || item.promo.title)
          ? { image: toImage(item.promo.image, 'card'), title: item.promo.title ?? '', href: promoLink?.href ?? null }
          : null,
    }
  })

  return (
    <>
      <UtilityBar />
      <HeaderClient
        logo={toImage(h.logo)}
        logoText={h.logoText || site.settings.siteName || 'Real Bengal Sweets'}
        logoHeight={h.logoHeight ?? 44}
        nav={nav}
        sticky={h.sticky !== false}
        showSearch={h.showSearch !== false}
        showAccount={h.showAccount !== false}
        showCart={h.showCart !== false}
        popularSearches={h.popularSearches ?? []}
        locale={site.settings.enableBengali ? site.locale : null}
        accountName={customer ? customer.name?.split(' ')[0] || 'Account' : null}
      />
    </>
  )
}
