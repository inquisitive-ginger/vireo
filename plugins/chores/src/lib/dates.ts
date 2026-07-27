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
