/* Due-date helpers. `due_date` is a calendar day (no time) — overdue means the
   due day is strictly before today. */

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** A pending task whose due day is before today. Completed tasks are never overdue. */
export function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status === 'completed') return false
  const due = new Date(`${dueDate}T00:00:00`)
  return due.getTime() < startOfToday().getTime()
}

/** Short, human due-date label: "Today", "Tomorrow", weekday, or "Mon D". */
export function dueLabel(dueDate: string | null): string | null {
  if (!dueDate) return null
  const due = new Date(`${dueDate}T00:00:00`)
  const today = startOfToday()
  const dayMs = 86_400_000
  const days = Math.round((due.getTime() - today.getTime()) / dayMs)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days > 1 && days < 7) return due.toLocaleDateString(undefined, { weekday: 'long' })
  return due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
