import { Disclosure } from '@family-os/ui'

const LEAD_COUNT = 3

/* A management list leads with three and hides the rest behind the Disclosure the
   used shelf taught (M4/6 rework) — an index, not a wall. Shared by the Catalog
   stocking lists and the Tickets tab's per-kid shelves. */
export function ClampedList<T>({
  items,
  label,
  render,
}: {
  items: T[]
  label: string
  render: (item: T) => React.ReactNode
}) {
  const lead = items.slice(0, LEAD_COUNT)
  const rest = items.slice(LEAD_COUNT)
  return (
    <div className="flex flex-col gap-2">
      {lead.map(render)}
      {rest.length > 0 && (
        <Disclosure label={label} count={rest.length}>
          <div className="flex flex-col gap-2 pt-1">{rest.map(render)}</div>
        </Disclosure>
      )}
    </div>
  )
}
