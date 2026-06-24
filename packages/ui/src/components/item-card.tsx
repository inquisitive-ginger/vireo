import type { ElementType, ReactNode } from 'react'
import { Spine } from './spine'
import { cn } from '../lib/utils'

export interface ItemCardProps {
  /** Leading 4px spine hue(s) — any CSS color or `var(--…)`. Pass an array of
      member hues for a split spine (multi-person rows); omit for no spine. The
      spine carries no semantic on its own: the call site decides identity vs.
      status (see design-system.md "Status vs identity colour"). */
  spine?: string | string[]
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
  /** Chrome wrapper tag. Default `div`; feed posts render as `article`. */
  as?: ElementType
  className?: string
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
  chrome = 'card',
  align = 'stretch',
  dimmed = false,
  trailing,
  as,
  className,
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
        className
      )}
    >
      {spine !== undefined && <Spine color={spine} />}
      {children}
      {trailing}
    </Tag>
  )
}
