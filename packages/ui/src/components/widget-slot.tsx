import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface WidgetSlotProps {
  children: ReactNode
  className?: string
  /** Flat slots omit card chrome (bg, border, shadow). Use for placeholder and error states. */
  flat?: boolean
}

export function WidgetSlot({ children, className, flat }: WidgetSlotProps) {
  return (
    <div
      className={cn(
        'h-full w-full overflow-hidden rounded-xl',
        !flat && 'bg-card border border-border shadow-[var(--shadow-card)]',
        className
      )}
    >
      {children}
    </div>
  )
}
