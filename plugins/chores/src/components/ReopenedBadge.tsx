import { RotateCcw } from 'lucide-react'

/* Marks a pending task that was completed before and sent back by a parent (M4/3b).
   A signal, not a chip (only a reward earns the pill shape): amber ↻ + word, so it
   reads as a mild "not yet" — attention, not the red alarm of Overdue. */
export function ReopenedBadge() {
  return (
    <span
      className="text-sm-token inline-flex items-center gap-1 font-semibold"
      style={{ color: 'color-mix(in oklch, var(--warning) 72%, var(--foreground))' }}
    >
      <RotateCcw size={13} strokeWidth={2.5} aria-hidden />
      Redo
    </span>
  )
}
