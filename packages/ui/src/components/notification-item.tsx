import { CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '../lib/utils'

export type NotifyVariant = 'success' | 'info' | 'warning' | 'error'

export interface NotificationItemProps {
  title: string
  body?: string | null
  variant: NotifyVariant
  createdAt: string
  className?: string
}

const VARIANT_ICON: Record<
  NotifyVariant,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
}

const VARIANT_COLOR: Record<NotifyVariant, string> = {
  success: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  error: 'text-error',
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NotificationItem({
  title,
  body,
  variant,
  createdAt,
  className,
}: NotificationItemProps) {
  const Icon = VARIANT_ICON[variant]
  return (
    <div className={cn('flex gap-3 px-4 py-3 border-b border-border last:border-0', className)}>
      <Icon size={16} className={cn('mt-0.5 shrink-0', VARIANT_COLOR[variant])} aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-snug">{title}</p>
        {body && (
          <p className="text-sm text-muted-foreground leading-snug mt-0.5 line-clamp-2">{body}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(createdAt)}</p>
      </div>
    </div>
  )
}
