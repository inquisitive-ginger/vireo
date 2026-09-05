import { useMemo, useRef, useState, type ReactNode } from 'react'
import { CircleDashed } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AskLine,
  CURRENCY,
  Coin,
  EmojiStub,
  EmptyState,
  ErrorCard,
  Modal,
  PageContainer,
  PageHeader,
  PunchCard,
  TicketFrame,
  bucks,
  bucksSpoken,
  relativeDayLabel,
} from '@family-os/ui'
import {
  useChoosePrize,
  usePunch,
  usePunchCards,
  type FinishedCards,
  type PrizeOption,
  type PunchCardData,
  type PunchPayout,
} from '../lib/punch-cards'

/* The Punch cards tab (joy rework 2026-08-02, built to the gated artifact) — the
   kid's tallies beside Today. Three moves over the shipped M4/6 surface: a fixed
   5-wide stamp wall stamping the habit's glyph, the prize pulled out of the punch
   run into an always-visible rail, and the finished cards shelved on the tab.

   The kid names the prize they're working for up front and can change it anytime
   ("Change your pick" in the rail). An unpicked card is the tab's loud state — a
   washed rail and its only primary CTA. At the goal a picked card mints on the
   spot; an unpicked one goes gold until the picker claims it. The celebration is
   held here, keyed by template, because the refetch replaces the completed card
   with the fresh one underneath it — the gold full-card state is the durable
   fallback if a refresh drops it. */

type Celebration = { payout: PunchPayout; card: PunchCardData }

function cardRank(a: PunchCardData, b: PunchCardData): number {
  const full = (c: PunchCardData) => (c.completedAt ? 0 : 1)
  if (full(a) !== full(b)) return full(a) - full(b)
  const rem = a.template.goal - a.count - (b.template.goal - b.count)
  if (rem !== 0) return rem
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
}

function lastPunchedLabel(iso: string | null): string | null {
  if (!iso) return null
  const { lead } = relativeDayLabel(new Date(iso), new Date(), { direction: 'backward' })
  return `Last punched ${lead === 'Today' || lead === 'Yesterday' ? lead.toLowerCase() : lead}`
}

function finishedLabel(iso: string): string {
  const { lead } = relativeDayLabel(new Date(iso), new Date(), { direction: 'backward' })
  return `Finished ${lead === 'Today' || lead === 'Yesterday' ? lead.toLowerCase() : lead}`
}

