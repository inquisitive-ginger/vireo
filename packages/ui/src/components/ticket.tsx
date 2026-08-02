import type { ReactNode } from 'react'
import { AskSeal } from './coin-decision'
import { Coin } from './coin'

/* The ticket (ADR 055) — the reward module's one physical metaphor, extracted here
   at its second cross-plugin caller (the store/pocket in rewards, the punch-card
   prize picker in chores — the Coin precedent). The STUB carries the cost in the
   store (coin + numeral) and the emoji once owned (it's paid for; the price is
   history); the dashed perforation is the promise it will be torn later.

   The notches are DIE-CUT, not drawn: a mask punches real holes through the card —
   border, wash and all — and the shadow is a drop-shadow on the wrapper, recomputed
   off the cut silhouette, so nothing can extend past an edge at any width. In the
   store a ticket is one fixed-width unit; at `md:` the rest of its row is THE ROLL
   it tears off — the same ticket echoing at the perforation, dimmed in two steps,
   bleeding off-screen. Echoes are decoration (aria-hidden, no pointer). */

export const TICKET_PERF = 'color-mix(in oklch, var(--coin) 34%, var(--border))'
const LIT_BORDER = 'color-mix(in oklch, var(--coin) 60%, var(--border))'

/* Hole geometry: the stub is 80px + a 2px dashed perforation → centre 81px. Roll units
   are a fixed 430px, so the joint holes sit at 430/511/860/941 — punched through the
   container so border and joints are cut alike. Safari (the fridge iPad) needs the
   -webkit- mask longhands. */
const holes = (xs: string[]) =>
  xs
    .flatMap((x) => [
      `radial-gradient(circle at ${x} 0, transparent 7px, #000 7.8px)`,
      `radial-gradient(circle at ${x} 100%, transparent 7px, #000 7.8px)`,
    ])
    .join(', ')

const TICKET_STYLES = `
  .rwt-sh { filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.07)) drop-shadow(0 3px 10px rgb(0 0 0 / 0.07)); }
  .rwt-tk {
    position: relative; display: flex; align-items: stretch; overflow: hidden;
    background: var(--card); border: 1px solid var(--border); border-radius: 12px;
    -webkit-mask: ${holes(['81px'])}; -webkit-mask-composite: source-in;
    mask: ${holes(['81px'])}; mask-composite: intersect;
  }
  .rwt-tk.rwt-lit { border-color: ${LIT_BORDER}; }
  .rwt-tk.rwt-sel { border-color: var(--primary); box-shadow: inset 0 0 0 1px var(--primary); }
  .rwt-unit { display: flex; align-items: stretch; flex: 1 1 auto; min-width: 0; }
  .rwt-echo { display: none; }
  @media (min-width: 768px) {
    .rwt-tk.rwt-roll {
      -webkit-mask: ${holes(['81px', '430px', '511px', '860px', '941px'])};
      -webkit-mask-composite: source-in;
      mask: ${holes(['81px', '430px', '511px', '860px', '941px'])};
      mask-composite: intersect;
      /* the roll bleeds off the cut edge — no right border, no rounded end */
      border-right: 0; border-top-right-radius: 0; border-bottom-right-radius: 0;
    }
    .rwt-roll .rwt-unit, .rwt-roll .rwt-echo { flex: 0 0 430px; }
    .rwt-roll .rwt-echo {
      display: flex; opacity: 0.38; pointer-events: none;
      border-left: 2px dashed ${TICKET_PERF};
    }
    .rwt-roll .rwt-echo ~ .rwt-echo { opacity: 0.15; }
  }
`

function TicketStyles() {
  return (
    <style href="rewards-ticket" precedence="default">
      {TICKET_STYLES}
    </style>
  )
}

export interface TicketFrameProps {
  /** "You can get this now" — a brass-warmed border; the shelf split already carries
      affordability, so the field stays plain card (no wash). */
  lit?: boolean
  /** An asked ticket quiets down while it waits. */
  waiting?: boolean
  /** The picked option in a chooser — the primary ring, cut like everything else. */
  selected?: boolean
  /** Store form: fixed-width unit at md:, the dimmed roll filling the rest of the row. */
  roll?: boolean
  /** The roll's echo content (the same ticket, re-rendered; aria-hidden). */
  echoes?: ReactNode
  children: ReactNode
  className?: string
}

export function TicketFrame({
  lit = false,
  waiting = false,
  selected = false,
  roll = false,
  echoes,
  children,
  className,
}: TicketFrameProps) {
  return (
    <div className={`rwt-sh ${waiting ? 'opacity-90' : ''} ${className ?? ''}`}>
      <TicketStyles />
      <div
        className={`rwt-tk ${lit ? 'rwt-lit' : ''} ${selected ? 'rwt-sel' : ''} ${roll ? 'rwt-roll' : ''}`}
      >
        <div className="rwt-unit">{children}</div>
        {roll && (
          <>
            <div className="rwt-echo" aria-hidden>
              {echoes}
            </div>
            <div className="rwt-echo" aria-hidden>
              {echoes}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** Store stub: the price, worn where the tear will happen. */
export function CostStub({ cost }: { cost: number }) {
  return (
    <span
      className="grid w-[80px] flex-none place-items-center py-4"
      style={{ borderRight: `2px dashed ${TICKET_PERF}` }}
    >
      <span className="flex items-center gap-1.5">
        <Coin size={20} />
        <span
          className="text-card-title font-bold leading-none tabular-nums"
          style={{ color: 'var(--coin-ink)' }}
        >
          {cost}
        </span>
      </span>
    </span>
  )
}

/** Pocket stub: the emoji — it's paid for; the price is history. */
export function EmojiStub({ emoji }: { emoji: string }) {
  return (
    <span
      className="grid w-[80px] flex-none place-items-center py-4"
      style={{ borderRight: `2px dashed ${TICKET_PERF}` }}
    >
      <span className="text-[30px] leading-none" aria-hidden>
        {emoji}
      </span>
    </span>
  )
}

/** The quiet ask marker — informational, never a gate: "you'll ask when you use it". */
export function AskLine() {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs-token font-semibold"
      style={{ color: 'var(--coin-ink)' }}
    >
      <AskSeal size={13} ring={false} />
      ask to use
    </span>
  )
}
