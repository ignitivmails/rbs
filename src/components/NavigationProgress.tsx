'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ADMIN_ROUTE } from '@/lib/admin-route'

const START_EVENT = 'rbs:navigation-start'

/** Call before router.push / router.replace to show the top progress bar. */
export function startNavigationProgress() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(START_EVENT))
}

const isModifiedClick = (e: MouseEvent) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0

/** Thin bar at the top of the page while navigating between pages (theme colours). */
export function NavigationProgress() {
  const pathname = usePathname()
  const search = useSearchParams()
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const active = useRef(false)
  const trickle = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const safety = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const finish = () => {
    if (!active.current) return
    active.current = false
    clearInterval(trickle.current)
    clearTimeout(safety.current)
    setWidth(100)
    setTimeout(() => {
      setVisible(false)
      setWidth(0)
    }, 350)
  }

  const start = () => {
    if (active.current) return
    active.current = true
    setVisible(true)
    setWidth(12)
    clearInterval(trickle.current)
    trickle.current = setInterval(() => setWidth((w) => Math.min(90, w + (90 - w) * 0.12)), 250)
    clearTimeout(safety.current)
    safety.current = setTimeout(finish, 15_000) // never get stuck
  }

  // The new route has rendered → complete the bar.
  useEffect(() => {
    finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isModifiedClick(e)) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      if (url.pathname.startsWith(ADMIN_ROUTE) || url.pathname.startsWith('/api/') || url.pathname.startsWith('/next/')) return
      if (url.pathname === location.pathname && url.search === location.search) return // same page / hash link
      start()
    }
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement
      // Only plain GET forms navigate (e.g. search); server-action forms prevent default.
      if ((form.method || 'get').toLowerCase() === 'get' && form.getAttribute('action')) start()
    }
    window.addEventListener(START_EVENT, start)
    document.addEventListener('click', onClick, true)
    document.addEventListener('submit', onSubmit, true)
    return () => {
      window.removeEventListener(START_EVENT, start)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('submit', onSubmit, true)
      clearInterval(trickle.current)
      clearTimeout(safety.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!visible) return null
  return <div className="rbs-progress" style={{ width: `${width}%`, opacity: width >= 100 ? 0 : 1 }} aria-hidden />
}
