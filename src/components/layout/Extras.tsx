import Link from 'next/link'

import { Icon } from '@/components/Icon'
import { getSite } from '@/lib/data'
import { whatsappHref } from '@/lib/utils'

export async function WhatsAppFloat() {
  const { settings } = await getSite()
  if (!settings.whatsappFloat || !settings.whatsapp) return null
  return (
    <a
      href={whatsappHref(settings.whatsapp, settings.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <Icon name="chat" size={28} />
    </a>
  )
}

export function DraftBanner() {
  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 rounded-full bg-ink px-4 py-2 text-xs font-medium text-page shadow-lg">
      <span className="size-2 animate-pulse rounded-full bg-accent" />
      Preview mode — showing drafts
      <Link href="/next/exit-preview" prefetch={false} className="underline">
        Exit
      </Link>
    </div>
  )
}
