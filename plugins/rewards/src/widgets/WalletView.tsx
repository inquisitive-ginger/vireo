import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Star, Wallet } from 'lucide-react'
import { Coin, WidgetHeader, WIDGET_CQ } from '@family-os/ui'
import type { Redemption, Reward } from '../types'
import { walletReach } from '../lib/affordability'
import { BalanceChip } from '../components/Store'
import { Track } from '../components/RedeemDialog'

/* `rewards.wallet` — the kid's home widget (M4/5, frame "1" + XP footnote). It leads
   with the balance and follows it with ONE adaptive line, because a bare number is a
   scoreboard, not a wallet: what you can grab now, or the next thing you're close to.
   The near-empty state is the one that matters — it points at the next reachable reward
   instead of dead-ending at "3".

   XP rides underneath as a quiet footnote (tiers 1–3 only). A chore mints both P-Bucks
   and XP, so divorcing them across two widgets reads as two disconnected games — but
   they keep different FORMS (ADR 051): P-Bucks is the brass coin you spend, XP is the
   muted star that only climbs. The store stays P-Bucks-only; you can't spend XP. */

export type WalletSize = 'compact' | 'standard'

export interface WalletViewProps {
  balance: number
  rewards: Reward[]
  /** Owned, un-torn tickets. One waiting beats the affordability line (M4/5c) —
      the thing you already have beats the thing you could buy. */
  tickets?: Redemption[]
  /** Lifetime XP for the footnote; omit for a parent's wallet (no XP accrues at tier 4). */
  lifetimeXp?: number
  size?: WalletSize
}

function Balance({ balance, size }: { balance: number; size: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Coin size={size} />
      <span className="text-metric tabular-nums">
        {balance}
        <span className="align-baseline text-base-token font-semibold text-muted-foreground">
          {' '}
          P$
        </span>
      </span>
    </div>
  )
}

function XpFootnote({ xp }: { xp: number }) {
  return (
    <div className="mt-auto flex items-center gap-1.5 border-t border-border pt-2.5 text-xs-body text-muted-foreground">
      <Star size={12} className="fill-current text-muted-foreground" aria-hidden />
      <span className="tabular-nums">{xp}</span> XP earned all-time
    </div>
  )
}

/** An owned ticket waiting in the pocket — the longest-held one leads. */
function TicketLine({ tickets }: { tickets: Redemption[] }) {
  const lead = [...tickets].sort((a, b) => a.purchasedAt.localeCompare(b.purchasedAt))[0]
  return (
    <div className="text-sm-token font-semibold">
      <span className="text-lg" aria-hidden>
        {lead?.reward?.emoji ?? '🎟️'}
      </span>{' '}
      {tickets.length === 1
        ? 'A ticket’s waiting in your pocket ›'
        : `${tickets.length} tickets are waiting in your pocket ›`}
    </div>
  )
}

/** The adaptive line: ticket-ready › affordable › next-goal › first-earn. */
function Adaptive({
  balance,
  rewards,
  tickets = [],
}: {
  balance: number
  rewards: Reward[]
  tickets?: Redemption[]
}) {
  const { affordable, nextUp } = walletReach(rewards, balance)
  if (tickets.length > 0) {
    return <TicketLine tickets={tickets} />
  }
  if (affordable.length > 0) {
    return (
      <div className="text-sm-token">
        <span className="text-lg" aria-hidden>
          {affordable.slice(0, 4).map((r) => r.emoji)}
        </span>{' '}
        <span className="text-muted-foreground">{affordable.length} you can get</span>
      </div>
    )
  }
  if (nextUp) {
    return (
      <div>
        <div className="text-sm-token">
          <span className="text-muted-foreground">{nextUp.cost - balance} more P$ for</span>{' '}
          <span aria-hidden>{nextUp.emoji}</span> {nextUp.name}
        </div>
        <div className="mt-2">
          <Track
            have={balance}
            total={nextUp.cost}
            label={`You have ${balance} of ${nextUp.cost} P-Bucks for ${nextUp.name}`}
          />
        </div>
      </div>
    )
  }
  return (
    <div className="text-sm-token text-muted-foreground">
      Do a chore to earn your first P-Bucks.
    </div>
  )
}

function CompactBody({ balance, rewards, tickets, lifetimeXp }: WalletViewProps) {
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader icon={Wallet} label="Wallet" />
      <div className="my-3">
        <Balance balance={balance} size={26} />
      </div>
      <Adaptive balance={balance} rewards={rewards} tickets={tickets} />
      {lifetimeXp !== undefined && <XpFootnote xp={lifetimeXp} />}
    </div>
  )
}

function StandardBody({ balance, rewards, tickets = [], lifetimeXp }: WalletViewProps) {
  const { affordable, nextUp } = walletReach(rewards, balance)
  return (
    <div className="flex size-full flex-col p-5">
      <WidgetHeader icon={Wallet} label="Wallet" trailing={<BalanceChip balance={balance} />} />
      {tickets.length > 0 && (
        <div className="mt-4">
          <TicketLine tickets={tickets} />
        </div>
      )}
      {affordable.length > 0 && (
        <>
          <div className="mb-2 mt-4 text-xs-token text-muted-foreground">You can get</div>
          <div className="flex flex-col gap-2">
            {affordable.slice(0, 2).map((r) => (
              <div key={r.id} className="flex items-center gap-2.5">
                <span className="text-lg" aria-hidden>
                  {r.emoji}
                </span>
                <span className="text-sm-token flex-1 truncate font-semibold">{r.name}</span>
                <span className="text-sm-token font-bold">
                  {r.cost} <span className="font-medium text-muted-foreground">P$</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      {nextUp && (
        <div className="mt-3 border-t border-border pt-3">
          <div className="text-sm-token font-semibold">
            <span aria-hidden>{nextUp.emoji}</span> {nextUp.name} · {nextUp.cost - balance} more P$
          </div>
          <div className="mt-2">
            <Track
              have={balance}
              total={nextUp.cost}
              label={`You have ${balance} of ${nextUp.cost} P-Bucks for ${nextUp.name}`}
            />
          </div>
        </div>
      )}
      {lifetimeXp !== undefined && <XpFootnote xp={lifetimeXp} />}
    </div>
  )
}

const WIDGET_STYLES = `
  .ww-compact, .ww-standard { height: 100%; }
  .ww-compact  { display: block; }
  .ww-standard { display: none; }
  @container (min-width: ${WIDGET_CQ.wideMinWidth}) {
    .ww-compact  { display: none; }
    .ww-standard { display: block; }
  }
`

export function WalletView(props: WalletViewProps) {
  let inner: ReactNode
  if (props.size) {
    inner = props.size === 'standard' ? <StandardBody {...props} /> : <CompactBody {...props} />
  } else {
    inner = (
      <div className="size-full" style={{ containerType: 'size' }}>
        <style href="rewards-wallet-widget" precedence="default">
          {WIDGET_STYLES}
        </style>
        <div className="ww-compact">
          <CompactBody {...props} />
        </div>
        <div className="ww-standard">
          <StandardBody {...props} />
        </div>
      </div>
    )
  }
  return (
    <Link to="/rewards" className="block size-full no-underline" aria-label="Open the store">
      {inner}
    </Link>
  )
}
