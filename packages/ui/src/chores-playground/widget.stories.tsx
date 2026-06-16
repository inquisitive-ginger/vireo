import type { Meta, StoryObj } from '@storybook/react'
import { CheckSquare, Star, TrendingUp } from 'lucide-react'
import { WidgetSlot } from '../components/widget-slot'
import { identityToken, type IdentityHue } from '../lib/identity'
import { KID_TASKS, PARENT_TASKS, type Task } from './_shared'

// ════════════════════════════════════════════════════════════════════════════
// 4 · chores.today-summary widget — "warm dashboard tile".
//
// Read-only in MVP: the widget summarises and taps through into the chores
// module (inline-complete is a 1.5 fast-follow). Fresher than the ledger version:
// soft rounded rows with breathing gaps (no full-width divider lines), identity
// avatars, labelled count chips (no bare trailing numbers), gentle overdue wash,
// and 2×2s that fill their height with intent.
//
// Slots: compact 1×1 (253×180), standard 2×1 (522×180), large 2×2 (522×376).
// Locked language: gold = XP only, red = overdue only, green = done; identity =
// per-person in the FAMILY view, status-only in the TASKEE view; DM Sans.
// ════════════════════════════════════════════════════════════════════════════

const GOLD = 'oklch(0.74 0.13 80)'
const GOLD_HI = 'oklch(0.88 0.09 86)'
const GOLD_DEEP = 'oklch(0.55 0.12 66)'
const GOLD_TINT = 'oklch(0.95 0.045 86)'
const GOLD_INK = 'oklch(0.45 0.1 70)'

const OVERDUE_WASH = 'color-mix(in oklch, var(--error) 8%, transparent)'
const GAP = 16

