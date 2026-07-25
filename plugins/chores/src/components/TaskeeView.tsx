import { useMemo, useRef } from 'react'
import { PageContainer, PageHeader } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { payoutForTask, type PayoutsByInstance } from '../lib/payouts'
import { TaskCard } from './TaskCard'
import { ScorePlate } from './ScorePlate'
import { FlightChip } from './FlightChip'
import { useXpFlight } from '../lib/use-xp-flight'

export interface TaskeeViewProps {
  /** The active profile's own tasks. */
  tasks: ChoreTask[]
  /** Persist the completion. Resolves on success, rejects to revert the optimistic
      UI. Omitted in Storybook → the flight runs locally with no network. */
  onCompleteTask?: (taskId: string) => Promise<unknown>
  /** Persisted lifetime XP total from GET /api/chores/xp. When provided this
      replaces the locally-derived seed (completed tasks sum). Seeded once on
      first render — not reactive to subsequent fetches, which would double-count
      in-session completions. */
  initialXp?: number
  /** Held/decided payouts keyed by completion instance (M4/3b). Empty when the
      earn UI is flagged off. */
  payoutIndex?: PayoutsByInstance
}

/* The taskee surface (tiers 1–3, Agency variant) — renders the full status-encoded
   list and the shared XP flight (design §2; the engine lives in `useXpFlight`).
   Header carries the lifetime score plate (the flight's landing target). On tap:
   the badge lifts off, a portal chip arcs to the plate, and on landing the card
   morphs to done while the plate banks + counts up. */
export function TaskeeView({ tasks, onCompleteTask, initialXp, payoutIndex }: TaskeeViewProps) {
  const { plateRef, lifetime, flights, handleComplete, onFlightDone, effectiveStatus } =
    useXpFlight({ tasks, onCompleteTask, initialXp })

  // Lock card order on first sight so a just-completed task morphs in place
  // (design §2 "the card does not reorder during the flight") even if a refetch
  // re-sorts completed-last underneath us.
  const orderRef = useRef<string[]>([])
  const ordered = useMemo(() => {
    for (const t of tasks) if (!orderRef.current.includes(t.id)) orderRef.current.push(t.id)
    const byId = new Map(tasks.map((t) => [t.id, t]))
    return orderRef.current.map((id) => byId.get(id)).filter((t): t is ChoreTask => !!t)
  }, [tasks])

  const done = ordered.filter((t) => effectiveStatus(t) === 'completed').length
  const total = ordered.length
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <PageContainer width="list">
      <PageHeader title="Chores" action={<ScorePlate ref={plateRef} value={lifetime} />} />

      {/* Progress line + bar (design §1 taskee header). */}
      <div className="mb-4">
        <p className="text-sm-token mb-2 text-muted-foreground">
          {done === total ? '🎉 All done today' : `${total - done} left · ${done} of ${total} done`}
        </p>
        <div className="h-meter overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-success transition-[width] duration-[var(--duration-slow)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-border pt-4">
        {ordered.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            displayStatus={effectiveStatus(t)}
            onComplete={handleComplete}
            payout={payoutIndex && payoutForTask(t, payoutIndex)}
          />
        ))}
      </div>

      {flights.map((flight) => (
        <FlightChip
          key={flight.taskId}
          from={flight.from}
          to={flight.to}
          value={flight.value}
          onDone={() => onFlightDone(flight)}
        />
      ))}
    </PageContainer>
  )
}
