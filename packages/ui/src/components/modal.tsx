import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

/* A centered modal — the app's focused-decision surface, distinct from the `Drawer`
   (the create/edit capture rail) and `ConfirmDialog` (a fixed destructive confirm). Use
   it for a one-tap decision that wants its own bespoke content (the reward redeem
   confirm). Provide the accessible `title` (rendered visually-hidden) and your own
   visible heading in `children`. */
export interface ModalProps {
  open: boolean
  onClose: () => void
  /** Accessible name — rendered visually-hidden; put the visible heading in children. */
  title: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[1px]" />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            'fixed left-1/2 top-1/2 z-[60] w-[320px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2',
            'rounded-hero border border-border bg-card p-6 focus:outline-none',
            className
          )}
          style={{ boxShadow: 'var(--shadow-raised)' }}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
