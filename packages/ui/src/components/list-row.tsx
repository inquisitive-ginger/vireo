import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface ListRowProps {
  /** The row's leading control — a check ring, a static marker, whatever the
      consumer needs. `ListRow` renders it, it does not define it (ADR 063: the
      primitive takes a generic slot so a later story, e.g. an interactive
      check, can fill it without a prop-shape change here).

      On an activatable row the slot is painted above the overlay but is INERT:
      a decorative marker there would otherwise punch a dead hole through the
      row's own target, dead-centre on the affordance the thumb aims for. A
      leading control that is genuinely interactive opts back in with
      `pointer-events-auto` on itself — it keeps the z-order either way. */
  leading?: ReactNode
  /** The row's trailing control — a correction menu, an inline action. Lifted
      above the activation overlay so it stays tappable on a row that is itself
      a target; a control the overlay swallows is a control that does nothing. */
  trailing?: ReactNode
  /** Dim the row — e.g. a checked-off item. */
  dimmed?: boolean
  /** Makes the row's passive area a single tap target — the `ItemCard`
      tap-row-to-edit affordance, ported to the row primitive. */
  onActivate?: () => void
  /** Accessible name for the tap target. Required whenever `onActivate` is set. */
  activateLabel?: string
  /** Wrapper tag. Default `div`. */
  as?: ElementType
  className?: string
  style?: CSSProperties
  /** The content column. Provide your own `min-w-0 flex-1` wrapper so the row
      truncates correctly — `ListRow` owns the leading slot and the hairline,
      not the content's internal layout. */
  children: ReactNode
}

/* The second row primitive (ADR 063), beside `ItemCard`: hairline-separated,
   no per-row border/shadow/radius — a set of rows scanned together, not
   independent objects. Cards when items carry several actions of their own
   (the meals week plan); rows when a list is scanned and acted on one way
   (groceries). See design-system.md "The card-row primitive" for the rule. */
export function ListRow({
  leading,
  trailing,
  dimmed = false,
  onActivate,
  activateLabel,
  as,
  className,
  style,
  children,
}: ListRowProps) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      className={cn(
        'relative flex items-center gap-3 border-b border-border px-4',
        dimmed && 'opacity-[0.66]',
        onActivate && 'cursor-pointer',
        className,
        // After `className` on purpose (ADR 068): the primitive owns its floor
        // and tailwind-merge drops a consumer's competing `min-h-*` rather than
        // honouring it. The arbitrary form is load-bearing — the named utility
        // isn't recognised as a `min-h`, so both classes survive and the winner
        // falls to CSS source order.
        'min-h-[var(--spacing-list-touch)]'
      )}
      style={style}
    >
      {onActivate && (
        <button
          type="button"
          onClick={onActivate}
          aria-label={activateLabel}
          // Derived, not chosen (ADR 068 §3): the overlay lays out against the
          // PADDING box, which the `border-b` sits outside of, so the box being
          // inset is 55px, not 56. `(56 − 1 − 48) / 2 = 3.5` is the gutter that
          // leaves a 48px live target — `--spacing-touch`, declared since the
          // 2026-07-10 audit — with `3.5 + 1 + 3.5 = 8px` of dead band between
          // neighbours. Re-derive it if the row floor, the hairline, or
          // `--spacing-touch` moves; do not round it back to `inset-y-1`, which
          // measures 47/9. A tap in the band does nothing, which is the point:
          // a no-op costs one tap, a mis-toggle corrupts the list someone is
          // reading in a shop. The hairline itself does not move.
          className="absolute inset-x-0 inset-y-[3.5px] z-10 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
        />
      )}
      {leading !== undefined && (
        <div
          className={cn(
            'flex shrink-0 items-center',
            // Above the overlay in paint order, below it in hit-testing.
            // `pointer-events: none` on the ring alone is not enough — the hit
            // resolves to this wrapper, which has no handler and swallows it.
            onActivate && 'relative z-20 pointer-events-none'
          )}
        >
          {leading}
        </div>
      )}
      {children}
      {trailing !== undefined && (
        <div className={cn('flex shrink-0 items-center', onActivate && 'relative z-20')}>
          {trailing}
        </div>
      )}
    </Tag>
  )
}