export function PunchCardsTab({ tabBar }: { tabBar: ReactNode }) {
  const cards = usePunchCards()
  const punch = usePunch()
  const choose = useChoosePrize()
  const [picking, setPicking] = useState<PunchCardData | null>(null)
  const [done, setDone] = useState<Record<string, Celebration>>({})

  // Closest-to-a-prize first, full cards leading — but re-sorted only when the
  // list's membership changes. A landing punch must not reshuffle the cards
  // under the kid's finger; the fresh order applies on the next visit.
  const orderRef = useRef<Map<string, number> | null>(null)
  const list = useMemo(() => {
    const data = cards.data?.cards ?? []
    const prev = orderRef.current
    if (prev && data.length === prev.size && data.every((c) => prev.has(c.id))) {
      return [...data].sort((a, b) => prev.get(a.id)! - prev.get(b.id)!)
    }
    const sorted = [...data].sort(cardRank)
    orderRef.current = new Map(sorted.map((c, i) => [c.id, i]))
    return sorted
  }, [cards.data])

  const finished = cards.data?.finished ?? []

  const celebrate = (templateId: string, celebration: Celebration) =>
    setDone((d) => ({ ...d, [templateId]: celebration }))

  function onPunch(card: PunchCardData) {
    if (punch.isPending) return
    punch.mutate(card.id, {
      onSuccess: (data) => {
        if (!data.completed) return
        if (data.payout) celebrate(card.templateId, { payout: data.payout, card: data.card })
        // Finished with no live pick — the prize sheet takes over, claim mode.
        else setPicking(data.card)
      },
    })
  }

  return (
    <PageContainer width="list">
      <PageHeader title="Chores" nav={tabBar} />

      {cards.isError ? (
        <ErrorCard moduleName="Punch cards" onRetry={() => cards.refetch()} />
      ) : cards.isLoading ? (
        <div aria-busy="true" aria-label="Loading punch cards" className="flex flex-col gap-3">
          <div className="h-[180px] animate-pulse rounded-card border border-border bg-card" />
          <div className="h-[180px] animate-pulse rounded-card border border-border bg-card" />
        </div>
      ) : list.length === 0 && Object.keys(done).length === 0 ? (
        <EmptyState
          icon={CircleDashed}
          heading="No punch cards yet"
          body="A card is a goal you fill one punch at a time — try bites, reading nights. A parent sets one up in Rewards."
        />
      ) : (
        <div>
          {list.length > 1 && (
            <p className="text-xs-body mb-2 text-right text-muted-foreground">
              Closest to a prize first
            </p>
          )}
          <div className="flex flex-col gap-3">
            {list.map((card) => {
              const celebration = done[card.templateId]
              if (celebration) {
                return (
                  <FinishedMoment
                    key={card.templateId}
                    celebration={celebration}
                    onNext={() =>
                      setDone((d) => {
                        const { [card.templateId]: _, ...rest } = d
                        return rest
                      })
                    }
                  />
                )
              }
              return card.completedAt ? (
                <FullCard key={card.id} card={card} onPick={() => setPicking(card)} />
              ) : (
                <LiveCard
                  key={card.id}
                  card={card}
                  punching={punch.isPending && punch.variables === card.id}
                  error={punch.variables === card.id ? punch.error : null}
                  onPunch={() => onPunch(card)}
                  onPick={() => setPicking(card)}
                />
              )
            })}
          </div>
        </div>
      )}

      {finished.length > 0 && <FinishedShelf finished={finished} />}

      {(list.length > 0 || finished.length > 0) && (
        <p className="text-xs-body mt-5 text-muted-foreground">
          Punch cards earn a prize you picked. Everyday chores earn {CURRENCY.short} — those live on
          Today.
        </p>
      )}

      <PrizeDialog
        card={picking}
        pending={choose.isPending}
        error={choose.error}
        onClose={() => {
          choose.reset()
          setPicking(null)
        }}
        onChoose={(rewardId) => {
          if (!picking || choose.isPending) return
          choose.mutate(
            { cardId: picking.id, rewardId },
            {
              onSuccess: (data) => {
                setPicking(null)
                if (data.payout)
                  celebrate(picking.templateId, { payout: data.payout, card: data.card })
              },
            }
          )
        }}
      />
    </PageContainer>
  )
}

function Countdown({ remaining, count, goal }: { remaining: number; count: number; goal: number }) {
  return (
    <div className="text-right">
      <p className="text-card-title whitespace-nowrap">{remaining} to go</p>
      <p className="text-xs-body mt-px text-muted-foreground">
        {count} of {goal}
      </p>
    </div>
  )
}

/* The pill and gold tile sit on always-light coin metal, so their ink is fixed
   like the Coin's own device — --coin-ink would flip light in dark mode. */
const GOLD_INK = 'oklch(0.30 0.09 74)'
const GOLD_FACE = 'linear-gradient(150deg, var(--coin-hi), var(--coin) 55%, var(--coin-deep))'

function GoldPill({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex h-6.5 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.07em]"
      style={{
        background: 'linear-gradient(180deg, var(--coin-hi), var(--coin))',
        color: GOLD_INK,
        boxShadow: 'inset 0 -1px 0 oklch(0.55 0.125 74 / 0.5)',
      }}
    >
      {children}
    </span>
  )
}

function RailArt({
  children,
  variant = 'plain',
}: {
  children: ReactNode
  variant?: 'plain' | 'unset' | 'gold'
}) {
  return (
    <span
      className={`grid size-13 shrink-0 place-items-center rounded-lg text-[26px] leading-none ${
        variant === 'unset' ? 'opacity-75 grayscale-[0.3]' : ''
      }`}
      style={
        variant === 'gold'
          ? { background: GOLD_FACE, border: '1px solid var(--coin-deep)' }
          : { background: 'var(--surface-sunken)', border: '1.5px solid var(--border)' }
      }
      aria-hidden
    >
      {children}
    </span>
  )
}

