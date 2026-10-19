import Link from 'next/link'

import { CMSLink } from '@/components/CMSLink'
import { Icon } from '@/components/Icon'
import { NewsletterForm } from '@/components/ui'
import { getSite } from '@/lib/data'
import { cn, whatsappHref } from '@/lib/utils'

import { SocialLinks } from './SocialLinks'

export async function Footer() {
  const { footer: f, settings, header } = await getSite()
  const siteName = settings.siteName || 'Real Bengal Sweets'
  const year = new Date().getFullYear()
  const columns = f.columns ?? []

  return (
    <footer
      className={cn('mt-auto', !f.background && 'bg-ink', !f.textColor && 'text-page')}
      style={{ background: f.background || undefined, color: f.textColor || undefined }}
    >
      <div className="container-x grid gap-10 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div className="space-y-5">
          <Link href="/" className="font-heading text-2xl font-semibold">
            {header.logoText || siteName}
          </Link>
          {f.about && <p className="max-w-sm text-sm leading-relaxed opacity-80">{f.about}</p>}
          {f.showContact !== false && (
            <ul className="space-y-2 text-sm opacity-90">
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:underline">
                    <Icon name="phone" size={16} /> {settings.phone}
                  </a>
                </li>
              )}
              {settings.whatsapp && (
                <li>
                  <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <Icon name="chat" size={16} /> WhatsApp
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:underline">
                    <Icon name="mail" size={16} /> {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2">
                  <Icon name="pin" size={16} className="mt-0.5 shrink-0" />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
            </ul>
          )}
          {f.showSocials !== false && <SocialLinks socials={settings.socials} />}
        </div>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {columns.map((col, i) => (
            <div key={(col.title ?? '') + i}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--rbs-font-body)' }}>
                {col.title}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {(col.links ?? []).map((l, li) => (
                  <li key={li}>
                    <CMSLink link={l.link} className="opacity-80 hover:underline hover:opacity-100" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {f.showNewsletter !== false && (
            <div className={cn(columns.length >= 4 ? 'sm:col-span-2 md:col-span-4' : 'sm:col-span-2 md:col-span-2')}>
              <h3 className="mb-2 font-heading text-xl">{f.newsletterHeading}</h3>
              {f.newsletterText && <p className="mb-4 text-sm opacity-80">{f.newsletterText}</p>}
              <NewsletterForm
                source="footer"
                tone="dark"
                placeholder={f.newsletterPlaceholder}
                buttonLabel={f.newsletterButton}
                disclaimer={f.newsletterDisclaimer}
              />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-current/15">
        <div className="container-x flex flex-col gap-3 py-5 text-xs opacity-75 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>{(f.copyright || `© {year} ${siteName}`).replace('{year}', String(year))}</p>
            {f.legalText && <p>{f.legalText}</p>}
          </div>
          {(f.bottomLinks ?? []).length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {(f.bottomLinks ?? []).map((l, i) => (
                <li key={i}>
                  <CMSLink link={l.link} className="hover:underline" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
