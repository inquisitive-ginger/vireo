import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

/** What kind of page this is — not how many pixels wide it is. */
export type PageWidth = 'prose' | 'list' | 'wide' | 'full'

export interface PageContainerProps {
  /** `prose` — a reading column (the feed: Lora body, 680px).
      `list`  — a scannable row list (chores board, settings: 840px).
      `wide`  — a canvas that needs room (the calendar month grid: 1400px).
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
 *
 * The inset is symmetric on three sides and steps at `md:`, with the shell
 * chrome. The air above a TITLE is `PageHeader`'s, not the frame's (ADR 074):
 * Home, the calendar's tablet surface and the shopping hero render no title into
 * that slot, and were paying for a header they do not have. The bottom is
 * shorter on a phone because the shell already reserves the tab bar beneath it.
 */
export function PageContainer({ width, className, children }: PageContainerProps) {
  return (
    <div className={cn(WIDTH_CLASS[width], 'px-4 pt-4 pb-6 md:px-6 md:pt-6 md:pb-12', className)}>
      {children}
    </div>
  )
}
