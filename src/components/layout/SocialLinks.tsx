import { Icon, socialIconName } from '@/components/Icon'
import type { SocialLink } from '@/lib/types'
import { cn } from '@/lib/utils'

const LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
}

export function SocialLinks({ socials, size = 18, className }: { socials?: SocialLink[] | null; size?: number; className?: string }) {
  const list = (socials ?? []).filter((s) => s.url)
  if (!list.length) return null
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {list.map((s) => (
        <li key={s.url}>
          <a href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={LABELS[s.platform ?? ''] ?? s.platform ?? 'Social'} className="opacity-80 transition-opacity hover:opacity-100">
            <Icon name={socialIconName(s.platform)} size={size} />
          </a>
        </li>
      ))}
    </ul>
  )
}
