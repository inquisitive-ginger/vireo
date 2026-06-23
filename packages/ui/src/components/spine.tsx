import { cn } from '../lib/utils'

export interface SpineProps {
  /** The spine color — any CSS color or `var(--…)`. Carries no semantic on its
      own: the call site decides identity vs. status (see design-system.md
      "Status vs identity colour"). Pass `identityColor(name)` on multi-person
      surfaces, a status color on single-person ones. */
  color: string
  /** Float the spine shorter than the row, inset from its top/bottom edges — the
      dense filled-pill recipe (widget rows). Default `false` → self-stretches to
      the full content box (card/list rows). */
  inset?: boolean
  className?: string
}

/* The 4px leading-edge spine — a vertical color bar that codes a row to a family
   member (identity hue) or a status (neutral / overdue / done). Shape only: a
   flex child that self-stretches to the content box, 4px wide, 2px radius. The
   placement is standardized here so the row surfaces across chores, feed, and
   calendar stop hand-rolling the same inline <span>. Render it as the first
   child of a `flex` row that carries the gap to the content. */
export function Spine({ color, inset = false, className }: SpineProps) {
  return (
    <span
      aria-hidden
      className={cn('w-1 shrink-0 self-stretch rounded-sm', inset && 'my-2', className)}
      style={{ background: color }}
    />
  )
}
