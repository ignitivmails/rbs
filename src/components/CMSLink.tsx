import Link from 'next/link'
import type { ReactNode } from 'react'

import type { LinkData, ResolvedLink } from '@/lib/types'
import { cn, isExternal, resolveLink } from '@/lib/utils'

type Appearance = 'primary' | 'secondary' | 'light' | 'outline' | 'link' | 'none'

const appearanceClass: Record<Appearance, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  light: 'btn btn-light',
  outline: 'btn btn-outline',
  link: 'inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline',
  none: '',
}

type Props = {
  link?: LinkData | null
  resolved?: ResolvedLink | null
  appearance?: Appearance | string | null
  className?: string
  children?: ReactNode
}

/** Renders a CMS link group (custom URL or reference) as a Next.js link or external anchor. */
export function CMSLink({ link, resolved, appearance = 'none', className, children }: Props) {
  const r = resolved ?? resolveLink(link)
  if (!r) return null
  const cls = cn(appearanceClass[(appearance as Appearance) ?? 'none'] ?? appearanceClass.primary, className)
  const content = children ?? r.label
  if (isExternal(r.href) || r.newTab) {
    return (
      <a href={r.href} className={cls} target={r.newTab ? '_blank' : undefined} rel={r.newTab ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    )
  }
  return (
    <Link href={r.href} className={cls}>
      {content}
    </Link>
  )
}
