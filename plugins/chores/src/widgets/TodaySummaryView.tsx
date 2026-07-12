import type { ReactNode } from 'react'
import { CheckSquare, Star, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  EmptyState,
  ProfileAvatar,
  Spine,
  WidgetHeader as UiWidgetHeader,
  WIDGET_CQ,
  identityToken,
  resolveHue,
} from '@family-os/ui'
import type { ChoreTask } from '../types'
import { isOverdue } from '../lib/dates'
import { GOLD, GOLD_DEEP, GOLD_HI, GOLD_INK, GOLD_TINT } from '../lib/gold'

/* `chores.today-summary` — taskee + family framings, three sizes.

   Visual direction: "Hero split" (design.md §4, gated 2026-06-20 Today Widget
   Rework). A big text-metric count anchors the glance; the taskee framing carries
   per-task +XP on filled rows, daily XP in the header, and the lifetime coin
   score; the family framing keeps identity (avatars/hues) and labelled chips, no
   XP. The Focus-mode "Next up" widget variant is owed to the Focus Mode session
   (it needs the per-profile focusMode setting to branch on). */

const OVERDUE_WASH = 'color-mix(in oklch, var(--error) 8%, transparent)'

/* Helpers */

function todayPending(tasks: ChoreTask[]): ChoreTask[] {
  return tasks.filter((t) => t.status === 'pending')
}

function todayCompleted(tasks: ChoreTask[]): ChoreTask[] {
  return tasks.filter((t) => t.status === 'completed')
}

function overdueCount(tasks: ChoreTask[]): number {
  return tasks.filter((t) => isOverdue(t.dueDate, t.status)).length
}

function spineColor(t: ChoreTask): string {
  if (t.status === 'completed') return 'var(--success)'
  return isOverdue(t.dueDate, t.status) ? 'var(--error)' : 'var(--border)'
}

/* Urgency order so that when a list is taller than the slot, the most important
   rows survive the clip: overdue → other pending → completed. */
function byUrgency(a: ChoreTask, b: ChoreTask): number {
  const rank = (t: ChoreTask) =>
    t.status === 'completed' ? 2 : isOverdue(t.dueDate, t.status) ? 0 : 1
  return rank(a) - rank(b)
}

/* Members with overdue work first, then most-pending — never hides anyone. */
function byMemberUrgency(a: { tasks: ChoreTask[] }, b: { tasks: ChoreTask[] }): number {
  const od = overdueCount(b.tasks) - overdueCount(a.tasks)
  if (od !== 0) return od
  const pending = (g: { tasks: ChoreTask[] }) =>
    g.tasks.filter((t) => t.status === 'pending').length
  return pending(b) - pending(a)
}

/* Shared chrome */

/* CheckSquare + "Chores" widget identity — the shared `WidgetHeader` primitive
   supplied with this module's glyph + label; the optional trailing slot carries the
   score / daily XP / overdue pill. */
function WidgetHeader({ trailing }: { trailing?: ReactNode }) {
  return <UiWidgetHeader icon={CheckSquare} label="Chores" trailing={trailing} />
}

/* The hero count — text-metric (the sanctioned widget-count token). */
function HeroCount({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-metric text-foreground">{value}</span>
      <span className="text-sm-token text-muted-foreground">{label}</span>
    </div>
  )
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-meter overflow-hidden rounded-full bg-muted">
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
      <span className="text-xs-token text-muted-foreground">
        {done} of {total} done today
      </span>
    </div>
  )
}

/* Lifetime XP coin (design §4 "gold coin score"). No animation in the read-only
   widget; the full-page ScorePlate is the flight target. */
