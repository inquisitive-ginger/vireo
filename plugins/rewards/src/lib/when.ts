/* Kid-grammar timestamps for the pocket. A ticket's age is part of its story
   ("Bought Tuesday" is a week of looking forward to Friday), so the labels speak in
   days a kid names, not ISO dates. Pure, injectable `now` for tests. */

const DAY_MS = 24 * 60 * 60 * 1000

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

function dayLabel(then: Date, now: Date): string {
  const days = Math.round((startOfDay(now).getTime() - startOfDay(then).getTime()) / DAY_MS)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return then.toLocaleDateString(undefined, { weekday: 'long' })
  return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function boughtLabel(iso: string, now = new Date()): string {
  return `Bought ${dayLabel(new Date(iso), now)}`
}

export function usedLabel(iso: string, now = new Date()): string {
  return `Used ${dayLabel(new Date(iso), now)}`
}

export function askedLabel(iso: string, now = new Date()): string {
  const then = new Date(iso)
  const mins = Math.round((now.getTime() - then.getTime()) / 60_000)
  if (mins < 1) return 'Asked just now'
  if (mins < 60) return `Asked ${mins} min ago`
  const hours = Math.round(mins / 60)
  if (startOfDay(now).getTime() === startOfDay(then).getTime() || hours <= 12)
    return `Asked ${hours} hour${hours === 1 ? '' : 's'} ago`
  return `Asked ${dayLabel(then, now)}`
}

/** "4 rewards enjoyed since July" — the shelf's one summary line. */
export function enjoyedSince(count: number, earliestIso: string, now = new Date()): string {
  const then = new Date(earliestIso)
  const sameYear = then.getFullYear() === now.getFullYear()
  const month = then.toLocaleDateString(undefined, {
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
  return `${count} reward${count === 1 ? '' : 's'} enjoyed since ${month}`
}
