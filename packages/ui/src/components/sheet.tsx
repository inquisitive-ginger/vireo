import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

/* A bottom sheet — the answer-a-question surface, distinct from the `Drawer` (the
   create/edit capture rail) and `Modal` (a centered one-tap decision). Use it for
   content a user pulls up, reads, and dismisses (the wallet history). Rises from the
   bottom edge, caps its height, and scrolls inside; the grab bar is the visual cue
   that it dismisses, Radix handles Esc/overlay. Provide the accessible `title`
   (rendered visually-hidden) and your own visible heading in `children`. */
export interface SheetProps {
  open: boolean
  onClose: () => void
  /** Accessible name — rendered visually-hidden; put the visible heading in children. */
  title: string
  children: ReactNode
  className?: string
}

export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[1px]" />
        <Dialog.Content
          data-ui-sheet
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            'fixed bottom-0 left-1/2 z-[60] flex w-full max-w-[560px] -translate-x-1/2 flex-col',
            'max-h-[85dvh] rounded-t-hero border border-b-0 border-border bg-card',
            'focus:outline-none',
            className
          )}
          style={{ boxShadow: 'var(--shadow-raised)' }}
        >
          <style href="ui-sheet" precedence="default">{`
            @keyframes sheetUp {
              from { opacity: 0; transform: translate(-50%, 16px); }
              to   { opacity: 1; transform: translate(-50%, 0); }
            }
            [data-ui-sheet] { animation: sheetUp var(--duration-normal) var(--ease-out); }
            @media (prefers-reduced-motion: reduce) {
              [data-ui-sheet] { animation: none; }
            }
          `}</style>
          <div className="flex shrink-0 justify-center pb-1 pt-2.5" aria-hidden>
            <div className="h-1 w-9 rounded-full bg-border" />
          </div>
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <div className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
