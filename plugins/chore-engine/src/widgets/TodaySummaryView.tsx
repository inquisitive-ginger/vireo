import { CheckSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, ProfileAvatar, getIdentityHue, identityColor } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { isOverdue } from '../lib/dates'
import { GOLD, GOLD_DEEP, GOLD_HI, GOLD_INK, GOLD_TINT } from '../lib/gold'

/* ---- helpers ---------------------------------------------------------------- */

function todayPending(tasks: ChoreTask[]): ChoreTask[] {
  return tasks.filter((t) => t.status === 'pending')
}

function todayCompleted(tasks: ChoreTask[]): ChoreTask[] {
  return tasks.filter((t) => t.status === 'completed')
}

function overdueCount(tasks: ChoreTask[]): number {
  return tasks.filter((t) => isOverdue(t.dueDate, t.status)).length
}

/* ---- widget header ---------------------------------------------------------- */

/* CheckSquare + "CHORES" in --accent (widget identity header — design-system.md). */
function WidgetHeader() {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <CheckSquare size={13} style={{ color: 'var(--accent)' }} aria-hidden />
      <span className="text-section-label" style={{ color: 'var(--accent)' }}>
        Chores
      </span>
    </div>
  )
}

/* ---- mini score plate ------------------------------------------------------- */

/* Compact coin for the taskee widget — same gold semantic as ScorePlate on the
   full page (design §4 "gold coin score"). No animation in the widget (read-only
   MVP); the flight target lives on the full-page score plate. */
function MiniCoinScore({ value }: { value: number }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full"
      style={{
        padding: '4px 10px 4px 8px',
        background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD_TINT})`,
        border: `1px solid ${GOLD}`,
        boxShadow: '0 1px 2px oklch(0 0 0 / 0.06)',
      }}
    >
      <span
        className="grid size-[16px] shrink-0 place-items-center rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 30%, ${GOLD_HI}, ${GOLD} 70%, ${GOLD_DEEP})`,
          color: GOLD_DEEP,
        }}
        aria-hidden
      >
        <span style={{ fontSize: 8, fontWeight: 700 }}>★</span>
      </span>
      <span className="text-card-title leading-none" style={{ color: GOLD_INK, fontWeight: 700 }}>
        {value.toLocaleString()}
      </span>
      <span
        className="text-xs-token font-bold tracking-[0.04em] opacity-70"
        style={{ color: GOLD_INK }}
      >
        XP
      </span>
    </div>
  )
}

/* ---- count chip ------------------------------------------------------------- */

/* Labelled count chip used in the family framing (design §4 "labelled count chips
   — no bare trailing numbers"). The chip text is always label + count together. */
function CountChip({
  label,
  count,
  variant = 'neutral',
}: {
  label: string
  count: number
  variant?: 'neutral' | 'error' | 'success'
}) {
  const bg =
    variant === 'error'
      ? 'color-mix(in oklch, var(--error) 10%, transparent)'
      : variant === 'success'
        ? 'color-mix(in oklch, var(--success) 10%, transparent)'
        : 'var(--muted)'
  const fg =
    variant === 'error'
      ? 'var(--error)'
      : variant === 'success'
        ? 'var(--success)'
        : 'var(--muted-foreground)'
  return (
    <span
      className="text-xs-token inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold"
      style={{ background: bg, color: fg }}
    >
      {count} {label}
    </span>
  )
}

/* ---- progress bar ----------------------------------------------------------- */

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className="h-[4px] overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-success"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${done} of ${total} tasks done`}
      />
    </div>
  )
}

/* ============================================================================ */
/* Taskee framing (tiers 1–3)                                                   */
/* ============================================================================ */

/* Compact 1×1 — just the count + empty signal. Nice-to-have per spec. */
function TaskeeCompact({ pending, total, tier }: { pending: number; total: number; tier: number }) {
  if (total === 0) {
    return (
      <div className="flex size-full flex-col" style={{ containerType: 'size' }}>
        <WidgetHeader />
        <div className="flex flex-1 items-center justify-center">
          <EmptyState heading={tier === 1 ? 'All done!' : 'No tasks'} compact />
        </div>
      </div>
    )
  }

  return (
    <div className="flex size-full flex-col" style={{ containerType: 'size' }}>
      <WidgetHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <span className="text-metric leading-none text-foreground">{pending}</span>
        <span className="text-sm-token text-muted-foreground">
          {pending === 1 ? 'task left' : 'tasks left'}
        </span>
      </div>
    </div>
  )
}

/* Standard 2×1 — count + peek (first 1-2 tasks) + progress bar + coin score. */
function TaskeeStandard({
  tasks,
  lifetimeXp,
  tier,
}: {
  tasks: ChoreTask[]
  lifetimeXp: number
  tier: number
}) {
  const pending = todayPending(tasks)
  const done = todayCompleted(tasks).length
  const total = tasks.length

  if (total === 0) {
    return (
      <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
        <WidgetHeader />
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            heading={tier === 1 ? 'All done!' : 'No tasks today'}
            body={tier === 1 ? 'Nothing today!' : undefined}
            compact
          />
        </div>
      </div>
    )
  }

  /* Peek: show up to 2 pending tasks (or done tasks if all done). */
  const peekTasks = pending.length > 0 ? pending.slice(0, 2) : tasks.slice(0, 2)

  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <WidgetHeader />
        <MiniCoinScore value={lifetimeXp} />
      </div>

      {/* Count headline */}
      <p className="text-card-title mb-2 text-foreground">
        {pending.length === 0
          ? '🎉 All done today'
          : `${pending.length} ${pending.length === 1 ? 'task' : 'tasks'} left today`}
      </p>

      {/* Task peek — status spine + title */}
      <div className="mb-3 flex flex-col gap-1.5">
        {peekTasks.map((t) => {
          const overdue = isOverdue(t.dueDate, t.status)
          const spine =
            t.status === 'completed' ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'
          return (
            <div key={t.id} className="flex items-center gap-2">
              <span
                aria-hidden
                className="shrink-0 self-stretch rounded-sm"
                style={{ width: 4, background: spine }}
              />
              <span
                className={`text-sm-token min-w-0 truncate ${t.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}
              >
                {t.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-auto">
        <p className="text-xs-token mb-1 text-muted-foreground">
          {done} of {total} done
        </p>
        <ProgressBar done={done} total={total} />
      </div>
    </div>
  )
}

