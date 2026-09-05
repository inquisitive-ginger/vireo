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
  className?: string
}

/* The shared page header for plugin/route pages: an optional eyebrow, the page
   title, an optional subtitle line, and a trailing action — on one consistent
   baseline so every page (Family Feed, Chores, …) aligns. Compose it inside
   `PageContainer`, which owns the gutter.

   The header owns the air on BOTH sides of its title (ADR 074) — `pt-2 md:pt-4`
   above, on top of the frame's inset, and `mb-6` below. A surface that renders
   no title pays neither. */
export function PageHeader({ title, eyebrow, subtitle, action, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-6 flex items-start justify-between gap-4 pt-2 md:pt-4', className)}>
      <div className="min-w-0">
        {eyebrow && <div className="text-section-label mb-1.5 text-accent">{eyebrow}</div>}
        <h1 className="text-page-title m-0 text-foreground">{title}</h1>
        {subtitle && <p className="text-sm-token mt-1.5 text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
