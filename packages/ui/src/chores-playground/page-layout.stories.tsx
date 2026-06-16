import type { Meta, StoryObj } from '@storybook/react'
import { GripVertical, MoreVertical, Plus, Star, TrendingUp } from 'lucide-react'
import { Button } from '../components/button'
import { identityToken } from '../lib/identity'
import { KID_TASKS, MockPage, PARENT_TASKS, ViewLabel, type Task } from './_shared'

// ─── shared primitives ────────────────────────────────────────────────────────

function PageTitle({ children }: { children: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 26,
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        color: 'var(--foreground)',
      }}
    >
      {children}
    </span>
  )
}

function groupByAssignee(
  tasks: Task[]
): Array<{ assignee: string; hue: Task['hue']; tasks: Task[] }> {
  const map = new Map<string, { hue: Task['hue']; tasks: Task[] }>()
  for (const t of tasks) {
    if (!map.has(t.assignee)) map.set(t.assignee, { hue: t.hue, tasks: [] })
    map.get(t.assignee)!.tasks.push(t)
  }
  return Array.from(map.entries()).map(([assignee, { hue, tasks }]) => ({ assignee, hue, tasks }))
}

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Chores Playground/1 · Page Layout',
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

// ─── Taskee views (tiers 1–3) — locked "warm arcade ledger" treatment ────────
//
// Gold = a dedicated "treasure" semantic built on the system's marigold/warning
// hue (≈78), kept well clear of error-red (hue 12) so XP never reads as alarm.
// In KID view the identity hue carries no information (every task is the same
// kid), so cards go neutral and COLOR ENCODES STATUS: neutral default, red only
// for overdue, green for done. Gold is reserved exclusively for XP.

const GOLD = 'oklch(0.74 0.13 80)' // minted coin gold
const GOLD_HI = 'oklch(0.88 0.09 86)' // highlight (top-left of coin)
const GOLD_DEEP = 'oklch(0.55 0.12 66)' // deep edge + gold text
const GOLD_TINT = 'oklch(0.95 0.045 86)' // soft gold wash
const GOLD_INK = 'oklch(0.45 0.1 70)' // gold text on tint

// Daily-earned stat — sits on the progress line. Deliberately LIGHTER than the
// total: no fill, a momentum icon (not the trophy star), gold-ink text. Reads as
// "today so far", clearly subordinate to the lifetime score plate in the header.
function DailyXp({ earned }: { earned: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <TrendingUp size={13} style={{ color: GOLD_DEEP, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: GOLD_INK, lineHeight: 1 }}>
        <span style={{ fontWeight: 700 }}>+{earned}</span> XP today
      </span>
    </span>
  )
}

// Progress line shared across both taskee views
function ProgressLine({ done, total, earned }: { done: number; total: number; earned: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px 14px',
      }}
    >
      <span
        style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--muted-foreground)' }}
      >
        {done} of {total} done today
      </span>
      <DailyXp earned={earned} />
    </div>
  )
}

// XP reward pill (gold) used on neutral cards
function XpPill({ value, earned = false }: { value: number; earned?: boolean }) {
  if (earned) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--success)',
          lineHeight: 1,
        }}
      >
        ✓ +{value} XP
      </span>
    )
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: GOLD_TINT,
        borderRadius: 9999,
        padding: '4px 10px',
        fontFamily: 'var(--font-ui)',
        fontSize: 12,
        fontWeight: 700,
        color: GOLD_INK,
        lineHeight: 1,
      }}
    >
      +{value} XP
    </span>
  )
}

