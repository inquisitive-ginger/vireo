import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDrag } from '@use-gesture/react'
import { cn } from '../lib/utils'

/* A bottom sheet — the answer-a-question surface, distinct from the `Drawer` (the
   create/edit capture rail) and `Modal` (a centered one-tap decision). Use it for
   content a user pulls up, reads, and dismisses (the wallet history). Rises from the
   bottom edge, caps its height, and scrolls inside. The grab bar is a real handle:
   drag it past the threshold (or flick) and the sheet dismisses — the drag binds to
   the handle strip only, so it never fights the content's own scrolling. Esc and the
   overlay still work via Radix. Provide the accessible `title` (rendered
   visually-hidden) and your own visible heading in `children`. */
export interface SheetProps {
  open: boolean
  onClose: () => void
  /** Accessible name — rendered visually-hidden; put the visible heading in children. */
  title: string
  children: ReactNode
  className?: string
}

const DISMISS_THRESHOLD = 110

type AnimEasing = 'none' | 'snap' | 'dismiss'

export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  const [anim, setAnim] = useState<{ y: number; easing: AnimEasing }>({ y: 0, easing: 'none' })
  const dismissingRef = useRef(false)

  const bind = useDrag(
    ({ movement: [, my], velocity: [, vy], direction: [, dy], last }) => {
      const clamped = Math.max(0, my)
      if (last) {
        const flick = vy > 0.5 && dy > 0
        if (flick || clamped > DISMISS_THRESHOLD) {
          dismissingRef.current = true
          setAnim({ y: clamped, easing: 'dismiss' })
        } else {
          setAnim({ y: 0, easing: 'snap' })
        }
      } else {
        setAnim({ y: clamped, easing: 'none' })
      }
    },
    { axis: 'y', filterTaps: true }
  )

  const transitionStyle: string =
    anim.easing === 'dismiss'
      ? 'transform var(--duration-normal) var(--ease-in)'
      : anim.easing === 'snap'
        ? 'transform var(--duration-slow) var(--ease-out)'
        : 'none'

  function handleTransitionEnd(e: React.TransitionEvent) {
    if (e.propertyName !== 'transform') return
    if (dismissingRef.current) onClose()
    else setAnim({ y: 0, easing: 'none' })
  }

  // The drag state lives on THIS component, which outlives the dialog (only
  // Radix's content unmounts on close) — without the reset, a reopen after a
  // drag-dismiss lands at translateY(110%) the moment the enter keyframe
  // releases: an open dialog with its sheet offscreen.
  useEffect(() => {
    if (open) {
      dismissingRef.current = false
      setAnim({ y: 0, easing: 'none' })
    }
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[1px]" />
        <Dialog.Content
          data-ui-sheet
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            // Centered by inset-x + margin, never by transform — the enter animation
            // and the drag both own `transform`, and a -translate-x-1/2 utility would
            // stack with them (the sheet would open left of center, then snap right).
            'fixed inset-x-0 bottom-0 z-[60] mx-auto flex w-full max-w-[560px] flex-col',
            'max-h-[85dvh] rounded-t-hero border border-b-0 border-border bg-card',
            'focus:outline-none',
            className
          )}
          style={{
            boxShadow: 'var(--shadow-raised)',
            transform: dismissingRef.current ? 'translateY(110%)' : `translateY(${anim.y}px)`,
            transition: transitionStyle,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <style href="ui-sheet" precedence="default">{`
            @keyframes sheetUp {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            [data-ui-sheet] { animation: sheetUp var(--duration-normal) var(--ease-out); }
            @media (prefers-reduced-motion: reduce) {
              [data-ui-sheet] { animation: none; }
            }
          `}</style>
          <div
            {...bind()}
            className="flex shrink-0 cursor-grab touch-none justify-center pb-2 pt-2.5 active:cursor-grabbing"
            aria-hidden
          >
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
