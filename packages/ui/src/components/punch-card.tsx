import type { ReactNode } from 'react'
import { Coin } from './coin'

/* The punch card (ADR 049, M4/6) — the paper sheet, not a meter: each square is a
   thing you did, countable by eye, and the payout is a finish line at the end of
   the row. The NEXT square is the one tap target (dashed, waiting); the stamp
   lands instantly. Lives here because two plugins render it — chores punches it,
   rewards' parent surfaces read it — and plugins cannot import each other (the
   Coin precedent). Purely presentational: data and mutations stay with callers. */

export type PunchFinish =
  | { kind: 'coin' }
  | { kind: 'emoji'; emoji: string }
  /** No prize named yet — the wrapping stays on (M4/6 gate: the wrapped gift). */
  | { kind: 'gift' }

export interface PunchCardProps {
  glyph: string
  name: string
  goal: number
  count: number
  finish: PunchFinish
  /** Lights the finish line — the completed treatment. */
  finishReached?: boolean
  /** Renders the next square as the live tap target. */
  onPunch?: () => void
  punchLabel?: string
  punchDisabled?: boolean
  /** Makes the finish line tappable (choice cards — opens the prize sheet). */
  onFinishTap?: () => void
  finishTapLabel?: string
  /** Trailing header slot — the "3 of 5" count or a Done! badge. */
  headerTrailing?: ReactNode
  /** Lines under the strip — the promise, the claim link, an error. */
  children?: ReactNode
  className?: string
}

export function PunchCard({
  glyph,
  name,
  goal,
  count,
  finish,
  finishReached = false,
  onPunch,
  punchLabel,
  punchDisabled = false,
  onFinishTap,
  finishTapLabel,
  headerTrailing,
  children,
  className,
}: PunchCardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-card p-4 ${className ?? ''}`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[20px] leading-none" aria-hidden>
          {glyph}
        </span>
        <p className="text-card-title flex-1">{name}</p>
        {headerTrailing}
      </div>

      <div className="flex items-center gap-3">
        <PunchSquares
          count={count}
          goal={goal}
          onPunch={onPunch}
          punchLabel={punchLabel}
          disabled={punchDisabled}
        />
        <FinishLine
          finish={finish}
          reached={finishReached}
          onTap={onFinishTap}
          tapLabel={finishTapLabel}
        />
      </div>

      {children}
    </div>
  )
}

export function PunchSquares({
  count,
  goal,
  onPunch,
  punchLabel,
  disabled = false,
}: {
  count: number
  goal: number
  onPunch?: () => void
  punchLabel?: string
  disabled?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-wrap gap-1.5">
      {Array.from({ length: goal }, (_, i) => {
        const punched = i < count
        const isNext = i === count && onPunch !== undefined
        const cls = 'grid size-9 place-items-center rounded-md border text-[17px] leading-none'
        const style = {
          borderColor: isNext ? 'var(--primary)' : 'var(--border)',
          borderStyle: isNext ? ('dashed' as const) : ('solid' as const),
          borderWidth: isNext ? 2 : 1,
          background: punched ? 'var(--secondary)' : 'transparent',
        }
        if (isNext) {
          return (
            <button
              key={i}
              type="button"
              className={`${cls} cursor-pointer`}
              style={style}
              aria-label={punchLabel}
              disabled={disabled}
              onClick={onPunch}
            />
          )
        }
        return (
          <span key={i} className={cls} style={style} aria-hidden>
            {punched && <span className={i === count - 1 ? 'animate-stamp-in' : undefined}>✓</span>}
          </span>
        )
      })}
    </div>
  )
}

function FinishLine({
  finish,
  reached,
  onTap,
  tapLabel,
}: {
  finish: PunchFinish
  reached: boolean
  onTap?: () => void
  tapLabel?: string
}) {
  const face =
    finish.kind === 'coin' ? <Coin size={24} /> : finish.kind === 'emoji' ? finish.emoji : '🎁'
  const style = reached
    ? { background: 'var(--coin-tint)', boxShadow: 'var(--shadow-card)' }
    : { border: '2px dashed var(--border)' }
  const cls = 'grid size-11 shrink-0 place-items-center rounded-full text-[20px]'

  if (onTap) {
    return (
      <button
        type="button"
        className={`${cls} cursor-pointer`}
        style={style}
        aria-label={tapLabel}
        onClick={onTap}
      >
        {face}
      </button>
    )
  }
  return (
    <span className={cls} style={style} aria-hidden>
      {face}
    </span>
  )
}
