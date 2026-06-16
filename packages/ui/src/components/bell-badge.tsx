import { Bell } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './button'

export type BadgeSeverity = 'success' | 'info' | 'warning' | 'error' | null

export interface BellBadgeProps {
  count: number
  maxSeverity: BadgeSeverity
  onClick: () => void
  className?: string
  /** Icon-only mode — hides the label and count bubble; shows a small dot indicator instead. Use in compact surfaces like a top bar. */
  compact?: boolean
}

function severityClass(severity: BadgeSeverity): string {
  if (!severity || severity === 'success' || severity === 'info') return 'bg-accent'
  if (severity === 'warning') return 'bg-warning'
  return 'bg-error'
}

export function BellBadge({ count, maxSeverity, onClick, className, compact }: BellBadgeProps) {
  const ariaLabel =
    count > 0 ? `${count} unread notification${count > 1 ? 's' : ''}` : 'Notifications'

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn('relative text-muted-foreground hover:bg-primary/10', className)}
      >
        <Bell size={18} aria-hidden />
        {count > 0 && (
          <span
            className={cn(
              'absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full',
              severityClass(maxSeverity)
            )}
            aria-hidden
          />
        )}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-label={ariaLabel}
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
