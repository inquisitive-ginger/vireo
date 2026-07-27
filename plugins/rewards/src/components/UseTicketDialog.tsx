import { useState } from 'react'
import { AskSeal, Button, Modal } from '@family-os/ui'
import { useUseRedemption } from '../lib/hooks'
import type { Redemption, RedemptionStatus } from '../types'

/* The use moment (ADR 055). Tapping "Use it" in the pocket lands here:
     · non-approval → confirm, then the TEAR — the module's one celebratory flourish
     · ask-first    → the ask, at use time; no money talk (that was settled at the
       register) — the question is timing, and the ticket stays in the pocket
   The tear animation is a 480ms settle of the two halves; skipped under reduced
   motion (the CSS keyframes only bind inside no-preference). */

const TEAR_STYLES = `
  .rwt-half { padding: 14px 12px; font-size: 30px; line-height: 1;
    background: var(--coin-tint); border: 1px solid color-mix(in oklch, var(--coin) 55%, var(--border)); }
  .rwt-half.l { border-radius: 10px 2px 2px 10px; transform: rotate(-4deg);
    clip-path: polygon(0 0, 94% 0, 100% 12%, 94% 25%, 100% 38%, 94% 52%, 100% 65%, 94% 78%, 100% 90%, 94% 100%, 0 100%); }
  .rwt-half.r { border-radius: 2px 10px 10px 2px; transform: rotate(3deg);
    display: grid; place-items: center;
    clip-path: polygon(6% 0, 100% 0, 100% 100%, 6% 100%, 0 90%, 6% 78%, 0 65%, 6% 52%, 0 38%, 6% 25%, 0 12%); }
  @media (prefers-reduced-motion: no-preference) {
    .rwt-half.l { animation: rwtTearL 480ms cubic-bezier(0, 0, 0.2, 1) both; }
    .rwt-half.r { animation: rwtTearR 480ms cubic-bezier(0, 0, 0.2, 1) both; }
    @keyframes rwtTearL { from { transform: rotate(0) translateX(6px); } to { transform: rotate(-4deg) translateX(0); } }
    @keyframes rwtTearR { from { transform: rotate(0) translateX(-6px); } to { transform: rotate(3deg) translateX(0); } }
  }
`

/** The torn ticket — two halves settling apart at the perforation. */
export function TornHalves({ emoji, name }: { emoji: string; name: string }) {
  return (
    <div className="my-2 flex justify-center gap-1.5" aria-hidden>
      <style href="rewards-tear" precedence="default">
        {TEAR_STYLES}
      </style>
      <span className="rwt-half l">{emoji}</span>
      <span
        className="rwt-half r text-sm-token font-bold uppercase tracking-wide"
        style={{ color: 'var(--coin-ink)' }}
      >
        {name.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 10)}
      </span>
    </div>
  )
}

export function UseTicketDialog({
  ticket,
  open,
  onClose,
}: {
  ticket: Redemption | null
  open: boolean
  onClose: () => void
}) {
  const use = useUseRedemption()
  const [result, setResult] = useState<RedemptionStatus | null>(null)

  const close = () => {
    onClose()
    setTimeout(() => {
      setResult(null)
      use.reset()
    }, 200)
  }

  if (!ticket) return null
  const reward = ticket.reward
  const askFirst = reward?.requiresApproval ?? false
  const name = reward?.name ?? 'your reward'
  const emoji = reward?.emoji ?? '🎟️'

  const title = result === 'used' ? 'Torn!' : result === 'use_requested' ? 'Asked!' : 'Use it now?'

  return (
    <Modal open={open} onClose={close} title={title}>
      <UseTicketView
        title={title}
        emoji={emoji}
        name={name}
        description={reward?.description ?? null}
        askFirst={askFirst}
        result={result}
        pending={use.isPending}
        error={use.error instanceof Error ? use.error.message : null}
        onUse={() =>
          use.mutate(ticket.id, {
            onSuccess: (data) => setResult(data.redemption.status),
          })
        }
        onClose={close}
      />
    </Modal>
  )
}

/** Pure view so the three states can be tested without the mutation. */
export function UseTicketView({
  title,
  emoji,
  name,
  description,
  askFirst,
  result,
  pending,
  error,
  onUse,
  onClose,
}: {
  title: string
  emoji: string
  name: string
  description: string | null
  askFirst: boolean
  result: RedemptionStatus | null
  pending: boolean
  error: string | null
  onUse: () => void
  onClose: () => void
}) {
  if (result === 'used') {
    return (
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-card-title">{title}</h3>
        <TornHalves emoji={emoji} name={name} />
        <p className="text-base-token font-semibold text-foreground">Enjoy {name} 🎉</p>
        <p className="text-sm-token text-muted-foreground">The stub&rsquo;s on your shelf.</p>
        <Button onClick={onClose} className="mt-5 w-full">
          Done
        </Button>
      </div>
    )
  }

  if (result === 'use_requested') {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-card-title">{title}</h3>
        <span className="text-[38px] leading-none" aria-hidden>
          {emoji}
        </span>
        <p className="text-sm-token text-muted-foreground">
          Mom or Dad got a ping — your ticket stays in your pocket until it&rsquo;s a yes.
        </p>
        <Button onClick={onClose} className="mt-4 w-full">
          Okay
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className="grid size-16 place-items-center rounded-panel text-[38px] leading-none"
        style={{ background: 'var(--surface-sunken)', boxShadow: 'var(--shadow-inset)' }}
        aria-hidden
      >
        {emoji}
      </div>
      <h3 className="text-card-title mt-1">{title}</h3>
      <p className="text-base-token font-semibold">{name}</p>
      {description && <p className="text-sm-token text-muted-foreground">{description}</p>}

      <p className="text-sm-token mt-2 text-muted-foreground">
        {askFirst
          ? 'This one’s an ask — Mom or Dad gets a ping, and your ticket stays in your pocket until it’s a yes.'
          : 'Tear the ticket and it’s used — the stub goes on your shelf.'}
      </p>

      {error && <p className="text-sm-token mt-1 font-medium text-[var(--error)]">{error}</p>}

      <div className="mt-4 flex w-full flex-col gap-2">
        <Button onClick={onUse} disabled={pending} className="w-full">
          {askFirst ? (
            <span className="inline-flex items-center gap-1.5">
              <AskSeal size={15} ring={false} />
              Ask to use it
            </span>
          ) : (
            'Use it'
          )}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={pending} className="w-full">
          Not yet
        </Button>
      </div>
    </div>
  )
}
