import type { ReactNode } from 'react'
import { AskSeal, Coin } from '@family-os/ui'

/* The ticket (ADR 055) — the one physical metaphor the module commits to. A reward you
   buy becomes a ticket: the STUB carries the cost in the store (coin + numeral) and the
   emoji once it's owned (it's paid for; the price is history); the dashed perforation is
   the promise it will be torn later.

   The notches are DIE-CUT, not drawn: a mask punches real holes through the card —
   border, wash and all — and the shadow is a drop-shadow on the wrapper, recomputed off
   the cut silhouette, so nothing can extend past an edge at any width. In the store a
   ticket is one fixed-width unit; at `md:` the rest of its row is THE ROLL it tears off —
   the same ticket echoing at the perforation, dimmed in two steps, bleeding off-screen.
   Echoes are decoration (aria-hidden, no pointer); the phone shows none and is unchanged.

   One anatomy renders the store shelf, the pocket, and the loading skeleton, so the
   three can't drift. */

const PERF = 'color-mix(in oklch, var(--coin) 34%, var(--border))'
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
      border-left: 2px dashed ${PERF};
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

export function TicketFrame({
  lit = false,
  waiting = false,
  roll = false,
  echoes,
  children,
  className,
}: {
  /** "You can get this now" — a brass-warmed border; the shelf split already carries
      affordability, so the field stays plain card (no wash). */
  lit?: boolean
  /** An asked ticket quiets down while it waits. */
  waiting?: boolean
  /** Store form: fixed-width unit at md:, the dimmed roll filling the rest of the row. */
  roll?: boolean
  /** The roll's echo content (the same ticket, re-rendered; aria-hidden). */
  echoes?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rwt-sh ${waiting ? 'opacity-90' : ''} ${className ?? ''}`}>
      <TicketStyles />
      <div className={`rwt-tk ${lit ? 'rwt-lit' : ''} ${roll ? 'rwt-roll' : ''}`}>
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
      style={{ borderRight: `2px dashed ${PERF}` }}
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
      style={{ borderRight: `2px dashed ${PERF}` }}
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

function StoreTicketBody({
  emoji,
  name,
  description,
  askFirst,
}: {
  emoji: string
  name: string
  description: string | null
  askFirst: boolean
}) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-3.5 px-4 py-4">
      <span className="flex-none text-[34px] leading-none">{emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="text-base-token block font-bold leading-tight">{name}</span>
        {description && (
          <span className="mt-0.5 block text-xs-body leading-snug text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {askFirst && (
        <span className="flex-none self-end pb-0.5">
          <AskLine />
        </span>
      )}
    </span>
  )
}

/** A ticket on the store shelf — the live unit is the tap target; the roll is scenery. */
export function StoreTicket({
  emoji,
  name,
  description,
  cost,
  askFirst,
  onPick,
}: {
  emoji: string
  name: string
  description: string | null
  cost: number
  askFirst: boolean
  onPick: () => void
}) {
  const unit = (
    <>
      <CostStub cost={cost} />
      <StoreTicketBody emoji={emoji} name={name} description={description} askFirst={askFirst} />
    </>
  )
  return (
    <TicketFrame lit roll echoes={unit}>
      <button
        type="button"
        onClick={onPick}
        aria-label={
          `${name}, ${cost} P-Bucks. You can get this now. ` +
          (askFirst ? 'You will ask a parent when you use it.' : '')
        }
        className="flex min-w-0 flex-1 cursor-pointer items-stretch text-left transition-opacity active:opacity-80"
      >
        <span aria-hidden className="flex min-w-0 flex-1 items-stretch">
          {unit}
        </span>
      </button>
    </TicketFrame>
  )
}

/** A torn stub on the memory shelf — the reward, remembered, with a count. */
export function StubChip({ emoji, name, count }: { emoji: string; name: string; count: number }) {
  return (
    <span
      className="text-sm-token inline-flex items-center gap-1.5 py-1.5 pl-2.5 pr-3 font-semibold text-muted-foreground"
      style={{
        background: 'var(--surface-sunken)',
        boxShadow: 'var(--shadow-inset)',
        borderRadius: '8px 3px 3px 8px',
        clipPath:
          'polygon(0 0, 96% 0, 100% 14%, 96% 28%, 100% 42%, 96% 56%, 100% 70%, 96% 84%, 100% 100%, 0 100%)',
      }}
    >
      <span className="text-base" aria-hidden>
        {emoji}
      </span>
      <span className="text-foreground">{name}</span>
      {count > 1 && <span>×{count}</span>}
    </span>
  )
}

/** Loading placeholder — the page keeps its ticket shape while it fetches. */
export function TicketSkeleton() {
  return (
    <TicketFrame className="mb-2.5">
      <span
        className="grid w-[80px] flex-none place-items-center py-4"
        style={{ borderRight: `2px dashed ${PERF}` }}
      >
        <span className="size-6 animate-pulse rounded-full bg-muted" />
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-3.5 px-4 py-4">
        <span className="size-9 flex-none animate-pulse rounded-card bg-muted" />
        <span className="min-w-0 flex-1">
          <span className="block h-4 w-2/5 animate-pulse rounded bg-muted" />
          <span className="mt-1.5 block h-3 w-3/5 animate-pulse rounded bg-muted" />
        </span>
      </div>
    </TicketFrame>
  )
}
