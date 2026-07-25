import { useState } from 'react'
import { Coin } from './coin'
import { Button } from './button'
import { Textarea } from './textarea'
import { bucks } from '../lib/currency'

/* The "needs a grown-up's yes" mark (M4/4). A gold wax seal — a seal IS
   authorization — struck with a "?", which reads as *ask*: not "done" like a check,
   not "blocked" like a lock. A single glyph stays crisp where a check or star blurs,
   and it wears the coin family's metal so it belongs beside a price. Positioned by the
   caller (a corner badge on a reward's emoji tile, or inline). */
export interface AskSealProps {
  /** Diameter in px. */
  size?: number
  /** A white ring so it punches cleanly out of whatever it sits on (a corner badge). */
  ring?: boolean
  className?: string
  style?: React.CSSProperties
}

export function AskSeal({ size = 20, ring = true, className, style }: AskSealProps) {
  return (
    <span
      className={`inline-grid place-items-center rounded-full${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Needs a grown-up's OK"
      title="Needs a grown-up's OK"
      style={{
        width: size,
        height: size,
        color: 'var(--coin-btn-ink)',
        background:
          'radial-gradient(circle at 34% 30%, var(--coin-hi), var(--coin) 62%, var(--coin-deep))',
        boxShadow: ring
          ? '0 0 0 2px var(--card), 0 1px 2px rgba(0,0,0,0.25)'
          : '0 1px 2px rgba(0,0,0,0.2)',
        ...style,
      }}
    >
      <span
        aria-hidden
        className="font-black leading-none"
        style={{ fontSize: Math.round(size * 0.62) }}
      >
        ?
      </span>
    </span>
  )
}

export interface CoinDecisionTrayProps {
  amount: number
  /** The waiting prompt — "Waiting on your OK", "15 P$ to spend". */
  prompt: string
  /** The affirmative button — "Pay 10 P$", "Approve". */
  approveLabel: string
  /** The negative button — "Not yet", "Not this time". */
  declineLabel: string
  onApprove: () => Promise<unknown> | void
  /** `note` is null unless `withDeclineNote` is set and the parent typed one. */
  onDecline: (note: string | null) => Promise<unknown> | void
  /** When set, declining first opens an inline optional-note field (M4/4 redemptions);
      without it, declining fires immediately (the chores payout, whose note is deferred). */
  withDeclineNote?: boolean
  declineNoteLabel?: React.ReactNode
  declineNotePlaceholder?: string
  /** Confirmation lines once decided. */
  approvedLabel?: string
  declinedLabel?: string
}

/* The brass decision tray — a coin, a prompt, and approve/decline. Shared by the
   chores board (a held payout) and the rewards queue (a payout OR a redemption), so
   the two can't drift. Owns its own optimistic decided/deciding state: it flips to a
   confirmation the instant it's tapped and reverts if the mutation rejects; a query
   refetch reconciles underneath. */
export function CoinDecisionTray({
  amount,
  prompt,
  approveLabel,
  declineLabel,
  onApprove,
  onDecline,
  withDeclineNote = false,
  declineNoteLabel,
  declineNotePlaceholder,
  approvedLabel,
  declinedLabel = 'Not this time',
}: CoinDecisionTrayProps) {
  const [decided, setDecided] = useState<'approve' | 'decline' | null>(null)
  const [deciding, setDeciding] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')

  const trayStyle = {
    background: 'color-mix(in oklch, var(--coin) 12%, var(--card))',
    borderColor: 'color-mix(in oklch, var(--coin) 42%, var(--card))',
  }

  function run(decision: 'approve' | 'decline', noteArg: string | null) {
    setDecided(decision)
    setDeciding(true)
    Promise.resolve(decision === 'approve' ? onApprove() : onDecline(noteArg))
      .catch(() => {
        setDecided(null)
        setNoteOpen(false)
      })
      .finally(() => setDeciding(false))
  }

  if (decided) {
    return (
      <div
        className="relative z-20 flex items-center gap-2 rounded-card border px-3 py-2.5"
        style={trayStyle}
      >
        <Coin size={18} />
        <span className="text-sm-token font-semibold" style={{ color: 'var(--coin-ink)' }}>
          {decided === 'approve' ? (approvedLabel ?? `Paid ${bucks(amount)}`) : declinedLabel}
        </span>
      </div>
    )
  }

  if (noteOpen) {
    return (
      <div
        className="relative z-20 flex flex-col gap-2 rounded-card border px-3 py-2.5"
        style={trayStyle}
      >
        {declineNoteLabel && (
          <span className="text-xs-body text-muted-foreground">{declineNoteLabel}</span>
        )}
        <Textarea
          rows={2}
          value={note}
          autoFocus
          placeholder={declineNotePlaceholder}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" disabled={deciding} onClick={() => setNoteOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={deciding}
            onClick={() => run('decline', note.trim() || null)}
            style={{ background: 'var(--error)', color: 'var(--error-foreground)' }}
          >
            {declineLabel} · refund {bucks(amount)}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative z-20 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card border py-2 pr-2 pl-3"
      style={trayStyle}
    >
      <Coin size={22} />
      <span className="text-sm-token flex-1 font-semibold" style={{ color: 'var(--coin-ink)' }}>
        {prompt}
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={deciding}
          onClick={() => run('approve', null)}
          className="font-bold text-[oklch(0.28_0.09_74)] shadow-[var(--shadow-card)] hover:brightness-95"
          style={{ background: 'var(--coin)' }}
        >
          {approveLabel}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={deciding}
          onClick={() => (withDeclineNote ? setNoteOpen(true) : run('decline', null))}
        >
          {declineLabel}
        </Button>
      </div>
    </div>
  )
}
