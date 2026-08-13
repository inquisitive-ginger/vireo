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

const monthShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' })

export function weekRangeLabel(start: Date): string {
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  if (start.getMonth() === end.getMonth()) {
    return `${monthShort(start)} ${start.getDate()}–${end.getDate()}`
  }
  return `${monthShort(start)} ${start.getDate()} – ${monthShort(end)} ${end.getDate()}`
}

export function weekTitle(offsetWeeks: number, start: Date): string {
  if (offsetWeeks === 0) return 'This week'
  if (offsetWeeks === 1) return 'Next week'
  if (offsetWeeks === -1) return 'Last week'
  return `Week of ${monthShort(start)} ${start.getDate()}`
}
