import type { CSSProperties, ElementType, ReactNode } from 'react'
import { Spine } from './spine'
import { cn } from '../lib/utils'

export interface ItemCardProps {
  /** Leading 4px spine hue(s) — any CSS color or `var(--…)`. Pass an array of
      member hues for a split spine (multi-person rows); omit for no spine. The
      spine carries no semantic on its own: the call site decides identity vs.
      status (see design-system.md "Status vs identity colour"). */
  spine?: string | string[]
  /** Dashed spine — identity's absence rendered (see `SpineProps.dashed`). */
  spineDashed?: boolean
  /** `card` — elevated row chrome: `--radius-card` corners, border, `--card`
      fill, `--shadow-card`, and the standard `px-4 py-3`. `bare` — layout only,
      no chrome/padding, for surfaces that own their container (widget slots). */
  chrome?: 'card' | 'bare'
  /** Cross-axis alignment of the row's columns. `stretch` (default) for
      multi-line content; `center` for a single dominant line paired with a
      trailing control (the chores completion circle). The spine always
      self-stretches regardless. */
  align?: 'center' | 'stretch'
  /** Dim the row — e.g. a completed task. Pairs with `transition-opacity` on
      `className` when the dim should animate. */
  dimmed?: boolean
  /** Control pinned to the row's trailing edge, outside the content column
      (e.g. a completion toggle). */
  trailing?: ReactNode
  /** Makes the row's passive area a single tap target (tap-row-to-edit). ItemCard
      stretches a transparent button across itself and lifts `trailing` above it,
      so the trailing controls stay clickable. This is the primary edit affordance
      on touch, where the explicit pencil is hidden — see `RowActions`.

      The row owns its own tap surface because it owns its own radius and chrome:
      chores and calendar each hand-rolled this overlay (and each cited the other
      as the source) before it moved here. */
  onActivate?: () => void
  /** Accessible name for the tap target. Required whenever `onActivate` is set —
      "Edit “Vacuum”", not "Edit". */
  activateLabel?: string
  /** Chrome wrapper tag. Default `div`; feed posts render as `article`. */
  as?: ElementType
  className?: string
  /** Dynamic row fill — the one value that can't be a token class. Chores paints
      an overdue wash here: identity owns the spine, so status owns the field
      (ADR 043). Genuinely-dynamic inline values are sanctioned by ADR 035. */
  style?: CSSProperties
  /** The content column. Provide your own `min-w-0 flex-1` wrapper so the row
      truncates correctly — ItemCard owns the spine/chrome/trailing, not the
      content's internal layout. */
  children: ReactNode
}

/* The shared card-row skeleton: a `flex` row that hangs a leading `<Spine>`, a
   content column, and an optional trailing control off one standardized chrome.
   Absorbs the `flex + Spine + rounded/border/bg-card/shadow-card` recipe that
   feed (`FeedPostCard`), chores (`TaskCard`), and calendar (`EventRow`) each
   hand-rolled — and had drifted (14px vs 8px radius, three paddings). One
   `--radius-card` + `px-4 py-3` here keeps them in lockstep.

   Styled utility-first like the shell (ADR 035); the only dynamic value is the
   spine color, which `<Spine>` keeps inline. */
export function ItemCard({
  spine,
  spineDashed = false,
  chrome = 'card',
  align = 'stretch',
  dimmed = false,
  trailing,
  onActivate,
  activateLabel,
  as,
  className,
  style,
  children,
}: ItemCardProps) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      className={cn(
        'flex gap-3',
        align === 'center' ? 'items-center' : 'items-stretch',
        chrome === 'card' &&
          'rounded-card border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)]',
        dimmed && 'opacity-[0.66]',
        onActivate && 'relative',
        className
      )}
      style={style}
    >
      {spine !== undefined && <Spine color={spine} dashed={spineDashed} />}
      {onActivate && (
        <button
          type="button"
          onClick={onActivate}
          aria-label={activateLabel}
          className="absolute inset-0 z-10 cursor-pointer rounded-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
        />
      )}
      {children}
      {/* Lifted above the tap overlay so the row's real controls still win the click. */}
      {trailing !== undefined &&
        (onActivate ? (
          <div className="relative z-20 flex shrink-0 items-center gap-0.5">{trailing}</div>
        ) : (
          trailing
        ))}
    </Tag>
  )
}
