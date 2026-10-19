import { getSite } from '@/lib/data'
import { isScheduledActive, resolveLink } from '@/lib/utils'

import { AnnouncementBarClient } from './AnnouncementBarClient'

export async function AnnouncementBar() {
  const { announcement: a } = await getSite()
  if (!a?.enabled || !isScheduledActive(a)) return null
  const messages = (a.messages ?? [])
    .filter((m) => m.text)
    .map((m) => ({ text: m.text as string, href: resolveLink(m.link)?.href ?? null }))
  if (!messages.length) return null
  return (
    <AnnouncementBarClient
      messages={messages}
      rotateSeconds={a.rotateSeconds ?? 5}
      dismissible={Boolean(a.dismissible)}
      background={a.background || null}
      color={a.textColor || null}
    />
  )
}
