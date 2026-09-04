import { useEffect, useRef } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { CaptureField, Chip, ListRow, PageContainer, PageHeader, cn } from '@family-os/ui'
import type { ShoppingItem, ShoppingList } from '../types'
import { ShoppingCaptureHero } from './ShoppingCaptureHero'

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
  /** `shopping.item.add` is revoked for this profile — the one lever that closes
      the field (ADR 072 §6). The house itself adds; the wide layout needs it. */
  canAdd: boolean
  /** Which arrangement of THIS surface to draw. Not a route and not something a
      reader switches — the viewport picks it, and both draw the same list from
      the same data. Wide DOES have capture/list modes inside it, which is what
      W2 always was; the no-mode rule is the narrow layout's (design.md
      §"The no-mode principle is scoped to narrow"). */
  layout: 'narrow' | 'wide'
  /** Wide only — the hero's short memory of what landed, anywhere. */
  justAdded: { id: string; name: string }[]
  /** Wide only — everything waiting across every destination. */
  totalOpenCount: number
  /** Wide only — whether `Show lists` has revealed the strip and the list.
      Always true on narrow, where the list is simply the page. */
  showLists: boolean
  onToggleLists: () => void
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
  layout,
  justAdded,
  totalOpenCount,
  showLists,
  onToggleLists,
}: ShoppingPageViewProps) {
  const selected = lists.find((l) => l.id === selectedListId)
  const destination = selected?.name ?? 'the list'
  // Aisles belong to the LIST, not to the app — a hardware run has none of ours,
  // so it renders flat rather than filing every screw under Other.
  const showAisles = selected?.groupByAisle ?? true
  // While composing, the strip gives way to the echo (S2) — one line under the
  // field at a time, and the filing is the one worth reading at that moment.
  const composing = draftAisle !== null
  const wide = layout === 'wide'
  const revealed = useRef<HTMLDivElement>(null)

  // The hero fills the screen, so what `Show lists` reveals starts below the
  // fold: without this the control changes its own label and nothing else the
  // reader can see. Wide only — narrow renders the list unconditionally, so
  // nothing was revealed to scroll to.
  useEffect(() => {
    if (!wide || !showLists) return
    revealed.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [wide, showLists])

  return (
    // `list` at BOTH widths. A list is not prose, but it is not a billboard
    // either: unmeasured at 1280 the rows run 1232px, so a name at the left edge
    // and its aisle at the right are a head-turn apart. The wide layout earns its
    // presence with type size, not with span.
    <PageContainer width="list">
      {wide ? (
        <ShoppingCaptureHero
          justAdded={justAdded}
          openCount={totalOpenCount}
          lists={lists}
          showingLists={showLists}
          onToggleLists={onToggleLists}
          loading={loading}
          destination={selected?.name ?? null}
          onAdd={onAdd}
          onDraftChange={onDraftChange}
          draftAisle={draftAisle}
          addError={addError}
          canAdd={canAdd}
        />
      ) : (
        <>
          {/* The count rides the title's own baseline and the field sits 14px
              under it (artifact S1), so the primitive's `items-start` / `mb-6`
              are the two things overridden — not the header. */}
          <PageHeader
            className="mb-0 items-baseline"
            title="Shopping"
            action={<span className="text-sm-token text-muted-foreground">{openCount} to get</span>}
          />

          <CaptureField
            size="hero"
            className="mt-3.5"
            // Deliberately NOT autofocused (ADR 070): an unrequested keyboard on
            // a route you opened to read is hostile. The wide layout is a screen
            // you walked up to in order to type, so it focuses; this is not.
            placeholder={`Add to ${destination}`}
            label={`Add to ${destination}`}
            disabled={!canAdd}
            onValueChange={onDraftChange}
            onSubmit={onAdd}
            trailing={<DestinationChip name={destination} many={lists.length > 1} />}
          />

          {/* Everything that reports on the field sits between the field and the
              strip. Below the strip a notice reads as a caption on the list,
              which is not what failed. */}
          {addError && (
            <p role="alert" className="text-sm-token px-1 pt-2 text-error">
              Couldn&rsquo;t add &ldquo;{addError}&rdquo; — check your connection and try again.
            </p>
          )}

          {!canAdd && (
            <p className="text-sm-token px-1 pt-2 text-muted-foreground">
              Adding to the list is turned off for this profile.
            </p>
          )}

          {composing && (
            <p className="text-sm-token px-1 pt-2 text-muted-foreground">
              Enter to add · files under{' '}
              <span className="font-medium text-foreground">{draftAisle}</span>
            </p>
          )}
        </>
      )}

      {/* The destination strip swaps the list in place. Narrow hides it while
          composing — one line under the field at a time, and the filing is the
          one worth reading at that moment. Wide shows it only once the lists
          have been asked for, because until then this surface is capture only. */}
      {showLists && (wide || !composing) && (
        <div ref={revealed} className="mt-3 flex gap-2 overflow-hidden py-0.5">
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

      {showLists && (
        <div className={cn('mt-1', composing && 'opacity-50')}>
          {loading ? (
            <div className="flex justify-center pt-8">
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Loading" />
            </div>
          ) : groups.length === 0 ? (
            <p className="text-body px-1 pt-6 text-muted-foreground">
              Nothing on {destination} yet.
            </p>
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
                      {/* Producer words only ("for Thursday") — who added a thing
                          is noise on a shared list (live review, 2026-09-03), so
                          it is stored and never shown. Usually empty until the
                          needs-push contract lands; that is correct, not a gap. */}
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
      )}
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
