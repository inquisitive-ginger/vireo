import { useRef } from 'react'
import { CompletionToggle, ItemCard } from '@family-os/ui'
import type { ChoreTask, PendingPayout } from '../types'
import { isOverdue } from '../lib/dates'
import { REWARDS_UI_ENABLED } from '../lib/flags'
import { kidPayoutView } from '../lib/payouts'
import { DeclinedNote } from './KidPayoutBadge'
import { TaskReward, TaskStatusLine } from './TaskMeta'

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
  /** This completion instance's held/decided F$ payout (M4/3b), if any — drives the
      "when Mom or Dad checks" / "No F$ this time" state on a done card. */
  payout?: PendingPayout
}

/* Taskee card — STATUS-encoded (design-system "Status vs identity colour").
   The owner is always the viewer here, so identity hue carries no information:
   the 4px spine encodes status only (neutral / red=overdue / green=done). The
   40px circle is the completion target; tapping it launches the XP flight
   (design §2) — the badge lifts off and the card holds still until the chip lands.

   Layout follows the "chip = reward" system (see `TaskMeta`): the STATE + timing
   sit left in the content column as colour-coded text; the REWARD group (F$ chip +
   quiet XP) sits in the trailing cluster, vertically centred with the completion
   circle — once the reward crosses to the right edge, the circle is its alignment
   context, not the status baseline.

   Styled utility-first like the shell (ADR 035); only genuinely dynamic values
   (status-driven spine color, optimistic opacity) stay inline. */
export function TaskCard({ task, displayStatus, onComplete, payout }: TaskCardProps) {
  const status = displayStatus ?? (task.status as TaskDisplayStatus)
  const done = status === 'completed'
  // Held / earned / declined F$ for a done paying chore (M4/3b). Derived from the
  // task so it is right the instant a completion lands (no wait on the payout row).
  const payoutView = done && REWARDS_UI_ENABLED ? kidPayoutView(task, payout) : null
  const inFlight = status === 'inFlight'
  const overdue = !done && !inFlight && isOverdue(task.dueDate, task.status)
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'
  const badgeRef = useRef<HTMLSpanElement>(null)
  const completable = status === 'pending' && !!onComplete

  function handleComplete() {
    const rect = badgeRef.current?.getBoundingClientRect()
    if (rect) onComplete?.(task.id, rect)
  }

  return (
    <ItemCard
      spine={spine}
      align="center"
      dimmed={done}
      className="transition-opacity duration-200"
      trailing={
        <div className="flex items-center gap-3">
          <TaskReward
            ref={badgeRef}
            task={task}
            done={done}
            inFlight={inFlight}
            payoutView={payoutView}
          />
          <CompletionToggle
            checked={done}
            size={40}
            muted={inFlight}
            onToggle={completable ? handleComplete : undefined}
            label={`Mark “${task.title}” done`}
          />
        </div>
      }
    >
      <div className="min-w-0 flex-1">
        <span
          className={`text-card-title block truncate ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
        >
          {task.title}
        </span>
        <TaskStatusLine task={task} className="mt-1" />
        <DeclinedNote view={payoutView} />
      </div>
    </ItemCard>
  )
}
