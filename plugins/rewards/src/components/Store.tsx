import { useMemo, useState } from 'react'
import { Tag, Ticket as TicketIcon } from 'lucide-react'
import { CURRENCY, Coin, EmptyState, ErrorCard, TabBar } from '@family-os/ui'
import { useAuth } from '@family-os/platform'
import { useEarnedRewards, useMyCards, useMyRedemptions, useStore } from '../lib/hooks'
import { gapFor, storeShelves } from '../lib/affordability'
import { askedLabel, boughtLabel, earnedLabel, enjoyedSince } from '../lib/when'
import type { FinishedCards, Redemption, Reward } from '../types'
import { EmojiStub, StoreTicket, StubChip, TicketFrame, TicketSkeleton } from './Ticket'
import { HistorySheet } from './HistorySheet'
import { RedeemDialog } from './RedeemDialog'
import { UseTicketDialog } from './UseTicketDialog'

/* The kid rewards surface (ADR 055): two tabs, two jobs.
     · Store    — spending well. The purse leads, then "Get it now" tickets and
                  "Almost there" striving rows. One tense: what you can do next.
     · My stuff — owning and remembering. The pocket of tickets you hold, and the
                  shelf of stubs you've torn. Punch cards land here later (M4/6),
                  which is why it's "My stuff", not "My tickets".
   The tab badge is the pocket's ready count — the same grammar as the parent's
   approvals badge. History ("Where'd it go?") joins the purse in M4/5c. */

type KidTab = 'store' | 'stuff'

export function Store() {
  const { name } = useAuth()
  const store = useStore()
  const mine = useMyRedemptions()
  const earned = useEarnedRewards()
  const punchCards = useMyCards()
  const [tab, setTab] = useState<KidTab>('store')
  const [picked, setPicked] = useState<Reward | null>(null)
  const [using, setUsing] = useState<Redemption | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)

  const pocket = mine.data ?? []
  const readyCount = pocket.filter((t) => t.status === 'owned').length

  if (store.isError) {
    return <ErrorCard moduleName="Store" onRetry={() => store.refetch()} />
  }

  return (
    <>
      <h1 className="sr-only">Rewards</h1>
      <TabBar<KidTab>
        aria-label="Rewards"
        className="mb-5"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'store', label: 'Store' },
          { value: 'stuff', label: 'My stuff', badge: readyCount },
        ]}
      />

      {store.isLoading || !store.data ? (
        <StoreSkeleton />
      ) : tab === 'store' ? (
        <StoreTab
          name={name}
          balance={store.data.balance}
          rewards={store.data.rewards}
          onPick={setPicked}
          onOpenHistory={() => setHistoryOpen(true)}
        />
      ) : (
        <PocketTab
          pocket={pocket}
          used={earned.data ?? []}
          finishedCards={punchCards.data?.finished ?? []}
          onUse={setUsing}
        />
      )}

      {store.data && (
        <RedeemDialog
          reward={picked}
          balance={store.data.balance}
          open={picked !== null}
          onClose={() => setPicked(null)}
        />
      )}
      <UseTicketDialog ticket={using} open={using !== null} onClose={() => setUsing(null)} />
      <HistorySheet open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </>
  )
}

// ─── The Store tab ──────────────────────────────────────────────────────────

export function StoreTab({
  name,
  balance,
  rewards,
  onPick,
  onOpenHistory,
}: {
  name: string
  balance: number
  rewards: Reward[]
  onPick: (reward: Reward) => void
  onOpenHistory?: () => void
}) {
  const [showAllNow, setShowAllNow] = useState(false)
  const [showAllNear, setShowAllNear] = useState(false)
  const { afford, almost, big } = useMemo(() => storeShelves(rewards, balance), [rewards, balance])
  // "Get it now" leads with the biggest thing in reach — top three by price descending.
  const now = useMemo(() => [...afford].sort((a, b) => b.cost - a.cost), [afford])
  const near = useMemo(() => [...almost, ...big], [almost, big])
  const visibleNow = showAllNow ? now : now.slice(0, 3)
  const visibleNear = showAllNear ? near : near.slice(0, 3)

  return (
    <div>
      <PurseHero name={name} balance={balance} onOpenHistory={onOpenHistory} />

      {rewards.length === 0 ? (
        <EmptyState
          icon={Tag}
          heading="No rewards yet"
          body="Ask a parent to add things you can spend your P-Bucks on."
        />
      ) : (
        <div className="flex flex-col gap-7">
          {now.length > 0 && (
            <Shelf label="Get it now">
              <div className="flex flex-col gap-3">
                {visibleNow.map((r) => (
                  <StoreTicket
                    key={r.id}
                    emoji={r.emoji}
                    name={r.name}
                    description={r.description}
                    cost={r.cost}
                    askFirst={r.requiresApproval}
                    onPick={() => onPick(r)}
                  />
                ))}
              </div>
              <SeeAll
                shown={visibleNow.length}
                total={now.length}
                open={showAllNow}
                openLabel={`See all ${now.length} you can get ›`}
                onToggle={setShowAllNow}
              />
            </Shelf>
          )}

          {near.length > 0 && (
            <Shelf label="Almost there">
              <div className="grid gap-2 md:grid-cols-2">
                {visibleNear.map((r) => (
                  <NearRow
                    key={r.id}
                    reward={r}
                    gap={gapFor(r, balance)}
                    onPick={() => onPick(r)}
                  />
                ))}
              </div>
              <SeeAll
                shown={visibleNear.length}
                total={near.length}
                open={showAllNear}
                openLabel={`See all ${near.length} ›`}
                onToggle={setShowAllNear}
              />
            </Shelf>
          )}
        </div>
      )}
    </div>
  )
}

