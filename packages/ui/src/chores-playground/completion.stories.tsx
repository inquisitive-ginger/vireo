import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useRef, useState } from 'react'
import { Star } from 'lucide-react'
import { KID_TASKS, MockPage, ViewLabel, type Task } from './_shared'

// ════════════════════════════════════════════════════════════════════════════
// 2 · Completion — LOCKED.
//
// The earn moment is the "XP flight": on complete, the task's gold +XP badge
// lifts off from its exact spot, arcs up to the score plate, and the lifetime
// total grows → counts up → settles as it lands. One feedback for all views.
//
// Tap targets are per-view (settled in Group 1): the FOCUS view uses the big
// green "Mark done" button; the AGENCY view uses the 40px completion circle.
// Both fire the same flight. Locked language: neutral status-encoded cards,
// gold = XP only, red = overdue only, green = done.
// ════════════════════════════════════════════════════════════════════════════

const GOLD = 'oklch(0.74 0.13 80)'
const GOLD_HI = 'oklch(0.88 0.09 86)'
const GOLD_DEEP = 'oklch(0.55 0.12 66)'
const GOLD_TINT = 'oklch(0.95 0.045 86)'
const GOLD_INK = 'oklch(0.45 0.1 70)'

type Pt = { x: number; y: number }
type Flight = { key: number; id: string; value: number; from: Pt; to: Pt }
type View = 'focus' | 'agency'