// Neutral, status-encoded kid card. Spine + accents carry status, NOT identity.
function NeutralKidCard({ task }: { task: Task }) {
  const done = task.status === 'completed'
  const overdue = task.overdue && !done
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-card)',
        padding: '14px 16px 14px 14px',
        opacity: done ? 0.66 : 1,
      }}
    >
      <div
        style={{
          width: 4,
          alignSelf: 'stretch',
          borderRadius: 2,
          background: spine,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 17,
            fontWeight: 600,
            lineHeight: 1.3,
            display: 'block',
            color: done ? 'var(--muted-foreground)' : 'var(--foreground)',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          {overdue ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--error)',
                color: 'var(--error-foreground)',
                borderRadius: 6,
                padding: '2px 7px',
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.06em',
                lineHeight: 1,
              }}
            >
              OVERDUE
            </span>
          ) : null}
          {task.dueDate && !done && (
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                color: overdue ? 'var(--error)' : 'var(--muted-foreground)',
              }}
            >
              {task.dueDate}
            </span>
          )}
          {done ? <XpPill value={task.xpReward} earned /> : <XpPill value={task.xpReward} />}
        </div>
      </div>
      {done ? (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--success)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 17,
            flexShrink: 0,
          }}
        >
          ✓
        </div>
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2.5px solid var(--border)',
            flexShrink: 0,
          }}
        />
      )}
    </div>
  )
}

// The locked treatment — score plate (H-2). Lifetime total in a refined gold
// ledger: coin + Lora numeral + stacked "XP / TOTAL", deliberately distinct in
// icon (Star) and weight from the lighter daily momentum stat (TrendingUp).
function H2Header() {
  // Score plate — a refined ledger counter; number in Lora, stacked unit + tag.
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 24px 14px',
      }}
    >
      <PageTitle>Chores</PageTitle>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          background: `linear-gradient(180deg, ${GOLD_TINT}, oklch(0.92 0.05 84))`,
          border: `1px solid ${GOLD}`,
          borderRadius: 14,
          padding: '8px 14px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: `radial-gradient(circle at 34% 28%, ${GOLD_HI}, ${GOLD} 62%, ${GOLD_DEEP})`,
            boxShadow: 'inset 0 1px 1px oklch(1 0 0 / 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Star size={14} fill="white" style={{ color: 'white' }} />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.01em',
            color: GOLD_DEEP,
          }}
        >
          247
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 2 }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: GOLD_INK,
            }}
          >
            XP
          </span>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: GOLD_INK,
              opacity: 0.7,
            }}
          >
            TOTAL
          </span>
        </div>
      </div>
    </div>
  )
}

// Section divider inside the focus view.
function FocusSectionLabel({ children }: { children: string }) {
  return (
    <div style={{ padding: '14px 24px 8px' }}>
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--muted-foreground)',
        }}
      >
        {children}
      </span>
    </div>
  )
}

// Compact secondary row — "Coming up" / "Done" lists in the focus view.
function FocusMiniRow({ task }: { task: Task }) {
  const done = task.status === 'completed'
  const overdue = task.overdue && !done
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 48,
        padding: '0 24px',
        borderBottom: '1px solid var(--border)',
        opacity: done ? 0.55 : 1,
      }}
    >
      <div
        style={{
          width: 4,
          alignSelf: 'stretch',
          borderRadius: 2,
          background: spine,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          flex: 1,
          fontFamily: 'var(--font-ui)',
          fontSize: 16,
          padding: '9px 0',
          color: done ? 'var(--muted-foreground)' : 'var(--foreground)',
          textDecoration: done ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </span>
      <XpPill value={task.xpReward} earned={done} />
    </div>
  )
}

