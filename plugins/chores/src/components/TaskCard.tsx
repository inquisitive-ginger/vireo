import { useRef } from 'react'
import { Badge, CompletionToggle, Spine } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { isOverdue, dueLabel } from '../lib/dates'
import { XpPill } from './XpPill'

/** Display status drives the card: `inFlight` is the brief window during the XP
    flight — the card holds its pending shape but the badge has "lifted off". */
export type TaskDisplayStatus = 'pending' | 'inFlight' | 'completed'

export interface TaskCardProps {
  task: ChoreTask
  /** Overrides `task.status` during the optimistic flight. Defaults to it. */
  displayStatus?: TaskDisplayStatus
  /** When provided, a pending task shows a tappable completion circle. The rect
      is the live position of the XP badge — the flight's launch point. */
  onComplete?: (taskId: string, badgeRect: DOMRect) => void
}

/* Taskee card — STATUS-encoded (design-system "Status vs identity colour").
   The owner is always the viewer here, so identity hue carries no information:
   the 4px spine and accents encode status only (neutral / red=overdue /
   green=done). The 40px circle is the completion target; tapping it launches the
   XP flight (design §2) — the badge lifts off and the card holds still until the
   chip lands.

   Styled utility-first like the shell (ADR 035); only genuinely dynamic values
   (status-driven spine/text color, optimistic opacity) stay inline. */
export function TaskCard({ task, displayStatus, onComplete }: TaskCardProps) {
  const status = displayStatus ?? (task.status as TaskDisplayStatus)
  const done = status === 'completed'
  const inFlight = status === 'inFlight'
  const overdue = !done && !inFlight && isOverdue(task.dueDate, task.status)
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'
  const label = dueLabel(task.dueDate)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const completable = status === 'pending' && !!onComplete

  function handleComplete() {
    const rect = badgeRef.current?.getBoundingClientRect()
    if (rect) onComplete?.(task.id, rect)
  }

  return (
    <div
      className="flex items-center gap-3 rounded-[14px] border border-border bg-card py-3.5 pr-4 pl-3.5 shadow-[var(--shadow-card)] transition-opacity duration-200"
      style={{ opacity: done ? 0.66 : 1 }}
    >
      <Spine color={spine} />
      <div className="min-w-0 flex-1">
        <span
          className={`text-card-title block ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
        >
          {task.title}
        </span>
        <div className="mt-1 flex items-center gap-2">
          {overdue && <Badge variant="destructive">Overdue</Badge>}
          {label && !done && (
            <span className={`text-sm-token ${overdue ? 'text-error' : 'text-muted-foreground'}`}>
              {label}
            </span>
          )}
          {/* Badge is the flight's launch point — hidden while airborne. */}
          <span ref={badgeRef} className={inFlight ? 'invisible' : 'visible'}>
            <XpPill value={task.xpReward} earned={done} />
          </span>
        </div>
      </div>
      <CompletionToggle
        checked={done}
        size={40}
        muted={inFlight}
        onToggle={completable ? handleComplete : undefined}
        label={`Mark “${task.title}” done`}
      />
    </div>
  )
}
