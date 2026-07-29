import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

const REVEAL_STEP = 10

/* Quiet, collapsed secondary section (Coming up / Done), shared by both taskee
   framings so they cannot drift. Collapsed by default so the surface leads with
   what is still to do.

   The revealed list is clamped: chores are never archived, so "Done" is every
   chore the profile has ever finished, and an expanded section would otherwise be
   an unbounded wall (auto-bug #82). The header states the true total; the button
   states the remainder. */
export function CollapsibleSection<T extends { id: string }>({
  label,
  items,
  renderItem,
  listClassName = 'flex flex-col gap-1.5 pt-1',
}: {
  label: string
  items: T[]
  renderItem: (item: T) => ReactNode
  listClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(REVEAL_STEP)
  if (items.length === 0) return null

  const visible = items.slice(0, shown)
  const more = items.length - visible.length

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-section-label flex w-full items-center gap-1.5 py-2 text-muted-foreground"
        aria-expanded={open}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {label} · {items.length}
      </button>
      {open && (
        <div className={listClassName}>
          {visible.map(renderItem)}
          {more > 0 && (
            <button
              type="button"
              onClick={() => setShown((n) => n + REVEAL_STEP)}
              className="text-sm-token self-start py-2 text-muted-foreground underline underline-offset-4"
            >
              Show {more} more
            </button>
          )}
        </div>
      )}
    </div>
  )
}
