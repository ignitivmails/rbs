import { Icon } from '@/components/Icon'
import { getSite } from '@/lib/data'
import { cn, whatsappHref } from '@/lib/utils'

import { SocialLinks } from './SocialLinks'

/** Thin strip above the header: phone, WhatsApp, message, socials. */
export async function UtilityBar() {
  const { header, settings } = await getSite()
  const u = header.utility
  if (!u?.enabled) return null
  const showPhone = u.showPhone !== false && settings.phone
  const showWa = u.showWhatsapp !== false && settings.whatsapp

  return (
    <div
      className={cn('hidden text-xs md:block', !u.background && 'bg-ink', !u.textColor && 'text-page')}
      style={{ background: u.background || undefined, color: u.textColor || undefined }}
    >
      <div className="container-x flex h-8 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showPhone && (
            <a href={`tel:${settings.phone!.replace(/\s/g, '')}`} className="flex items-center gap-1.5 opacity-90 hover:opacity-100">
              <Icon name="phone" size={13} /> {settings.phone}
            </a>
          )}
          {showWa && (
            <a href={whatsappHref(settings.whatsapp!)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 opacity-90 hover:opacity-100">
              <Icon name="chat" size={13} /> WhatsApp us
            </a>
          )}
        </div>
        {u.text && <p className="truncate opacity-90">{u.text}</p>}
        {u.showSocials !== false ? <SocialLinks socials={settings.socials} size={14} /> : <span />}
      </div>
    </div>
  )
}
