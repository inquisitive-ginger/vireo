import { useState, type ReactNode } from 'react'
import { Disclosure, RevealMore } from '@family-os/ui'

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
  const [shown, setShown] = useState(REVEAL_STEP)
  if (items.length === 0) return null

  const visible = items.slice(0, shown)
  const more = items.length - visible.length

  return (
    <Disclosure label={label} count={items.length} className="mt-2">
      <div className={listClassName}>
        {visible.map(renderItem)}
        {more > 0 && (
          <RevealMore
            label={`Show ${more} more`}
            onClick={() => setShown((n) => n + REVEAL_STEP)}
          />
        )}
      </div>
    </Disclosure>
  )
}