// The single hero card — the one obvious next action. Status-encoded; neutral
// unless overdue, with a big, low-friction completion button for a young kid.
function FeaturedCard({ task }: { task: Task }) {
  const overdue = task.overdue
  return (
    <div style={{ padding: '0 18px 4px' }}>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderLeft: `5px solid ${overdue ? 'var(--error)' : 'var(--border)'}`,
          borderRadius: 16,
          boxShadow: 'var(--shadow-raised)',
          padding: '18px 20px 20px',
        }}
      >
        {overdue && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--error)',
              color: 'var(--error-foreground)',
              borderRadius: 6,
              padding: '3px 9px',
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              marginBottom: 10,
            }}
          >
            OVERDUE
          </span>
        )}
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.2,
            display: 'block',
            color: 'var(--foreground)',
          }}
        >
          {task.title}
        </span>
        {task.dueDate && (
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              color: overdue ? 'var(--error)' : 'var(--muted-foreground)',
              display: 'block',
              marginTop: 4,
            }}
          >
            {task.dueDate}
          </span>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 18,
          }}
        >
          {/* big gold reward */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: `radial-gradient(circle at 34% 28%, ${GOLD_HI}, ${GOLD} 62%, ${GOLD_DEEP})`,
                boxShadow: 'inset 0 1px 1px oklch(1 0 0 / 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Star size={13} fill="white" style={{ color: 'white' }} />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                  color: GOLD_DEEP,
                }}
              >
                +{task.xpReward}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: GOLD_INK,
                }}
              >
                XP
              </span>
            </span>
          </span>
          {/* one big action */}
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'var(--success)',
              color: 'white',
              border: 'none',
              borderRadius: 9999,
              padding: '12px 24px',
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '2px solid white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
              }}
            >
              ✓
            </span>
            Mark done
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Variant 1: Focus view (ADHD / younger) — one obvious next action ──────────
function FocusView() {
  const pending = KID_TASKS.filter((t) => t.status === 'pending')
  const completed = KID_TASKS.filter((t) => t.status === 'completed')
  const featured = pending.find((t) => t.overdue) ?? pending[0]
  const remaining = featured ? pending.filter((t) => t.id !== featured.id) : pending
  const earned = completed.reduce((s, t) => s + t.xpReward, 0)

  return (
    <div>
      <ViewLabel>Focus view · tiers 1–2 / younger · one next action</ViewLabel>
      <MockPage width={448}>
        <H2Header />
        <ProgressLine done={completed.length} total={KID_TASKS.length} earned={earned} />
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <FocusSectionLabel>Next up</FocusSectionLabel>
          {featured && <FeaturedCard task={featured} />}
          {remaining.length > 0 && (
            <>
              <FocusSectionLabel>Coming up</FocusSectionLabel>
              {remaining.map((t) => (
                <FocusMiniRow key={t.id} task={t} />
              ))}
            </>
          )}
          {completed.length > 0 && (
            <>
              <FocusSectionLabel>Done</FocusSectionLabel>
              {completed.map((t) => (
                <FocusMiniRow key={t.id} task={t} />
              ))}
            </>
          )}
          <div style={{ height: 18 }} />
        </div>
      </MockPage>
    </div>
  )
}

// ── Variant 2: Agency view (older kid) — full neutral status-encoded card list ─
function AgencyView() {
  const tasks = KID_TASKS
  const done = tasks.filter((t) => t.status === 'completed')
  const earned = done.reduce((s, t) => s + t.xpReward, 0)

  return (
    <div>
      <ViewLabel>Agency view · tiers 1–2 / older · full list</ViewLabel>
      <MockPage width={448}>
        <H2Header />
        <ProgressLine done={done.length} total={tasks.length} earned={earned} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: '16px 18px 22px',
            borderTop: '1px solid var(--border)',
          }}
        >
          {tasks.map((t) => (
            <NeutralKidCard key={t.id} task={t} />
          ))}
        </div>
      </MockPage>
    </div>
  )
}

export const TaskeeViews: Story = {
  name: 'Taskee — focus + agency',
  render: () => (
    <div style={{ background: 'var(--background)', padding: 32 }}>
      <ViewLabel>Taskee views · focus (younger / ADHD) + agency (older) · tiers 1–3</ViewLabel>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <FocusView />
        <AgencyView />
      </div>
    </div>
  ),
}

// ════════════════════════════════════════════════════════════════════════════
// Admin B+ — enhanced tier-4 management surface
// Builds on locked variant B (grouped by assignee). Aesthetic: "warm operations
// console" — capable + information-dense, but warm and editorial, never a
// spreadsheet. Identity hue does real work (each person's lane). Gold = XP only.
// Red = overdue only. Adds: time scope, hide-completed, per-person add, inline
// edit/remove, workload balance, and a drag-to-reassign affordance (1.5).
// ════════════════════════════════════════════════════════════════════════════

