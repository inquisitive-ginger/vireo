import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

/** The elevation-ladder rung a live widget slot renders at (design-system.md
    §Widget prominence). Exactly one `feature` per home surface. */
export type WidgetProminence = 'feature' | 'card' | 'quiet'

export interface WidgetSlotProps {
  children: ReactNode
  className?: string
  /**
   * Prominence rung — the shell's elevation ladder. `feature` lifts most (raised
   * shadow, hero radius, no border), `card` rests (card shadow + soft hairline),
   * `quiet` recedes into a recessed surface with no lift. Defaults to `card`.
   * Ignored when `flat` is set.
   */
  prominence?: WidgetProminence
  /**
   * Flat slots carry only a clipped shape, no elevation — the placeholder
   * (not-installed) and error states ONLY. A flat slot is **not** the `quiet`
   * rung: quiet is a live widget that recedes; flat is not-content. Overrides
   * `prominence`.
   */
  flat?: boolean
}

/** Rung chrome. Hierarchy is carried by surface + depth, not a uniform border —
    only the recessed `quiet` rung and the resting `card` carry an edge, and the
    `feature` rung leans entirely on the raised shadow. */
const PROMINENCE_CHROME: Record<WidgetProminence, string> = {
  feature: 'rounded-hero bg-card shadow-[var(--shadow-raised)]',
  card: 'rounded-panel bg-card border border-border/50 shadow-[var(--shadow-card)]',
  quiet: 'rounded-panel border border-border/40 bg-secondary/60',
}

export function WidgetSlot({ children, className, prominence = 'card', flat }: WidgetSlotProps) {
  return (
    <div
      className={cn(
        'h-full w-full overflow-hidden',
        flat ? 'rounded-xl' : PROMINENCE_CHROME[prominence],
        className
      )}
    >
      {children}
    </div>
  )
}
