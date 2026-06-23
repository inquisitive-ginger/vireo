import * as PopoverPrimitive from '@radix-ui/react-popover'
import type { ComponentProps } from 'react'
import { cn } from '../lib/utils'

/* Radix Popover, themed to our tokens. Used as the shell for the date picker
   and any other "click a trigger → floating panel" surface. Elevated like the
   other above-the-page surfaces (--shadow-raised), matching drawers/dialogs.

   `container` lets a caller portal the content into a specific node — notably
   the nearest dialog when the popover lives inside a modal Drawer, so it stays
   within the dialog's focus/dismiss scope and remains interactive. */

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor

export interface PopoverContentProps extends ComponentProps<typeof PopoverPrimitive.Content> {
  container?: HTMLElement | null
}

export function PopoverContent({
  className,
  align = 'start',
  sideOffset = 6,
  container,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal container={container ?? undefined}>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 rounded-xl border border-border bg-card text-card-foreground shadow-[var(--shadow-raised)]',
          'outline-none',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