const adminCss = `
.apx-row { transition: background var(--duration-fast) var(--ease-out); position: relative; }
.apx-row:hover { background: var(--muted); }
.apx-row .apx-actions { opacity: 0; transition: opacity var(--duration-fast) var(--ease-out); }
.apx-row:hover .apx-actions { opacity: 1; }
.apx-row .apx-handle { opacity: 0; transition: opacity var(--duration-fast) var(--ease-out); }
.apx-row:hover .apx-handle { opacity: 0.5; cursor: grab; }
.apx-iconbtn { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; border: none; background: transparent; color: var(--muted-foreground); cursor: pointer; transition: background var(--duration-fast), color var(--duration-fast); }
.apx-iconbtn:hover { background: var(--card); color: var(--foreground); box-shadow: var(--shadow-card); }
.apx-iconbtn.danger:hover { color: var(--error); }
@media (prefers-reduced-motion: no-preference) {
  @keyframes apx-dropglow { 0%,100% { background: var(--bg0); } 50% { background: var(--bg1); } }
  @keyframes apx-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
}
.apx-group { animation: apx-rise 0.34s var(--ease-out) backwards; }
`

function sortTasks(tasks: Task[]): Task[] {
  const rank = (t: Task) => (t.status === 'completed' ? 3 : t.overdue ? 0 : t.dueDate ? 1 : 2)
  return [...tasks].sort((a, b) => rank(a) - rank(b))
}

// ─── Time-scope control options ──────────────────────────────────────────────

function ScopeSegmented({ value = 'Today' }: { value?: string }) {
  const opts = ['Today', 'Week', 'All']
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--muted)',
        borderRadius: 10,
        padding: 3,
        gap: 2,
      }}
    >
      {opts.map((o) => {
        const active = o === value
        return (
          <span
            key={o}
            style={{
              padding: '6px 16px',
              borderRadius: 7,
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
              background: active ? 'var(--card)' : 'transparent',
              boxShadow: active ? 'var(--shadow-card)' : 'none',
              cursor: 'pointer',
            }}
          >
            {o}
          </span>
        )
      })}
    </div>
  )
}

// ─── Hide-completed toggle (shared taskee + admin) ───────────────────────────

function HideCompletedToggle({ on = false }: { on?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span
        style={{
          width: 36,
          height: 20,
          borderRadius: 9999,
          background: on ? 'var(--accent)' : 'var(--border)',
          position: 'relative',
          transition: 'background var(--duration-fast) var(--ease-out)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: on ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'white',
            boxShadow: 'var(--shadow-card)',
            transition: 'left var(--duration-fast) var(--ease-out)',
          }}
        />
      </span>
      <span
        style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--muted-foreground)' }}
      >
        Hide completed
      </span>
    </span>
  )
}

// ─── Group header options ────────────────────────────────────────────────────

type Group = { assignee: string; hue: Task['hue']; tasks: Task[] }

function loadOf(g: Group) {
  return g.tasks.filter((t) => t.status === 'pending').reduce((s, t) => s + t.xpReward, 0)
}
function pendingOf(g: Group) {
  return g.tasks.filter((t) => t.status === 'pending').length
}
function overdueOf(g: Group) {
  return g.tasks.filter((t) => t.overdue && t.status === 'pending').length
}

function GroupHeaderPlate({ group, maxLoad }: { group: Group; maxLoad: number }) {
  const load = loadOf(group)
  const pct = maxLoad > 0 ? Math.max(8, (load / maxLoad) * 100) : 0
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 18px',
        background: `linear-gradient(90deg, ${identityToken(group.hue, 'tint')}, transparent 70%)`,
        borderTop: `2px solid ${identityToken(group.hue)}`,
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--foreground)',
            }}
          >
            {group.assignee}
          </span>
          {overdueOf(group) > 0 && (
            <span
              style={{
                background: 'var(--error)',
                color: 'var(--error-foreground)',
                borderRadius: 6,
                padding: '1px 6px',
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {overdueOf(group)} overdue
            </span>
          )}
        </div>
        {/* workload meter — the "are they balanced?" read */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
          <div
            style={{
              flex: 1,
              maxWidth: 120,
              height: 5,
              borderRadius: 9999,
              background: 'var(--muted)',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: 9999,
                background: identityToken(group.hue),
              }}
            />
          </div>
          <span
            style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--muted-foreground)' }}
          >
            {pendingOf(group)} task{pendingOf(group) === 1 ? '' : 's'} · {load} XP load
          </span>
        </div>
      </div>
      <button className="apx-iconbtn" title="Add task for this person">
        <Plus size={16} />
      </button>
    </div>
  )
}

