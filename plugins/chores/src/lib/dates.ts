import { isSameDay, relativeDayLabel, startOfDay } from '@family-os/ui'

/* Due-date helpers. `due_date` is a calendar day (no time) — overdue means the
   due day is strictly before today. */

/** A pending task whose due day is before today. Completed tasks are never overdue. */
export function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status === 'completed') return false
  const due = new Date(`${dueDate}T00:00:00`)
  return due.getTime() < startOfDay(new Date()).getTime()
}

/** Whether a timestamp (e.g. `completedAt`) falls on today's local calendar day. */
export function isToday(iso: string | null): boolean {
  if (!iso) return false
  return isSameDay(new Date(iso), new Date())
}

/** Short, human due-date label: "Today", "Tomorrow", weekday, or "Mon D". */
export function dueLabel(dueDate: string | null): string | null {
  if (!dueDate) return null
  return relativeDayLabel(new Date(`${dueDate}T00:00:00`)).lead
}

/** When a completed task was done: time of day if today ("7:42 PM"), else
    "yesterday", a weekday, or "Mon D". */
export function doneLabel(completedAt: string | null): string | null {
  if (!completedAt) return null
  const at = new Date(completedAt)
  if (isSameDay(at, new Date())) {
    return at.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }
  const { lead } = relativeDayLabel(at, new Date(), { direction: 'backward' })
  return lead === 'Yesterday' ? 'yesterday' : lead
}

/** Today as a local date key (`YYYY-MM-DD`) — sent as `?today=` so routine
    occurrences materialize against the household's day, not the server's UTC one. */
export function todayKey(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}
