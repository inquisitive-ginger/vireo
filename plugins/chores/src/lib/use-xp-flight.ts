import { useCallback, useRef, useState } from 'react'
import type { ChoreTask } from '../types'
import type { TaskDisplayStatus } from '../components/TaskCard'
import { usePrefersReducedMotion } from './use-reduced-motion'

type Override = 'inFlight' | 'done'

interface Flight {
  taskId: string
  from: DOMRect
  to: DOMRect
  value: number
}

interface UseXpFlightOptions {
  tasks: ChoreTask[]
  /** Persist the completion. Resolves on success, rejects to revert the optimistic
      UI. Omitted in Storybook → the flight runs locally with no network. */
  onCompleteTask?: (taskId: string) => Promise<unknown>
  /** Persisted lifetime XP total (GET /api/chores/xp). Seeds the plate once on
      mount; subsequent fetches do not re-seed (would double-count in-session
      completions). Falls back to the sum of already-completed tasks. */
  initialXp?: number
}

/* The XP-flight engine shared by both taskee variants (Agency `TaskeeView` and
   Focus `FocusView`). Owns the optimistic completion state machine
   (`pending → inFlight → done+banked`), the lifetime score, the airborne chips,
   and the reduced-motion / off-screen-plate quiet-bank edge (design §2). Each
   view supplies its own launch point (Agency = the card's XP badge; Focus = the
   hero card's XP chip) and renders its own `FlightChip`s from `flights`. */
export function useXpFlight({ tasks, onCompleteTask, initialXp }: UseXpFlightOptions) {
  const reduced = usePrefersReducedMotion()
  const plateRef = useRef<HTMLDivElement>(null)

  const [lifetime, setLifetime] = useState(
    () =>
      initialXp ??
      tasks.filter((t) => t.status === 'completed').reduce((sum, t) => sum + t.xpReward, 0)
  )

  const [overrides, setOverrides] = useState<Record<string, Override>>({})
  const overridesRef = useRef(overrides)
  overridesRef.current = overrides
  const [flights, setFlights] = useState<Flight[]>([])

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

  const effectiveStatus = useCallback(
    (task: ChoreTask): TaskDisplayStatus => {
      const o = overrides[task.id]
      if (o === 'done') return 'completed'
      if (o === 'inFlight') return 'inFlight'
      return task.status as TaskDisplayStatus
    },
    [overrides]
  )

  return { plateRef, lifetime, flights, handleComplete, onFlightDone, effectiveStatus }
}
