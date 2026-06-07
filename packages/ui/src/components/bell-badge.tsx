import { Bell } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './button'

export type BadgeSeverity = 'success' | 'info' | 'warning' | 'error' | null

export interface BellBadgeProps {
  count: number
  maxSeverity: BadgeSeverity
  onClick: () => void
  className?: string
}

function severityClass(severity: BadgeSeverity): string {
  if (!severity || severity === 'success' || severity === 'info') return 'bg-accent'
  if (severity === 'warning') return 'bg-warning'
  return 'bg-error'
}

export function BellBadge({ count, maxSeverity, onClick, className }: BellBadgeProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-label={
        count > 0 ? `${count} unread notification${count > 1 ? 's' : ''}` : 'Notifications'
      }
      className={cn(
        'w-full justify-start gap-3 px-3 py-2.5 min-h-[48px] h-auto',
        'text-muted-foreground hover:bg-secondary hover:text-foreground',
        className
      )}
    >
      <Bell size={18} aria-hidden />
      <span className="flex-1 text-sm text-left font-normal">Notifications</span>
      {count > 0 && (
        <span
          className={cn(
            'flex items-center justify-center min-w-[18px] h-[18px] rounded-full px-1',
            'text-xs font-bold text-white leading-none shrink-0',
            severityClass(maxSeverity)
          )}
          aria-hidden
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  )
}
