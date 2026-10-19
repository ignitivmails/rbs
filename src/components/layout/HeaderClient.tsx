'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import { cartCount, useCart, useHydrated } from '@/components/cart/store'
import { Icon } from '@/components/Icon'
import { Img } from '@/components/Img'
import { useStore } from '@/components/StoreProvider'
import { LanguageSwitcher } from '@/components/ui'
import type { ImageData } from '@/lib/types'
import { cn } from '@/lib/utils'

export type NavLink = { label: string; href: string; newTab: boolean }
export type NavColumn = {
  heading: string
  href: string | null
  items: NavLink[]
  products: Array<{ name: string; href: string; image: ImageData | null }>
}
export type NavItem = {
  label: string
  href: string | null
  newTab: boolean
  layout: 'link' | 'dropdown' | 'mega'
  columns: NavColumn[]
  promo: { image: ImageData | null; title: string; href: string | null } | null
}

type Props = {
  logo: ImageData | null
  logoText: string
  logoHeight: number
  nav: NavItem[]
  sticky: boolean
  showSearch: boolean
  showAccount: boolean
  showCart: boolean
  popularSearches: string[]
  locale: 'en' | 'bn' | null
  /** First name of the logged-in shopper, or null for guests. */
  accountName: string | null
}

const hasPanel = (item: NavItem) => item.layout !== 'link' && item.columns.length > 0

