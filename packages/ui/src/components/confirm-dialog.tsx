import { createPortal } from 'react-dom'
import { Button } from './button'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isPending?: boolean
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  isPending,
}: ConfirmDialogProps) {
  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'oklch(0.18 0.04 50 / 0.35)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className="bg-background border border-border rounded-xl p-6 w-[340px]"
        style={{ boxShadow: '0 12px 40px oklch(0.18 0.04 50 / 0.12)' }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-body"
      >
        <h3 id="confirm-dialog-title" className="text-card-title mb-2 text-foreground">
          {title}
        </h3>
        <p
          id="confirm-dialog-body"
          className="text-[13px] text-muted-foreground leading-relaxed mb-5"
        >
          {description}
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive text-error-foreground hover:bg-destructive/90"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
