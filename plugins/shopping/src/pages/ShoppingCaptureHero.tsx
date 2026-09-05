import { useState, type ReactNode } from 'react'
import { ChevronRight, Loader2, Mic, X } from 'lucide-react'
import { CaptureField, Chip } from '@family-os/ui'
import type { CaptureReport } from '../types'
import { ReportLine } from '../components/ReportLine'

export interface ShoppingCaptureHeroProps {
  /** The last few things that landed, anywhere. Names only — never who added
      them (ADR 072 §4, withdrawn 2026-09-04), and never the aisle they filed
      under (SH-13). Ids because a house adds milk twice in a week and two chips
      must not collide. */
  justAdded: { id: string; name: string; canRetract: boolean }[]
  /** Taking back a typo you made two seconds ago (ADR 073, tier 1). Undefined
      when the profile lacks the key at all; per-CHIP eligibility is the server's
      `canRetract`, which folds in both "yours" and the fifteen-minute window —
      never a position in this strip (ADR 073 §2). */
  onRetract?: (id: string, name: string) => void
  /** The destination pills. Rendered here rather than built here so ONE strip
      serves both layouts — it is the same control, in the same component, just
      placed differently. */
  destinations: ReactNode
  /** Everything waiting across every destination — one number, the same "what's
      left" arithmetic the pills use (D6). */
  openCount: number
  /** Swaps to the list, at its own URL. */
  onShowLists: () => void
  loading: boolean
  destination: string | null
  onAdd: (name: string) => void
  /** The one report slot's contents, already ranked (D4). */
  report: CaptureReport | null
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
  destinations,
  openCount,
  onShowLists,
  loading,
  destination,
  onAdd,
  report,
  canAdd,
}: ShoppingCaptureHeroProps) {
  const [composing, setComposing] = useState(false)

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
        onValueChange={(value) => setComposing(value.trim().length > 0)}
        onSubmit={onAdd}
        trailing={<HoldToSpeak />}
      />

      {/* Tight to the field, because these ARE the field's destination control
          and proximity is the only thing that says so — at a larger gap they
          read as a field and then some unrelated filters. */}
      <div className="mt-3">{destinations}</div>

      {/* Reports on the field, under the pair, height reserved either way — a
          slot mounted on the first keystroke shoves everything below it down and
          Enter shoves it back. */}
      <ReportLine
        className="mt-2"
        size="body"
        report={report}
        idle={
          !canAdd
            ? 'Adding to the list is turned off for this profile.'
            : composing
              ? 'Enter to add'
              : undefined
        }
      />

      <div className="mt-7">
        <div className="text-section-label-lg text-muted-foreground">Just added</div>
        <div className="flex flex-wrap gap-2.5 pt-3">
          {loading ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />
          ) : justAdded.length === 0 ? (
            <span className="text-body text-muted-foreground">Nothing yet.</span>
          ) : (
            justAdded.map((chip) => {
              const retractable = onRetract !== undefined && chip.canRetract
              // A name and a way to undo it — no hue, no avatar, no adder
              // (ADR 072 §3, ADR 064), and no aisle (SH-13). The whole chip is
              // the take-back target where one is offered, which is what puts it
              // over the 48px floor; where it is not, the chip states and does
              // not pretend to act.
              return (
                <Chip
                  key={chip.id}
                  selected={false}
                  label={retractable ? `Take back ${chip.name}` : undefined}
                  onClick={retractable ? () => onRetract(chip.id, chip.name) : undefined}
                  className="text-body min-h-touch gap-2 py-2 pr-3 pl-4.5"
                >
                  {chip.name}
                  {retractable && <X size={18} aria-hidden />}
                </Chip>
              )
            })
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
          {loading ? ' ' : `${openCount} thing${openCount === 1 ? '' : 's'} to get`}
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