function Rail({ washed = false, children }: { washed?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col ${
        washed ? 'rounded-lg bg-[color-mix(in_oklab,var(--primary)_5%,transparent)] p-3' : ''
      }`}
    >
      <p className="text-section-label mb-2 text-muted-foreground">Your prize</p>
      {children}
    </div>
  )
}

function PrimaryCta({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="pt-3">
      <button
        type="button"
        onClick={onClick}
        className="text-sm-token cursor-pointer rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {label}
      </button>
    </div>
  )
}

function LiveCard({
  card,
  punching,
  error,
  onPunch,
  onPick,
}: {
  card: PunchCardData
  punching: boolean
  error: Error | null
  onPunch: () => void
  onPick: () => void
}) {
  const t = card.template
  // The stamp lands before the server answers — the optimistic +1 is what makes
  // the tap feel like drawing the check rather than submitting a form.
  const count = Math.min(card.count + (punching ? 1 : 0), t.goal)
  const remaining = t.goal - count
  const picked = t.payoutKind === 'reward' && card.chosenReward?.active

  return (
    <PunchCard
      glyph={t.glyph}
      name={t.name}
      goal={t.goal}
      count={count}
      meta={lastPunchedLabel(card.lastPunchedAt)}
      headerTrailing={<Countdown remaining={remaining} count={count} goal={t.goal} />}
      onPunch={onPunch}
      punchLabel={`Punch ${t.name} — ${count + 1} of ${t.goal}`}
      punchDisabled={punching}
      gridLabel={`${t.name}: ${count} of ${t.goal} stamped, ${remaining} to go. Tap the dashed square to punch.`}
      prizeRail={
        t.payoutKind === 'coins' ? (
          <Rail>
            <div className="flex items-start gap-3">
              <RailArt>
                <Coin size={30} />
              </RailArt>
              <div className="min-w-0">
                <p className="text-card-title">
                  {t.payoutCoins ?? 0} {CURRENCY.short}
                </p>
                <p className="text-xs-body mt-1 font-semibold" style={{ color: 'var(--coin-ink)' }}>
                  Straight into your wallet.
                </p>
              </div>
            </div>
          </Rail>
        ) : picked ? (
          <Rail>
            <div className="flex items-start gap-3">
              <RailArt>{card.chosenReward!.emoji}</RailArt>
              <div className="min-w-0">
                <p className="text-card-title">{card.chosenReward!.name}</p>
                <p className="text-xs-body mt-1 text-muted-foreground">
                  Your pick — {remaining} {remaining === 1 ? 'stamp' : 'stamps'} away.
                </p>
              </div>
            </div>
            <div className="pt-3">
              <button
                type="button"
                onClick={onPick}
                className="text-xs-body cursor-pointer text-muted-foreground underline underline-offset-3 hover:text-foreground"
                aria-label={`Change your prize for ${t.name}`}
              >
                Change your pick
              </button>
            </div>
          </Rail>
        ) : (
          <Rail washed>
            <div className="flex items-start gap-3">
              <RailArt variant="unset">🎁</RailArt>
              <div className="min-w-0">
                <p className="text-card-title text-muted-foreground">What are you working for?</p>
                <p className="text-xs-body mt-1 text-muted-foreground">
                  Pick one — you can change your mind anytime.
                </p>
              </div>
            </div>
            <PrimaryCta label="Pick your prize" onClick={onPick} />
          </Rail>
        )
      }
    >
      {error && <p className="text-xs-body mt-2 text-error">{error.message}</p>}
    </PunchCard>
  )
}

/* A full card whose prize is still unclaimed — it goes gold and outshines the
   others until the kid takes it. The pick never expires. */
function FullCard({ card, onPick }: { card: PunchCardData; onPick: () => void }) {
  const t = card.template
  return (
    <PunchCard
      glyph={t.glyph}
      name={t.name}
      goal={t.goal}
      count={t.goal}
      gold
      meta={card.completedAt ? finishedLabel(card.completedAt) : undefined}
      headerTrailing={<GoldPill>Card full!</GoldPill>}
      gridLabel={`${t.name}: all ${t.goal} punches stamped. Card is full.`}
      prizeRail={
        <Rail>
          <div className="flex items-start gap-3">
            <RailArt variant="gold">🎁</RailArt>
            <div className="min-w-0">
              <p className="text-card-title">Pick your prize!</p>
              <p className="text-xs-body mt-1 text-muted-foreground">
                It goes straight in your pocket.
              </p>
            </div>
          </div>
          <PrimaryCta label="Pick your prize" onClick={onPick} />
        </Rail>
      }
    />
  )
}

const CONFETTI = [
  'var(--identity-terracotta)',
  'var(--identity-marigold)',
  'var(--identity-sage)',
  'var(--identity-sky)',
  'var(--identity-plum)',
  'var(--coin)',
]

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 16 }, (_, i) => (
        <i
          key={i}
          className="animate-confetti-fall absolute -top-2 h-[11px] w-[7px] rounded-[2px]"
          style={{
            left: `${3 + i * 6}%`,
            background: CONFETTI[i % CONFETTI.length],
            animationDelay: `${(i * 0.17) % 2.8}s`,
            animationDuration: `${2.3 + (i % 5) * 0.25}s`,
          }}
        />
      ))}
    </div>
  )
}

function FinishedMoment({ celebration, onNext }: { celebration: Celebration; onNext: () => void }) {
  const { payout, card } = celebration
  const t = card.template
  const reward = payout.kind === 'reward'
  return (
    <PunchCard
      glyph={t.glyph}
      name={t.name}
      goal={t.goal}
      count={t.goal}
      gold
      meta={`All ${t.goal} — you did it!`}
      headerTrailing={<GoldPill>Prize won!</GoldPill>}
      gridLabel={`${t.name}: all ${t.goal} punches stamped. Prize won.`}
      prizeRail={
        <Rail>
          <div className="flex items-start gap-3">
            <RailArt variant="gold">{reward ? payout.emoji : <Coin size={30} />}</RailArt>
            <div className="min-w-0">
              <p className="text-card-title">
                {reward ? `${payout.name} is yours!` : `${bucks(payout.coins)} is yours!`}
              </p>
              <p className="text-xs-body mt-1 text-muted-foreground">
                {reward ? "It's in your pocket, in Rewards." : 'Straight into your wallet.'}
              </p>
              {!reward && payout.fallback && (
                <p className="text-xs-body mt-1 text-muted-foreground">
                  Those prizes aren&rsquo;t around any more, so the best one&rsquo;s price landed
                  instead.
                </p>
              )}
            </div>
          </div>
          <div className="pt-3">
            <button
              type="button"
              onClick={onNext}
              className="text-sm-token cursor-pointer font-semibold text-primary"
              aria-label={`Start the next ${t.name} card, ${
                reward ? 'prize in your pocket' : `${bucksSpoken(payout.coins)} earned`
              }`}
            >
              Start the next card ›
            </button>
          </div>
        </Rail>
      }
    >
      <Confetti />
    </PunchCard>
  )
}

function FinishedShelf({ finished }: { finished: FinishedCards[] }) {
  const latest = [...finished]
    .sort((a, b) => (b.lastFinishedAt ?? '').localeCompare(a.lastFinishedAt ?? ''))
    .slice(0, 3)
  const total = finished.reduce((n, f) => n + f.count, 0)
  return (
    <div className="mt-8">
      <h2 className="text-section-label mb-3 flex items-center gap-3 text-muted-foreground after:h-px after:flex-1 after:bg-border">
        Cards you&rsquo;ve finished
      </h2>
      <div className="flex flex-wrap items-center gap-2.5">
        {latest.map((f) => (
          <FinishedStub key={f.templateId} f={f} />
        ))}
        <Link
          to="/rewards"
          className="text-xs-body text-muted-foreground underline underline-offset-3 hover:text-foreground"
        >
          See all {total} in My stuff ›
        </Link>
      </div>
    </div>
  )
}

function FinishedStub({ f }: { f: FinishedCards }) {
  const date = f.lastFinishedAt
    ? new Date(f.lastFinishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null
  const prize = f.prizeName ?? (f.prizeCoins != null ? bucks(f.prizeCoins) : null)
  return (
    <div className="relative flex items-center gap-2.5 overflow-hidden rounded-lg border border-border bg-card py-2.5 pl-3 pr-4">
      <span
        className="absolute inset-y-0 right-0 w-[3px] opacity-70"
        style={{ background: 'linear-gradient(to bottom, var(--coin-hi), var(--coin-deep))' }}
        aria-hidden
      />
      <span className="text-xl leading-none" aria-hidden>
        {f.glyph}
      </span>
      <span>
        <span className="text-sm-token block font-semibold leading-tight">
          {f.name}
          {f.count > 1 ? ` ×${f.count}` : ''}
        </span>
        <span className="text-xs-body block text-muted-foreground">
          {[date, prize].filter(Boolean).join(' · ')}
        </span>
      </span>
    </div>
  )
}

/* The prize picker — a Modal, the app's focused-decision surface (the register the
   buy confirm and the tear already use; the Sheet stays the read-only ledger). The
   options wear the ticket anatomy the kid knows from the store, and ask-first
   prizes carry their seal now — no surprise at use time. Claim mode (a full card)
   mints on the tap. */
function PrizeDialog({
  card,
  pending,
  error,
  onClose,
  onChoose,
}: {
  card: PunchCardData | null
  pending: boolean
  error: Error | null
  onClose: () => void
  onChoose: (rewardId: string | null) => void
}) {
  const options = (card?.template.payoutOptions ?? []).filter((o) => o.active)
  const claiming = !!card?.completedAt
  const priciest = (card?.template.payoutOptions ?? []).reduce((m, o) => Math.max(m, o.cost), 0)

  return (
    <Modal open={card !== null} onClose={onClose} title="Pick your prize" className="w-[380px]">
      <h2 className="text-heading mb-1">
        {claiming ? 'Card full! Pick your prize' : 'What are you working for?'}
      </h2>
      <p className="text-sm-token mb-4 text-muted-foreground">
        {claiming
          ? 'It goes straight in your pocket.'
          : 'Pick one — you can change your mind anytime.'}
      </p>

      {options.length === 0 ? (
        <div>
          <p className="text-sm-token text-muted-foreground">
            Those prizes aren&rsquo;t in the store any more.
          </p>
          {claiming && (
            <button
              type="button"
              disabled={pending}
              onClick={() => onChoose(null)}
              className="text-sm-token mt-3 cursor-pointer rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              Claim {bucks(priciest)} instead
            </button>
          )}
        </div>
      ) : (
        <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
          {options.map((o) => (
            <OptionTicket
              key={o.id}
              option={o}
              selected={card?.chosenRewardId === o.id}
              disabled={pending}
              onPick={() => onChoose(o.id)}
            />
          ))}
        </div>
      )}
      {error && <p className="text-sm-token mt-3 text-error">{error.message}</p>}
    </Modal>
  )
}

/* Each option is a real die-cut ticket (the shared TicketFrame — single, not the
   roll): the prize shelf browsed before it's earned, in exactly the anatomy the
   store will hand over once it's won. */
function OptionTicket({
  option,
  selected,
  disabled,
  onPick,
}: {
  option: PrizeOption
  selected: boolean
  disabled: boolean
  onPick: () => void
}) {
  return (
    <TicketFrame selected={selected}>
      <button
        type="button"
        disabled={disabled}
        onClick={onPick}
        aria-pressed={selected}
        aria-label={`${option.name}${option.requiresApproval ? ', ask before using' : ''}`}
        className="flex min-w-0 flex-1 cursor-pointer items-stretch text-left transition-opacity active:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <EmojiStub emoji={option.emoji} />
        <span className="flex min-w-0 flex-1 items-center px-3.5 py-3" aria-hidden>
          <span className="min-w-0 flex-1">
            <span className="text-base-token block font-bold leading-tight">{option.name}</span>
            {option.description && (
              <span className="text-xs-body mt-0.5 block leading-snug text-muted-foreground">
                {option.description}
              </span>
            )}
            {option.requiresApproval && (
              <span className="mt-1 block">
                <AskLine />
              </span>
            )}
          </span>
        </span>
      </button>
    </TicketFrame>
  )
}