/* Large 2×2 — full task list + progress bar + coin score. Fills height. */
function TaskeeLarge({
  tasks,
  lifetimeXp,
  tier,
}: {
  tasks: ChoreTask[]
  lifetimeXp: number
  tier: number
}) {
  const pending = todayPending(tasks)
  const done = todayCompleted(tasks).length
  const total = tasks.length

  if (total === 0) {
    return (
      <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
        <WidgetHeader />
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            heading={tier === 1 ? 'All done! Nothing today!' : 'No tasks scheduled today'}
            compact
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      {/* Header row: identity + score */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <WidgetHeader />
        <MiniCoinScore value={lifetimeXp} />
      </div>

      {/* Count headline */}
      <p className="text-card-title mb-3 text-foreground">
        {pending.length === 0
          ? '🎉 All done today'
          : `${pending.length} ${pending.length === 1 ? 'task' : 'tasks'} left today`}
      </p>

      {/* Task list — fills remaining height; shows up to ~5 without scroll */}
      <div className="mb-3 flex flex-col gap-2 overflow-hidden">
        {tasks.map((t) => {
          const overdue = isOverdue(t.dueDate, t.status)
          const spine =
            t.status === 'completed' ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'
          const rowBg = overdue
            ? 'color-mix(in oklch, var(--error) 8%, transparent)'
            : 'transparent'
          return (
            <div
              key={t.id}
              className="flex items-center gap-2.5 rounded-lg py-2 pr-2 pl-2"
              style={{ background: rowBg }}
            >
              <span
                aria-hidden
                className="h-full shrink-0 self-stretch rounded-sm"
                style={{ width: 4, minHeight: 20, background: spine }}
              />
              <div className="min-w-0 flex-1">
                <span
                  className={`text-base-token block truncate ${t.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                >
                  {t.title}
                </span>
              </div>
              {overdue && (
                <span
                  className="text-xs-token shrink-0 font-semibold"
                  style={{ color: 'var(--error)' }}
                >
                  Overdue
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress: grows to fill the bottom */}
      <div className="mt-auto">
        <p className="text-xs-token mb-1 text-muted-foreground">
          {done} of {total} done
        </p>
        <ProgressBar done={done} total={total} />
      </div>
    </div>
  )
}

/* ============================================================================ */
/* Family framing (tier 4 / family pseudo-profile)                              */
/* ============================================================================ */

/* Per-person row in the family summary. */
function FamilyPersonRow({ name, tasks }: { name: string; tasks: ChoreTask[] }) {
  const pending = tasks.filter((t) => t.status === 'pending').length
  const done = tasks.filter((t) => t.status === 'completed').length
  const overdue = overdueCount(tasks)
  const allDone = pending === 0 && tasks.length > 0
  const hue = getIdentityHue(name)

  return (
    <div
      className="flex items-center gap-2.5 rounded-lg px-2 py-2"
      style={
        overdue > 0
          ? { background: 'color-mix(in oklch, var(--error) 8%, transparent)' }
          : undefined
      }
    >
      {/* Identity spine */}
      <span
        aria-hidden
        className="shrink-0 self-stretch rounded-sm"
        style={{
          width: 4,
          minHeight: 20,
          background: identityColor(name, 'base'),
        }}
      />

      {/* Avatar + name */}
      <ProfileAvatar name={name} size="sm" identity={hue} />
      <span className="text-base-token min-w-0 flex-1 truncate font-medium text-foreground">
        {name}
      </span>

      {/* Count chips or "all done" state */}
      {allDone ? (
        <CountChip label="all done" count={done} variant="success" />
      ) : (
        <div className="flex items-center gap-1.5">
          {overdue > 0 && <CountChip label="overdue" count={overdue} variant="error" />}
          {pending > 0 && <CountChip label="left" count={pending} variant="neutral" />}
        </div>
      )}
    </div>
  )
}

/* Groups tasks by assignee. Returns [{name, tasks}] in insertion order. */
function groupByAssignee(tasks: ChoreTask[]): { name: string; tasks: ChoreTask[] }[] {
  const map = new Map<string, ChoreTask[]>()
  for (const t of tasks) {
    const key = t.assigneeName
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(t)
  }
  return Array.from(map.entries()).map(([name, ts]) => ({ name, tasks: ts }))
}

/* Standard 2×1 family — summary headline + up to 2 per-person rows. */
function FamilyStandard({ tasks }: { tasks: ChoreTask[] }) {
  const done = todayCompleted(tasks).length
  const total = tasks.length
  const overdue = overdueCount(tasks)
  const groups = groupByAssignee(tasks)

  if (total === 0) {
    return (
      <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
        <WidgetHeader />
        <div className="flex flex-1 items-center justify-center">
          <EmptyState heading="No tasks today" compact />
        </div>
      </div>
    )
  }

  /* Show up to 2 person rows in standard height. */
  const visibleGroups = groups.slice(0, 2)

  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      <WidgetHeader />

      {/* Summary headline */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="text-card-title text-foreground">
          {done} of {total} done today
        </p>
        {overdue > 0 && <CountChip label="overdue" count={overdue} variant="error" />}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <ProgressBar done={done} total={total} />
      </div>

      {/* Per-person rows */}
      <div className="flex flex-col gap-1">
        {visibleGroups.map(({ name, tasks: memberTasks }) => (
          <FamilyPersonRow key={name} name={name} tasks={memberTasks} />
        ))}
      </div>
    </div>
  )
}

/* Large 2×2 family — full per-person list, fills height. */
function FamilyLarge({ tasks }: { tasks: ChoreTask[] }) {
  const done = todayCompleted(tasks).length
  const total = tasks.length
  const overdue = overdueCount(tasks)
  const groups = groupByAssignee(tasks)

  if (total === 0) {
    return (
      <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
        <WidgetHeader />
        <div className="flex flex-1 items-center justify-center">
          <EmptyState heading="No tasks today" compact />
        </div>
      </div>
    )
  }

  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      <WidgetHeader />

      {/* Summary headline */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="text-card-title text-foreground">
          {done} of {total} done today
        </p>
        {overdue > 0 && <CountChip label="overdue" count={overdue} variant="error" />}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <ProgressBar done={done} total={total} />
      </div>

      {/* Per-person rows — grows to fill */}
      <div className="flex flex-col gap-1.5 overflow-hidden">
        {groups.map(({ name, tasks: memberTasks }) => (
          <FamilyPersonRow key={name} name={name} tasks={memberTasks} />
        ))}
      </div>
    </div>
  )
}

/* ============================================================================ */
/* Public: TodaySummaryView                                                     */
/* ============================================================================ */

export type WidgetSize = 'compact' | 'standard' | 'large'

export interface TodaySummaryViewProps {
  tasks: ChoreTask[]
  /** Active profile's tier — 1–3 → taskee framing; 4 or family → family framing. */
  tier: number
  /** Whether the active profile is the family pseudo-profile (shows family framing). */
  isFamily?: boolean
  size: WidgetSize
  /** Lifetime XP — local/optimistic via ScorePlate pattern (tiers 1–3 only). */
  lifetimeXp?: number
}

/* The pure view for `chores.today-summary`. No data fetching — the container
   (`TodaySummary.tsx`) owns that. The whole tile is wrapped in a Link so any tap
   deep-links into /chores (design §4 "read-only + tap-through in MVP").

   Size is conveyed via props rather than CSS container queries at this layer
   because the shell passes explicit size strings. The outermost `div` uses
   `container-type: size` so any future inner container queries work. */
export function TodaySummaryView({
  tasks,
  tier,
  isFamily = false,
  size,
  lifetimeXp = 0,
}: TodaySummaryViewProps) {
  const usesFamilyFraming = isFamily || tier >= 4

  const inner = usesFamilyFraming ? (
    size === 'large' ? (
      <FamilyLarge tasks={tasks} />
    ) : (
      <FamilyStandard tasks={tasks} />
    )
  ) : size === 'compact' ? (
    <TaskeeCompact pending={todayPending(tasks).length} total={tasks.length} tier={tier} />
  ) : size === 'large' ? (
    <TaskeeLarge tasks={tasks} lifetimeXp={lifetimeXp} tier={tier} />
  ) : (
    <TaskeeStandard tasks={tasks} lifetimeXp={lifetimeXp} tier={tier} />
  )

  return (
    <Link to="/chores" className="block size-full no-underline" aria-label="Open Chores">
      {inner}
    </Link>
  )
}
