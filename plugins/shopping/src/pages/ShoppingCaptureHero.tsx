import { Loader2, Mic } from 'lucide-react'
import { CaptureField } from '@family-os/ui'

export interface ShoppingCaptureHeroProps {
  /** The last few things that landed, anywhere. Names only — never who added
      them (ADR 072 §4, withdrawn 2026-09-04). Ids because a house adds milk
      twice in a week and two chips must not collide. */
  justAdded: { id: string; name: string }[]
  /** Everything waiting, everywhere. The per-destination split is not repeated
      here — it lives one block down in the destination strip, where it is
      tappable rather than merely stated. */
  openCount: number
  loading: boolean
  destination: string | null
  onAdd: (name: string) => void
  onDraftChange: (draft: string) => void
  draftAisle: string | null
  addError: string | null
  canAdd: boolean
}

/* The top block of `/shopping` at tablet width and up (design.md §"The wide
   layout", artifact frame W2). It is NOT a separate surface and it is not a
   mode: the same route, the same data, the same list underneath — the field is
   simply the size it should be on a screen you are standing in front of, and
   the list follows it down the page exactly as it does on a phone.

   Read from across a room, so every label here is a distance token and the
   strip label is `section-label-lg` rather than the 11px `section-label` a
   phone uses (design-system.md §Type scale). */
export function ShoppingCaptureHero({
  justAdded,
  openCount,
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
    <div>
      <h1 className="text-display-xl text-foreground">What do we need?</h1>

      <CaptureField
        size="wall"
        className="mt-6"
        // Wide only (ADR 070): this is the screen someone walked up to in order
        // to type, and any tap before the word loses to a notepad. The narrow
        // layout does not focus — an unrequested keyboard on a route you opened
        // to read is hostile.
        autoFocus
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

      {/* The seam between catching and shopping. It states the total and hands
          off — no button, because the list it would send you to is the next
          thing on the page. */}
      <div className="mt-7 border-t border-border pt-5">
        {/* Never `0 things waiting` before the read lands — a count is a claim
            about the house, read from across the room by someone who will not
            look twice. */}
        <span className="text-body text-muted-foreground">
          {loading ? ' ' : `${openCount} thing${openCount === 1 ? '' : 's'} waiting`}
        </span>
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