// ─── Task row options (with management affordances) ──────────────────────────

function AdminRowBase({
  task,
  children,
  showHandle = false,
}: {
  task: Task
  children: React.ReactNode
  showHandle?: boolean
}) {
  const done = task.status === 'completed'
  const overdue = task.overdue && !done
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : identityToken(task.hue)
  return (
    <div
      className="apx-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 54,
        padding: '0 14px 0 0',
        borderBottom: '1px solid var(--border)',
        opacity: done ? 0.55 : 1,
      }}
    >
      {showHandle ? (
        <span
          className="apx-handle"
          style={{ paddingLeft: 6, display: 'flex', color: 'var(--muted-foreground)' }}
        >
          <GripVertical size={16} />
        </span>
      ) : (
        <span style={{ width: 6 }} />
      )}
      <span
        style={{
          width: 4,
          alignSelf: 'stretch',
          borderRadius: 2,
          background: spine,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0, padding: '9px 0' }}>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 15,
            display: 'block',
            color: done ? 'var(--muted-foreground)' : 'var(--foreground)',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            color: overdue ? 'var(--error)' : 'var(--muted-foreground)',
          }}
        >
          {done
            ? `Done ${task.completedLabel}`
            : overdue
              ? `Overdue · ${task.dueDate}`
              : (task.dueDate ?? 'No due date')}
        </span>
      </div>
      {children}
    </div>
  )
}

// R2 — drag handle always-ish + kebab menu
function AdminRowKebab({ task }: { task: Task }) {
  const done = task.status === 'completed'
  return (
    <AdminRowBase task={task} showHandle>
      {!done && <XpPill value={task.xpReward} />}
      <button className="apx-iconbtn" title="More">
        <MoreVertical size={16} />
      </button>
    </AdminRowBase>
  )
}

// Family pulse as interactive status filters. Tapping a chip scopes the board
// (e.g. "Overdue" → only overdue lanes). Default = "All". MVP-level; per-lane
// badge filtering is a later refinement.
function PulseFilters({
  total,
  pending,
  overdue,
  active = 'all',
}: {
  total: number
  pending: number
  overdue: number
  active?: 'all' | 'pending' | 'overdue'
}) {
  const chips: { id: 'all' | 'pending' | 'overdue'; label: string; n: number; danger?: boolean }[] =
    [
      { id: 'all', label: 'All', n: total },
      { id: 'pending', label: 'Pending', n: pending },
      { id: 'overdue', label: 'Overdue', n: overdue, danger: true },
    ]
  return (
    <div style={{ display: 'inline-flex', gap: 6 }}>
      {chips.map((c) => {
        const on = c.id === active
        const accent = c.danger ? 'var(--error)' : 'var(--foreground)'
        const idle = c.danger && c.n > 0 ? 'var(--error)' : 'var(--muted-foreground)'
        return (
          <span
            key={c.id}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 9px 4px 11px',
              borderRadius: 9999,
              cursor: 'pointer',
              border: `1px solid ${on ? accent : 'var(--border)'}`,
              background: on ? accent : 'transparent',
              color: on ? 'var(--background)' : idle,
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {c.label}
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 9999,
                padding: '0 5px',
                background: on ? 'oklch(1 0 0 / 0.22)' : 'var(--muted)',
                color: on ? 'var(--background)' : idle,
              }}
            >
              {c.n}
            </span>
          </span>
        )
      })}
    </div>
  )
}

// ─── Composed recommended view + drag-to-reassign snapshot ───────────────────

