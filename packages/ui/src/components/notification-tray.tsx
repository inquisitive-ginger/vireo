import * as Dialog from '@radix-ui/react-dialog'
import { X, Bell } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/utils'
import { Button } from './button'
import { EmptyState } from './empty-state'
import { NotificationItem } from './notification-item'
import type { NotifyVariant } from './notification-item'

export interface NotificationEntry {
  id: string
  title: string
  body?: string | null
  variant: NotifyVariant
  createdAt: string
  isRead: boolean
}

export interface NotificationTrayProps {
  open: boolean
  onClose: () => void
  notifications: NotificationEntry[]
  onDeleteNotification?: (id: string) => void
  onClearAll?: () => void
  loading?: boolean
  /** Pinned below the scroll region — the tray's standing actions, which must stay
      reachable when the list is long enough to scroll (ADR 046's report entry). */
  footer?: ReactNode
  className?: string
}

export function NotificationTray({
  open,
  onClose,
  notifications,
  onDeleteNotification,
  onClearAll,
  loading = false,
  footer,
  className,
}: NotificationTrayProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/20" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col',
            'bg-card border-l border-border shadow-[var(--shadow-raised)]',
            'animate-tray-in focus:outline-none',
            className
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4">
            <Dialog.Title className="text-card-title flex items-center gap-2">
              <Bell size={16} aria-hidden />
              Notifications
            </Dialog.Title>
            <div className="flex items-center gap-1">
              {onClearAll && notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-7 px-2"
                  onClick={onClearAll}
                >
                  Clear all
                </Button>
              )}
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 p-0"
                  aria-label="Close notifications"
                >
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex h-48 items-center justify-center">
                <EmptyState icon={Bell} heading="No notifications" body="You're all caught up." />
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  title={n.title}
                  body={n.body}
                  variant={n.variant}
                  createdAt={n.createdAt}
                  isRead={n.isRead}
                  onDelete={onDeleteNotification ? () => onDeleteNotification(n.id) : undefined}
                />
              ))
            )}
          </div>

          {footer && (
            <div className="shrink-0 border-t border-border px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
