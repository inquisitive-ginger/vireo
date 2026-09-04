import { ChevronRight, Loader2, Mic } from 'lucide-react'
import { CaptureField, PageContainer } from '@family-os/ui'
import type { ShoppingList } from '../types'

export interface WallPageViewProps {
  /** The last few things that landed, anywhere. Names only — never who added
      them (ADR 072 §4, withdrawn 2026-09-04). Ids because a house adds milk
      twice in a week and two chips must not collide. */
  justAdded: { id: string; name: string }[]
  lists: ShoppingList[]
  openCount: number
  loading: boolean
  destination: string | null
  onAdd: (name: string) => void
  onDraftChange: (draft: string) => void
  draftAisle: string | null
  addError: string | null
  canAdd: boolean
  onSeeLists: () => void
}

/* W2 (design.md §"The wall tablet", artifact frame W2). The wall ONLY takes
   things in: no checking, no aisles, no shopping. One enormous input with a
   short memory, read from six feet away — which is why every label here is a
   distance token and the "Just added" strip is `section-label-lg`, not the
   11px `section-label` the phone uses (design-system.md §Type scale).

   W1 — this surface as the phone page at larger type — was drawn in the
   artifact and rejected. Do not grow it back into a list. */
export function WallPageView({
  justAdded,
  lists,
  openCount,
  loading,
  destination,
  onAdd,
  onDraftChange,
  draftAisle,
  addError,
  canAdd,
  onSeeLists,
}: WallPageViewProps) {
  const composing = draftAisle !== null

  return (
    <PageContainer width="full" className="flex h-full flex-col">
      <h1 className="text-display-xl text-foreground">What do we need?</h1>

      <CaptureField
        size="wall"
        className="mt-6"
        // The one surface ADR 070 names for autofocus: somebody walked up to it
        // in order to type, and any tap before the word loses to a notepad.
        autoFocus
        placeholder={destination ? `Type it, or say it` : 'Loading…'}
        label={destination ? `Add to ${destination}` : 'Add to the shopping list'}
        disabled={!canAdd || !destination}
        onValueChange={onDraftChange}
        onSubmit={onAdd}
        trailing={<HoldToSpeak />}
      />

      {/* Tall enough for the line it reserves — `pt-3` + one `text-body` line is
          41px, so a 32px reserve let the first keystroke shove `Just added` and
          every chip down 9px, and Enter shove them back. */}
      <div className="min-h-11 pt-3">
        {addError ? (
          <p role="alert" className="text-body px-1 text-error">
            Couldn&rsquo;t add &ldquo;{addError}&rdquo; &mdash; it is not on the list. Try again.
          </p>
        ) : !canAdd ? (
          <p className="text-body px-1 text-muted-foreground">
            Adding from this screen is turned off.
          </p>
        ) : composing ? (
          <p className="text-body px-1 text-muted-foreground">
            Enter to add · files under{' '}
            <span className="font-medium text-foreground">{draftAisle}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <div className="text-section-label-lg text-muted-foreground">Just added</div>
        <div className="flex flex-wrap gap-2.5 pt-3">
          {loading ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />
          ) : justAdded.length === 0 ? (
            <span className="text-body text-muted-foreground">Nothing yet.</span>
          ) : (
            justAdded.map((chip) => (
              <span
                key={chip.id}
                className="text-body rounded-full border-2 border-border px-4.5 py-2 text-foreground"
              >
                {chip.name}
              </span>
            ))
          )}
        </div>
      </div>

      {/* The one way off this surface, and the only place the wall says how much
          is waiting — a count is not a list, so it stays a sentence. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        {/* Never `0 things waiting` before the read lands — a count is a claim
            about the house, and the wall is read from across the room by someone
            who will not look twice. */}
        <span className="text-body text-muted-foreground">
          {loading
            ? '\u00a0'
            : [
                `${openCount} thing${openCount === 1 ? '' : 's'} waiting`,
                ...lists.map((l) => `${l.name} ${l.itemCount}`),
              ].join(' · ')}
        </span>
        <button
          type="button"
          onClick={onSeeLists}
          className="text-body flex h-touch cursor-pointer items-center gap-1.5 rounded-panel border border-border px-4 font-medium text-foreground"
        >
          See the lists
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>
    </PageContainer>
  )
}

/* Reserved, not implemented — voice is out of M5.5 scope (design.md §W2). The
   slot exists so the affordance is designed into the field now rather than
   bolted onto its edge later; it is disabled so nobody at the fridge taps it
   and waits for something that will not happen. */
function HoldToSpeak() {
  return (
    <span
      aria-hidden
      className="text-body flex h-13 items-center gap-2 rounded-panel border border-border bg-secondary px-4 font-medium text-muted-foreground opacity-50"
    >
      <Mic size={22} />
      Hold to speak
    </span>
  )
}
