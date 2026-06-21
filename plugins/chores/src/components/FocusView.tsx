import { useRef, useState } from 'react'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import { PageHeader } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { isOverdue, dueLabel } from '../lib/dates'
import { ScorePlate } from './ScorePlate'
import { FlightChip } from './FlightChip'
import { useXpFlight } from '../lib/use-xp-flight'
import { GOLD_INK, GOLD_TINT } from '../lib/gold'

export interface FocusViewProps {
  /** The active profile's own tasks. */
  tasks: ChoreTask[]
  /** Persist the completion. Rejects to revert the optimistic flight. Omitted in
      Storybook → the flight runs locally with no network. */
  onCompleteTask?: (taskId: string) => Promise<unknown>
  /** Persisted lifetime XP seed (GET /api/chores/xp). */
  initialXp?: number
}

/* Most urgent first — overdue, then earliest due, then undated (design §1, the
   hero "Next up" auto-surfaces the most urgent / overdue). */
function byUrgency(a: ChoreTask, b: ChoreTask): number {
  const oa = isOverdue(a.dueDate, a.status) ? 0 : 1
  const ob = isOverdue(b.dueDate, b.status) ? 0 : 1
  if (oa !== ob) return oa - ob
  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
  if (a.dueDate) return -1
  if (b.dueDate) return 1
  return 0
}

/* The Focus taskee variant (design §1, "Spotlight" — gated 2026-06-20 Focus Mode).
   One obvious next action: a single hero "Next up" card with a big green Mark done,
   the rest collapsed to quiet "Coming up" / "Done" disclosure rows. Minimises
   executive-function load (younger / ADHD). Shares the XP flight engine with the
   Agency `TaskeeView` (`useXpFlight`): the hero's gold XP chip is the flight's
   launch point; on landing the plate banks and the next task promotes to hero. */
export function FocusView({ tasks, onCompleteTask, initialXp }: FocusViewProps) {
  const { plateRef, lifetime, flights, handleComplete, onFlightDone, effectiveStatus } =
    useXpFlight({ tasks, onCompleteTask, initialXp })

  // Hero promotes on landing: an in-flight task is still "not completed", so it
  // holds the hero slot through the flight (design §2 "the card does not change
  // during the flight") and only yields once it banks.
  const pending = tasks.filter((t) => effectiveStatus(t) !== 'completed').sort(byUrgency)
  const completed = tasks.filter((t) => effectiveStatus(t) === 'completed')
  const [hero, ...rest] = pending

  const done = completed.length
  const total = tasks.length
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <div className="mx-auto max-w-[680px] px-6 pt-7 pb-12">
      <PageHeader title="Chores" action={<ScorePlate ref={plateRef} value={lifetime} />} />

      {/* Progress line + bar (design §1 taskee header — shared with Agency). */}
      <div className="mb-5">
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

      {hero ? (
        <HeroCard
          key={hero.id}
          task={hero}
          inFlight={effectiveStatus(hero) === 'inFlight'}
          onComplete={handleComplete}
        />
      ) : (
        <AllDone />
      )}

      <CollapsibleSection label="Coming up" tasks={rest} />
      <CollapsibleSection label="Done" tasks={completed} />

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

/* The hero "Next up" card. The gold XP chip is the flight's launch point (it
   lifts off on tap, mirroring the Agency badge); the big green Mark done is the
   tap target (design §2 "focus = green Mark done button"). */
function HeroCard({
  task,
  inFlight,
  onComplete,
}: {
  task: ChoreTask
  inFlight: boolean
  onComplete: (taskId: string, badgeRect: DOMRect) => void
}) {
  const overdue = isOverdue(task.dueDate, task.status)
  const label = dueLabel(task.dueDate)
  const chipRef = useRef<HTMLSpanElement>(null)

  function handleClick() {
    const rect = chipRef.current?.getBoundingClientRect()
    if (rect) onComplete(task.id, rect)
  }

  return (
    <div
      className="rounded-[18px] border bg-card p-[22px] shadow-[var(--shadow-card)]"
      style={{
        borderColor: overdue
          ? 'color-mix(in oklch, var(--error) 35%, var(--border))'
          : 'var(--border)',
      }}
    >
      <span className="text-section-label text-muted-foreground">Next up</span>
      <h2
        className="mt-1.5 font-semibold text-foreground"
        style={{ fontSize: 26, lineHeight: 1.15 }}
      >
        {task.title}
      </h2>
      <div className="mt-3 mb-5 flex flex-wrap items-center gap-2">
        {label && (
          <span
            className="text-sm-token inline-flex items-center rounded-full px-2.5 py-0.5 font-medium"
            style={{
              background: overdue
                ? 'color-mix(in oklch, var(--error) 12%, transparent)'
                : 'var(--muted)',
              color: overdue ? 'var(--error)' : 'var(--muted-foreground)',
            }}
          >
            {overdue ? `Overdue · ${label}` : label}
          </span>
        )}
        {/* The XP chip is the flight's launch point — hidden while airborne. */}
        <span
          ref={chipRef}
          className={`text-sm-token inline-flex items-center rounded-full px-2.5 py-0.5 font-bold ${inFlight ? 'invisible' : 'visible'}`}
          style={{ background: GOLD_TINT, color: GOLD_INK }}
        >
          +{task.xpReward} XP
        </span>
      </div>
      <button
        type="button"
        onClick={inFlight ? undefined : handleClick}
        disabled={inFlight}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-success py-4 text-base font-semibold text-success-foreground shadow-[var(--shadow-card)] transition-transform active:scale-[0.98] disabled:opacity-60"
        aria-label={`Mark “${task.title}” done`}
      >
        <Check size={20} strokeWidth={3} />
        Mark done
      </button>
    </div>
  )
}

/* Quiet, collapsed secondary section (Coming up / Done). Collapsed by default so
   the hero stays the single focus; tap to reveal the mini-rows. */
function CollapsibleSection({ label, tasks }: { label: string; tasks: ChoreTask[] }) {
  const [open, setOpen] = useState(false)
  if (tasks.length === 0) return null
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-section-label flex w-full items-center gap-1.5 py-2 text-muted-foreground"
        aria-expanded={open}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {label} · {tasks.length}
      </button>
      {open && (
        <div className="flex flex-col gap-1.5 pt-1">
          {tasks.map((t) => (
            <MiniRow key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  )
}

function MiniRow({ task }: { task: ChoreTask }) {
  const done = task.status === 'completed'
  const overdue = isOverdue(task.dueDate, task.status)
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'
  const label = dueLabel(task.dueDate)
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
      style={{ background: 'var(--muted)' }}
    >
      <span
        aria-hidden
        className="w-1 shrink-0 self-stretch rounded-sm"
        style={{ background: spine }}
      />
      <span
        className={`text-sm-token min-w-0 flex-1 truncate ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
      >
        {task.title}
      </span>
      {!done && label && (
        <span
          className={`text-xs-token shrink-0 ${overdue ? 'text-error' : 'text-muted-foreground'}`}
        >
          {label}
        </span>
      )}
      <span
        className="text-xs-token shrink-0 font-bold"
        style={{ color: done ? 'var(--success)' : GOLD_INK }}
      >
        {done ? `✓ +${task.xpReward}` : `+${task.xpReward}`}
      </span>
    </div>
  )
}

/* Empty payoff — the hero is replaced by the celebration (design §1). */
function AllDone() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[18px] border border-border bg-card py-14 text-center shadow-[var(--shadow-card)]">
      <span style={{ fontSize: 40 }} aria-hidden>
        🎉
      </span>
      <span className="text-card-title text-foreground">All done today</span>
    </div>
  )
}
