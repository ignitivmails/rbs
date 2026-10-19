'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition, type ReactNode } from 'react'

import { setLocaleAction, subscribeAction } from '@/lib/actions'
import { cn, formatNumber } from '@/lib/utils'

import { Icon } from './Icon'

/* ---------------- Horizontal scroller with arrows ---------------- */

export function ScrollRow({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => {
    const el = ref.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }
  return (
    <div className="relative">
      <div ref={ref} className={cn('no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2', className)}>
        {children}
      </div>
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-surface p-2 shadow-md hover:text-primary md:flex"
      >
        <Icon name="chevronLeft" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-surface p-2 shadow-md hover:text-primary md:flex"
      >
        <Icon name="chevronRight" />
      </button>
    </div>
  )
}

/* ---------------- Newsletter form ---------------- */

type NewsletterProps = {
  placeholder?: string | null
  buttonLabel?: string | null
  disclaimer?: string | null
  source?: string
  tone?: 'light' | 'dark'
}

export function NewsletterForm({ placeholder, buttonLabel, disclaimer, source = 'website', tone = 'light' }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [pending, startTransition] = useTransition()

  if (result?.ok) {
    return (
      <p className="flex items-center gap-2 font-medium" role="status">
        <Icon name="check" /> {result.message}
      </p>
    )
  }

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault()
        startTransition(async () => setResult(await subscribeAction(email, source)))
      }}
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`newsletter-${source}`}>
          {placeholder || 'Email'}
        </label>
        <input
          id={`newsletter-${source}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder || 'Your email address'}
          className={cn(
            'min-w-0 flex-1 rounded-btn border px-4 py-3 text-sm outline-none',
            tone === 'dark' ? 'border-white/30 bg-white/10 text-inherit placeholder:text-white/60' :'border-line bg-surface text-ink focus:border-primary',
          )}
        />
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? '…' : buttonLabel || 'Subscribe'}
        </button>
      </div>
      {result && !result.ok && <p className="mt-2 text-sm text-danger">{result.message}</p>}
      {disclaimer && <p className="mt-2 text-xs opacity-70">{disclaimer}</p>}
    </form>
  )
}

/* ---------------- Sort dropdown (updates ?sort=) ---------------- */

type SortSelectProps = {
  options: Array<{ value: string; label: string }>
  value: string
  label: string
  /** Current query string params, so other filters are kept. */
  query?: Record<string, string>
}

export function SortSelect({ options, value, label, query = {} }: SortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams(query)
          next.set('sort', e.target.value)
          router.push(`${pathname}?${next.toString()}`, { scroll: false })
        }}
        className="rounded-theme border border-line bg-surface px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

/* ---------------- Count-up number ---------------- */

export function CountUp({ value, animate = true, duration = 1600 }: { value: number; animate?: boolean; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(animate ? 0 : value)

  useEffect(() => {
    if (!animate) return setDisplay(value)
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setDisplay(value)
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))))
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, animate, duration])

  return <span ref={ref}>{formatNumber(display)}</span>
}

/* ---------------- Language switcher ---------------- */

export function LanguageSwitcher({ locale }: { locale: 'en' | 'bn' }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  return (
    <div className="flex items-center rounded-full border border-line text-xs font-semibold" aria-label="Language">
      {(['en', 'bn'] as const).map((l) => (
        <button
          key={l}
          type="button"
          disabled={pending}
          aria-pressed={locale === l}
          onClick={() =>
            startTransition(async () => {
              await setLocaleAction(l)
              router.refresh()
            })
          }
          className={cn('rounded-full px-2.5 py-1', locale === l ? 'bg-primary text-primary-fg' : 'text-muted')}
        >
          {l === 'en' ? 'EN' : 'বাং'}
        </button>
      ))}
    </div>
  )
}
