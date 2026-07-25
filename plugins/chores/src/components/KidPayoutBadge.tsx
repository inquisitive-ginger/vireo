import { Coin, CURRENCY, bucks, bucksSpoken } from '@family-os/ui'
import type { KidPayoutView } from '../lib/payouts'

/* What the kid sees for the payout on a completed paying chore (M4/3b). Three outcomes,
   each visibly distinct so held is never mistaken for refused or earned:

   - held     → a brass "N P$ when Mom or Dad checks" pill: the work counted (XP is already
                theirs), the money is waiting on a person. Names no specific parent —
                a per-family override of the wording is a later setting.
   - earned   → the brass chip, identical to the pending `CoinValue` — the
                payout is in their wallet now (auto-credited, or an approved payout).
                Deliberately the SAME width as pending: the reward group is right-
                aligned next to the completion circle, so a width change on completion
                would slide it sideways as the flight lands. The done card (struck
                title, green check) is what marks it earned, not a badge on the chip.
   - declined → a quiet "No P$ this time" — the one chip with no coin beside it, so it
                is the one that has to name the currency. The XP stays; the optional
                reason is quoted separately by `DeclinedNote`.

   The `view` is derived by `kidPayoutView` (see lib/payouts) — mostly from the task,
   so it is correct the instant a completion lands, not after the payout row is
   fetched. Returns null → renders nothing. */
export function KidPayoutBadge({ view }: { view: KidPayoutView }) {
  if (!view) return null

  if (view.kind === 'held' || view.kind === 'earned') {
    return (
      <span
        className="text-sm-token inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-1 leading-none font-bold"
        style={{
          background: 'var(--coin-tint)',
          border: '1px solid var(--coin)',
          color: 'var(--coin-ink)',
        }}
      >
        <Coin size={16} />
        {/* Each chip is written TWICE — once in the compact code, once spoken. A screen
            reader handed `P$` says "P dollar sign", which is not a currency anyone
            recognises, and it gets nothing at all from the coin. `earned` is a bare
            value, so the coin can state its unit; `held` is a SENTENCE, and a sentence
            has to name what it is counting. */}
        <span aria-hidden>
          {view.kind === 'held'
            ? `${bucks(view.amount)} when Mom or Dad checks`
            : String(view.amount)}
        </span>
        <span className="sr-only">
          {view.kind === 'held'
            ? `${bucksSpoken(view.amount)} when Mom or Dad checks`
            : bucksSpoken(view.amount)}
        </span>
      </span>
    )
  }

  return (
    <span className="text-sm-token inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-medium text-muted-foreground">
      <span aria-hidden>No {CURRENCY.code} this time</span>
      <span className="sr-only">No {CURRENCY.short} this time</span>
    </span>
  )
}

/* The parent's optional reason, quoted back verbatim in the family voice (the M4/1
   `decided_note` treatment). A recess, so it reads as a note pinned to the row rather
   than more chrome. Rendered only for a declined payout that carries a note. */
export function DeclinedNote({ view }: { view: KidPayoutView }) {
  if (view?.kind !== 'declined' || !view.note) return null
  return (
    <p
      className="text-prose-sm mt-2 rounded-card px-3 py-2 text-foreground"
      style={{ background: 'var(--surface-sunken)', boxShadow: 'var(--shadow-inset)' }}
    >
      “{view.note}”
    </p>
  )
}