export const AdminView: Story = {
  name: 'Admin — grouped by assignee',
  render: () => {
    const groups = groupByAssignee(PARENT_TASKS)
    const maxLoad = Math.max(...groups.map(loadOf))
    const totalPending = PARENT_TASKS.filter((t) => t.status === 'pending').length
    const totalOverdue = PARENT_TASKS.filter((t) => t.overdue && t.status === 'pending').length

    return (
      <div style={{ background: 'var(--background)', padding: 32 }}>
        <style dangerouslySetInnerHTML={{ __html: adminCss }} />
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          {/* Full enhanced view */}
          <div>
            <ViewLabel>Admin · grouped by assignee · tier 4</ViewLabel>
            <MockPage width={560}>
              {/* Title + create */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '24px 24px 12px',
                }}
              >
                <PageTitle>Chores</PageTitle>
                <Button size="sm">
                  <Plus size={14} style={{ marginRight: 4 }} />
                  New Task
                </Button>
              </div>
              {/* Family pulse — now interactive status filters */}
              <div style={{ padding: '0 24px 12px' }}>
                <PulseFilters
                  total={PARENT_TASKS.length}
                  pending={totalPending}
                  overdue={totalOverdue}
                  active="all"
                />
              </div>
              {/* Toolbar: time scope + hide completed */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 24px 16px',
                }}
              >
                <ScopeSegmented value="Today" />
                <HideCompletedToggle on={false} />
              </div>
              {/* Grouped lanes */}
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {groups.map((g, i) => (
                  <div
                    key={g.assignee}
                    className="apx-group"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <GroupHeaderPlate group={g} maxLoad={maxLoad} />
                    {sortTasks(g.tasks).map((t) => (
                      <AdminRowKebab key={t.id} task={t} />
                    ))}
                  </div>
                ))}
              </div>
            </MockPage>
          </div>

          {/* Drag-to-reassign snapshot (1.5 foreshadow) */}
          <div>
            <ViewLabel>Drag to reassign · 1.5 (affordance shown now)</ViewLabel>
            <MockPage width={460}>
              <div style={{ padding: '20px 24px 12px' }}>
                <PageTitle>Chores</PageTitle>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', position: 'relative' }}>
                {/* Maya — source, with a dashed placeholder where the grabbed task was */}
                <GroupHeaderPlate group={groups[0]} maxLoad={maxLoad} />
                <div
                  style={{
                    margin: '8px 14px',
                    height: 46,
                    border: '2px dashed var(--border)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 16,
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    color: 'var(--muted-foreground)',
                  }}
                >
                  moving…
                </div>
                <AdminRowKebab task={groups[0].tasks[1]} />

                {/* Zach — highlighted drop target */}
                <div
                  style={{
                    margin: '4px 8px',
                    borderRadius: 12,
                    border: `2px dashed ${identityToken(groups[1].hue)}`,
                    background: identityToken(groups[1].hue, 'tint'),
                    padding: 4,
                  }}
                >
                  <GroupHeaderPlate group={groups[1]} maxLoad={maxLoad} />
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '10px 0',
                      fontFamily: 'var(--font-ui)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: identityToken(groups[1].hue, 'ink'),
                    }}
                  >
                    Drop to reassign to {groups[1].assignee}
                  </div>
                </div>

                {/* Floating grabbed card */}
                <div
                  style={{
                    position: 'absolute',
                    top: 150,
                    left: 90,
                    width: 300,
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderLeft: `4px solid ${identityToken(groups[0].hue)}`,
                    borderRadius: 12,
                    boxShadow: 'var(--shadow-raised)',
                    padding: '12px 16px',
                    transform: 'rotate(-3deg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'grabbing',
                  }}
                >
                  <GripVertical size={16} style={{ color: 'var(--muted-foreground)' }} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 15,
                        color: 'var(--foreground)',
                      }}
                    >
                      Feed the dog
                    </div>
                    <div
                      style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--error)' }}
                    >
                      Overdue · Fri Jun 13
                    </div>
                  </div>
                  <XpPill value={10} />
                </div>
              </div>
              <div style={{ height: 16 }} />
            </MockPage>
          </div>
        </div>
      </div>
    )
  },
}
