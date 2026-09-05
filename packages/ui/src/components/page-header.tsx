import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface PageHeaderProps {
  /** The page title (rendered as the `page-title` token, Lora). */
  title: ReactNode
  /** Small uppercase label above the title (e.g. a section eyebrow). */
  eyebrow?: ReactNode
  /** A line below the title — a summary or count strip. */
  subtitle?: ReactNode
  /** Trailing action(s), aligned to the title row (e.g. a primary button). */
  action?: ReactNode
  /** A strip that switches the panel below — a `TabBar` of peer surfaces. It
      binds to what it switches, so it sits inside the header's own bottom
      margin rather than negotiating one with the panel. */
  nav?: ReactNode
  className?: string
}

/* The shared page header for plugin/route pages: an optional eyebrow, the page
   title, an optional subtitle line, and a trailing action — on one consistent
   baseline so every page (Family Feed, Chores, …) aligns. Compose it inside
   `PageContainer`, which owns the gutter.

   The header owns the air on BOTH sides of its title (ADR 074) — `pt-2 md:pt-4`
   above, on top of the frame's inset, and `mb-6` below. A surface that renders
   no title pays neither.

   It owns the nav strip's space for the same reason: the strip binds to the
   panel it switches, so the header's bottom margin IS the strip's, and no caller
   does the arithmetic. Six surfaces had six answers before this.

   One flex row that wraps, rather than a column: the count on Shopping's header
   rides the title's baseline via `items-baseline`, which only reaches the title
   row while the header IS that row. `min-w-0` on the title block means it and
   the action never wrap; only `basis-full` on the strip does. */
export function PageHeader({ title, eyebrow, subtitle, action, nav, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'mb-6 flex flex-wrap items-start justify-between gap-x-4 pt-2 md:pt-4',
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && <div className="text-section-label mb-1.5 text-accent">{eyebrow}</div>}
        <h1 className="text-page-title m-0 text-foreground">{title}</h1>
        {subtitle && <p className="text-sm-token mt-1.5 text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {nav && <div className="mt-4 basis-full">{nav}</div>}
    </header>
  )
}
