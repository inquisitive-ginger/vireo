import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

/** What kind of page this is — not how many pixels wide it is. */
export type PageWidth = 'prose' | 'list' | 'wide' | 'full'

export interface PageContainerProps {
  /** `prose` — a reading column (the feed: Lora body, 680px).
      `list`  — a scannable row list (chores board, settings: 840px).
      `wide`  — a canvas that needs room (the calendar month grid: 1100px).
      `full`  — no max width (the home dashboard grid fills the viewport). */
  width: PageWidth
  className?: string
  children: ReactNode
}

const WIDTH_CLASS: Record<PageWidth, string> = {
  prose: 'mx-auto w-full max-w-content',
  list: 'mx-auto w-full max-w-list',
  wide: 'mx-auto w-full max-w-wide',
  full: 'w-full',
}

/* The page-level container. Every route surface composes it.
 *
 * A page states its ROLE, not a number. Before this existed, the six page
 * surfaces had six different recipes — chores and feed agreed at 680px by
 * coincidence, the calendar hardcoded an arbitrary `max-w-[1100px]` beside a
 * token that existed to prevent exactly that, and Settings had drifted onto
 * Tailwind's stock `max-w-2xl` (672px — 8px off ours) *without* `mx-auto`, so it
 * quietly hugged the left edge while its siblings sat centred. None of that was
 * decided; it accumulated.
 *
 * The padding is deliberately not a prop: one horizontal rhythm across every
 * route is the point. A surface that needs to break the gutter (a full-bleed
 * month grid) does it on its own child, not by re-negotiating the page frame.
 */
export function PageContainer({ width, className, children }: PageContainerProps) {
  return (
    <div className={cn(WIDTH_CLASS[width], 'px-4 pt-6 pb-12 sm:px-6', className)}>{children}</div>
  )
}
