import { useRef, useState } from 'react'
import { useDrag } from '@use-gesture/react'
import { CheckCircle, Info, AlertTriangle, XCircle, X, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './button'

export type NotifyVariant = 'success' | 'info' | 'warning' | 'error'

export interface NotificationItemProps {
  title: string
  body?: string | null
  variant: NotifyVariant
  createdAt: string
  isRead?: boolean
  onDelete?: () => void
  className?: string
}

const VARIANT_ICON: Record<
  NotifyVariant,
  React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
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

const DISMISS_THRESHOLD = 100

type AnimEasing = 'none' | 'snap' | 'dismiss'

export function NotificationItem({
  title,
  body,
  variant,
  createdAt,
  isRead = false,
  onDelete,
  className,
}: NotificationItemProps) {
  const Icon = VARIANT_ICON[variant]
  const [hovered, setHovered] = useState(false)
  const [anim, setAnim] = useState<{ x: number; easing: AnimEasing }>({ x: 0, easing: 'none' })
  const dismissingRef = useRef(false)

  const bind = useDrag(
    ({ movement: [mx], velocity: [vx], direction: [dx], last }) => {
      const clamped = Math.min(0, mx)
      if (last) {
        const flick = vx > 0.5 && dx < 0
        if (flick || clamped < -DISMISS_THRESHOLD) {
          dismissingRef.current = true
          setAnim({ x: -480, easing: 'dismiss' })
        } else {
          setAnim({ x: 0, easing: 'snap' })
        }
      } else {
        setAnim({ x: clamped, easing: 'none' })
      }
    },
    {
      axis: 'x',
      filterTaps: true,
      pointer: { mouse: false },
    }
  )

  const transitionStyle: string =
    anim.easing === 'dismiss'
      ? 'transform 180ms ease-in'
      : anim.easing === 'snap'
        ? 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        : 'none'

  const backdropOpacity = Math.min(1, Math.abs(anim.x) / DISMISS_THRESHOLD)

  function handleTransitionEnd(e: React.TransitionEvent) {
    if (e.propertyName !== 'transform') return
    if (dismissingRef.current) {
      onDelete?.()
    } else {
      setAnim({ x: 0, easing: 'none' })
    }
  }

  return (
    <div
      className={cn('relative overflow-hidden border-b border-border last:border-0', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* swipe backdrop — red strip revealed as item slides left */}
      {onDelete && (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-end pr-4 bg-error"
          style={{ opacity: backdropOpacity }}
        >
          <Trash2 size={14} className="text-error-foreground" />
        </div>
      )}

      {/* sliding content */}
      <div
        {...(onDelete ? bind() : {})}
        className="flex items-start gap-2.5 px-4 py-3 bg-background"
        style={{
          touchAction: 'pan-y',
          borderLeft: isRead ? '3px solid transparent' : '3px solid var(--accent)',
          transform: `translateX(${anim.x}px)`,
          transition: transitionStyle,
          willChange: anim.x !== 0 ? 'transform' : 'auto',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <Icon
          size={15}
          className={cn('shrink-0 mt-0.5', VARIANT_COLOR[variant])}
          style={{ opacity: isRead ? 0.45 : 1 }}
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p
              className="text-sm leading-snug truncate"
              style={{
                fontWeight: isRead ? 400 : 600,
                color: isRead ? 'var(--muted-foreground)' : 'var(--foreground)',
              }}
            >
              {title}
            </p>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="text-xs text-muted-foreground"
                style={{ opacity: isRead ? 0.6 : 0.85 }}
              >
                {formatRelativeTime(createdAt)}
              </span>
              {onDelete && hovered && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                  aria-label={`Delete notification: ${title}`}
                >
                  <X size={10} />
                </Button>
              )}
            </div>
          </div>
          {body && (
            <p className="text-sm text-muted-foreground leading-snug mt-0.5 line-clamp-2">{body}</p>
          )}
        </div>
      </div>
    </div>
  )
}
