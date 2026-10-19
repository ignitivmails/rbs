import type { DeliveryZone } from './types'

export const PINCODE_RE = /^[1-9][0-9]{5}$/

/** "411001-411062, 412105" → [[411001, 411062], [412105, 412105]] */
export function parsePincodes(text?: string | null): Array<[number, number]> {
  return (text ?? '')
    .split(/[\s,;]+/)
    .filter(Boolean)
    .flatMap((token) => {
      const m = token.match(/^(\d{6})(?:-(\d{6}))?$/)
      if (!m) return []
      const a = Number(m[1])
      const b = m[2] ? Number(m[2]) : a
      return [[Math.min(a, b), Math.max(a, b)] as [number, number]]
    })
}

/** Zones that list the pincode win; otherwise the default (pan-India) zone applies. */
export function findZone(zones: DeliveryZone[], pincode: string): DeliveryZone | null {
  if (!PINCODE_RE.test(pincode)) return null
  const n = Number(pincode)
  const active = zones.filter((z) => z.active !== false)
  const listed = active.find((z) => !z.isDefault && parsePincodes(z.pincodes).some(([a, b]) => n >= a && n <= b))
  return listed ?? active.find((z) => z.isDefault) ?? null
}

const IST = 'Asia/Kolkata'

/** Calendar date + minutes-past-midnight in IST. */
function istNow(now: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: IST,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

const istDateOf = (iso: string) => istNow(new Date(iso)).date

function addDays(ymd: string, days: number) {
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + days))
  return dt.toISOString().slice(0, 10)
}

/** Earliest delivery date (YYYY-MM-DD, IST) honouring lead time, same-day cut-off and blackout dates. */
export function estimateDelivery(zone: DeliveryZone, now = new Date()): string {
  const { date, minutes } = istNow(now)
  let lead = Math.max(0, zone.leadTimeDays ?? 1)
  if (lead === 0 && zone.sameDayCutoff) {
    const [h, m] = zone.sameDayCutoff.split(':').map(Number)
    if (Number.isFinite(h) && minutes > h * 60 + (m || 0)) lead = 1
  }
  const blackout = new Set((zone.blackoutDates ?? []).map((b) => (b.date ? istDateOf(b.date) : '')).filter(Boolean))
  let result = addDays(date, lead)
  for (let i = 0; i < 30 && blackout.has(result); i++) result = addDays(result, 1)
  return result
}

/** The next `count` deliverable dates for a zone (starting at the earliest possible). */
export function availableDates(zone: DeliveryZone, count = 7, now = new Date()): string[] {
  const blackout = new Set((zone.blackoutDates ?? []).map((b) => (b.date ? istDateOf(b.date) : '')).filter(Boolean))
  const dates: string[] = []
  let d = estimateDelivery(zone, now)
  for (let i = 0; dates.length < count && i < 60; i++) {
    if (!blackout.has(d)) dates.push(d)
    d = addDays(d, 1)
  }
  return dates
}

export function formatDeliveryDate(ymd: string, now = new Date()) {
  const today = istNow(now).date
  if (ymd === today) return 'today'
  if (ymd === addDays(today, 1)) return 'tomorrow'
  const [y, m, d] = ymd.split('-').map(Number)
  return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  )
}