function CoinScore({ value }: { value: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full"
      style={{ background: GOLD_TINT, padding: '4px 10px 4px 4px', border: `1px solid ${GOLD}` }}
    >
      <span
        className="grid size-5 shrink-0 place-items-center rounded-full"
        style={{
          background: `radial-gradient(circle at 34% 28%, ${GOLD_HI}, ${GOLD} 62%, ${GOLD_DEEP})`,
          boxShadow: 'inset 0 1px 1px oklch(1 0 0 / 0.4)',
        }}
        aria-hidden
      >
        <Star size={10} fill="white" style={{ color: 'white' }} />
      </span>
      <span className="inline-flex items-baseline gap-0.5">
        {/* Geometry-coupled: bold gold numeral, tight line-height, baseline-aligned to the coin. */}
        <span style={{ fontSize: 15, fontWeight: 700, color: GOLD_DEEP, lineHeight: 1 }}>
          {value.toLocaleString()}
        </span>
        <span className="text-xs-token font-bold tracking-[0.04em]" style={{ color: GOLD_INK }}>
          XP
        </span>
      </span>
    </span>
  )
}

/* Daily XP earned today (design §4 "daily XP (header)"). */
function DailyXp({ earned }: { earned: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <TrendingUp size={13} style={{ color: GOLD_DEEP }} aria-hidden />
      <span className="text-sm-token" style={{ color: GOLD_INK, lineHeight: 1 }}>
        <span className="font-bold">+{earned}</span> today
      </span>
    </span>
  )
}

function OverduePill({ n, soft = false }: { n: number; soft?: boolean }) {
  return (
    <span
      className="text-xs-token inline-flex items-center rounded-full px-2 py-0.5 font-bold"
      style={{
        background: soft ? OVERDUE_WASH : 'var(--error)',
        color: soft ? 'var(--error)' : 'var(--error-foreground)',
      }}
    >
      {n} overdue
    </span>
  )
}

/* Labelled count chip (design §4 "no bare trailing numbers"). */
function CountChip({ label, count }: { label: string; count: number }) {
  return (
    <span className="text-xs-token inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-semibold text-muted-foreground">
      {count} {label}
    </span>
  )
}

function AllDoneChip() {
  return (
    <span
      className="text-xs-token inline-flex items-center rounded-full px-2 py-0.5 font-bold"
      style={{
        background: 'color-mix(in oklch, var(--success) 12%, transparent)',
        color: 'var(--success)',
      }}
    >
      ✓ all done
    </span>
  )
}

/* Rows */

