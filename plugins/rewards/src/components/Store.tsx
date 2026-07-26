import { useState } from 'react'
import { ChevronDown, ChevronRight, Loader2, Tag } from 'lucide-react'
import { Coin, EmptyState, ErrorCard, PageHeader } from '@family-os/ui'
import { useEarnedRewards, useMyRedemptions, useStore } from '../lib/hooks'
import { gapFor, storeShelves } from '../lib/affordability'
import type { Redemption, Reward } from '../types'
import { AskPill } from './AskPill'
import { RedeemDialog } from './RedeemDialog'

/* The kid store (M4/5). PROGRESSIVE DISCLOSURE, not the whole catalog at once — a wall of
   nine tiles is overwhelming, especially for a kid with ADHD. The default screen shows
   only what's actionable: what you can get now, and the SINGLE closest thing you're saving
   for. The rest of the catalog is one calm "See all rewards" tap away. Nothing is greyed
   or hidden — an out-of-reach reward keeps full colour and states exactly how many more
   P-Bucks it needs; it's just not all shown up front. Tapping anything opens the redeem
   sheet, which derives afford / ask / nudge on its own. */

export function Store() {
  const store = useStore()
  const mine = useMyRedemptions()
  const earned = useEarnedRewards()
  const [picked, setPicked] = useState<Reward | null>(null)

  if (store.isLoading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }
  if (store.isError || !store.data) {
    return <ErrorCard moduleName="Store" onRetry={() => store.refetch()} />
  }

  return (
    <>
      <StoreView
        balance={store.data.balance}
        rewards={store.data.rewards}
        mine={mine.data ?? []}
        earned={earned.data ?? []}
        onPick={setPicked}
      />
      <RedeemDialog
        reward={picked}
        balance={store.data.balance}
        open={picked !== null}
        onClose={() => setPicked(null)}
      />
    </>
  )
}

export function StoreView({
  balance,
  rewards,
  mine = [],
  earned = [],
  onPick,
}: {
  balance: number
  rewards: Reward[]
  /** The kid's pocket (ADR 055): owned tickets + any use request in flight. */
  mine?: Redemption[]
  /** Used tickets, all time — the "Rewards you've earned" collection. */
  earned?: Redemption[]
  onPick: (reward: Reward) => void
}) {
  const [showAll, setShowAll] = useState(false)
  const { afford, almost, big } = storeShelves(rewards, balance)
  const saving = [...almost, ...big] // every out-of-reach reward, cheapest-first
  // Calm by default: only the closest goal. "See all" reveals the rest.
  const visibleSaving = showAll ? saving : saving.slice(0, 1)
  const hidden = saving.length - visibleSaving.length

  return (
    <div>
      <PageHeader
        title="Store"
        subtitle="Tap a reward to get it"
        action={<BalancePlate balance={balance} />}
      />

      {mine.length > 0 && <MyRewards items={mine} />}

      {rewards.length === 0 ? (
        <EmptyState
          icon={Tag}
          heading="No rewards yet"
          body="Ask a parent to add things you can spend your P-Bucks on."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {afford.length > 0 && (
            <Section label="You can get">
              <div className="grid grid-cols-3 gap-2.5">
                {afford.map((r) => (
                  <StoreTile key={r.id} reward={r} onPick={() => onPick(r)} />
                ))}
              </div>
            </Section>
          )}

          {saving.length > 0 && (
            <Section label="Saving up for">
              <div className="flex flex-col gap-2">
                {visibleSaving.map((r) => (
                  <SavingRow
                    key={r.id}
                    reward={r}
                    gap={gapFor(r, balance)}
                    onPick={() => onPick(r)}
                  />
                ))}
              </div>
              {hidden > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="text-sm-token mt-3 font-semibold text-primary"
                >
                  See all rewards ({saving.length}) ›
                </button>
              ) : (
                showAll &&
                saving.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowAll(false)}
                    className="text-sm-token mt-3 font-semibold text-muted-foreground"
                  >
                    Show less
                  </button>
                )
              )}
            </Section>
          )}
        </div>
      )}

      {earned.length > 0 && <EarnedRewards items={earned} />}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
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

/* An affordable reward — the fun part, so it keeps the tile with a green "you can get
   this" edge. (Out-of-reach rewards render as calm SavingRows instead.) */
function StoreTile({ reward, onPick }: { reward: Reward; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-label={
        `${reward.name}, ${reward.cost} P-Bucks. You can get this now. ` +
        (reward.requiresApproval ? 'A parent says yes first.' : '')
      }
      className="relative flex min-h-[124px] cursor-pointer flex-col items-center gap-2 rounded-panel border bg-card p-3 text-center transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
      style={{ borderColor: 'color-mix(in oklch, var(--success) 45%, var(--border))' }}
    >
      {reward.requiresApproval && (
        <span className="absolute right-2 top-2">
          <AskPill />
        </span>
      )}
      <span
        className="grid size-12 place-items-center rounded-card text-[30px] leading-none"
        style={{ background: 'color-mix(in oklch, var(--success) 12%, var(--card))' }}
        aria-hidden
      >
        {reward.emoji}
      </span>
      <span className="text-base-token font-semibold leading-snug text-foreground" aria-hidden>
        {reward.name}
      </span>
      <span className="text-sm-token mt-auto font-bold" aria-hidden>
        {reward.cost} <span className="font-medium text-muted-foreground">P$</span>
      </span>
    </button>
  )
}

/* A reward you're saving for — one calm row, not a tile in a wall. Emoji, name, and the
   one number that matters ("N more P$"). Tapping opens the nudge. */
