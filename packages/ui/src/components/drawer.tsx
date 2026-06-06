import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/utils'
import { Button } from './button'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Drawer({ open, onClose, title, children, className }: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[1px]" />
        <Dialog.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-[440px] flex-col',
            'bg-background border-l border-border shadow-xl',
            'focus:outline-none',
            className
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5">
            <Dialog.Title className="text-card-title">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" className="size-8 p-0" aria-label="Close">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
