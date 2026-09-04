import { ChevronRight, Loader2, Mic, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { CaptureField, cn } from '@family-os/ui'

export interface ShoppingCaptureHeroProps {
  /** The last few things that landed, anywhere. Names only — never who added
      them (ADR 072 §4, withdrawn 2026-09-04). Ids because a house adds milk
      twice in a week and two chips must not collide. */
  justAdded: { id: string; name: string; canRetract: boolean }[]
  /** Taking back a typo you made two seconds ago (ADR 073, tier 1). Undefined
      when the profile lacks the key at all; per-CHIP eligibility is the server's
      `canRetract`, which folds in both "yours" and the fifteen-minute window. */
  onRetract?: (id: string, name: string) => void
  /** A retract the server refused — most often the window closing between
      fetches, which is expected and must be shown rather than swallowed. */
  retractError: string | null
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
  onRetract,
  retractError,
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
        {retractError && (
          <p role="alert" className="text-body px-1 pt-2 text-error">
            {retractError}
          </p>
        )}
        <div className="flex flex-wrap gap-2.5 pt-3">
          {loading ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />
          ) : justAdded.length === 0 ? (
            <span className="text-body text-muted-foreground">Nothing yet.</span>
          ) : (
            justAdded.map((chip) => (
              <span
                key={chip.id}
                className={cn(
                  'text-body flex items-center gap-2 rounded-full border-2 border-border py-2 pl-4.5 text-foreground',
                  onRetract && chip.canRetract ? 'pr-2' : 'pr-4.5'
                )}
              >
                {chip.name}
                {onRetract && chip.canRetract && (
                  <button
                    type="button"
                    onClick={() => onRetract(chip.id, chip.name)}
                    aria-label={`Take back ${chip.name}`}
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
