import type { CSSProperties, ReactNode } from 'react'

/* The punch card (ADR 049, M4/6; joy rework 2026-08-02) — the paper sheet, not a
   meter: a fixed 5-wide stamp wall where every punch stamps the habit's own glyph
   at a slightly imperfect angle, countable by eye on every screen. The NEXT square
   is the only dashed element and the one tap target; the stamp lands instantly.
   The prize lives in a rail the caller composes (`prizeRail`) — kid copy stays on
   the kid surface. Lives here because two plugins render it — chores punches it,
   rewards' parent surfaces read it — and plugins cannot import each other (the
   Coin precedent). Purely presentational: data and mutations stay with callers. */

export interface PunchCardProps {
  glyph: string
  name: string
  goal: number
  count: number
  /** Line under the name — "Last punched yesterday". Omit on a fresh card. */
  meta?: ReactNode
  /** Trailing header slot — the countdown or a "Card full!" pill. */
  headerTrailing?: ReactNode
  /** Renders the next square as the live tap target. */
  onPunch?: () => void
  punchLabel?: string
  punchDisabled?: boolean
  /** Spoken summary for the stamp wall (its squares are decorative). */
  gridLabel: string
  /** The coin-metal treatment a full or just-won card wears. */
  gold?: boolean
  /** Right of the stamp wall; stacks under it on narrow screens. */
  prizeRail?: ReactNode
  /** Overlays and lines outside the body — confetti, an error. */
  children?: ReactNode
  className?: string
}

export function PunchCard({
  glyph,
  name,
  goal,
  count,
  meta,
  headerTrailing,
  onPunch,
  punchLabel,
  punchDisabled = false,
  gridLabel,
  gold = false,
  prizeRail,
  children,
  className,
}: PunchCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-card border bg-card p-4 ${className ?? ''}`}
      style={{
        borderColor: gold ? 'color-mix(in oklab, var(--coin) 50%, var(--border))' : 'var(--border)',
        boxShadow: gold ? 'var(--shadow-raised)' : 'var(--shadow-card)',
      }}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-[22px] leading-tight" aria-hidden>
          {glyph}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-card-title">{name}</p>
          {meta && <p className="text-xs-body mt-0.5 text-muted-foreground">{meta}</p>}
        </div>
        {headerTrailing}
      </div>

      <div className="mt-3.5 flex flex-col gap-3.5 sm:flex-row sm:items-stretch sm:gap-4">
        <PunchSquares
          glyph={glyph}
          count={count}
          goal={goal}
          onPunch={onPunch}
          punchLabel={punchLabel}
          disabled={punchDisabled}
          label={gridLabel}
        />
        {prizeRail && (
          <>
            <div className="h-px bg-border sm:h-auto sm:w-px" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col">{prizeRail}</div>
          </>
        )}
      </div>

      {children}
    </div>
  )
}

/* Per-index stamp angles — fixed so a card never re-rolls its handwriting. */
const STAMP_ROT = [
  -5, 3, -2, 4, -3, 2, -4, 5, -1, 3, -6, 2, -3, 4, -2, 3, -5, 1, -2, 4, -4, 2, -3, 5, -1, 3, -2, 4,
  -5, 2,
]

export function PunchSquares({
  glyph,
  count,
  goal,
  onPunch,
  punchLabel,
  disabled = false,
  label,
}: {
  glyph: string
  count: number
  goal: number
  onPunch?: () => void
  punchLabel?: string
  disabled?: boolean
  label: string
}) {
  const cell =
    'grid aspect-square w-full min-h-11 place-items-center rounded-card text-[24px] leading-none'
  return (
    <div
      role="img"
      aria-label={label}
      className="grid w-full min-w-0 grid-cols-5 content-start gap-2 self-start sm:flex-[1.15]"
    >
      {Array.from({ length: goal }, (_, i) => {
        const punched = i < count
        if (i === count && onPunch !== undefined) {
          return (
            <button
              key={i}
              type="button"
              className={`${cell} animate-breathe cursor-pointer bg-[color-mix(in_oklab,var(--primary)_7%,transparent)] text-[20px] font-semibold text-primary hover:bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]`}
              style={{ border: '2px dashed var(--primary)' }}
              aria-label={punchLabel}
              disabled={disabled}
              onClick={onPunch}
            >
              +
            </button>
          )
        }
        const justStamped = punched && i === count - 1
        return (
          <span
            key={i}
            className={justStamped ? `${cell} animate-stamp-press` : cell}
            style={
              punched
                ? { background: 'var(--secondary)', boxShadow: 'var(--shadow-inset)' }
                : { border: '1.5px solid var(--border)' }
            }
            aria-hidden
          >
            {punched && (
              <span
                className={justStamped ? 'animate-stamp-slam inline-block' : 'inline-block'}
                style={
                  {
                    '--stamp-rot': `${STAMP_ROT[i % STAMP_ROT.length]}deg`,
                    transform: 'rotate(var(--stamp-rot))',
                  } as CSSProperties
                }
              >
                {glyph}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
