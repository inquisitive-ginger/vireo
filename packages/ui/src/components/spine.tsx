import { cn } from '../lib/utils'

export interface SpineProps {
  /** The spine color(s). A single color (or a one-element array) paints a solid
      bar; **multiple colors paint a vertical hard-stop split** — one band per
      member, top to bottom, reading as stacked identity lanes (the multi-person
      calendar recipe, not a blended hue). Each entry is any CSS color or
      `var(--…)`. Carries no semantic on its own: the call site decides identity
      vs. status (see design-system.md "Status vs identity colour"). Pass member
      hues on multi-person surfaces, a status color on single-person ones. */
  color: string | string[]
  /** Float the spine shorter than the row, inset from its top/bottom edges — the
      dense filled-pill recipe (widget rows). Default `false` → self-stretches to
      the full content box (card/list rows). */
  inset?: boolean
  /** Render the bar as dashes — identity's absence, not an identity (the meals
      unclaimed-day recipe, design.md §M5/2). Single color only: a split spine
      states who is present, which is exactly what a dashed spine states isn't. */
  dashed?: boolean
  className?: string
}

/* Build the bar fill: one color → solid; many → a vertical gradient of hard-edged
   stops, an equal band per color (the split-spine recipe, mirrored from the
   month-grid lane fills in `lib/hues`). */
function spineFill(color: string | string[]): string {
  if (!Array.isArray(color)) return color
  if (color.length <= 1) return color[0] ?? 'transparent'
  const n = color.length
  const stops = color
    .map((c, i) => `${c} ${Math.round((i / n) * 100)}% ${Math.round(((i + 1) / n) * 100)}%`)
    .join(', ')
  return `linear-gradient(180deg, ${stops})`
}

/* The 4px leading-edge spine — a vertical color bar that codes a row to a family
   member (identity hue), several members (a split bar), or a status (neutral /
   overdue / done). Shape only: a flex child that self-stretches to the content
   box, 4px wide, 2px radius. The placement is standardized here so the row
   surfaces across chores, feed, and calendar stop hand-rolling the same inline
   <span>. Render it as the first child of a `flex` row that carries the gap to
   the content. */
export function Spine({ color, inset = false, dashed = false, className }: SpineProps) {
  const solid = Array.isArray(color) ? (color[0] ?? 'transparent') : color
  return (
    <span
      aria-hidden
      className={cn('w-1 shrink-0 self-stretch rounded-full', inset && 'my-2', className)}
      style={{
        background: dashed
          ? `repeating-linear-gradient(180deg, ${solid} 0 10px, transparent 10px 15px)`
          : spineFill(color),
      }}
    />
  )
}