const css = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes cmp-pop { 0% { transform: scale(1); } 45% { transform: scale(1.18); } 100% { transform: scale(1); } }
  @keyframes cmp-checkin { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
}
`

// ─── animated count-up (easeInOutCubic — gentle at both ends) ─────────────────

function useCountUp(target: number, ms = 640) {
  const [val, setVal] = useState(target)
  const fromRef = useRef(target)
  useEffect(() => {
    const from = fromRef.current
    if (from === target) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
      setVal(Math.round(from + (target - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return val
}

// ─── locked score plate (H-2) — grows, counts up, settles when XP lands ──────

function ScorePlate({ total }: { total: number }) {
  const shown = useCountUp(total)
  const ref = useRef<HTMLDivElement>(null)
  const prev = useRef(total)
  useEffect(() => {
    if (prev.current === total) return
    prev.current = total
    const node = ref.current
    if (!node) return
    // grow the container, hold while the metric counts up, then shrink back
    const anim = node.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.09)', offset: 0.22 },
        { transform: 'scale(1.09)', offset: 0.7 },
        { transform: 'scale(1)' },
      ],
      { duration: 860, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    )
    return () => anim.cancel()
  }, [total])
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        background: `linear-gradient(180deg, ${GOLD_TINT}, oklch(0.92 0.05 84))`,
        border: `1px solid ${GOLD}`,
        borderRadius: 14,
        padding: '8px 14px',
        boxShadow: 'var(--shadow-card)',
        transformOrigin: 'center',
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
        {shown}
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
  )
}

function GoldPill({ value }: { value: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
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

function EarnedPill({ value }: { value: number }) {
  return (
    <span
      style={{
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

// ─── flight chip — travels the TRUE measured path from badge → score plate.
// position:fixed so no ancestor overflow clips it. Runs once per chip.

function FlightChip({
  from,
  to,
  value,
  onDone,
}: Pick<Flight, 'from' | 'to' | 'value'> & { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const mid = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 36 }
    const anim = node.animate(
      [
        { transform: `translate(${from.x}px, ${from.y}px) scale(1)`, opacity: 1 },
        { offset: 0.55, transform: `translate(${mid.x}px, ${mid.y}px) scale(1.05)`, opacity: 1 },
        { transform: `translate(${to.x}px, ${to.y}px) scale(0.5)`, opacity: 0.9 },
      ],
      { duration: 980, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'forwards' }
    )
    anim.onfinish = () => onDoneRef.current()
    return () => anim.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        transform: `translate(${from.x}px, ${from.y}px)`,
      }}
    >
      <div
        style={{
          transform: 'translate(-50%, -50%)',
          background: GOLD,
          color: 'white',
          borderRadius: 9999,
          padding: '4px 11px',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          fontWeight: 800,
          whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-raised)',
        }}
      >
        +{value} XP
      </div>
    </div>
  )
}

// ─── AGENCY view card — neutral card + completion circle ──────────────────────

function AgencyCard({
  task,
  done,
  fx,
  inFlight = false,
  onComplete,
  pillRef,
}: {
  task: Task
  done: boolean
  fx: boolean
  inFlight?: boolean
  onComplete: () => void
  pillRef?: (n: HTMLSpanElement | null) => void
}) {
  const overdue = task.overdue && !done
  const spine = done ? 'var(--success)' : overdue ? 'var(--error)' : 'var(--border)'

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-card)',
        padding: '14px 16px 14px 14px',
        opacity: done ? 0.66 : 1,
        transition: 'opacity var(--duration-normal) var(--ease-out)',
      }}
    >
      <div
        style={{
          width: 4,
          alignSelf: 'stretch',
          borderRadius: 2,
          background: spine,
          flexShrink: 0,
          transition: 'background var(--duration-normal) var(--ease-out)',
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
            transition: 'color var(--duration-normal) var(--ease-out)',
          }}
        >
          {task.title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          {overdue && (
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
          )}
          {done ? (
            <EarnedPill value={task.xpReward} />
          ) : (
            <span
              ref={pillRef}
              style={{ display: 'inline-flex', visibility: inFlight ? 'hidden' : 'visible' }}
            >
              <GoldPill value={task.xpReward} />
            </span>
          )}
        </div>
      </div>

      <button
        onClick={done || inFlight ? undefined : onComplete}
        aria-label={done ? 'Completed' : 'Mark complete'}
        style={{
          position: 'relative',
          width: 40,
          height: 40,
          borderRadius: '50%',
          flexShrink: 0,
          cursor: done || inFlight ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: 17,
          border: done ? 'none' : '2.5px solid var(--border)',
          background: done ? 'var(--success)' : 'transparent',
          transition:
            'background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)',
          animation: fx ? 'cmp-pop 0.32s var(--ease-out)' : undefined,
        }}
      >
        {done && (
          <span style={{ animation: fx ? 'cmp-checkin 0.3s var(--ease-out)' : undefined }}>✓</span>
        )}
      </button>
    </div>
  )
}

// ─── FOCUS view — featured "Next up" hero card + big green button ─────────────

function SectionLabel({ children }: { children: string }) {
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

function MiniRow({ task, done }: { task: Task; done: boolean }) {
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
      {done ? <EarnedPill value={task.xpReward} /> : <GoldPill value={task.xpReward} />}
    </div>
  )
}

function FeaturedCard({
  task,
  inFlight = false,
  onComplete,
  rewardRef,
}: {
  task: Task
  inFlight?: boolean
  onComplete: () => void
  rewardRef?: (n: HTMLSpanElement | null) => void
}) {
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
          <span
            ref={rewardRef}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              visibility: inFlight ? 'hidden' : 'visible',
            }}
          >
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
          <button
            onClick={inFlight ? undefined : onComplete}
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
              cursor: inFlight ? 'default' : 'pointer',
              opacity: inFlight ? 0.6 : 1,
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

// ─── demo page wiring (one self-contained instance per view) ─────────────────

function CompletionDemo({ view }: { view: View }) {
  const pending = KID_TASKS.filter((t) => t.status === 'pending')
  const history = KID_TASKS.filter((t) => t.status === 'completed')
  const baseTotal = 247
  const baseDaily = history.reduce((s, t) => s + t.xpReward, 0)

  const [done, setDone] = useState<Set<string>>(new Set())
  const [banked, setBanked] = useState<Set<string>>(new Set())
  const [inFlight, setInFlight] = useState<Set<string>>(new Set())
  const [fxId, setFxId] = useState<string | null>(null)
  const [flights, setFlights] = useState<Flight[]>([])

  const plateRef = useRef<HTMLDivElement>(null)
  const originRefs = useRef<Record<string, HTMLSpanElement | null>>({})
  const flightKey = useRef(0)

  const earned = pending.filter((t) => banked.has(t.id)).reduce((s, t) => s + t.xpReward, 0)
  const total = baseTotal + earned
  const daily = baseDaily + earned
  const doneCount = history.length + done.size
  const totalCount = KID_TASKS.length

  const stillPending = pending.filter((t) => !done.has(t.id))
  const featured = stillPending.find((t) => t.overdue) ?? stillPending[0]
  const comingUp = featured ? stillPending.filter((t) => t.id !== featured.id) : stillPending
  const doneTasks = [...history, ...pending.filter((t) => done.has(t.id))]

  function complete(task: Task) {
    const id = task.id
    const originNode = originRefs.current[id]
    const plateNode = plateRef.current

    if (originNode && plateNode) {
      const p = originNode.getBoundingClientRect()
      const q = plateNode.getBoundingClientRect()
      const key = ++flightKey.current
      setFlights((f) => [
        ...f,
        {
          key,
          id,
          value: task.xpReward,
          from: { x: p.left + p.width / 2, y: p.top + p.height / 2 },
          to: { x: q.left + q.width / 2, y: q.top + q.height / 2 },
        },
      ])
      // Keep the task in place with its badge hidden so the chip looks like it
      // lifted off the card. The card only morphs / reorders once the chip lands.
      setInFlight((prev) => new Set(prev).add(id))
    } else {
      setDone((prev) => new Set(prev).add(id))
      setBanked((prev) => new Set(prev).add(id))
      setFxId(id)
      window.setTimeout(() => setFxId((cur) => (cur === id ? null : cur)), 600)
    }
  }

  function finishFlight(key: number, id: string) {
    setFlights((f) => f.filter((fl) => fl.key !== key))
    setInFlight((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setDone((prev) => new Set(prev).add(id))
    setBanked((prev) => new Set(prev).add(id))
    setFxId(id)
    window.setTimeout(() => setFxId((cur) => (cur === id ? null : cur)), 600)
  }

  function reset() {
    setDone(new Set())
    setBanked(new Set())
    setInFlight(new Set())
    setFxId(null)
    setFlights([])
  }

  return (
    <>
      <div>
        <ViewLabel>
          {view === 'focus'
            ? 'Focus view · tiers 1–2 / younger · big "Mark done"'
            : 'Agency view · tiers 1–2 / older · completion circle'}
        </ViewLabel>
        <MockPage width={460}>
          {/* header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 24px 14px',
            }}
          >
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
              Chores
            </span>
            <div ref={plateRef} style={{ display: 'inline-flex' }}>
              <ScorePlate total={total} />
            </div>
          </div>

          {/* progress line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px 14px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                color: 'var(--muted-foreground)',
              }}
            >
              {doneCount} of {totalCount} done today
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: GOLD_INK }}>
              <span style={{ fontWeight: 700 }}>+{daily}</span> XP today
            </span>
          </div>

          {/* body */}
          {view === 'focus' ? (
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {featured ? (
                <>
                  <SectionLabel>Next up</SectionLabel>
                  <FeaturedCard
                    key={featured.id}
                    task={featured}
                    inFlight={inFlight.has(featured.id)}
                    onComplete={() => complete(featured)}
                    rewardRef={(n) => {
                      originRefs.current[featured.id] = n
                    }}
                  />
                </>
              ) : (
                <div
                  style={{
                    padding: '28px 24px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--success)',
                  }}
                >
                  🎉 All done today!
                </div>
              )}
              {comingUp.length > 0 && (
                <>
                  <SectionLabel>Coming up</SectionLabel>
                  {comingUp.map((t) => (
                    <MiniRow key={t.id} task={t} done={false} />
                  ))}
                </>
              )}
              {doneTasks.length > 0 && (
                <>
                  <SectionLabel>Done</SectionLabel>
                  {doneTasks.map((t) => (
                    <MiniRow key={t.id} task={t} done />
                  ))}
                </>
              )}
              <div style={{ height: 14 }} />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                padding: '16px 18px 12px',
                borderTop: '1px solid var(--border)',
              }}
            >
              {pending.map((t) => (
                <AgencyCard
                  key={t.id}
                  task={t}
                  done={done.has(t.id)}
                  fx={fxId === t.id}
                  inFlight={inFlight.has(t.id)}
                  onComplete={() => complete(t)}
                  pillRef={(n) => {
                    originRefs.current[t.id] = n
                  }}
                />
              ))}
              {history.map((t) => (
                <AgencyCard key={t.id} task={t} done fx={false} onComplete={() => {}} />
              ))}
            </div>
          )}

          {/* reset */}
          <div style={{ padding: '4px 18px 20px' }}>
            <button
              onClick={reset}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                color: 'var(--muted-foreground)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              ↺ reset demo
            </button>
          </div>
        </MockPage>
      </div>

      {flights.map((fl) => (
        <FlightChip
          key={fl.key}
          from={fl.from}
          to={fl.to}
          value={fl.value}
          onDone={() => finishFlight(fl.key, fl.id)}
        />
      ))}
    </>
  )
}

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Chores Playground/2 · Completion',
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

// ─── Locked: XP flight across both taskee views ──────────────────────────────

export const XpFlight: Story = {
  name: 'XP flight (locked)',
  render: () => (
    <div style={{ background: 'var(--background)', padding: 32 }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <ViewLabel>Completion · locked XP-flight feedback · both taskee views</ViewLabel>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--muted-foreground)',
          margin: '0 0 20px',
        }}
      >
        Complete a task — its gold +XP badge flies up to the score plate, which grows, counts up,
        and settles. Focus uses the big “Mark done” button; agency uses the completion circle. Same
        flight either way.
      </p>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <CompletionDemo view="focus" />
        <CompletionDemo view="agency" />
      </div>
    </div>
  ),
}
