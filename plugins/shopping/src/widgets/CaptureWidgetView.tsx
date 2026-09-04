import { ShoppingCart } from 'lucide-react'
import { CaptureField, ListRow, WidgetHeader, WIDGET_INSET, cn, useFitRows } from '@family-os/ui'
import type { RecentItem } from '../types'

/* Reserve for the "+N more" line when the list is clamped. */
const MORE_RESERVE = 22

export interface CaptureWidgetViewProps {
  items: RecentItem[]
  openCount: number
  loading: boolean
  /** The read failed. `Nothing waiting` would be a false claim about the house,
      so the tile says it does not know instead. */
  error: boolean
  destination: string | null
  onAdd: (name: string) => void
  onDraftChange: (draft: string) => void
  draftAisle: string | null
  addError: string | null
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
  onDraftChange,
  draftAisle,
  addError,
  canAdd,
}: CaptureWidgetViewProps) {
  const { boxRef, listRef, shown, hiddenCount, measuring } = useFitRows(items, MORE_RESERVE)
  // While composing, the echo takes the line — the filing is the one thing worth
  // reading between typing and Enter, on every surface the field appears on.
  const note = addError
    ? { role: 'alert' as const, className: 'text-error', body: `Couldn’t add “${addError}”` }
    : !canAdd
      ? { role: undefined, className: 'text-muted-foreground', body: 'Adding is turned off.' }
      : draftAisle
        ? { role: undefined, className: 'text-muted-foreground', body: `files under ${draftAisle}` }
        : null

  return (
    <div className={cn('flex h-full flex-col', WIDGET_INSET.standard)}>
      <WidgetHeader
        icon={ShoppingCart}
        label="Shopping"
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
        className="mt-3 shrink-0 shadow-none"
        // A widget is a surface you did not navigate to (ADR 070) — nothing was
        // covered up to put this here, so the field is live on arrival.
        autoFocus
        placeholder={destination ? `Add to ${destination}` : 'Add something'}
        label={destination ? `Add to ${destination}` : 'Add to the shopping list'}
        disabled={!canAdd || !destination}
        onValueChange={onDraftChange}
        onSubmit={onAdd}
      />

      {note && (
        <p role={note.role} className={cn('text-sm-token truncate px-1 pt-1.5', note.className)}>
          {note.body}
        </p>
      )}

      {/* The measured box: `min-h-0 flex-1` is what gives `useFitRows` a height
          to clamp against. Without the height-constrained flex child it measures
          zero and the tile crops instead of fitting (auto-bug #116). */}
      <div ref={boxRef} data-fit-box className="mt-1 min-h-0 flex-1 overflow-hidden">
        {error ? (
          <p className="text-sm-token px-1 pt-1 text-muted-foreground">
            Couldn&rsquo;t load the list.
          </p>
        ) : (
          !loading &&
          items.length === 0 && (
            <p className="text-sm-token px-1 pt-1 text-muted-foreground">Nothing waiting.</p>
          )
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
          {/* A remainder with nothing above it is not a remainder — in a slot
              too short for even one whole row the header's own count is already
              the true number, and "+6 more" beside no rows reads as a broken
              tile. */}
          {!measuring && hiddenCount > 0 && shown.length > 0 && (
            <div className="text-sm-token pt-2 text-muted-foreground">+{hiddenCount} more</div>
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
  return <span className="size-5 shrink-0 rounded-full border-2 border-border" aria-hidden />
}