const css = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes wdg-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
}
.wdg-row { animation: wdg-rise 0.32s var(--ease-out) backwards; }
`

function slot(width: number, height: number) {
  return (Story: React.ComponentType) => (
    <div style={{ background: 'var(--background)', padding: 32 }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{ width, height }}>
        <WidgetSlot>
          <Story />
        </WidgetSlot>
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Chores Playground/4 · Widget',
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

// ─── shared chrome ───────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer', // read-only: whole tile taps into the module
      }}
    >
      {children}
    </div>
  )
}

function Header({ trailing }: { trailing?: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '12px 16px 10px',
        flexShrink: 0,
      }}
    >
      <CheckSquare size={13} style={{ color: 'var(--accent)' }} />
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          flex: 1,
        }}
      >
        Chores
      </span>
      {trailing}
    </div>
  )
}

function BigNumber({ value, label }: { value: number | string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          color: 'var(--foreground)',
        }}
      >
        {value}
      </span>
      <span
        style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--muted-foreground)' }}
      >
        {label}
      </span>
    </div>
  )
}

function Progress({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? (done / total) * 100 : 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{ height: 6, borderRadius: 9999, background: 'var(--muted)', overflow: 'hidden' }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 9999,
            background: 'var(--success)',
          }}
        />
      </div>
      <span
        style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--muted-foreground)' }}
      >
        {done} of {total} done today
      </span>
    </div>
  )
}

function CoinScore({ total }: { total: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: GOLD_TINT,
        borderRadius: 9999,
        padding: '4px 10px 4px 4px',
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: `radial-gradient(circle at 34% 28%, ${GOLD_HI}, ${GOLD} 62%, ${GOLD_DEEP})`,
          boxShadow: 'inset 0 1px 1px oklch(1 0 0 / 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Star size={10} fill="white" style={{ color: 'white' }} />
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 3 }}>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 15,
            fontWeight: 700,
            color: GOLD_DEEP,
            lineHeight: 1,
          }}
        >
          {total}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: GOLD_INK,
          }}
        >
          XP
        </span>
      </span>
    </span>
  )
}

function DailyXp({ earned }: { earned: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <TrendingUp size={13} style={{ color: GOLD_DEEP, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: GOLD_INK, lineHeight: 1 }}>
        <span style={{ fontWeight: 700 }}>+{earned}</span> today
      </span>
    </span>
  )
}

function OverduePill({ n, soft = false }: { n: number; soft?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 9999,
        padding: '2px 8px',
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        fontWeight: 700,
        background: soft ? OVERDUE_WASH : 'var(--error)',
        color: soft ? 'var(--error)' : 'var(--error-foreground)',
      }}
    >
      {n} overdue
    </span>
  )
}

function CountPill({ n }: { n: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 9999,
        padding: '2px 9px',
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        fontWeight: 600,
        background: 'var(--muted)',
        color: 'var(--muted-foreground)',
      }}
    >
      {n} left
    </span>
  )
}

function Avatar({ name, hue, size = 28 }: { name: string; hue: IdentityHue; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background: identityToken(hue, 'tint'),
        color: identityToken(hue, 'ink'),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-ui)',
        fontSize: Math.round(size * 0.42),
        fontWeight: 700,
      }}
    >
      {name[0]}
    </span>
  )
}

// soft taskee task row (no divider; gap-separated, gentle wash on overdue)
function TaskRow({ task, i }: { task: Task; i: number }) {
  const done = task.status === 'completed'
  const overdue = task.overdue && !done
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'
  return (
    <div
      className="wdg-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 12px',
        minHeight: 46,
        borderRadius: 11,
        background: overdue ? OVERDUE_WASH : 'var(--muted)',
        opacity: done ? 0.6 : 1,
        animationDelay: `${i * 55}ms`,
      }}
    >
      <span
        style={{
          width: 4,
          alignSelf: 'stretch',
          margin: '9px 0',
          borderRadius: 2,
          background: spine,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          flex: 1,
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: done ? 'var(--muted-foreground)' : 'var(--foreground)',
          textDecoration: done ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </span>
      {overdue && (
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--error)',
          }}
        >
          Overdue
        </span>
      )}
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 700,
          color: GOLD_INK,
          flexShrink: 0,
        }}
      >
        +{task.xpReward}
      </span>
    </div>
  )
}

// soft family person tile
function AllDonePill() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        borderRadius: 9999,
        padding: '2px 9px 2px 7px',
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        fontWeight: 700,
        background: 'color-mix(in oklch, var(--success) 12%, transparent)',
        color: 'var(--success)',
      }}
    >
      ✓ all done
    </span>
  )
}

function PersonTile({
  name,
  hue,
  pending,
  overdue,
  done,
  i,
}: {
  name: string
  hue: IdentityHue
  pending: number
  overdue: number
  done: number
  i: number
}) {
  const allDone = pending === 0 && done > 0
  return (
    <div
      className="wdg-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '0 12px',
        minHeight: 52,
        borderRadius: 11,
        background: overdue > 0 ? OVERDUE_WASH : 'var(--muted)',
        opacity: allDone ? 0.75 : 1,
        animationDelay: `${i * 55}ms`,
      }}
    >
      <Avatar name={name} hue={hue} />
      <span
        style={{
          flex: 1,
          fontFamily: 'var(--font-ui)',
          fontSize: 15,
          fontWeight: 500,
          color: 'var(--foreground)',
        }}
      >
        {name}
      </span>
      {allDone ? (
        <AllDonePill />
      ) : (
        <>
          {overdue > 0 && <OverduePill n={overdue} soft />}
          <CountPill n={pending} />
        </>
      )}
    </div>
  )
}

// ─── data helpers ────────────────────────────────────────────────────────────

function taskeeData() {
  const pending = KID_TASKS.filter((t) => t.status === 'pending')
  const done = KID_TASKS.filter((t) => t.status === 'completed')
  return {
    pending,
    all: KID_TASKS,
    doneCount: done.length,
    total: KID_TASKS.length,
    dailyEarned: done.reduce((s, t) => s + t.xpReward, 0),
    lifetime: 247,
  }
}

function familyData() {
  const map = new Map<
    string,
    { hue: IdentityHue; pending: number; overdue: number; done: number }
  >()
  for (const t of PARENT_TASKS) {
    if (!map.has(t.assignee)) map.set(t.assignee, { hue: t.hue, pending: 0, overdue: 0, done: 0 })
    const e = map.get(t.assignee)!
    if (t.status === 'completed') e.done += 1
    else {
      e.pending += 1
      if (t.overdue) e.overdue += 1
    }
  }
  const people = Array.from(map.entries()).map(([name, v]) => ({ name, ...v }))
  return {
    people,
    pending: PARENT_TASKS.filter((t) => t.status === 'pending').length,
    overdue: PARENT_TASKS.filter((t) => t.overdue && t.status === 'pending').length,
    doneToday: PARENT_TASKS.filter((t) => t.status === 'completed').length,
    totalToday: PARENT_TASKS.length,
  }
}

// ─── COMPACT 1×1 — taskee ────────────────────────────────────────────────────

export const CompactTaskee: Story = {
  name: 'Compact 1×1 — taskee',
  decorators: [slot(253, 180)],
  render: () => {
    const d = taskeeData()
    return (
      <Shell>
        <Header trailing={<DailyXp earned={d.dailyEarned} />} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '4px 16px 16px',
          }}
        >
          <BigNumber value={d.pending.length} label="tasks left today" />
          <Progress done={d.doneCount} total={d.total} />
        </div>
      </Shell>
    )
  },
}

// ─── STANDARD 2×1 — taskee ───────────────────────────────────────────────────

export const StandardTaskee: Story = {
  name: 'Standard 2×1 — taskee',
  decorators: [slot(522, 180)],
  render: () => {
    const d = taskeeData()
    return (
      <Shell>
        <Header trailing={<CoinScore total={d.lifetime} />} />
        <div style={{ flex: 1, display: 'flex', gap: 14, padding: '2px 16px 16px', minHeight: 0 }}>
          <div
            style={{
              width: 150,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <BigNumber value={d.pending.length} label="tasks left today" />
            <DailyXp earned={d.dailyEarned} />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            {d.pending.map((t, i) => (
              <TaskRow key={t.id} task={t} i={i} />
            ))}
          </div>
        </div>
      </Shell>
    )
  },
}

// ─── LARGE 2×2 — taskee ──────────────────────────────────────────────────────

export const LargeTaskee: Story = {
  name: 'Large 2×2 — taskee',
  decorators: [slot(522, 2 * 180 + GAP)],
  render: () => {
    const d = taskeeData()
    return (
      <Shell>
        <Header trailing={<DailyXp earned={d.dailyEarned} />} />
        {/* hero */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
            padding: '4px 16px 14px',
          }}
        >
          <BigNumber value={d.pending.length} label="tasks left today" />
          <CoinScore total={d.lifetime} />
        </div>
        <div style={{ padding: '0 16px 14px' }}>
          <Progress done={d.doneCount} total={d.total} />
        </div>
        {/* list fills remaining height */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
            padding: '4px 16px 16px',
            overflowY: 'auto',
            minHeight: 0,
          }}
        >
          {d.all.map((t, i) => (
            <TaskRow key={t.id} task={t} i={i} />
          ))}
        </div>
      </Shell>
    )
  },
}

// ─── STANDARD 2×1 — family ───────────────────────────────────────────────────

export const StandardFamily: Story = {
  name: 'Standard 2×1 — family',
  decorators: [slot(522, 180)],
  render: () => {
    const d = familyData()
    const flagged = d.people.filter((p) => p.overdue > 0).slice(0, 2)
    return (
      <Shell>
        <Header trailing={d.overdue > 0 ? <OverduePill n={d.overdue} /> : undefined} />
        <div style={{ flex: 1, display: 'flex', gap: 14, padding: '2px 16px 16px', minHeight: 0 }}>
          <div
            style={{
              width: 150,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <BigNumber value={d.pending} label="pending today" />
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                color: 'var(--muted-foreground)',
              }}
            >
              {d.doneToday} of {d.totalToday} done
            </span>
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            {flagged.map((p, i) => (
              <PersonTile
                key={p.name}
                name={p.name}
                hue={p.hue}
                pending={p.pending}
                overdue={p.overdue}
                done={p.done}
                i={i}
              />
            ))}
          </div>
        </div>
      </Shell>
    )
  },
}

// ─── LARGE 2×2 — family ──────────────────────────────────────────────────────

export const LargeFamily: Story = {
  name: 'Large 2×2 — family',
  decorators: [slot(522, 2 * 180 + GAP)],
  render: () => {
    const d = familyData()
    return (
      <Shell>
        <Header trailing={d.overdue > 0 ? <OverduePill n={d.overdue} /> : undefined} />
        {/* hero summary */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, padding: '4px 16px 12px' }}>
          <BigNumber value={d.pending} label="pending today" />
        </div>
        <div style={{ padding: '0 16px 14px' }}>
          <Progress done={d.doneToday} total={d.totalToday} />
        </div>
        {/* people fill remaining height */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: '0 16px 16px',
            overflowY: 'auto',
            minHeight: 0,
          }}
        >
          {d.people.map((p, i) => (
            <PersonTile
              key={p.name}
              name={p.name}
              hue={p.hue}
              pending={p.pending}
              overdue={p.overdue}
              done={p.done}
              i={i}
            />
          ))}
        </div>
      </Shell>
    )
  },
}
