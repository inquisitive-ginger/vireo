import { ChevronDown, Loader2 } from 'lucide-react'
import { CaptureField, Chip, ListRow, PageContainer, PageHeader, cn } from '@family-os/ui'
import type { ShoppingItem, ShoppingList } from '../types'

export interface AisleGroup {
  aisle: string
  items: ShoppingItem[]
}

export interface ShoppingPageViewProps {
  lists: ShoppingList[]
  selectedListId: string
  onSelectList: (id: string) => void
  /** Already in walk order, already grouped — the server sorts, the view draws. */
  groups: AisleGroup[]
  /** The rows are still coming. Distinct from "there are none" — the empty line
      is a claim about the house, and it must not be made before the answer is in. */
  loading: boolean
  openCount: number
  onAdd: (name: string) => void
  onDraftChange: (draft: string) => void
  /** What the current draft would file under. Null while the field is empty —
      the echo only exists between typing and committing. */
  draftAisle: string | null
  /** The name that failed to land, so the word is not silently lost. */
  addError: string | null
  /** False on the unattended family dashboard, which has nobody to attribute an
      add to. Everyone else adds — tier 1 included. */
  canAdd: boolean
}

/* The /shopping surface (design.md §Anatomy, artifact frames S1/S2). The capture
   field is the hero at rest and the aisle-ordered list is the page; neither is a
   mode, and the field simply scrolls away under the thumb in a shop. There is no
   index of lists and no drill-in — the destination strip is a filter that swaps
   the list in place. No spine, no hue, no avatar (ADR 064): "who added the milk"
   is not a question this list answers, so provenance is a text fact. */
export function ShoppingPageView({
  lists,
  selectedListId,
  onSelectList,
  groups,
  loading,
  openCount,
  onAdd,
  onDraftChange,
  draftAisle,
  addError,
  canAdd,
}: ShoppingPageViewProps) {
  const selected = lists.find((l) => l.id === selectedListId)
  const destination = selected?.name ?? 'the list'
  // Aisles belong to the LIST, not to the app — a hardware run has none of ours,
  // so it renders flat rather than filing every screw under Other.
  const showAisles = selected?.groupByAisle ?? true
  // While composing, the strip gives way to the echo (S2) — one line under the
  // field at a time, and the filing is the one worth reading at that moment.
  const composing = draftAisle !== null

  return (
    <PageContainer width="list">
      {/* The count rides the title's own baseline and the field sits 14px under
          it (artifact S1), so the primitive's `items-start` / `mb-6` are the two
          things overridden — not the header. */}
      <PageHeader
        className="mb-0 items-baseline"
        title="Shopping"
        action={<span className="text-sm-token text-muted-foreground">{openCount} to get</span>}
      />

      <CaptureField
        size="hero"
        className="mt-3.5"
        // Deliberately NOT autofocused (ADR 070): an unrequested keyboard on a
        // route you opened to read is hostile. The wall and the widget focus.
        placeholder={`Add to ${destination}`}
        label={`Add to ${destination}`}
        disabled={!canAdd}
        onValueChange={onDraftChange}
        onSubmit={onAdd}
        trailing={<DestinationChip name={destination} many={lists.length > 1} />}
      />

      {/* Everything that reports on the field sits between the field and the
          strip. Below the strip a notice reads as a caption on the list, which
          is not what failed. */}
      {addError && (
        <p role="alert" className="text-sm-token px-1 pt-2 text-error">
          Couldn&rsquo;t add &ldquo;{addError}&rdquo; — check your connection and try again.
        </p>
      )}

      {!canAdd && (
        <p className="text-sm-token px-1 pt-2 text-muted-foreground">
          Switch to your own profile to add to the list.
        </p>
      )}

      {composing ? (
        <p className="text-sm-token px-1 pt-2 text-muted-foreground">
          Enter to add · files under{' '}
          <span className="font-medium text-foreground">{draftAisle}</span>
        </p>
      ) : (
        <div className="mt-3 flex gap-2 overflow-hidden py-0.5">
          {lists.map((list) => (
            <Chip
              key={list.id}
              selected={list.id === selectedListId}
              onClick={() => onSelectList(list.id)}
              selectedClassName="border-primary bg-primary/13 text-primary"
            >
              {list.name} {list.itemCount}
            </Chip>
          ))}
        </div>
      )}

      <div className={cn('mt-1', composing && 'opacity-50')}>
        {loading ? (
          <div className="flex justify-center pt-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Loading" />
          </div>
        ) : groups.length === 0 ? (
          <p className="text-body px-1 pt-6 text-muted-foreground">Nothing on {destination} yet.</p>
        ) : (
          groups.map((group, i) => (
            <div key={group.aisle}>
              {showAisles && (
                <div
                  className={cn(
                    'text-section-label pb-1.5 text-muted-foreground',
                    i === 0 ? 'pt-2.5' : 'pt-4.5'
                  )}
                >
                  {group.aisle}
                </div>
              )}
              {group.items.map((item) => (
                <ListRow key={item.id} leading={<Ring />}>
                  <div className="min-w-0 flex-1">
                    <span className="text-card-title block truncate text-foreground">
                      {item.name}
                    </span>
                    {item.note && (
                      <span className="text-sm-token block truncate text-muted-foreground">
                        {item.note}
                      </span>
                    )}
                  </div>
                </ListRow>
              ))}
            </div>
          ))
        )}
      </div>
    </PageContainer>
  )
}

/* The leading slot ListRow renders but does not define (ADR 063). Static here:
   checking an item off is M5.5/4, and a ring that looks tappable and isn't
   would be worse than one that plainly is not yet. */
function Ring() {
  return <span className="size-6 shrink-0 rounded-full border-2 border-border" aria-hidden />
}

/* The scope slot: what you type, and where it lands, on one line (ADR 070). It
   states the destination; the strip below changes it — which is why the chevron
   only appears when there is more than one place to land. */
function DestinationChip({ name, many }: { name: string; many: boolean }) {
  // The border is not decoration: `--secondary` sits 0.01 L above `--card` on
  // dark, so the fill alone leaves the pill invisible and the scope reads as
  // loose text floating in the field. The edge is what makes it an object.
  return (
    <span className="text-sm-token flex h-8.5 items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 font-semibold text-secondary-foreground">
      {name}
      {many && <ChevronDown size={14} aria-hidden />}
    </span>
  )
}
