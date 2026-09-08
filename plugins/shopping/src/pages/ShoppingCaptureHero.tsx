import type { ReactNode } from 'react'
import { ChevronRight, CornerDownLeft } from 'lucide-react'
import { CaptureField } from '@family-os/ui'
import type { CaptureReport } from '../types'
import { ReportLine } from '../components/ReportLine'

export interface ShoppingCaptureHeroProps {
  /** The destination pills. Rendered here rather than built here so ONE strip
      serves both layouts — it is the same control, in the same component, just
      placed differently. */
  destinations: ReactNode
  /** Everything waiting across every destination — one number, the same "what's
      left" arithmetic the pills use. House-wide is right HERE and on the widget
      (D6) and wrong on the phone (SH-10): this surface has no rows of its own to
      contradict, and the pills directly above name every scope it sums. */
  openCount: number
  /** Swaps to the list, at its own URL. */
  onShowLists: () => void
  loading: boolean
  destination: string | null
  onAdd: (name: string) => void
  /** The report slot's stack, already ranked (D4): one error line, then one
      notice per collision, growing downward into the space below the pills. */
  reports: CaptureReport[]
  canAdd: boolean
  /** No route to the server. The wall is capture and nothing else, so offline it
      has nothing it can do — and it says that rather than taking words it will
      drop. */
  offline: boolean
}

/* `/shopping` at tablet width and up (design.md §"One surface, two layouts",
   artifact frame W2): capture fills the screen, and the lists come in only when
   asked for. Same route, same data, no profile check — the viewport picks this,
   and `Show lists` swaps to the list at `/shopping/lists`.

   It is capture and NOTHING else (Zach, live pass). The `Just added` strip is
   gone: `/shopping/lists` now carries take-back on the rows themselves (SH-02),
   which is a click further away and does strictly more — rename, re-file and
   remove sit beside it. That was the strip's one job, and at W2 it was once the
   only place it could be done (ADR 073 §3), so it could not leave until the rows
   had it. `Hold to speak` is gone with it: a control reserved for a feature
   outside M5.5 was the largest thing on the field.

   Read from across a room, so every label here is a distance token. */
export function ShoppingCaptureHero({
  destinations,
  openCount,
  onShowLists,
  loading,
  destination,
  onAdd,
  reports,
  canAdd,
  offline,
}: ShoppingCaptureHeroProps) {
  return (
    /* Fills the screen, so what a person walks up to is the field and nothing
       else — and it FILLS ITS PARENT rather than computing against the viewport.

       It used to subtract `4.5rem`, a copy of `PageContainer`'s `pt-6 pb-12`.
       That was right until the container gained `sm:pt-10` the same day, and
       then the copy was 16px short at every size ≥640px — measured, not
       guessed: `main` reported `scrollHeight − clientHeight = 16` at both
       1024×768 and 768×1024. A surface that says "fills the screen" was
       overflowing it by a rounding error in a duplicated constant.

       `h-full` has no constant to drift. The shell already owns the height
       (`App.tsx`: `h-dvh` outside, `flex-1 overflow-auto` on `main`), so this
       inherits `dvh` — which is also the right answer for a tablet's browser
       chrome and its on-screen keyboard, neither of which `svh` tracked.

       `overflow-hidden` states the consequence: with no scroll, a notice stack
       that outgrows the space is CLIPPED rather than scrolled to. */
    <div className="flex h-full flex-col overflow-hidden">
      {/* Centred in what is left above the seam, rather than hung from the top.
          With the strip gone the wall is mostly empty, and SH-14's finding is
          answered by rebalancing what is there — nothing is added to fill it,
          and nothing reaches for `--surface-sunken` (ADR 040). */}
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        {/* What centres is the VISIBLE block — headline, field, pills. The report
            slot hangs out of flow below it (Zach, live pass): counted in, its
            empty 40px reserve pushed everything ~20px above optical centre, so
            the block measured centred and did not look it. Out of flow it also
            means a notice arriving cannot move the field someone is typing into. */}
        <div className="relative">
          <h1 className="text-page-title text-foreground">What do we need?</h1>

          <CaptureField
            size="wall"
            className="mt-6"
            // No autofocus, at any width (ADR 070, amended 2026-09-04). A screen
            // left on in a kitchen is not a screen someone walked up to, and it
            // must not hold the keyboard on the chance that they did.
            //
            // The placeholder DEMONSTRATES rather than describes: it is the only
            // thing on the wall that can teach the comma (Zach, live pass), and
            // a wall has no other place to put an instruction.
            placeholder="milk, eggs, bread"
            label={destination ? `Add to ${destination}` : 'Add to the shopping list'}
            disabled={!canAdd || !destination || offline}
            onSubmit={onAdd}
            trailing={canAdd && destination && !offline ? <EnterHint /> : undefined}
          />

          {/* Tight to the field, because these ARE the field's destination control
              and proximity is the only thing that says so — at a larger gap they
              read as a field and then some unrelated filters. */}
          <div className="mt-3">{destinations}</div>

          <ReportLine
            className="absolute inset-x-0 top-full mt-2"
            size="body"
            reports={reports}
            idle={
              !canAdd
                ? 'Adding to the list is turned off for this profile.'
                : offline
                  ? 'Offline — adding needs a connection.'
                  : undefined
            }
          />
        </div>
      </div>

      {/* The seam between catching and shopping, pinned to the bottom edge. */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        {/* Never `0 things to get` before the read lands — a count is a claim
            about the house, read from across the room by someone who will not
            look twice. */}
        <span className="text-body text-muted-foreground">
          {loading ? ' ' : `${openCount} thing${openCount === 1 ? '' : 's'} to get`}
        </span>
        {/* Swaps to the list, at its own URL. The way back is `Back to adding`
            at the top of that view AND the browser's own back gesture — which is
            the reason this is a route and not a piece of state. It is also now
            the way to every verb a row has, take-back included. */}
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

/* What `Hold to speak` used to occupy, at a fraction of its weight. Persistent
   while the field is live rather than only while composing: it replaces chrome
   that was always there, and on a screen someone walks up to it IS the
   instruction. `aria-hidden` — the field already announces itself, and a hint
   read out after every label is noise to the one reader who cannot see it. */
function EnterHint() {
  return (
    <span aria-hidden className="text-body flex items-center gap-1.5 pr-2 text-muted-foreground">
      <CornerDownLeft size={18} />
      Enter to add
    </span>
  )
}
