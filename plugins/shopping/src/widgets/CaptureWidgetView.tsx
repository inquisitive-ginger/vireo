import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { CaptureField, ListRow, WidgetHeader, WIDGET_INSET, cn, useFitRows } from '@family-os/ui'
import type { CaptureReport, RecentItem } from '../types'
import { ReportLine } from '../components/ReportLine'

/* Reserve for the "+N more" line when the list is clamped. */
const MORE_RESERVE = 22

export interface CaptureWidgetViewProps {
  items: RecentItem[]
  openCount: number
  loading: boolean
  /** The read failed AND there is nothing cached to show. A failed background
      refetch that still holds rows is not this: the rows stay, because stale
      rows beat a tile that contradicts itself. */
  error: boolean
  destination: string | null
  onAdd: (name: string) => void
  /** The report slot's stack, already ranked (D4). */
  reports: CaptureReport[]
  canAdd: boolean
}

/* The zero-navigation capture (design.md §"Adding from anywhere in the house").
   The dashboard is the first screen after login, so a widget with a live field
   makes the common add cost no navigation at all — which is the whole Keep
   comparison. It shows what is waiting; it does not shop, and it is not a
   second /shopping. */
export function CaptureWidgetView({
  items,
  openCount,
  loading,
  error,
  destination,
  onAdd,
  reports,
  canAdd,
}: CaptureWidgetViewProps) {
  const { boxRef, listRef, shown, measuring } = useFitRows(items, MORE_RESERVE)
  const [composing, setComposing] = useState(false)

  return (
    <div className={cn('flex h-full flex-col', WIDGET_INSET.standard)}>
      <WidgetHeader
        icon={ShoppingCart}
        label="Shopping"
        // House-wide, and it stays that way (D6): these rows are cross-list and
        // each names its list, so the figure and what it counts share a screen.
        // Same arithmetic as everywhere else — what's left.
        //
        // Blank rather than 0 until the read lands: the count is a claim about
        // the house and must not be made before the answer is in.
        trailing={
          <span className="text-sm-token text-muted-foreground">
            {loading || error ? '' : openCount}
          </span>
        }
      />

      <CaptureField
        size="inline"
        // A `--card` field on a `--card` slot is the same value as its own
        // parent, so a raised shadow has nothing to lift off: unfocused, the
        // field is a hairline rectangle and the rows below it carry the tile.
        // The recess is the one rung that reads in both themes (ADR 040).
        className="mt-3 shrink-0 bg-surface-sunken shadow-[var(--shadow-inset)]"
        // No autofocus (ADR 070, amended 2026-09-04). On a phone the dashboard
        // stacks and this tile is fifth, so claiming focus scrolled the reader
        // 1272px to a surface they had not asked for.
        placeholder={destination ? `Add to ${destination}` : 'Add something'}
        label={destination ? `Add to ${destination}` : 'Add to the shopping list'}
        disabled={!canAdd || !destination}
        onValueChange={(value) => setComposing(value.trim().length > 0)}
        onSubmit={onAdd}
      />

      {/* Reserved whether or not it has a line to draw. Mounting it on the first
          keystroke inserts a line, `useFitRows` re-clamps on the shrunken box,
          and a row disappears while the user is still typing the word — then
          comes back on Enter. */}
      <ReportLine
        className="shrink-0"
        reports={reports}
        idle={!canAdd ? 'Adding is turned off.' : composing ? 'Enter to add' : undefined}
      />

      {/* The measured box: `min-h-0 flex-1` is what gives `useFitRows` a height
          to clamp against. Without the height-constrained flex child it measures
          zero and the tile crops instead of fitting (auto-bug #116). */}
      {/* A 4px seam under an input reads as an autocomplete menu, not as the
          tile's content — but the recess is what separates the two, so the gap
          only has to stop them touching and must not spend a whole row. */}
      <div ref={boxRef} data-fit-box className="mt-2 min-h-0 flex-1 overflow-hidden">
        {/* `error` already means "and nothing cached", so this can never sit
            above rows: a tile saying it could not load, over four things it
            plainly loaded, teaches the reader to trust neither. */}
        {!loading && items.length === 0 && (
          <p className="text-sm-token px-1 pt-1 text-muted-foreground">
            {error ? 'Couldn’t load the list.' : 'Nothing waiting.'}
          </p>
        )}
        <div ref={listRef} data-fit-list className="flex flex-col">
          {!loading &&
            shown.map((item) => (
              <ListRow key={item.id} leading={<Ring />}>
                <div className="min-w-0 flex-1">
                  <span className="text-base-token block truncate text-foreground">
                    {item.name}
                  </span>
                </div>
                {/* Where it landed — the widget spans every destination, so a
                    row that is not on the default list has to say so. */}
                {item.listName !== destination && (
                  <span className="text-xs-body shrink-0 text-muted-foreground">
                    {item.listName}
                  </span>
                )}
              </ListRow>
            ))}
          {/* The remainder is counted off the HOUSE, not off the read: the recent
              endpoint caps at 12, so `items.length - shown.length` says "+2 more"
              on a tile whose own header says 19. Two counts of one thing that
              disagree read as a broken tile. A remainder with nothing above it is
              not a remainder either — in a slot too short for even one whole row
              the header's count is already the true number. */}
          {!measuring && shown.length > 0 && openCount > shown.length && (
            <div className="text-sm-token pt-2 text-muted-foreground">
              +{openCount - shown.length} more
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* The same static ring the page draws (ADR 063's leading slot). Checking off is
   the shop surface's job, not the dashboard's — a ring that looks tappable and
   is not would be worse than one that plainly is not yet. */
function Ring() {
  return <span className="size-5 shrink-0 rounded-full border-2 border-input" aria-hidden />
}
