import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface ListRowProps {
  /** The row's leading control — a check ring, a static marker, whatever the
      consumer needs. `ListRow` renders it, it does not define it (ADR 063: the
      primitive takes a generic slot so a later story, e.g. an interactive
      check, can fill it without a prop-shape change here). Lifted above the
      activation overlay when both are present, same reasoning as `trailing`. */
  leading?: ReactNode
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
        'relative flex items-center gap-3 border-b border-border',
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
          // 4px dead band top and bottom, so neighbouring targets are 8px
          // apart (ADR 068). A tap in the band does nothing, which is the
          // point: a no-op costs one tap, a mis-toggle corrupts the list
          // someone is reading in a shop. The hairline does not move — it is
          // the row's own border, not the target's edge.
          className="absolute inset-x-0 inset-y-1 z-10 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
        />
      )}
      {leading !== undefined && (
        <div className={cn('flex shrink-0 items-center', onActivate && 'relative z-20')}>
          {leading}
        </div>
      )}
      {children}
    </Tag>
  )
}
