import { ChevronDown, ChevronUp, Loader2, Mic } from 'lucide-react'
import { CaptureField } from '@family-os/ui'
import type { ShoppingList } from '../types'

export interface ShoppingCaptureHeroProps {
  /** The last few things that landed, anywhere. Names only — never who added
      them (ADR 072 §4, withdrawn 2026-09-04). Ids because a house adds milk
      twice in a week and two chips must not collide. */
  justAdded: { id: string; name: string }[]
  /** Everything waiting, everywhere, and the per-destination split beside it.
      This is the only place either appears while the lists are hidden. */
  openCount: number
  lists: ShoppingList[]
  /** Whether the lists are currently revealed below — the control says so, and
      says how to undo it. */
  showingLists: boolean
  onToggleLists: () => void
  loading: boolean
  destination: string | null
  onAdd: (name: string) => void
  onDraftChange: (draft: string) => void
  draftAisle: string | null
  addError: string | null
  canAdd: boolean
}

/* `/shopping` at tablet width and up (design.md §"One surface, two layouts",
   artifact frame W2): capture fills the screen, and the lists come in only when
   asked for. Same route, same data, no profile check — the viewport picks this,
   and `Show lists` reveals the rest of the page in place.

   Read from across a room, so every label here is a distance token and the strip
   label is `section-label-lg` rather than the 11px `section-label` a phone uses
   (design-system.md §Type scale). */
export function ShoppingCaptureHero({
  justAdded,
  openCount,
  lists,
  showingLists,
  onToggleLists,
  loading,
  destination,
  onAdd,
  onDraftChange,
  draftAisle,
  addError,
  canAdd,
}: ShoppingCaptureHeroProps) {
  const composing = draftAisle !== null

  return (
    // Fills the screen, so what a person walks up to is the field and nothing
    // else. `4.5rem` is `PageContainer`'s own `pt-6 pb-12` — subtracted rather
    // than guessed, so the block ends exactly where the viewport does instead of
    // leaving a short scroll to nothing.
    <div className="flex min-h-[calc(100svh-4.5rem)] flex-col">
      <h1 className="text-display-xl text-foreground">What do we need?</h1>

      <CaptureField
        size="wall"
        className="mt-6"
        // No autofocus, at any width (ADR 070, amended 2026-09-04). A screen
        // left on in a kitchen is not a screen someone walked up to, and it must
        // not hold the keyboard on the chance that they did.
        placeholder="Type it, or say it"
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
            Adding to the list is turned off for this profile.
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

      {/* The seam between catching and shopping. The counts are the whole answer
          while the lists are hidden, so the per-destination split lives here
          (artifact W2) rather than only in the strip below. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        {/* Never `0 things waiting` before the read lands — a count is a claim
            about the house, read from across the room by someone who will not
            look twice. */}
        <span className="text-body text-muted-foreground">
          {loading
            ? '\u00a0'
            : [
                `${openCount} thing${openCount === 1 ? '' : 's'} waiting`,
                // The per-destination split is the whole answer while the lists
                // are hidden. Once they are shown, the strip below says the same
                // thing and is tappable, so this stops repeating it.
                ...(showingLists ? [] : lists.map((l) => `${l.name} ${l.itemCount}`)),
              ].join(' · ')}
        </span>
        {/* The same control in the same place both ways. Getting BACK to capture
            is the direction that matters on a screen left on in a kitchen, so it
            is never a different button somewhere else. */}
        <button
          type="button"
          onClick={onToggleLists}
          aria-expanded={showingLists}
          className="text-body flex h-touch cursor-pointer items-center gap-1.5 rounded-panel border border-border px-4 font-medium text-foreground"
        >
          {showingLists ? 'Hide lists' : 'Show lists'}
          {showingLists ? (
            <ChevronUp size={20} aria-hidden />
          ) : (
            <ChevronDown size={20} aria-hidden />
          )}
        </button>
      </div>
    </div>
  )
}

/* Reserved, not implemented — voice is out of M5.5 scope (design.md). The slot
   exists so the affordance is designed into the field now rather than bolted
   onto its edge later; `aria-hidden` and no button role so nobody taps it and
   waits for something that will not happen. */
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