function SavingRow({ reward, gap, onPick }: { reward: Reward; gap: number; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-label={
        `${reward.name}, ${reward.cost} P-Bucks. You need ${gap} more P-Bucks. ` +
        (reward.requiresApproval ? 'A parent says yes first.' : '')
      }
      className="flex w-full items-center gap-3 rounded-card border border-border bg-card p-3 text-left transition-transform active:scale-[0.99]"
    >
      <span
        className="grid size-11 place-items-center rounded-card text-2xl leading-none"
        style={{ background: 'var(--surface-sunken)' }}
        aria-hidden
      >
        {reward.emoji}
      </span>
      <span className="text-base-token min-w-0 flex-1 truncate font-semibold" aria-hidden>
        {reward.name}
      </span>
      <span className="flex flex-none items-center gap-2" aria-hidden>
        {reward.requiresApproval && <AskPill />}
        <span className="text-sm-token font-semibold text-muted-foreground">{gap} more P$</span>
      </span>
    </button>
  )
}

/* The kid's pocket (ADR 055): owned tickets, plus any ask waiting on a parent.
   M4/5b rebuilds this into the ticket/pocket UI proper. */
function MyRewards({ items }: { items: Redemption[] }) {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-section-label text-muted-foreground">Yours</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-col gap-2">
        {items.map((rd) => {
          const owned = rd.status === 'owned'
          return (
            <div
              key={rd.id}
              className="flex items-center gap-3 rounded-card border border-border bg-card p-3"
            >
              <span
                className="grid size-10 place-items-center rounded-card text-2xl leading-none"
                style={{ background: 'var(--surface-sunken)' }}
                aria-hidden
              >
                {rd.reward?.emoji ?? '🎁'}
              </span>
              <span className="text-base-token flex-1 truncate font-semibold">
                {rd.reward?.name ?? 'A reward'}
              </span>
              <span
                className="flex-none rounded-full px-2.5 py-1 text-xs-token font-bold"
                style={
                  owned
                    ? {
                        background: 'color-mix(in oklch, var(--success) 16%, var(--card))',
                        color: 'var(--success)',
                      }
                    : {
                        background: 'color-mix(in oklch, var(--warning) 22%, var(--card))',
                        color: 'color-mix(in oklch, var(--warning) 60%, var(--foreground))',
                      }
                }
              >
                {owned ? '🎟️ Yours' : '⏳ Waiting on a yes'}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* The store's hero balance — the brass counterpart to the chores XP ScorePlate: a
   `text-metric` numeral in a rounded plate, with the coin as its icon. Sits in the page
   header so a kid's own P-Bucks lead the screen, exactly as their XP leads the chores page. */
function BalancePlate({ balance }: { balance: number }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full"
      style={{
        padding: '7px 15px 7px 8px',
        background: 'var(--coin-tint)',
        border: '1px solid color-mix(in oklch, var(--coin) 55%, var(--border))',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <Coin size={26} />
      <span className="text-metric leading-none" style={{ color: 'var(--coin-ink)' }}>
        {balance}
      </span>
      <span className="text-xs-token font-bold tracking-[0.04em] text-muted-foreground opacity-70">
        P$
      </span>
      <span className="sr-only">Pritchett Bucks in your wallet</span>
    </div>
  )
}

/* The kid's collection — every reward they've actually earned, all time. Calm by default
   (one motivating line, collapsed), because it's a look-back, not an action; it opens to a
   trophy shelf grouped by reward (🎮 ×5), so a kid sees what they've built up. */
function EarnedRewards({ items }: { items: Redemption[] }) {
  const [open, setOpen] = useState(false)
  const groups = new Map<string, { emoji: string; name: string; count: number }>()
  for (const rd of items) {
    const g = groups.get(rd.rewardId)
    if (g) g.count += 1
    else
      groups.set(rd.rewardId, {
        emoji: rd.reward?.emoji ?? '🎁',
        name: rd.reward?.name ?? 'A reward',
        count: 1,
      })
  }
  const shelf = [...groups.values()].sort((a, b) => b.count - a.count)

  return (
    <section className="mt-8 border-t border-border pt-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2"
      >
        <span className="text-lg" aria-hidden>
          🏆
        </span>
        <span className="text-base-token font-semibold">
          You&rsquo;ve earned {items.length} reward{items.length === 1 ? '' : 's'}
        </span>
        {open ? (
          <ChevronDown className="ml-auto size-4 text-muted-foreground" aria-hidden />
        ) : (
          <ChevronRight className="ml-auto size-4 text-muted-foreground" aria-hidden />
        )}
      </button>
      {open && (
        <div className="mt-3 flex flex-wrap gap-2">
          {shelf.map((g) => (
            <span
              key={g.name}
              className="text-sm-token inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold"
            >
              <span aria-hidden>{g.emoji}</span> {g.name}
              {g.count > 1 && <span className="text-muted-foreground">×{g.count}</span>}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}

/** Coin + balance — the one place a coin and an amount live together on the store. */
export function BalanceChip({ balance }: { balance: number }) {
  return (
    <span
      className="inline-flex flex-none items-center gap-1.5 rounded-full py-1 pl-1.5 pr-3"
      style={{
        background: 'var(--coin-tint)',
        border: '1px solid color-mix(in oklch, var(--coin) 55%, var(--border))',
      }}
    >
      <Coin size={17} />
      <b className="text-base-token font-bold tabular-nums" style={{ color: 'var(--coin-ink)' }}>
        {balance} P$
      </b>
      <span className="sr-only">in your wallet</span>
    </span>
  )
}
