import { useRef } from 'react'
import { Button, CompletionToggle, FAMILY_HUE, ItemCard, identityToken } from '@family-os/ui'
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
  /** This completion instance's held/decided P-Bucks payout (M4/3b), if any — drives the
      "when Mom or Dad checks" / "No P-Bucks this time" state on a done card. */
  payout?: PendingPayout
  /** Claim an up-for-grabs task (assignee null) for the viewer. When the task is
      unowned and this is provided, the completion circle gives way to "I'll do it" —
      claiming is the first half of doing; the check appears once it's yours. */
  onClaim?: (taskId: string) => void
}

/* Taskee card — STATUS-encoded (design-system "Status vs identity colour").
   The owner is always the viewer here, so identity hue carries no information:
   the 4px spine encodes status only (neutral / red=overdue / green=done). The
   40px circle is the completion target; tapping it launches the XP flight
   (design §2) — the badge lifts off and the card holds still until the chip lands.

   Layout follows the "chip = reward" system (see `TaskMeta`): the STATE + timing
   sit left in the content column as colour-coded text; the REWARD group (P-Bucks chip +
   quiet XP) sits in the trailing cluster, vertically centred with the completion
   circle — once the reward crosses to the right edge, the circle is its alignment
   context, not the status baseline.

   Styled utility-first like the shell (ADR 035); only genuinely dynamic values
   (status-driven spine color, optimistic opacity) stay inline. */
export function TaskCard({ task, displayStatus, onComplete, payout, onClaim }: TaskCardProps) {
  const status = displayStatus ?? (task.status as TaskDisplayStatus)
  const done = status === 'completed'
  // Held / earned / declined P-Bucks for a done paying chore (M4/3b). Derived from the
  // task so it is right the instant a completion lands (no wait on the payout row).
  const payoutView = done && REWARDS_UI_ENABLED ? kidPayoutView(task, payout) : null
  const inFlight = status === 'inFlight'
  const overdue = !done && !inFlight && isOverdue(task.dueDate, task.status)
  // Up for grabs: not the viewer's, so this is the one taskee card whose spine is
  // not a status — it belongs to the household until claimed (Hearth, ADR 041).
  const upForGrabs = !done && task.assigneeId === null
  const spine = done
    ? 'var(--success)'
    : upForGrabs
      ? identityToken(FAMILY_HUE)
      : overdue
        ? 'var(--error)'
        : 'var(--border)'
  const badgeRef = useRef<HTMLSpanElement>(null)
  const completable = status === 'pending' && !upForGrabs && !!onComplete

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
          {upForGrabs && onClaim ? (
            <Button size="sm" variant="outline" onClick={() => onClaim(task.id)}>
              I&rsquo;ll do it
            </Button>
          ) : (
            <CompletionToggle
              checked={done}
              size={40}
              muted={inFlight}
              onToggle={completable ? handleComplete : undefined}
              label={`Mark “${task.title}” done`}
            />
          )}
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
