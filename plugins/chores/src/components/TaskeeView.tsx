import { useCallback, useMemo, useRef, useState } from 'react'
import { PageHeader } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { TaskCard, type TaskDisplayStatus } from './TaskCard'
import { ScorePlate } from './ScorePlate'
import { FlightChip } from './FlightChip'
import { usePrefersReducedMotion } from '../lib/use-reduced-motion'

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
}

type Override = 'inFlight' | 'done'
interface Flight {
  taskId: string
  from: DOMRect
  to: DOMRect
  value: number
}

/* The taskee surface (tiers 1–3, Agency variant) — owns the XP flight (design
   §2). Header carries the lifetime score plate (the flight's landing target);
   the list is status-encoded cards. On tap: the badge lifts off, a portal chip
   arcs to the plate, and on landing the card morphs to done while the plate
   banks + counts up. Reduced-motion or an off-screen plate → quiet bank. */
export function TaskeeView({ tasks, onCompleteTask, initialXp }: TaskeeViewProps) {
  const reduced = usePrefersReducedMotion()
  const plateRef = useRef<HTMLDivElement>(null)

  // Seeded once on mount. When initialXp is provided (persisted balance from
  // GET /api/chores/xp) it replaces the locally-derived fallback (sum of
  // already-completed tasks). Subsequent refetches do not re-seed to avoid
  // double-counting in-session completions.
  const [lifetime, setLifetime] = useState(
    () =>
      initialXp ??
      tasks.filter((t) => t.status === 'completed').reduce((sum, t) => sum + t.xpReward, 0)
  )

  const [overrides, setOverrides] = useState<Record<string, Override>>({})
  const overridesRef = useRef(overrides)
  overridesRef.current = overrides
  const [flights, setFlights] = useState<Flight[]>([])

  // Lock card order on first sight so a just-completed task morphs in place
  // (design §2 "the card does not reorder during the flight") even if a refetch
  // re-sorts completed-last underneath us.
  const orderRef = useRef<string[]>([])
  const ordered = useMemo(() => {
    for (const t of tasks) if (!orderRef.current.includes(t.id)) orderRef.current.push(t.id)
    const byId = new Map(tasks.map((t) => [t.id, t]))
    return orderRef.current.map((id) => byId.get(id)).filter((t): t is ChoreTask => !!t)
  }, [tasks])

  const setOverride = useCallback((id: string, value: Override | undefined) => {
    setOverrides((prev) => {
      const next = { ...prev }
      if (value) next[id] = value
      else delete next[id]
      return next
    })
  }, [])

  const handleComplete = useCallback(
    (taskId: string, badgeRect: DOMRect) => {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return
      const xp = task.xpReward

      const plateRect = plateRef.current?.getBoundingClientRect()
      const offscreen = !plateRect || plateRect.bottom < 0 || plateRect.top > window.innerHeight

      // Optimistic persistence — revert everything on failure.
      const persist = onCompleteTask?.(taskId) ?? Promise.resolve()
      persist.catch(() => {
        // If we'd already banked (quiet path or chip already landed), claw it back.
        if (overridesRef.current[taskId] === 'done') setLifetime((l) => l - xp)
        setOverride(taskId, undefined)
        setFlights((fs) => fs.filter((f) => f.taskId !== taskId))
      })

      if (reduced || offscreen) {
        // Quiet bank — morph + bank on tap, no airborne chip (design §2 edge).
        setOverride(taskId, 'done')
        setLifetime((l) => l + xp)
        return
      }

      setOverride(taskId, 'inFlight')
      setFlights((fs) => [...fs, { taskId, from: badgeRect, to: plateRect, value: xp }])
    },
    [tasks, onCompleteTask, reduced, setOverride]
  )

  const onFlightDone = useCallback(
    (flight: Flight) => {
      setOverride(flight.taskId, 'done')
      setLifetime((l) => l + flight.value)
      setFlights((fs) => fs.filter((f) => f !== flight))
    },
    [setOverride]
  )

  const done = ordered.filter((t) => effectiveStatus(t, overrides) === 'completed').length
  const total = ordered.length
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <div className="mx-auto max-w-[680px] px-6 pt-7 pb-12">
      <PageHeader title="Chores" action={<ScorePlate ref={plateRef} value={lifetime} />} />

      {/* Progress line + bar (design §1 taskee header). */}
      <div className="mb-4">
        <p className="text-sm-token mb-2 text-muted-foreground">
          {done === total ? '🎉 All done today' : `${total - done} left · ${done} of ${total} done`}
        </p>
        <div className="h-[5px] overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-success transition-[width] duration-[320ms]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-border pt-4">
        {ordered.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            displayStatus={effectiveStatus(t, overrides)}
            onComplete={handleComplete}
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
    </div>
  )
}

function effectiveStatus(task: ChoreTask, overrides: Record<string, Override>): TaskDisplayStatus {
  const o = overrides[task.id]
  if (o === 'done') return 'completed'
  if (o === 'inFlight') return 'inFlight'
  return task.status as TaskDisplayStatus
}
