import { useState, type ReactNode } from 'react'
import { CircleDashed } from 'lucide-react'
import {
  AskLine,
  Badge,
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
} from '@family-os/ui'
import {
  useChoosePrize,
  usePunch,
  usePunchCards,
  type PrizeOption,
  type PunchCardData,
  type PunchPayout,
} from '../lib/punch-cards'

/* The Punch cards tab (M4/6 rework) — the kid's tallies, given their own surface
   beside Today rather than a corner of it: chores and cards are disparate enough
   that ADR 049's task/tally distinction stays structural, and the Focus view keeps
   its minimalism untouched.

   The kid names the prize they're working for up front (the finish line carries
   it) and can change it anytime — tap the finish line. An unpicked card wears the
   wrapped gift. At the goal a picked card mints on the spot; an unpicked one opens
   the prize sheet. The celebration is held here, keyed by template, because the
   refetch replaces the completed card with the fresh one underneath it. */

type Celebration = { payout: PunchPayout; card: PunchCardData }

export function PunchCardsTab({ tabBar }: { tabBar: ReactNode }) {
  const cards = usePunchCards()
  const punch = usePunch()
  const choose = useChoosePrize()
  const [picking, setPicking] = useState<PunchCardData | null>(null)
  const [done, setDone] = useState<Record<string, Celebration>>({})

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
      <PageHeader title="Chores" />
      {tabBar}

      {cards.isError ? (
        <ErrorCard moduleName="Punch cards" onRetry={() => cards.refetch()} />
      ) : cards.isLoading ? (
        <div aria-busy="true" aria-label="Loading punch cards" className="flex flex-col gap-2.5">
          <div className="h-[120px] animate-pulse rounded-card border border-border bg-card" />
          <div className="h-[120px] animate-pulse rounded-card border border-border bg-card" />
        </div>
      ) : (cards.data ?? []).length === 0 && Object.keys(done).length === 0 ? (
        <EmptyState
          icon={CircleDashed}
          heading="No punch cards yet"
          body="A card is a goal you fill one punch at a time — try bites, reading nights. A parent sets one up in Rewards."
        />
      ) : (
        <div className="flex flex-col gap-2.5 md:max-w-[560px]">
          {(cards.data ?? []).map((card) => {
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
              <UnclaimedCard key={card.id} card={card} onPick={() => setPicking(card)} />
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

function finishFor(
  card: PunchCardData
): { kind: 'coin' } | { kind: 'emoji'; emoji: string } | { kind: 'gift' } {
  if (card.template.payoutKind === 'coins') return { kind: 'coin' }
  if (card.chosenReward?.active) return { kind: 'emoji', emoji: card.chosenReward.emoji }
  return { kind: 'gift' }
}

function promiseLine(card: PunchCardData): string {
  const t = card.template
  if (t.payoutKind === 'coins') return `Fill the card for ${bucks(t.payoutCoins ?? 0)}.`
  if (card.chosenReward?.active) {
    return `Fill the card and ${card.chosenReward.emoji} ${card.chosenReward.name} is yours. Tap it to change your pick.`
  }
  return 'Fill the card, then the prize is yours.'
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
  const choice = t.payoutKind === 'reward'
  const unpicked = choice && !card.chosenReward?.active

  return (
    <PunchCard
      glyph={t.glyph}
      name={t.name}
      goal={t.goal}
      count={count}
      finish={finishFor(card)}
      onPunch={onPunch}
      punchLabel={`Punch ${t.name} — ${count + 1} of ${t.goal}`}
      punchDisabled={punching}
      onFinishTap={choice ? onPick : undefined}
      finishTapLabel={
        card.chosenReward?.active
          ? `Change your prize for ${t.name}`
          : `Pick your prize for ${t.name}`
      }
      headerTrailing={
        <span className="text-sm-token text-muted-foreground">
          {count} of {t.goal}
        </span>
      }
    >
      <p className="text-xs-body mt-3 text-muted-foreground">{promiseLine(card)}</p>
      {unpicked && (
        <button
          type="button"
          onClick={onPick}
          className="text-sm-token mt-1 font-semibold text-primary"
        >
          Pick your prize ›
        </button>
      )}
      {error && <p className="text-xs-body mt-1 text-error">{error.message}</p>}
    </PunchCard>
  )
}

/* A full card whose prize is still unclaimed — the pick never expires, so the card
   sits here glowing until the kid takes it. */
function UnclaimedCard({ card, onPick }: { card: PunchCardData; onPick: () => void }) {
  const t = card.template
  return (
    <PunchCard
      glyph={t.glyph}
      name={t.name}
      goal={t.goal}
      count={t.goal}
      finish={finishFor(card)}
      finishReached
      onFinishTap={onPick}
      finishTapLabel={`Pick your prize for ${t.name}`}
      headerTrailing={<Badge variant="secondary">Done!</Badge>}
    >
      <p className="text-sm-token mt-3 font-semibold" style={{ color: 'var(--coin-ink)' }}>
        Card full — your prize is waiting.
      </p>
      <button
        type="button"
        onClick={onPick}
        className="text-sm-token mt-1 font-semibold text-primary"
      >
        Pick your prize ›
      </button>
    </PunchCard>
  )
}

function FinishedMoment({ celebration, onNext }: { celebration: Celebration; onNext: () => void }) {
  const { payout, card } = celebration
  const t = card.template
  return (
    <PunchCard
      glyph={t.glyph}
      name={t.name}
      goal={t.goal}
      count={t.goal}
      finish={payout.kind === 'reward' ? { kind: 'emoji', emoji: payout.emoji } : { kind: 'coin' }}
      finishReached
      headerTrailing={<Badge variant="secondary">Done!</Badge>}
    >
      <p className="text-sm-token mt-3 font-semibold" style={{ color: 'var(--coin-ink)' }}>
        {payout.kind === 'reward'
          ? `${payout.emoji} ${payout.name} is in your pocket — it's in Rewards`
          : `+${bucks(payout.coins)} in your wallet`}
      </p>
      {payout.kind === 'coins' && payout.fallback && (
        <p className="text-xs-body mt-0.5 text-muted-foreground">
          Those prizes aren&rsquo;t around any more, so the best one&rsquo;s price landed instead.
        </p>
      )}
      <button
        type="button"
        onClick={onNext}
        className="text-sm-token mt-2 font-semibold text-primary"
        aria-label={`Start the next ${t.name} card, ${
          payout.kind === 'coins' ? `${bucksSpoken(payout.coins)} earned` : 'prize in your pocket'
        }`}
      >
        Start the next card ›
      </button>
    </PunchCard>
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
