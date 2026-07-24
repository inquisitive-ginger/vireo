import type { ReactNode } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Button } from './button'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  /** Body copy — a string, or rich content when parts need emphasis. */
  description: ReactNode
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isPending?: boolean
  /** An optional second destructive choice rendered above the primary confirm —
      e.g. the calendar's "Just this week" vs. "All events" for a recurring event.
      When set the actions stack full-width (least-destructive first). */
  secondaryLabel?: string
  onSecondary?: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  isPending,
  secondaryLabel,
  onSecondary,
}: ConfirmDialogProps) {
  const hasSecondary = Boolean(secondaryLabel && onSecondary)
  return (
    <AlertDialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[60] bg-black/15 backdrop-blur-[1px]" />
        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-[340px] focus:outline-none"
          style={{ boxShadow: 'var(--shadow-raised)' }}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => isPending && e.preventDefault()}
        >
          <AlertDialog.Title className="text-card-title mb-2 text-foreground">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm-token text-muted-foreground leading-relaxed mb-5">
            {description}
          </AlertDialog.Description>
          {hasSecondary ? (
            // Two destructive choices → stack full-width, least-destructive first,
            // Cancel last.
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSecondary}
                disabled={isPending}
                className="w-full"
              >
                {secondaryLabel}
              </Button>
              <Button
                size="sm"
                onClick={onConfirm}
                disabled={isPending}
                className="w-full bg-destructive text-error-foreground hover:bg-destructive/90"
              >
                {confirmLabel}
              </Button>
              <AlertDialog.Cancel asChild>
                <Button variant="ghost" size="sm" disabled={isPending} className="w-full">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
            </div>
          ) : (
            <div className="flex gap-2 justify-end">
              <AlertDialog.Cancel asChild>
                <Button variant="ghost" size="sm" disabled={isPending}>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <Button
                size="sm"
                onClick={onConfirm}
                disabled={isPending}
                className="bg-destructive text-error-foreground hover:bg-destructive/90"
              >
                {confirmLabel}
              </Button>
            </div>
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
