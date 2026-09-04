import { ChevronRight, Loader2, Mic, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { CaptureField } from '@family-os/ui'

export interface ShoppingCaptureHeroProps {
  /** The last few things that landed, anywhere. Names only — never who added
      them (ADR 072 §4, withdrawn 2026-09-04). Ids because a house adds milk
      twice in a week and two chips must not collide. */
  justAdded: { id: string; name: string }[]
  /** Taking back a typo you made two seconds ago. Undefined when this profile
      cannot remove — `manage` is tier 4 while adding is tier 1 (ADR 071), so the
      person who made the typo may not be the one who can undo it. */
  onRemove?: (id: string) => void
  /** The destination pills. Rendered here rather than built here so ONE strip
      serves both layouts — it is the same control, in the same component, just
      placed differently. */
  destinations: ReactNode
  /** Everything waiting across every destination — one number. The per-list
      split lives on the pills, which are also the control that picks where an
      add lands. */
  openCount: number
  /** Swaps to the list, at its own URL. */
  onShowLists: () => void
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
   and `Show lists` swaps to the list at `/shopping/lists`.

   Read from across a room, so every label here is a distance token and the strip
   label is `section-label-lg` rather than the 11px `section-label` a phone uses
   (design-system.md §Type scale). */
export function ShoppingCaptureHero({
  justAdded,
  onRemove,
  destinations,
  openCount,
  onShowLists,
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

      {/* Tight to the field, because these ARE the field's destination control
          and proximity is the only thing that says so — at a larger gap they
          read as a field and then some unrelated filters. */}
      <div className="mt-3">{destinations}</div>

      {/* Reports on the field, under the pair. Tall enough for the line it
          reserves — `pt-2` plus one `text-body` line is 37px, and a short
          reserve lets the first keystroke shove everything below it down and
          Enter shove it back. */}
      <div className="min-h-10 pt-2">
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

      <div className="mt-7">
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
                className="text-body flex items-center gap-2 rounded-full border-2 border-border py-2 pl-4.5 pr-2 text-foreground"
              >
                {chip.name}
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(chip.id)}
                    aria-label={`Remove ${chip.name}`}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X size={18} aria-hidden />
                  </button>
                )}
              </span>
            ))
          )}
        </div>
      </div>

      {/* The seam between catching and shopping. One number, across every
          destination — the per-list split is on the pills above, where it is
          also the control that picks where an add goes. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        {/* Never `0 things to get` before the read lands — a count is a claim
            about the house, read from across the room by someone who will not
            look twice. */}
        <span className="text-body text-muted-foreground">
          {loading ? '\u00a0' : `${openCount} thing${openCount === 1 ? '' : 's'} to get`}
        </span>
        {/* Swaps to the list, at its own URL. The way back is `Back to adding`
            at the top of that view AND the browser's own back gesture — which is
            the reason this is a route and not a piece of state. */}
        <button
          type="button"
          onClick={onShowLists}
          className="text-body flex h-touch cursor-pointer items-center gap-1.5 rounded-panel border border-border px-4 font-medium text-foreground"
        >
          Show lists
          <ChevronRight size={20} aria-hidden />
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
