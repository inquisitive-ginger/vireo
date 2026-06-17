import { Badge } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { isOverdue, dueLabel } from '../lib/dates'
import { XpPill } from './XpPill'

export interface TaskCardProps {
  task: ChoreTask
}

/* Taskee card — STATUS-encoded (design-system "Status vs identity colour").
   The owner is always the viewer here, so identity hue carries no information:
   the 4px spine and accents encode status only (neutral / red=overdue /
   green=done). The 40px circle is the completion target; the Completion Flow
   story wires the tap + XP flight.

   Chrome (card surface, radius, shadow, dimensions) is inline `var(--token)`
   styling — the first-party-plugin convention (mirrors FeedPostCard); typography
   uses the shared scale utilities. */
export function TaskCard({ task }: TaskCardProps) {
  const done = task.status === 'completed'
  const overdue = isOverdue(task.dueDate, task.status)
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'
  const label = dueLabel(task.dueDate)

  return (
    <div
      className="flex items-center gap-3"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-card)',
        padding: '14px 16px 14px 14px',
        opacity: done ? 0.66 : 1,
      }}
    >
      <span
        aria-hidden
        className="shrink-0"
        style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: spine }}
      />
      <div className="min-w-0 flex-1">
        <span
          className="text-card-title"
          style={{
            display: 'block',
            color: done ? 'var(--muted-foreground)' : 'var(--foreground)',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </span>
        <div className="mt-1 flex items-center gap-2">
          {overdue && <Badge variant="destructive">Overdue</Badge>}
          {label && !done && (
            <span
              className="text-sm-token"
              style={{ color: overdue ? 'var(--error)' : 'var(--muted-foreground)' }}
            >
              {label}
            </span>
          )}
          <XpPill value={task.xpReward} earned={done} />
        </div>
      </div>
      {done ? (
        <div
          aria-hidden
          className="flex shrink-0 items-center justify-center text-card-title"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--success)',
            color: 'white',
          }}
        >
          ✓
        </div>
      ) : (
        <div
          aria-hidden
          className="shrink-0"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2.5px solid var(--border)',
          }}
        />
      )}
    </div>
  )
}
