const pad = (n: number) => String(n).padStart(2, '0')

export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const fromDateKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** The week runs Sunday → Saturday (design.md's "Aug 9–15" is a Sun–Sat span). */
export function weekStart(now: Date, offsetWeeks = 0): Date {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  start.setDate(start.getDate() + offsetWeeks * 7)
  return start
}

export function weekDays(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

const monthLong = (d: Date) => d.toLocaleDateString('en-US', { month: 'long' })

/** The page title — the calendar week view's title grammar verbatim
    ("August 9 – 15"), so the two week surfaces read as one pattern. */
export function weekRangeLabel(start: Date): string {
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  if (start.getMonth() === end.getMonth()) {
    return `${monthLong(start)} ${start.getDate()} – ${end.getDate()}`
  }
  return `${monthLong(start)} ${start.getDate()} – ${monthLong(end)} ${end.getDate()}`
}
