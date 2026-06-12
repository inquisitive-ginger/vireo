import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface WidgetSlotProps {
  children: ReactNode
  className?: string
}

export function WidgetSlot({ children, className }: WidgetSlotProps) {
  return (
    <div
      className={cn(
        'h-full w-full overflow-hidden rounded-xl',
        'bg-card border border-border shadow-[var(--shadow-card)]',
        className
      )}
    >
      {children}
    </div>
  )
}
