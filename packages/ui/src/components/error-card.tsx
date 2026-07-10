import { AlertTriangle } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './button'

export interface ErrorCardProps {
  moduleName: string
  onRetry?: () => void
  className?: string
}

export function ErrorCard({ moduleName, onRetry, className }: ErrorCardProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-3 px-5 py-5',
        'bg-muted text-center',
        className
      )}
      role="alert"
      aria-label={`${moduleName} — failed to load`}
    >
      <AlertTriangle
        className="size-6 text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm-token font-medium leading-none tracking-[0.01em] text-muted-foreground">
          {moduleName} couldn't load
        </span>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs-body text-muted-foreground hover:text-foreground"
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
