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
   story wires the tap + XP flight. */
export function TaskCard({ task }: TaskCardProps) {
  const done = task.status === 'completed'
  const overdue = isOverdue(task.dueDate, task.status)
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'
  const label = dueLabel(task.dueDate)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
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
        style={{
          width: 4,
          alignSelf: 'stretch',
          borderRadius: 2,
          background: spine,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 17,
            fontWeight: 600,
            lineHeight: 1.3,
            display: 'block',
            color: done ? 'var(--muted-foreground)' : 'var(--foreground)',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          {overdue && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--error)',
                color: 'var(--error-foreground)',
                borderRadius: 6,
                padding: '2px 7px',
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.06em',
                lineHeight: 1,
              }}
            >
              OVERDUE
            </span>
          )}
          {label && !done && (
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                color: overdue ? 'var(--error)' : 'var(--muted-foreground)',
              }}
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
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--success)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 17,
            flexShrink: 0,
          }}
        >
          ✓
        </div>
      ) : (
        <div
          aria-hidden
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2.5px solid var(--border)',
            flexShrink: 0,
          }}
        />
      )}
    </div>
  )
}
