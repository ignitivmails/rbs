'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'

type Props = {
  messages: Array<{ text: string; href: string | null }>
  rotateSeconds: number
  dismissible: boolean
  background: string | null
  color: string | null
}

const STORAGE_KEY = 'rbs-announcement-dismissed'

export function AnnouncementBarClient({ messages, rotateSeconds, dismissible, background, color }: Props) {
  const [index, setIndex] = useState(0)
  const [hidden, setHidden] = useState(false)
  const signature = messages.map((m) => m.text).join('|')

  useEffect(() => {
    try {
      if (dismissible && sessionStorage.getItem(STORAGE_KEY) === signature) setHidden(true)
    } catch {
      /* storage unavailable */
    }
  }, [dismissible, signature])

  useEffect(() => {
    if (messages.length < 2 || rotateSeconds <= 0) return
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), rotateSeconds * 1000)
    return () => clearInterval(id)
  }, [messages.length, rotateSeconds])

  if (hidden) return null

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + messages.length) % messages.length)

  return (
    <div
      className={cn('relative text-[13px] font-medium', !background && 'bg-primary', !color && 'text-primary-fg')}
      style={{ background: background ?? undefined, color: color ?? undefined }}
      role="region"
      aria-label="Announcements"
    >
      <div className="container-x flex h-9 items-center justify-center gap-2">
        {messages.length > 1 && (
          <button type="button" onClick={() => go(-1)} className="p-1 opacity-70 hover:opacity-100" aria-label="Previous announcement">
            <Icon name="chevronLeft" size={14} />
          </button>
        )}
        <div className="relative h-full min-w-0 flex-1 overflow-hidden">
          {messages.map((m, i) => {
            const content = <span className="truncate">{m.text}</span>
            return (
              <div
                key={m.text + i}
                aria-hidden={i !== index}
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-all duration-500',
                  i === index ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                )}
              >
                {m.href ? (
                  <Link href={m.href} className="truncate underline-offset-4 hover:underline" tabIndex={i === index ? 0 : -1}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            )
          })}
        </div>
        {messages.length > 1 && (
          <button type="button" onClick={() => go(1)} className="p-1 opacity-70 hover:opacity-100" aria-label="Next announcement">
            <Icon name="chevronRight" size={14} />
          </button>
        )}
        {dismissible && (
          <button
            type="button"
            aria-label="Close announcements"
            className="p-1 opacity-70 hover:opacity-100"
            onClick={() => {
              setHidden(true)
              try {
                sessionStorage.setItem(STORAGE_KEY, signature)
              } catch {
                /* storage unavailable */
              }
            }}
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