export function HeaderClient(props: Props) {
  const { logo, logoText, logoHeight, nav, sticky, showSearch, showAccount, showCart, popularSearches, locale, accountName } = props
  const { t } = useStore()
  const pathname = usePathname()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    setOpenIndex(null)
    setMobileOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenIndex(null)
      setMobileOpen(false)
      setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
  }, [mobileOpen])

  const openItem = openIndex !== null ? nav[openIndex] : null

  const logoEl = logo ? (
    <span className="relative block" style={{ height: logoHeight, width: logo.width && logo.height ? (logo.width / logo.height) * logoHeight : logoHeight * 3 }}>
      <Img image={logo} fill sizes="240px" className="object-contain object-left" alt={logoText} priority />
    </span>
  ) : (
    <span className="font-heading text-xl font-semibold leading-none text-primary md:text-2xl">{logoText}</span>
  )

  return (
    <header className={cn('z-40 border-b border-line bg-surface/95 backdrop-blur', sticky && 'sticky top-0')} onMouseLeave={() => setOpenIndex(null)}>
      {/* Top row */}
      <div className="container-x flex h-16 items-center gap-2 md:h-20 md:gap-4">
        <button type="button" className="-ml-2 p-2 md:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Icon name="menu" size={24} />
        </button>

        <Link href="/" className="shrink-0" aria-label={`${logoText} — home`}>
          {logoEl}
        </Link>

        {showSearch && (
          <form action="/search" role="search" className="relative mx-auto hidden w-full max-w-xl md:block">
            <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              name="q"
              type="search"
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              className="w-full rounded-full border border-line bg-page py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
            {searchFocused && popularSearches.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-theme border border-line bg-surface p-4 shadow-xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{t('popularSearches')}</p>
                <PopularSearches terms={popularSearches} />
              </div>
            )}
          </form>
        )}

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {showSearch && (
            <button type="button" className="p-2 md:hidden" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
              <Icon name="search" size={22} />
            </button>
          )}
          {locale && <LanguageSwitcher locale={locale} />}
          {showAccount && (
            <Link href="/account" className="flex items-center gap-1.5 p-2 hover:text-primary" aria-label={accountName ? `Account — ${accountName}` : 'Log in'}>
              <Icon name="user" size={22} />
              {accountName && <span className="hidden max-w-24 truncate text-sm font-medium lg:inline">{accountName}</span>}
            </Link>
          )}
          {showCart && <CartButton />}
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="border-t border-line px-4 py-3 md:hidden">
          <form action="/search" role="search" className="relative">
            <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              name="q"
              type="search"
              autoFocus
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="w-full rounded-full border border-line bg-page py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
          </form>
          {popularSearches.length > 0 && (
            <div className="mt-3">
              <PopularSearches terms={popularSearches} />
            </div>
          )}
        </div>
      )}

      {/* Desktop navigation */}
      {nav.length > 0 && (
        <nav className="relative hidden border-t border-line md:block" aria-label="Main">
          <ul className="container-x flex flex-wrap items-center justify-center gap-x-1">
            {nav.map((item, i) => (
              <li key={item.label + i} className="relative" onMouseEnter={() => setOpenIndex(hasPanel(item) ? i : null)}>
                {hasPanel(item) ? (
                  <button
                    type="button"
                    aria-expanded={openIndex === i}
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className={cn(
                      'flex items-center gap-1 px-3 py-3 text-sm font-medium transition-colors hover:text-primary',
                      openIndex === i && 'text-primary',
                    )}
                  >
                    {item.label}
                    <Icon name="chevronDown" size={14} className={cn('transition-transform', openIndex === i && 'rotate-180')} />
                  </button>
                ) : item.href ? (
                  <NavAnchor href={item.href} newTab={item.newTab} className="block px-3 py-3 text-sm font-medium transition-colors hover:text-primary">
                    {item.label}
                  </NavAnchor>
                ) : (
                  <span className="block px-3 py-3 text-sm font-medium">{item.label}</span>
                )}

                {item.layout === 'dropdown' && openIndex === i && (
                  <div className="absolute left-1/2 top-full z-50 min-w-56 -translate-x-1/2 rounded-b-theme border border-line bg-surface p-2 shadow-xl">
                    {item.href && (
                      <NavAnchor href={item.href} className="block rounded-theme px-3 py-2 text-sm font-semibold text-primary hover:bg-ink/5">
                        {item.label} →
                      </NavAnchor>
                    )}
                    {item.columns.flatMap((c) => c.items).map((l) => (
                      <NavAnchor key={l.href + l.label} href={l.href} newTab={l.newTab} className="block rounded-theme px-3 py-2 text-sm hover:bg-ink/5 hover:text-primary">
                        {l.label}
                      </NavAnchor>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {openItem && openItem.layout === 'mega' && hasPanel(openItem) && <MegaPanel item={openItem} />}
        </nav>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-surface">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-heading text-lg text-primary">{logoText}</span>
              <button type="button" className="p-2" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <Icon name="x" />
              </button>
            </div>
            <MobileNav nav={nav} />
          </div>
        </div>
      )}
    </header>
  )
}

function NavAnchor({ href, newTab, className, children }: { href: string; newTab?: boolean; className?: string; children: ReactNode }) {
  if (newTab || /^https?:\/\//.test(href)) {
    return (
      <a href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function PopularSearches({ terms }: { terms: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {terms.map((term) => (
        <Link
          key={term}
          href={`/search?q=${encodeURIComponent(term)}`}
          onMouseDown={(e) => e.preventDefault()}
          className="rounded-full border border-line px-3 py-1 text-sm hover:border-primary hover:text-primary"
        >
          {term}
        </Link>
      ))}
    </div>
  )
}

function MegaPanel({ item }: { item: NavItem }) {
  return (
    <div className="absolute left-0 right-0 top-full z-50 border-t border-line bg-surface shadow-xl">
      <div className="container-x grid gap-8 py-8" style={{ gridTemplateColumns: `repeat(${item.columns.length}, minmax(0, 1fr))${item.promo ? ' 260px' : ''}` }}>
        {item.columns.map((col, i) => (
          <div key={col.heading + i}>
            {col.heading &&
              (col.href ? (
                <NavAnchor href={col.href} className="mb-3 block font-heading text-lg hover:text-primary">
                  {col.heading}
                </NavAnchor>
              ) : (
                <p className="mb-3 font-heading text-lg">{col.heading}</p>
              ))}
            {col.items.length > 0 && (
              <ul className="mb-4 space-y-2">
                {col.items.map((l) => (
                  <li key={l.href + l.label}>
                    <NavAnchor href={l.href} newTab={l.newTab} className="text-sm text-muted hover:text-primary">
                      {l.label}
                    </NavAnchor>
                  </li>
                ))}
              </ul>
            )}
            {col.products.length > 0 && (
              <ul className="space-y-3">
                {col.products.slice(0, 4).map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="group flex items-center gap-3">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-theme bg-ink/5">
                        <Img image={p.image} fill sizes="48px" />
                      </span>
                      <span className="text-sm leading-snug group-hover:text-primary">{p.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {item.promo && (
          <PromoTile promo={item.promo} />
        )}
      </div>
    </div>
  )
}

function PromoTile({ promo }: { promo: NonNullable<NavItem['promo']> }) {
  const inner = (
    <>
      <span className="relative block aspect-[4/3] overflow-hidden rounded-theme bg-ink/5">
        <Img image={promo.image} fill sizes="260px" className="transition-transform duration-500 group-hover:scale-105" />
      </span>
      {promo.title && <span className="mt-3 block font-heading text-lg group-hover:text-primary">{promo.title} →</span>}
    </>
  )
  return promo.href ? (
    <Link href={promo.href} className="group block">
      {inner}
    </Link>
  ) : (
    <div className="group">{inner}</div>
  )
}

function MobileNav({ nav }: { nav: NavItem[] }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  return (
    <ul className="divide-y divide-line">
      {nav.map((item, i) =>
        hasPanel(item) ? (
          <li key={item.label + i}>
            <button
              type="button"
              aria-expanded={expanded === i}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left font-medium"
            >
              {item.label}
              <Icon name="chevronDown" size={18} className={cn('transition-transform', expanded === i && 'rotate-180')} />
            </button>
            {expanded === i && (
              <div className="space-y-4 bg-page px-4 pb-4 pt-1">
                {item.href && (
                  <NavAnchor href={item.href} className="block text-sm font-semibold text-primary">
                    {item.label} →
                  </NavAnchor>
                )}
                {item.columns.map((col, ci) => (
                  <div key={col.heading + ci}>
                    {col.heading && (
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                        {col.href ? <NavAnchor href={col.href}>{col.heading}</NavAnchor> : col.heading}
                      </p>
                    )}
                    <ul className="space-y-1.5">
                      {col.items.map((l) => (
                        <li key={l.href + l.label}>
                          <NavAnchor href={l.href} newTab={l.newTab} className="text-sm">
                            {l.label}
                          </NavAnchor>
                        </li>
                      ))}
                      {col.products.map((p) => (
                        <li key={p.href}>
                          <Link href={p.href} className="text-sm">
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </li>
        ) : (
          <li key={item.label + i}>
            {item.href ? (
              <NavAnchor href={item.href} newTab={item.newTab} className="block px-4 py-3.5 font-medium">
                {item.label}
              </NavAnchor>
            ) : (
              <span className="block px-4 py-3.5 font-medium">{item.label}</span>
            )}
          </li>
        ),
      )}
    </ul>
  )
}

function CartButton() {
  const count = useCart((s) => cartCount(s.items))
  const open = useCart((s) => s.open)
  const hydrated = useHydrated()
  return (
    <button type="button" onClick={open} className="relative p-2 hover:text-primary" aria-label={`Cart${hydrated && count ? `, ${count} items` : ''}`}>
      <Icon name="bag" size={22} />
      {hydrated && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold leading-5 text-primary-fg">
          {count}
        </span>
      )}
    </button>
  )
}
