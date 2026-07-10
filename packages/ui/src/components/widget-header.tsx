import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

/* The settled home-widget identity header: a muted module glyph beside a
   `text-section-label` name, with an optional trailing slot (score / pill / XP)
   pushed to the right. Shared by every content widget so the anatomy is defined
   once (chores today-summary, calendar up-next, family-feed). */

export interface WidgetHeaderProps {
  icon: LucideIcon
  label: string
  /** Right-aligned slot — a score coin, overdue pill, daily XP, etc. */
  trailing?: ReactNode
  className?: string
}

export function WidgetHeader({ icon: Icon, label, trailing, className }: WidgetHeaderProps) {
  return (
    <div className={cn('flex shrink-0 items-center gap-1.5', className)}>
      <Icon size={13} className="text-muted-foreground" aria-hidden />
      <span className="text-section-label flex-1">{label}</span>
      {trailing}
    </div>
  )
}
