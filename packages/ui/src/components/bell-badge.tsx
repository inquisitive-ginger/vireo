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
  /** Fold mode — matches the responsive sidebar rail: icon-over-label (centered)
   * below `xl`, label-beside at `xl`+. Count sits as a corner badge when slim,
   * inline at the row end when expanded. Use only inside the shell sidebar. */
  fold?: boolean
}

function severityClass(severity: BadgeSeverity): string {
  if (!severity || severity === 'success' || severity === 'info')
    return 'bg-accent text-accent-foreground'
  if (severity === 'warning') return 'bg-warning text-warning-foreground'
  return 'bg-error text-error-foreground'
}

export function BellBadge({
  count,
  maxSeverity,
  onClick,
  className,
  compact,
  fold,
}: BellBadgeProps) {
  const ariaLabel =
    count > 0 ? `${count} unread notification${count > 1 ? 's' : ''}` : 'Notifications'

  if (fold) {
    return (
      <Button
        variant="ghost"
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(
          'relative flex flex-col xl:flex-row items-center justify-center xl:justify-start',
          'gap-1 xl:gap-3 w-full py-2 xl:py-2.5 xl:px-3 min-h-touch h-auto rounded-panel',
          'text-muted-foreground hover:bg-secondary/70 hover:text-foreground',
          className
        )}
      >
        <Bell size={18} aria-hidden />
        <span className="text-xs-body xl:text-sm leading-tight xl:flex-1 xl:text-left font-normal">
          <span className="xl:hidden">Alerts</span>
          <span className="hidden xl:inline">Notifications</span>
        </span>
        {count > 0 && (
          <span
            className={cn(
              'absolute top-1 right-1 xl:static flex items-center justify-center',
              'min-w-4 h-4 rounded-full px-1 text-xs-token font-bold leading-none shrink-0',
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
              'absolute top-1.5 right-1.5 size-2 rounded-full',
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
        'w-full justify-start gap-3 px-3 py-2.5 min-h-touch h-auto',
        'text-muted-foreground hover:bg-secondary hover:text-foreground',
        className
      )}
    >
      <Bell size={18} aria-hidden />
      <span className="flex-1 text-sm text-left font-normal">Notifications</span>
      {count > 0 && (
        <span
          className={cn(
            'flex items-center justify-center min-w-4 h-4 rounded-full px-1',
            'text-xs-token font-bold leading-none shrink-0',
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
