import { forwardRef, type ReactNode } from 'react'
import { CoinValue } from '@family-os/ui'
import { isReopened, type ChoreTask } from '../types'
import { isOverdue, dueLabel } from '../lib/dates'
import { showCoinReward } from '../lib/flags'
import type { KidPayoutView } from '../lib/payouts'
import { XpPill } from './XpPill'
import { KidPayoutBadge } from './KidPayoutBadge'
import { ReopenedBadge } from './ReopenedBadge'

/* The two halves of a task row's meta, shared so Focus and Agency stop drifting
   (they had different overdue/date/XP treatments). The principle: a chip is a
   collectible REWARD — nothing else wears the pill.

   `TaskStatusLine` — the row's STATE + timing, as colour-coded text, never a pill:
   Overdue folds the date into one red phrase (the spine/border already carries the
   alarm colour on the taskee cards, so no red badge), a future date is muted, and a
   reopened task leads with the amber Redo tag. Nothing on a completed row (the struck
   title + check already say it).

   `TaskReward` — the REWARD group: F$ (the one chip) then XP (the quiet star, ADR
   051). The XP element takes the forwarded ref because it is the flight's launch
   point on the taskee surfaces. */

export function TaskStatusLine({ task, className }: { task: ChoreTask; className?: string }) {
  if (task.status === 'completed') return null

  const reopened = isReopened(task)
  const overdue = isOverdue(task.dueDate, task.status)
  const label = dueLabel(task.dueDate)

  let timing: ReactNode = null
  if (overdue) {
    timing = (
      <span className="text-sm-token font-semibold text-error">
        Overdue{label ? ` · ${label}` : ''}
      </span>
    )
  } else if (label) {
    timing = <span className="text-sm-token text-muted-foreground">Due {label}</span>
  }

  if (!reopened && !timing) return null

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className ?? ''}`}>
      {reopened && <ReopenedBadge />}
      {timing}
    </div>
  )
}

export interface TaskRewardProps {
  task: ChoreTask
  done: boolean
  /** Hide the XP while the flight chip is airborne (taskee surfaces). */
  inFlight?: boolean
  /** The completed-card F$ state (held / earned / declined); null on a pending row. */
  payoutView: KidPayoutView
  className?: string
}

export const TaskReward = forwardRef<HTMLSpanElement, TaskRewardProps>(function TaskReward(
  { task, done, inFlight, payoutView, className },
  xpRef
) {
  return (
    <div className={`flex shrink-0 items-center gap-2.5 ${className ?? ''}`}>
      {/* F$ leads — the coin is what a kid can spend. Pending shows the promise, a
          done card shows the held/earned/declined outcome. */}
      {!done && showCoinReward(task.coinReward) && <CoinValue value={task.coinReward} size={16} />}
      <KidPayoutBadge view={payoutView} />
      {/* XP second, always — the quiet star, and the flight's launch point. */}
      <span ref={xpRef} className={inFlight ? 'invisible' : 'visible'}>
        <XpPill value={task.xpReward} earned={done} />
      </span>
    </div>
  )
})