/* The purse — the hero, and it's personal: whose money, the struck coin, the metric
   numeral. The balance stops being a plate in a corner and becomes what the page is
   about. Capped at the roll's unit width at md: — a purse is hand-sized, not a
   banner. Tapping it asks "Where'd it go?" — the history sheet (M4/5c). */
function PurseHero({
  name,
  balance,
  onOpenHistory,
}: {
  name: string
  balance: number
  onOpenHistory?: () => void
}) {
  const Frame = onOpenHistory ? 'button' : 'div'
  return (
    <Frame
      {...(onOpenHistory ? { type: 'button' as const, onClick: onOpenHistory } : {})}
      className="mb-5 flex w-full items-center gap-3.5 rounded-panel border p-4 text-left transition-transform active:scale-[0.995] md:max-w-[430px]"
      style={{
        background: 'var(--coin-tint)',
        borderColor: 'color-mix(in oklch, var(--coin) 55%, var(--border))',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <Coin size={40} />
      <div className="min-w-0 flex-1">
        <div className="text-section-label text-muted-foreground">
          {name}&rsquo;s {CURRENCY.short}
        </div>
        <div className="flex items-baseline gap-1.5" style={{ color: 'var(--coin-ink)' }}>
          <span className="text-metric leading-none">{balance}</span>
          <span className="text-sm-token font-bold text-muted-foreground">P$</span>
        </div>
      </div>
      {onOpenHistory && (
        <span className="text-sm-token flex-none font-semibold text-primary">
          Where&rsquo;d it go? ›
        </span>
      )}
    </Frame>
  )
}

function Shelf({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-section-label text-muted-foreground">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  )
}

function SeeAll({
  shown,
  total,
  open,
  openLabel,
  onToggle,
}: {
  shown: number
  total: number
  open: boolean
  openLabel: string
  onToggle: (open: boolean) => void
}) {
  if (total <= shown && !open) return null
  return (
    <button
      type="button"
      onClick={() => onToggle(!open)}
      className={`text-sm-token mt-3 font-semibold ${open ? 'text-muted-foreground' : 'text-primary'}`}
    >
      {open ? 'Show less' : openLabel}
    </button>
  )
}

/* A reward you're striving for — a calm row: emoji, name, and the one number that
   matters as quiet text. Full colour, never greyed: distance, not denial. No meter —
   a balance-fed bar drops on every spend, taxing every goal at once (the nudge and
   the widget keep theirs: a one-time "how close?" answer, not an ambient loss meter).
   No pill either — a distance is not a collectible (the chip rule). Tapping opens
   the nudge. */
function NearRow({ reward, gap, onPick }: { reward: Reward; gap: number; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-label={`${reward.name}, ${reward.cost} P-Bucks. You need ${gap} more P-Bucks.`}
      className="flex w-full items-center gap-3 rounded-card border border-border bg-card px-3.5 py-3 text-left transition-transform active:scale-[0.99]"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <span className="flex-none text-2xl leading-none" aria-hidden>
        {reward.emoji}
      </span>
      <span className="text-sm-token min-w-0 flex-1 truncate font-semibold" aria-hidden>
        {reward.name}
      </span>
      <span className="text-sm-token flex-none font-semibold text-muted-foreground" aria-hidden>
        {gap} more P$
      </span>
    </button>
  )
}

// ─── The My stuff tab ───────────────────────────────────────────────────────

export function PocketTab({
  pocket,
  used,
  finishedCards = [],
  onUse,
}: {
  /** Owned tickets + any ask in flight. */
  pocket: Redemption[]
  /** Torn tickets, all time — the stub shelf. */
  used: Redemption[]
  /** Finished punch cards rolled up per template (M4/6) — kept stubs, same grammar
      as the shelf beside them. Punching lives on the chores surface. */
  finishedCards?: FinishedCards[]
  onUse: (ticket: Redemption) => void
}) {
  // The longest-held ticket leads — it's the one you've been looking forward to.
  const tickets = useMemo(
    () =>
      [...pocket].sort((a, b) => {
        if (a.status !== b.status) return a.status === 'owned' ? -1 : 1
        return a.purchasedAt.localeCompare(b.purchasedAt)
      }),
    [pocket]
  )
  const shelf = useMemo(() => {
    const groups = new Map<string, { emoji: string; name: string; count: number }>()
    for (const rd of used) {
      const g = groups.get(rd.rewardId)
      if (g) g.count += 1
      else
        groups.set(rd.rewardId, {
          emoji: rd.reward?.emoji ?? '🎁',
          name: rd.reward?.name ?? 'A reward',
          count: 1,
        })
    }
    return [...groups.values()].sort((a, b) => b.count - a.count)
  }, [used])
  const earliestUsed = useMemo(
    () =>
      used.reduce<string | null>((m, rd) => (!m || (rd.usedAt ?? '') < m ? rd.usedAt : m), null),
    [used]
  )

  if (tickets.length === 0 && used.length === 0 && finishedCards.length === 0) {
    return (
      <EmptyState
        icon={TicketIcon}
        heading="Nothing in your pocket yet"
        body="Buy a ticket in the Store and it lands here, yours to use whenever."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {tickets.length > 0 && (
        <Shelf label="Ready when you are">
          <div className="flex flex-col gap-2.5">
            {tickets.map((t) => (
              <PocketTicket key={t.id} ticket={t} onUse={() => onUse(t)} />
            ))}
          </div>
        </Shelf>
      )}

      {shelf.length > 0 && (
        <Shelf label="Torn & enjoyed">
          <div className="flex flex-wrap gap-2">
            {shelf.map((g) => (
              <StubChip key={g.name} emoji={g.emoji} name={g.name} count={g.count} />
            ))}
          </div>
          {earliestUsed && (
            <p className="text-xs-body mt-3 text-muted-foreground">
              {enjoyedSince(used.length, earliestUsed)}
            </p>
          )}
        </Shelf>
      )}

      {finishedCards.length > 0 && (
        <Shelf label="Finished cards">
          <div className="flex flex-wrap gap-2">
            {finishedCards.map((f) => (
              <StubChip key={f.templateId} emoji={f.glyph} name={f.name} count={f.count} />
            ))}
          </div>
        </Shelf>
      )}
    </div>
  )
}

/* A ticket in the pocket. The stub keeps the emoji — it's paid for; the price is
   history. Three states, one anatomy: ready ("Use it"), ask-first ("Ask to use"),
   and asked (waiting pill, slightly quieted). A "not now" simply returns the ticket
   to ready with the parent's words on it — nothing is lost. */
function PocketTicket({ ticket, onUse }: { ticket: Redemption; onUse: () => void }) {
  const waiting = ticket.status === 'use_requested'
  const askFirst = ticket.reward?.requiresApproval ?? false
  const name = ticket.reward?.name ?? 'A reward'
  const notNowNote = !waiting && ticket.decidedNote ? ticket.decidedNote : null

  return (
    <TicketFrame waiting={waiting} className="md:max-w-[560px]">
      <EmojiStub emoji={ticket.reward?.emoji ?? '🎟️'} />
      <div className="flex min-w-0 flex-1 items-center gap-3.5 px-4 py-4">
        <div className="min-w-0 flex-1">
          <div className="text-base-token font-bold leading-tight">{name}</div>
          {ticket.reward?.description && (
            <div className="mt-0.5 text-xs-body leading-snug text-muted-foreground">
              {ticket.reward.description}
            </div>
          )}
          {notNowNote && (
            <div className="mt-0.5 text-xs-body leading-snug text-muted-foreground">
              &ldquo;{notNowNote}&rdquo; — ask again anytime
            </div>
          )}
          <div className="text-xs-token mt-1 text-muted-foreground">
            {waiting && ticket.useRequestedAt
              ? askedLabel(ticket.useRequestedAt)
              : ticket.cost === 0
                ? earnedLabel(ticket.purchasedAt)
                : boughtLabel(ticket.purchasedAt)}
          </div>
        </div>
        <div className="flex flex-none flex-col items-end gap-1.5">
          {waiting ? (
            <span
              className="text-xs-token inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold"
              style={{
                background: 'color-mix(in oklch, var(--warning) 22%, var(--card))',
                color: 'color-mix(in oklch, var(--warning) 60%, var(--foreground))',
              }}
            >
              ⏳ Waiting on a yes
            </span>
          ) : askFirst ? (
            <button
              type="button"
              onClick={onUse}
              aria-label={`Ask to use ${name}`}
              className="text-sm-token cursor-pointer rounded-full bg-card px-4 py-2 font-bold"
              style={{
                color: 'var(--coin-ink)',
                border: '1.5px solid color-mix(in oklch, var(--coin) 65%, var(--border))',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              Ask to use
            </button>
          ) : (
            <button
              type="button"
              onClick={onUse}
              aria-label={`Use ${name}`}
              className="text-sm-token cursor-pointer rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              Use it
            </button>
          )}
        </div>
      </div>
    </TicketFrame>
  )
}

// ─── Loading ────────────────────────────────────────────────────────────────

/** Skeleton tickets — the page keeps its shape while it fetches (no centered spinner). */
function StoreSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the store">
      <div
        className="mb-5 h-[72px] animate-pulse rounded-panel border border-border md:max-w-[430px]"
        style={{ background: 'var(--surface-sunken)' }}
      />
      <TicketSkeleton />
      <TicketSkeleton />
      <TicketSkeleton />
    </div>
  )
}
