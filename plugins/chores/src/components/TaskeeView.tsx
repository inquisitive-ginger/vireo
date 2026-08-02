import { useMemo, useRef, type ReactNode } from 'react'
import { PageContainer, PageHeader } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { payoutForTask, type PayoutsByInstance } from '../lib/payouts'
import { taskeeProgress } from '../lib/progress'
import { AllDone } from './AllDone'
import { TaskCard } from './TaskCard'
import { GrabsTray } from './GrabsTray'
import { CollapsibleSection } from './CollapsibleSection'
import { ScorePlate } from './ScorePlate'
import { FlightChip } from './FlightChip'
import { useXpFlight } from '../lib/use-xp-flight'

export interface TaskeeViewProps {
  /** The active profile's own tasks, plus anything up for grabs. */
  tasks: ChoreTask[]
  /** Persist the completion. Resolves on success, rejects to revert the optimistic
      UI. Omitted in Storybook → the flight runs locally with no network. */
  onCompleteTask?: (taskId: string) => Promise<unknown>
  /** Claim an up-for-grabs task — the offer board's "I'll do it". */
  onClaimTask?: (taskId: string) => Promise<unknown>
  /** Persisted lifetime XP total from GET /api/chores/xp. When provided this
      replaces the locally-derived seed (completed tasks sum). Seeded once on
      first render — not reactive to subsequent fetches, which would double-count
      in-session completions. */
  initialXp?: number
  /** Held/decided payouts keyed by completion instance (M4/3b). Empty when the
      earn UI is flagged off. */
  payoutIndex?: PayoutsByInstance
  /** The Today · Punch cards TabBar (M4/6) — rendered under the header. */
  tabBar?: ReactNode
}

/* The taskee surface (tiers 1–3, Agency variant) — renders the full status-encoded
   list and the shared XP flight (design §2; the engine lives in `useXpFlight`).
   Header carries the lifetime score plate (the flight's landing target). On tap:
   the badge lifts off, a portal chip arcs to the plate, and on landing the card
   morphs to done while the plate banks + counts up. */
export function TaskeeView({
  tasks,
  onCompleteTask,
  onClaimTask,
  initialXp,
  payoutIndex,
  tabBar,
}: TaskeeViewProps) {
  // Your list and the household's offer board are different kinds of thing (gate
  // D6): the meter, the flight, and the card list speak about YOUR work only;
  // unclaimed chores sit in the sunken tray below, and claiming moves one up here.
  const { own, grabs } = useMemo(
    () => ({
      own: tasks.filter((t) => t.assigneeId !== null),
      grabs: tasks.filter((t) => t.assigneeId === null && t.status === 'pending'),
    }),
    [tasks]
  )

  const { plateRef, lifetime, flights, handleComplete, onFlightDone, effectiveStatus } =
    useXpFlight({ tasks: own, onCompleteTask, initialXp })

  // Lock card order on first sight so a just-completed task morphs in place
  // (design §2 "the card does not reorder during the flight") even if a refetch
  // re-sorts completed-last underneath us.
  //
  // Only tasks still pending when first seen join that list, which is what keeps
  // the flight intact: a chore finished just now stays where it was and morphs to
  // done, while everything already completed on arrival is history and belongs in
  // the collapsed section instead of padding the list forever (auto-bug #82).
  const orderRef = useRef<string[]>([])
  const seenRef = useRef<Set<string>>(new Set())
  const { active, history } = useMemo(() => {
    for (const t of own) {
      if (seenRef.current.has(t.id)) continue
      seenRef.current.add(t.id)
      if (t.status !== 'completed') orderRef.current.push(t.id)
    }
    const byId = new Map(own.map((t) => [t.id, t]))
    const active = orderRef.current.map((id) => byId.get(id)).filter((t): t is ChoreTask => !!t)
    const activeIds = new Set(active.map((t) => t.id))
    const history = own
      .filter((t) => !activeIds.has(t.id))
      .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    return { active, history }
  }, [own])

  const { done, total, pct } = taskeeProgress(own, (t) => effectiveStatus(t) === 'completed')

  return (
    <PageContainer width="list">
      <PageHeader title="Chores" action={<ScorePlate ref={plateRef} value={lifetime} />} />
      {tabBar}

      {active.length > 0 ? (
        <>
          {/* Progress line + bar (design §1 taskee header). */}
          <div className="mb-4">
            <p className="text-sm-token mb-2 text-muted-foreground">
              {done === total
                ? '🎉 All done today'
                : `${total - done} left · ${done} of ${total} done`}
            </p>
            <div className="h-meter overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success transition-[width] duration-[var(--duration-slow)]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {active.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                displayStatus={effectiveStatus(t)}
                onComplete={handleComplete}
                payout={payoutIndex && payoutForTask(t, payoutIndex)}
              />
            ))}
          </div>
        </>
      ) : own.length > 0 || grabs.length === 0 ? (
        /* Nothing to do — a meter at 100% and a one-line "all done" is a thin
           payoff for having cleared the list, and it left the page empty. A kid
           with nothing assigned and offers waiting gets the board, not a
           celebration for work that never existed. */
        <AllDone
          note={
            history.length > 0
              ? `${history.length} ${history.length === 1 ? 'chore' : 'chores'} finished so far`
              : undefined
          }
        />
      ) : null}

      <GrabsTray
        tasks={grabs}
        onClaim={onClaimTask ? (taskId) => void onClaimTask(taskId) : undefined}
      />

      <CollapsibleSection
        label="Done"
        items={history}
        listClassName="flex flex-col gap-2.5 pt-1"
        renderItem={(t) => (
          <TaskCard
            key={t.id}
            task={t}
            displayStatus="completed"
            payout={payoutIndex && payoutForTask(t, payoutIndex)}
          />
        )}
      />

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
