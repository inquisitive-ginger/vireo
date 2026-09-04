import { ChevronLeft, Loader2 } from 'lucide-react'
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
  layout: 'capture' | 'list'
  /** Wide only — the hero's short memory of what landed, anywhere. */
  justAdded: { id: string; name: string }[]
  /** Wide only — everything waiting across every destination. */
  totalOpenCount: number
  /** `capture` only — swaps to the list at its own URL. */
  onShowLists: () => void
  /** The way back, offered ONLY on the wide list view. Undefined on a phone,
      which has no dedicated capture view to return to. */
  onBackToCapture?: () => void
  /** Taking back a just-added typo. Undefined when this profile cannot remove —
      `manage` is tier 4 while adding is tier 1 (ADR 071). */
  onRemove?: (id: string) => void
}

/* The /shopping surface (design.md §Anatomy, artifact frames S1/S2). The capture
   field is the hero at rest and the aisle-ordered list is the page; neither is a
   mode, and the field simply scrolls away under the thumb in a shop. There is no
   index of lists and no drill-in — the destination strip both swaps the list in
   place and says where an add will land, which is one control, not two. No spine, no hue, no avatar (ADR 064): "who added the milk"
   is not a question this list answers, so provenance is a text fact. */
export function ShoppingPageView({
  lists,
  selectedListId,
  onSelectList,
  groups,
  loading,
  onAdd,
  onDraftChange,
  draftAisle,
  addError,
  canAdd,
  layout,
  justAdded,
  totalOpenCount,
  onShowLists,
  onBackToCapture,
  onRemove,
}: ShoppingPageViewProps) {
  const selected = lists.find((l) => l.id === selectedListId)
  const destination = selected?.name ?? 'the list'
  // Aisles belong to the LIST, not to the app — a hardware run has none of ours,
  // so it renders flat rather than filing every screw under Other.
  const showAisles = selected?.groupByAisle ?? true
  const composing = draftAisle !== null
  const capturing = layout === 'capture'

  /* ONE control, not two (Zach, 2026-09-04). The field used to carry a
     destination chip while this row filtered the list — two controls in similar
     clothes answering "which list?" differently. The selected pill is now both:
     what you are looking at, and where an add goes. That is also what makes
     Costco reachable from the capture screen, which had no way to it at all. */
  const destinations = (
    <div className="flex gap-2 overflow-hidden py-0.5">
      {lists.map((list) => (
        <Chip
          key={list.id}
          selected={list.id === selectedListId}
          onClick={() => onSelectList(list.id)}
          selectedClassName="border-primary bg-primary/13 text-primary"
          // `Chip` is 13px, which is right at arm's length and unreadable at six
          // feet — and on the capture layout these are load-bearing, since they
          // decide where an add lands. Sized up to the distance floor there, via
          // the sizing override the primitive documents.
          className={capturing ? 'text-body px-4 py-2' : undefined}
        >
          {list.name} {list.itemCount}
        </Chip>
      ))}
    </div>
  )

  return (
    // `list` at BOTH widths. A list is not prose, but it is not a billboard
    // either: unmeasured at 1280 the rows run 1232px, so a name at the left edge
    // and its aisle at the right are a head-turn apart. The wide layout earns its
    // presence with type size, not with span.
    <PageContainer width="list">
      {capturing ? (
        <ShoppingCaptureHero
          justAdded={justAdded}
          openCount={totalOpenCount}
          onRemove={onRemove}
          destinations={destinations}
          onShowLists={onShowLists}
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
          {onBackToCapture && (
            <button
              type="button"
              onClick={onBackToCapture}
              className="text-sm-token mb-3 flex cursor-pointer items-center gap-1 font-medium text-primary"
            >
              <ChevronLeft size={16} aria-hidden />
              Back to adding
            </button>
          )}

          {/* The count rides the title's own baseline and the field sits 14px
              under it (artifact S1), so the primitive's `items-start` / `mb-6`
              are the two things overridden — not the header. */}
          <PageHeader
            className="mb-0 items-baseline"
            title="Shopping"
            // Cumulative across every destination — the pills beside it already
            // give the per-list split, so the one number on the page that could
            // answer "how much is waiting in total" should not repeat a pill.
            action={
              <span className="text-sm-token text-muted-foreground">
                {totalOpenCount} thing{totalOpenCount === 1 ? '' : 's'} to get
              </span>
            }
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
      {/* Always visible now, composing or not: it says where the word you are
          typing will land, which is not something to hide behind an echo. */}
      {!capturing && <div className="mt-3">{destinations}</div>}

      {!capturing && (
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
                      // A section label binds to what is BELOW it, so the gap
                      // above stays the larger of the two. Both were tight
                      // enough to read as crowding between 56px rows (live
                      // review, 2026-09-04). `section-label` specifies no block
                      // spacing at all, so these numbers are local — the written
                      // rule is queued separately.
                      'text-section-label pb-2 text-muted-foreground',
                      i === 0 ? 'pt-4' : 'pt-7'
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