/* Taskee task row — filled (muted / overdue-wash) pill, status spine, +XP. */
function TaskRow({ task }: { task: ChoreTask }) {
  const done = task.status === 'completed'
  const overdue = isOverdue(task.dueDate, task.status)
  return (
    <div
      className="flex items-center gap-2.5 rounded-panel px-3"
      style={{
        minHeight: 44,
        background: overdue ? OVERDUE_WASH : 'var(--muted)',
        opacity: done ? 0.6 : 1,
      }}
    >
      <Spine color={spineColor(task)} inset />
      <span
        className={`text-sm-token min-w-0 flex-1 truncate ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
      >
        {task.title}
      </span>
      {overdue && (
        <span className="text-xs-token shrink-0 font-bold" style={{ color: 'var(--error)' }}>
          Overdue
        </span>
      )}
      <span className="text-sm-token shrink-0 font-bold" style={{ color: GOLD_INK }}>
        +{task.xpReward}
      </span>
    </div>
  )
}

/* Family person tile — identity SPINE + a real avatar (which may hold a photo) +
   name + count chips, on a filled row.

   This tile used to hand-roll its own initials circle from `identityToken(hue,
   'tint')`, which made the avatar the row's only hue carrier — so chores would
   have silently never shown a member's photo, and the moment it did, the tile
   would have lost its identity signal entirely. A photo is a face, not a colour
   token: the spine carries the hue, the avatar carries the face (ADR 042). */
function PersonTile({
  name,
  hue,
  avatarUrl,
  tasks,
}: {
  name: string
  hue: string | null
  avatarUrl: string | null
  tasks: ChoreTask[]
}) {
  const pending = tasks.filter((t) => t.status === 'pending').length
  const overdue = overdueCount(tasks)
  const allDone = pending === 0 && tasks.length > 0

  return (
    <div
      className="flex items-center gap-2.5 rounded-panel px-3"
      style={{
        minHeight: 48,
        background: overdue > 0 ? OVERDUE_WASH : 'var(--muted)',
        opacity: allDone ? 0.78 : 1,
      }}
    >
      <Spine color={identityToken(resolveHue(name, hue))} inset />
      <ProfileAvatar
        name={name}
        identity={resolveHue(name, hue)}
        avatarUrl={avatarUrl ?? undefined}
        size="sm"
        className="size-7"
      />
      <span className="text-base-token min-w-0 flex-1 truncate font-medium text-foreground">
        {name}
      </span>
      {allDone ? (
        <AllDoneChip />
      ) : (
        <>
          {overdue > 0 && <OverduePill n={overdue} soft />}
          {pending > 0 && <CountChip label="left" count={pending} />}
        </>
      )}
    </div>
  )
}

type MemberGroup = {
  name: string
  hue: string | null
  avatarUrl: string | null
  tasks: ChoreTask[]
}

function groupByAssignee(tasks: ChoreTask[]): MemberGroup[] {
  const map = new Map<string, MemberGroup>()
  for (const t of tasks) {
    let group = map.get(t.assigneeName)
    if (!group) {
      group = {
        name: t.assigneeName,
        hue: t.assigneeHue,
        avatarUrl: t.assigneeAvatarUrl,
        tasks: [],
      }
      map.set(t.assigneeName, group)
    }
    group.tasks.push(t)
  }
  return [...map.values()]
}

/* Shared empty frame: header (keeps the coin) + centered signal. */
function CenteredState({
  heading,
  body,
  trailing,
}: {
  heading: string
  body?: string
  trailing?: ReactNode
}) {
  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      <WidgetHeader trailing={trailing} />
      <div className="flex flex-1 items-center justify-center">
        <EmptyState heading={heading} body={body} compact />
      </div>
    </div>
  )
}

/* Taskee all-done — the daily payoff. A centered celebration that anchors the
   vertical center (slots fill height, so a bare label looked marooned), with the
   XP banked today. Compact drops the coin + earned line to fit the small slot. */
function TaskeeAllDone({
  lifetimeXp = 0,
  dailyXp = 0,
  compact = false,
}: {
  lifetimeXp?: number
  dailyXp?: number
  compact?: boolean
}) {
  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      <WidgetHeader trailing={compact ? undefined : <CoinScore value={lifetimeXp} />} />
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <span style={{ fontSize: compact ? 26 : 34, lineHeight: 1 }} aria-hidden>
          🎉
        </span>
        <span className="text-card-title text-foreground">All done today</span>
        {!compact && dailyXp > 0 && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full"
            style={{ background: GOLD_TINT, border: `1px solid ${GOLD}`, padding: '4px 12px' }}
          >
            <TrendingUp size={14} style={{ color: GOLD_DEEP }} aria-hidden />
            <span className="text-sm-token font-bold" style={{ color: GOLD_INK }}>
              +{dailyXp} XP earned today
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

/* Taskee framing (tiers 1–3) — Hero split */

function TaskeeCompact({
  tasks,
  tier,
}: {
  tasks: ChoreTask[]
  lifetimeXp: number
  dailyXp: number
  tier: number
}) {
  const pending = todayPending(tasks).length
  const done = todayCompleted(tasks).length
  const total = tasks.length

  if (total === 0) {
    return <CenteredState heading={tier === 1 ? 'All done!' : 'No tasks'} />
  }
  if (pending === 0) {
    return <TaskeeAllDone compact />
  }

  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      <WidgetHeader />
      <div className="mt-2 flex flex-1 flex-col justify-between">
        <HeroCount value={pending} label={pending === 1 ? 'task left today' : 'tasks left today'} />
        <ProgressBar done={done} total={total} />
      </div>
    </div>
  )
}

function TaskeeStandard({
  tasks,
  lifetimeXp,
  dailyXp,
  tier,
}: {
  tasks: ChoreTask[]
  lifetimeXp: number
  dailyXp: number
  tier: number
}) {
  const pending = todayPending(tasks)
  const total = tasks.length

  if (total === 0) {
    return (
      <CenteredState
        heading={tier === 1 ? 'All done!' : 'No tasks today'}
        trailing={<CoinScore value={lifetimeXp} />}
      />
    )
  }
  if (pending.length === 0) {
    return <TaskeeAllDone lifetimeXp={lifetimeXp} dailyXp={dailyXp} />
  }

  return (
    <div className="flex size-full flex-col p-5" style={{ containerType: 'size' }}>
      <WidgetHeader trailing={<CoinScore value={lifetimeXp} />} />
      <div className="mt-3 flex min-h-0 flex-1 gap-4">
        <div className="flex w-35 shrink-0 flex-col gap-2">
          <HeroCount
            value={pending.length}
            label={pending.length === 1 ? 'task left today' : 'tasks left today'}
          />
          {dailyXp > 0 && <DailyXp earned={dailyXp} />}
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
          {[...pending].sort(byUrgency).map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TaskeeLarge({
  tasks,
  lifetimeXp,
  dailyXp,
  tier,
}: {
  tasks: ChoreTask[]
  lifetimeXp: number
  dailyXp: number
  tier: number
}) {
  const pending = todayPending(tasks)
  const done = todayCompleted(tasks).length
  const total = tasks.length

  if (total === 0) {
    return (
      <CenteredState
        heading={tier === 1 ? 'All done!' : 'No tasks scheduled today'}
        trailing={<CoinScore value={lifetimeXp} />}
      />
    )
  }

  const allDone = pending.length === 0

  return (
    <div className="flex size-full flex-col p-6" style={{ containerType: 'size' }}>
      <WidgetHeader trailing={dailyXp > 0 ? <DailyXp earned={dailyXp} /> : undefined} />
      <div className="mt-2 mb-3 flex items-end justify-between gap-4">
        {allDone ? (
          <span className="flex items-center gap-2">
            <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden>
              🎉
            </span>
            <span className="text-card-title text-foreground">All done today</span>
          </span>
        ) : (
          <HeroCount value={pending.length} label="tasks left today" />
        )}
        <CoinScore value={lifetimeXp} />
      </div>
      <ProgressBar done={done} total={total} />
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
        {[...tasks].sort(byUrgency).map((t) => (
          <TaskRow key={t.id} task={t} />
        ))}
      </div>
    </div>
  )
}

/* Taskee — Focus framing (focusMode on) — single hero "Next up" + "+N more" */

/* The most urgent pending task auto-surfaces as the hero (overdue → earliest due
   → undated), mirroring the Focus page (design §1/§4). */
function focusSort(a: ChoreTask, b: ChoreTask): number {
  const oa = isOverdue(a.dueDate, a.status) ? 0 : 1
  const ob = isOverdue(b.dueDate, b.status) ? 0 : 1
  if (oa !== ob) return oa - ob
  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
  if (a.dueDate) return -1
  if (b.dueDate) return 1
  return 0
}

/* The hero "Next up" row — one prominent filled pill (status spine + title + XP).
   `large` bumps the title for the tall slot. */
function NextUpRow({ task, large = false }: { task: ChoreTask; large?: boolean }) {
  const overdue = isOverdue(task.dueDate, task.status)
  return (
    <div
      className="flex items-center gap-2.5 rounded-panel px-3.5"
      style={{ minHeight: large ? 56 : 48, background: overdue ? OVERDUE_WASH : 'var(--muted)' }}
    >
      <Spine color={spineColor(task)} inset />
      <span
        className={`min-w-0 flex-1 truncate font-medium text-foreground ${large ? 'text-card-title' : 'text-base-token'}`}
      >
        {task.title}
      </span>
      {overdue && (
        <span className="text-xs-token shrink-0 font-bold" style={{ color: 'var(--error)' }}>
          Overdue
        </span>
      )}
      <span className="text-sm-token shrink-0 font-bold" style={{ color: GOLD_INK }}>
        +{task.xpReward}
      </span>
    </div>
  )
}

/* "+N more today" — the collapsed remainder (Focus never lists the full set). */
function MoreLine({ n }: { n: number }) {
  if (n <= 0) return null
  return <span className="text-sm-token text-muted-foreground">+{n} more today</span>
}

function NextUpLabel() {
  return <span className="text-section-label text-muted-foreground">Next up</span>
}

function FocusCompact({ tasks, tier }: { tasks: ChoreTask[]; lifetimeXp: number; tier: number }) {
  const pending = todayPending(tasks).sort(focusSort)
  const done = todayCompleted(tasks).length
  const total = tasks.length

  if (total === 0) return <CenteredState heading={tier === 1 ? 'All done!' : 'No tasks'} />
  if (pending.length === 0) return <TaskeeAllDone compact />

  const [hero, ...rest] = pending
  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      <WidgetHeader />
      <div className="mt-2 flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <NextUpLabel />
          <NextUpRow task={hero} />
        </div>
        <div className="flex flex-col gap-1.5">
          <MoreLine n={rest.length} />
          <ProgressBar done={done} total={total} />
        </div>
      </div>
    </div>
  )
}

function FocusStandard({
  tasks,
  lifetimeXp,
  dailyXp,
  tier,
}: {
  tasks: ChoreTask[]
  lifetimeXp: number
  dailyXp: number
  tier: number
}) {
  const pending = todayPending(tasks).sort(focusSort)
  const done = todayCompleted(tasks).length
  const total = tasks.length

  if (total === 0)
    return (
      <CenteredState
        heading={tier === 1 ? 'All done!' : 'No tasks today'}
        trailing={<CoinScore value={lifetimeXp} />}
      />
    )
  if (pending.length === 0) return <TaskeeAllDone lifetimeXp={lifetimeXp} dailyXp={dailyXp} />

  const [hero, ...rest] = pending
  return (
    <div className="flex size-full flex-col p-5" style={{ containerType: 'size' }}>
      <WidgetHeader trailing={<CoinScore value={lifetimeXp} />} />
      <div className="mt-3 flex min-h-0 flex-1 flex-col justify-center gap-2.5">
        <NextUpLabel />
        <NextUpRow task={hero} large />
        <div className="flex items-center justify-between">
          <MoreLine n={rest.length} />
          {dailyXp > 0 && <DailyXp earned={dailyXp} />}
        </div>
        <ProgressBar done={done} total={total} />
      </div>
    </div>
  )
}

function FocusLarge({
  tasks,
  lifetimeXp,
  dailyXp,
  tier,
}: {
  tasks: ChoreTask[]
  lifetimeXp: number
  dailyXp: number
  tier: number
}) {
  const pending = todayPending(tasks).sort(focusSort)
  const done = todayCompleted(tasks).length
  const total = tasks.length

  if (total === 0)
    return (
      <CenteredState
        heading={tier === 1 ? 'All done!' : 'No tasks scheduled today'}
        trailing={<CoinScore value={lifetimeXp} />}
      />
    )
  if (pending.length === 0) return <TaskeeAllDone lifetimeXp={lifetimeXp} dailyXp={dailyXp} />

  const [hero, ...rest] = pending
  return (
    <div className="flex size-full flex-col p-6" style={{ containerType: 'size' }}>
      <WidgetHeader
        trailing={dailyXp > 0 ? <DailyXp earned={dailyXp} /> : <CoinScore value={lifetimeXp} />}
      />
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2.5">
        <NextUpLabel />
        <NextUpRow task={hero} large />
        <MoreLine n={rest.length} />
        <div className="mt-auto">
          <ProgressBar done={done} total={total} />
        </div>
      </div>
    </div>
  )
}

/* Family framing (tier 4 / family pseudo-profile) — Hero split */

/* Short / narrow family slot — a summary glance (count + progress + overdue), no
   per-person rows (they need height). Per-person detail is one tap away. Added for
   the responsive reflow: a family slot can be short (e.g. an h=1 slot is 180px on
   the mobile stack) where the stacked list would clip mid-tile. */
function FamilyCompact({ tasks }: { tasks: ChoreTask[] }) {
  const done = todayCompleted(tasks).length
  const total = tasks.length
  const pending = total - done
  const overdue = overdueCount(tasks)

  if (total === 0) {
    return <CenteredState heading="No tasks today" />
  }

  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      <WidgetHeader trailing={overdue > 0 ? <OverduePill n={overdue} /> : undefined} />
      <div className="mt-2 flex flex-1 flex-col justify-between">
        <HeroCount value={pending} label={pending === 0 ? '🎉 all done today' : 'pending today'} />
        <ProgressBar done={done} total={total} />
      </div>
    </div>
  )
}

function FamilyStandard({ tasks }: { tasks: ChoreTask[] }) {
  const done = todayCompleted(tasks).length
  const total = tasks.length
  const pending = total - done
  const overdue = overdueCount(tasks)
  const groups = groupByAssignee(tasks)

  if (total === 0) {
    return <CenteredState heading="No tasks today" />
  }

  /* Every member shows, urgent-first; the list fills height and only clips if it
     genuinely overflows the slot (overdue members survive the clip). */
  return (
    <div className="flex size-full flex-col p-5" style={{ containerType: 'size' }}>
      <WidgetHeader trailing={overdue > 0 ? <OverduePill n={overdue} /> : undefined} />
      <div className="mt-3 flex min-h-0 flex-1 gap-4">
        <div className="flex w-35 shrink-0 flex-col gap-1">
          <HeroCount value={pending} label="pending today" />
          <span className="text-xs-token text-muted-foreground">
            {done} of {total} done
          </span>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
          {[...groups].sort(byMemberUrgency).map((g) => (
            <PersonTile
              key={g.name}
              name={g.name}
              hue={g.hue}
              avatarUrl={g.avatarUrl}
              tasks={g.tasks}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FamilyLarge({ tasks }: { tasks: ChoreTask[] }) {
  const done = todayCompleted(tasks).length
  const total = tasks.length
  const pending = total - done
  const overdue = overdueCount(tasks)
  const groups = groupByAssignee(tasks)

  if (total === 0) {
    return <CenteredState heading="No tasks today" />
  }

  return (
    <div className="flex size-full flex-col p-6" style={{ containerType: 'size' }}>
      <WidgetHeader trailing={overdue > 0 ? <OverduePill n={overdue} /> : undefined} />
      <div className="mt-2 mb-3 flex items-end gap-4">
        <HeroCount value={pending} label={pending === 0 ? '🎉 all done today' : 'pending today'} />
      </div>
      <ProgressBar done={done} total={total} />
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
        {[...groups].sort(byMemberUrgency).map((g) => (
          <PersonTile
            key={g.name}
            name={g.name}
            hue={g.hue}
            avatarUrl={g.avatarUrl}
            tasks={g.tasks}
          />
        ))}
      </div>
    </div>
  )
}

/* Public: TodaySummaryView */

export type WidgetSize = 'compact' | 'standard' | 'large'

export interface TodaySummaryViewProps {
  tasks: ChoreTask[]
  /** Active profile's tier — 1–3 → taskee framing; 4 or family → family framing. */
  tier: number
  /** Whether the active profile is the family pseudo-profile (shows family framing). */
  isFamily?: boolean
  /** Optional explicit density override (Storybook / fixed hosts). When omitted the
      widget **self-sizes via CSS container queries** to its rendered box — the
      standard for content widgets (design-system.md; mirrors family-feed). */
  size?: WidgetSize
  /** Lifetime XP balance from GET /api/chores/xp (tiers 1–3 only). */
  lifetimeXp?: number
  /** XP earned today — sum of today's completed task rewards (tiers 1–3 only). */
  dailyXp?: number
  /** Effective Focus-mode setting (ADR 036). Taskee framing + on → the Focus
      "Next up" variant; off → the Agency Hero-split variant. */
  focusMode?: boolean
}

/* Container-query density toggle. The widget ships every variant's markup and CSS
   reveals the one that fits the rendered box (`containerType: size` on the wrapper;
   `@container` rules gate on width/height). Mirrors `FeedWidget`'s single/multi
   pattern.

   The **two-column "standard"** is a *wide-and-short* layout, so it only engages
   when the slot is both wide (≥440px) and short (≤299px). Everything narrower
   reflows to a **single column** (design-system.md mobile rule): taskee → compact
   (short) / large (tall); family → compact (short — count + progress, no per-person
   rows since they'd clip) / large (tall — full-width stacked list). Tall slots →
   large at any width. */
const WIDGET_STYLES = `
  .cw-compact, .cw-standard, .cw-large,
  .cwf-compact, .cwf-standard, .cwf-large { height: 100%; }
  .cw-compact  { display: block; }
  .cw-standard { display: none; }
  .cw-large    { display: none; }
  @container (min-height: ${WIDGET_CQ.tallMinHeight}) {
    .cw-compact  { display: none; }
    .cw-large    { display: block; }
  }
  @container (min-width: ${WIDGET_CQ.wideMinWidth}) and (max-height: ${WIDGET_CQ.shortMaxHeight}) {
    .cw-compact  { display: none; }
    .cw-large    { display: none; }
    .cw-standard { display: block; }
  }
  .cwf-compact  { display: block; }
  .cwf-standard { display: none; }
  .cwf-large    { display: none; }
  @container (min-height: ${WIDGET_CQ.tallMinHeight}) {
    .cwf-compact { display: none; }
    .cwf-large   { display: block; }
  }
  @container (min-width: ${WIDGET_CQ.wideMinWidth}) and (max-height: ${WIDGET_CQ.shortMaxHeight}) {
    .cwf-compact  { display: none; }
    .cwf-large    { display: none; }
    .cwf-standard { display: block; }
  }
`

/* The pure view for `chores.today-summary`. No data fetching — the container
   (`TodaySummary.tsx`) owns that. The whole tile is wrapped in a Link so any tap
   deep-links into /chores (design §4 "read-only + tap-through in MVP"). */
export function TodaySummaryView({
  tasks,
  tier,
  isFamily = false,
  size,
  lifetimeXp = 0,
  dailyXp = 0,
  focusMode = false,
}: TodaySummaryViewProps) {
  const usesFamilyFraming = isFamily || tier >= 4

  // Taskee framing → Focus ("Next up") or Agency (Hero split) per the setting.
  // Both reuse the same cw-* container-query slots; only the content differs.
  const taskeeStandard = focusMode ? (
    <FocusStandard tasks={tasks} lifetimeXp={lifetimeXp} dailyXp={dailyXp} tier={tier} />
  ) : (
    <TaskeeStandard tasks={tasks} lifetimeXp={lifetimeXp} dailyXp={dailyXp} tier={tier} />
  )
  const taskeeLarge = focusMode ? (
    <FocusLarge tasks={tasks} lifetimeXp={lifetimeXp} dailyXp={dailyXp} tier={tier} />
  ) : (
    <TaskeeLarge tasks={tasks} lifetimeXp={lifetimeXp} dailyXp={dailyXp} tier={tier} />
  )
  const taskeeCompact = focusMode ? (
    <FocusCompact tasks={tasks} lifetimeXp={lifetimeXp} tier={tier} />
  ) : (
    <TaskeeCompact tasks={tasks} lifetimeXp={lifetimeXp} dailyXp={dailyXp} tier={tier} />
  )
  const familyCompact = <FamilyCompact tasks={tasks} />
  const familyStandard = <FamilyStandard tasks={tasks} />
  const familyLarge = <FamilyLarge tasks={tasks} />

  let inner: ReactNode
  if (size) {
    /* Explicit override — render the single requested variant. */
    inner = usesFamilyFraming
      ? size === 'large'
        ? familyLarge
        : size === 'compact'
          ? familyCompact
          : familyStandard
      : size === 'compact'
        ? taskeeCompact
        : size === 'large'
          ? taskeeLarge
          : taskeeStandard
  } else {
    /* Self-size: ship every variant, let container queries reveal the right one. */
    inner = (
      <div className="size-full" style={{ containerType: 'size' }}>
        <style href="chores-today-widget" precedence="default">
          {WIDGET_STYLES}
        </style>
        {usesFamilyFraming ? (
          <>
            <div className="cwf-compact">{familyCompact}</div>
            <div className="cwf-standard">{familyStandard}</div>
            <div className="cwf-large">{familyLarge}</div>
          </>
        ) : (
          <>
            <div className="cw-compact">{taskeeCompact}</div>
            <div className="cw-standard">{taskeeStandard}</div>
            <div className="cw-large">{taskeeLarge}</div>
          </>
        )}
      </div>
    )
  }

  return (
    <Link to="/chores" className="block size-full no-underline" aria-label="Open Chores">
      {inner}
    </Link>
  )
}
