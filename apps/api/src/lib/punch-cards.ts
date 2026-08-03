import { rewardsPrisma } from '@family-os/plugin-rewards/db'
import type { EventBus } from '@family-os/platform/server'
import { postEntry } from './ledger'

/* Punch cards (ADR 049, choice rework 2026-07-31): a fixed-goal, resettable counter
   with a payout at the goal. A template is parent-authored; a per-profile card
   materializes lazily on read (the ADR 058 precedent) and at most one is OPEN per
   (template, profile) — a partial unique index backs that, so a materialization
   race resolves to a skipped insert, never a duplicate card.

   The kid punches their own card; a parent undoes (ADR 049). At the goal a fresh
   card opens if the template is still live, and the completed card is retained as
   history.

   The payout is `{coins}` or a curated CHOICE of catalog rewards (M4/6 gates):
   - coins → a ledger credit keyed `(punch_card, cardId)`, idempotent like every
     other earn (ADR 047/048), claimed at completion.
   - choice → the kid names their target up front (`chosenRewardId`, changeable
     anytime) and the mint waits on that pick: a live pick mints at completion, an
     unpicked card completes UNCLAIMED and the prize sheet claims it. The mint is a
     normal ticket at cost 0 — nothing was spent, so a revoke refunds nothing and
     ADR 055's "money moves once" holds vacuously. Out of stock mints anyway (stock
     caps store purchases, not earned promises); a retired option stops being
     offered, and a fully-retired option set claims coins at the priciest option's
     cost — the parent's own retirement caused it, so the error lands kid-ward. */

export type PunchTemplateRecord = {
  id: string
  name: string
  glyph: string
  goal: number
  payoutKind: string
  payoutCoins: number | null
  payoutOptionIds: string[]
  audience: string[]
  active: boolean
}

export type RewardSummary = {
  id: string
  name: string
  emoji: string
  description: string | null
  cost: number
  requiresApproval: boolean
  active: boolean
}

export type PunchCardRecord = {
  id: string
  templateId: string
  profileId: string
  count: number
  chosenRewardId: string | null
  completedAt: Date | null
  prizeClaimedAt: Date | null
  createdAt: Date
}

export type CardWithTemplate = PunchCardRecord & { template: PunchTemplateRecord }

/** A card as the surfaces consume it: the template's option set and the kid's pick
    resolved to renderable reward summaries, plus the newest punch's timestamp. */
export type CardResolved = CardWithTemplate & {
  payoutOptions: RewardSummary[]
  chosenReward: RewardSummary | null
  lastPunchedAt: Date | null
}

export type FinishedSummary = {
  templateId: string
  profileId: string
  name: string
  glyph: string
  count: number
  lastFinishedAt: Date | null
  /** The latest finish's prize — a reward name, or the coins amount. Both null when
      a fallback claim paid coins on a retired option set. */
  prizeName: string | null
  prizeCoins: number | null
}

export type PunchPayout =
  | { kind: 'coins'; coins: number; balance: number; fallback?: boolean }
  | { kind: 'reward'; redemptionId: string; rewardId: string; emoji: string; name: string }

export class PunchCardError extends Error {
  constructor(
    message: string,
    public status: 400 | 404 | 409 = 400
  ) {
    super(message)
    this.name = 'PunchCardError'
  }
}

const templateInclude = { template: true } as const

function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: string } | null)?.code === 'P2002'
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Opens the missing cards for the given profiles. Empty template audience means
 *  everyone the fridge sheet meant — tiers 1–3; naming a parent explicitly still
 *  works. `skipDuplicates` rides the partial index, so a concurrent read simply
 *  loses the insert it was about to make. */
export async function ensureOpenCards(input: { id: string; tier: number }[]): Promise<void> {
  // Every rewards profile_id column is uuid, so a text-id profile (the family
  // pseudo-profile, seeded fixtures) can no more hold a card than a wallet —
  // skip them rather than let one poison the whole materialization insert.
  const profiles = input.filter((p) => UUID_RE.test(p.id))
  if (profiles.length === 0) return
  const templates = await rewardsPrisma.punchCardTemplate.findMany({ where: { active: true } })
  if (templates.length === 0) return

  const wanted: { templateId: string; profileId: string }[] = []
  for (const t of templates) {
    for (const p of profiles) {
      if (t.audience.length > 0 ? t.audience.includes(p.id) : p.tier <= 3) {
        wanted.push({ templateId: t.id, profileId: p.id })
      }
    }
  }
  if (wanted.length === 0) return

  // A pair is occupied while its prize business is unsettled — an open card OR a
  // finished card still waiting on the kid's pick. Counting only open cards here
  // materialized a second instance beside an unclaimed finish (round-7 review bug).
  const occupied = await rewardsPrisma.punchCard.findMany({
    where: { prizeClaimedAt: null, profileId: { in: profiles.map((p) => p.id) } },
    select: { templateId: true, profileId: true },
  })
  const has = new Set(occupied.map((c) => `${c.templateId}:${c.profileId}`))
  const missing = wanted.filter((w) => !has.has(`${w.templateId}:${w.profileId}`))
  if (missing.length > 0) {
    await rewardsPrisma.punchCard.createMany({ data: missing, skipDuplicates: true })
  }
}

const summarize = (r: {
  id: string
  name: string
  emoji: string
  description: string | null
  cost: number
  requiresApproval: boolean
  active: boolean
}): RewardSummary => ({
  id: r.id,
  name: r.name,
  emoji: r.emoji,
  description: r.description,
  cost: r.cost,
  requiresApproval: r.requiresApproval,
  active: r.active,
})

/** Attaches option and chosen-reward summaries in ONE reward fetch across the set,
 *  and the newest punch per card in one groupBy. Inactive options travel with their
 *  flag — the sheet hides them, but a card whose pick was retired still needs the
 *  face to explain what changed. */
export async function resolveCards(cards: CardWithTemplate[]): Promise<CardResolved[]> {
  const ids = new Set<string>()
  for (const c of cards) {
    for (const id of c.template.payoutOptionIds) ids.add(id)
    if (c.chosenRewardId) ids.add(c.chosenRewardId)
  }
  const [rewards, punchMax] = await Promise.all([
    ids.size > 0
      ? rewardsPrisma.reward.findMany({ where: { id: { in: [...ids] } } })
      : Promise.resolve([]),
    cards.length > 0
      ? rewardsPrisma.punch.groupBy({
          by: ['cardId'],
          where: { cardId: { in: cards.map((c) => c.id) } },
          _max: { createdAt: true },
        })
      : Promise.resolve([]),
  ])
  const byId = new Map(rewards.map((r) => [r.id, summarize(r)]))
  const lastPunch = new Map(punchMax.map((p) => [p.cardId, p._max.createdAt]))

  return cards.map((c) => ({
    ...c,
    payoutOptions: c.template.payoutOptionIds
      .map((id) => byId.get(id))
      .filter((r): r is RewardSummary => !!r),
    chosenReward: c.chosenRewardId ? (byId.get(c.chosenRewardId) ?? null) : null,
    lastPunchedAt: lastPunch.get(c.id) ?? null,
  }))
}

/** Open cards (template embedded, oldest first — the card you started first leads)
 *  plus the finished history rolled up per (template, profile) for the chip shelf. */
export async function listCards(profileIds?: string[]): Promise<{
  cards: CardResolved[]
  finished: FinishedSummary[]
}> {
  const profileFilter = profileIds ? { profileId: { in: profileIds } } : {}
  const [cards, groups] = await Promise.all([
    // The id tie-break matters: cards materialized in one createMany share a
    // created_at, and Postgres's order between equal keys is undefined — every
    // punch rewrites a row and could flip the tie, shuffling the kid's list.
    rewardsPrisma.punchCard.findMany({
      where: { completedAt: null, ...profileFilter },
      include: templateInclude,
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    }),
    rewardsPrisma.punchCard.groupBy({
      by: ['templateId', 'profileId'],
      where: { completedAt: { not: null }, ...profileFilter },
      _count: { _all: true },
      _max: { completedAt: true },
    }),
  ])

  // A finished-but-unclaimed card still has a prize waiting — it rides with the
  // open cards so the sheet can claim it, not with the chips.
  const unclaimed = await rewardsPrisma.punchCard.findMany({
    where: {
      completedAt: { not: null },
      prizeClaimedAt: null,
      template: { payoutKind: 'reward' },
      ...profileFilter,
    },
    include: templateInclude,
    orderBy: [{ completedAt: 'asc' }, { id: 'asc' }],
  })

  const templateIds = [...new Set(groups.map((g) => g.templateId))]
  const [templates, latestFinished] = await Promise.all([
    rewardsPrisma.punchCardTemplate.findMany({
      where: { id: { in: templateIds } },
      select: { id: true, name: true, glyph: true, payoutKind: true, payoutCoins: true },
    }),
    // The latest finish per (template, profile) names the shelf stub's prize.
    rewardsPrisma.punchCard.findMany({
      where: { completedAt: { not: null }, ...profileFilter },
      orderBy: [{ completedAt: 'desc' }, { id: 'desc' }],
      distinct: ['templateId', 'profileId'],
      select: { templateId: true, profileId: true, chosenRewardId: true },
    }),
  ])
  const byId = new Map(templates.map((t) => [t.id, t]))
  const chosenIds = latestFinished.map((c) => c.chosenRewardId).filter((id): id is string => !!id)
  const chosen =
    chosenIds.length > 0
      ? await rewardsPrisma.reward.findMany({
          where: { id: { in: chosenIds } },
          select: { id: true, name: true },
        })
      : []
  const rewardName = new Map(chosen.map((r) => [r.id, r.name]))
  const latestBy = new Map(latestFinished.map((c) => [`${c.templateId}:${c.profileId}`, c]))

  return {
    cards: await resolveCards([...unclaimed, ...cards]),
    finished: groups.map((g) => {
      const t = byId.get(g.templateId)
      const last = latestBy.get(`${g.templateId}:${g.profileId}`)
      const prizeName = last?.chosenRewardId ? (rewardName.get(last.chosenRewardId) ?? null) : null
      return {
        templateId: g.templateId,
        profileId: g.profileId,
        name: t?.name ?? 'A card',
        glyph: t?.glyph ?? '🎉',
        count: g._count._all,
        lastFinishedAt: g._max.completedAt,
        prizeName,
        prizeCoins: t?.payoutKind === 'coins' ? (t.payoutCoins ?? null) : null,
      }
    }),
  }
}

export function getCard(id: string): Promise<CardWithTemplate | null> {
  return rewardsPrisma.punchCard.findUnique({ where: { id }, include: templateInclude })
}

export type PunchResult = {
  card: CardResolved
  completed: boolean
  /** Null while a completed choice card waits on the kid's pick. */
  payout: PunchPayout | null
  /** True when the card finished without a live pick — the prize sheet claims it. */
  prizePending: boolean
  /** True when an event-sourced `(sourceType, sourceId)` was already punched. */
  replayed: boolean
}

async function resolveOne(card: CardWithTemplate): Promise<CardResolved> {
  const [resolved] = await resolveCards([card])
  return resolved!
}

/** One stamp. The count moves atomically and completion is claimed with a
 *  compare-and-set on `completedAt`, so two simultaneous punches at the goal pay
 *  out once. The payout lands OUTSIDE the transaction: the coins path replays
 *  idempotently under the ledger's `(punch_card, cardId)` claim, and a completed
 *  card whose mint failed is visible as prize-pending (not silently reset), which
 *  is the recoverable half of the failure. */
export async function punchCard(
  bus: EventBus,
  input: { cardId: string; sourceType: string; sourceId?: string | null; createdBy: string }
): Promise<PunchResult> {
  const { cardId, sourceType, sourceId = null, createdBy } = input

  const card = await getCard(cardId)
  if (!card) throw new PunchCardError('Card not found', 404)
  if (card.completedAt) throw new PunchCardError('That card is already finished', 409)

  let updated: CardWithTemplate
  let completed = false
  try {
    updated = await rewardsPrisma.$transaction(async (tx) => {
      await tx.punch.create({ data: { cardId, sourceType, sourceId, createdBy } })
      const bumped = await tx.punchCard.update({
        where: { id: cardId },
        data: { count: { increment: 1 } },
        include: templateInclude,
      })
      if (bumped.count >= bumped.template.goal) {
        const won = await tx.punchCard.updateMany({
          where: { id: cardId, completedAt: null },
          data: { completedAt: new Date() },
        })
        completed = won.count === 1
      }
      return bumped
    })
  } catch (err) {
    if (!isUniqueViolation(err) || sourceId === null) throw err
    const current = await getCard(cardId)
    if (!current) throw err
    return {
      card: await resolveOne(current),
      completed: false,
      payout: null,
      prizePending: false,
      replayed: true,
    }
  }

  if (!completed) {
    bus.emit('rewards.card.punched', {
      cardId,
      profileId: updated.profileId,
      templateId: updated.templateId,
      count: updated.count,
      goal: updated.template.goal,
    })
    return {
      card: await resolveOne(updated),
      completed: false,
      payout: null,
      prizePending: false,
      replayed: false,
    }
  }

  let payout: PunchPayout | null = null
  if (updated.template.payoutKind === 'coins') {
    payout = await settleCoins(bus, updated, updated.template.payoutCoins ?? 0, false)
  } else if (updated.chosenRewardId) {
    const chosen = await rewardsPrisma.reward.findUnique({ where: { id: updated.chosenRewardId } })
    // A retired pick is NOT silently swapped — the card completes unclaimed and the
    // picker re-asks with what's still offered.
    if (chosen?.active) payout = await mintPrize(bus, updated, chosen)
  }

  // The new sheet goes up only once the prize business is settled — an unclaimed
  // finish would otherwise sit BESIDE its replacement, two instances of one card
  // (the round-7 review bug). The claim path opens it instead.
  if (payout !== null) await openFreshCard(updated)

  bus.emit('rewards.card.completed', {
    cardId,
    profileId: updated.profileId,
    templateId: updated.templateId,
    payout:
      payout === null
        ? null
        : payout.kind === 'coins'
          ? { coins: payout.coins }
          : { rewardId: payout.rewardId, redemptionId: payout.redemptionId },
  })

  const final = await getCard(cardId)
  return {
    card: await resolveOne(final ?? updated),
    completed: true,
    payout,
    prizePending: payout === null,
    replayed: false,
  }
}

async function openFreshCard(card: CardWithTemplate): Promise<void> {
  if (!card.template.active) return
  await rewardsPrisma.punchCard.createMany({
    data: [{ templateId: card.templateId, profileId: card.profileId }],
    skipDuplicates: true,
  })
}

async function settleCoins(
  bus: EventBus,
  card: CardWithTemplate,
  coins: number,
  fallback: boolean
): Promise<PunchPayout> {
  const label = `Card finished — ${card.template.glyph} ${card.template.name}`
  const { balance } = await postEntry(bus, {
    profileId: card.profileId,
    delta: coins,
    reason: label,
    sourceType: 'punch_card',
    sourceId: card.id,
  })
  await rewardsPrisma.punchCard.updateMany({
    where: { id: card.id, prizeClaimedAt: null },
    data: { prizeClaimedAt: new Date() },
  })
  return { kind: 'coins', coins, balance, fallback: fallback || undefined }
}

async function mintPrize(
  bus: EventBus,
  card: CardWithTemplate,
  reward: { id: string; name: string; emoji: string }
): Promise<PunchPayout> {
  const redemption = await rewardsPrisma.redemption.create({
    data: { rewardId: reward.id, profileId: card.profileId, cost: 0 },
  })
  await rewardsPrisma.punchCard.updateMany({
    where: { id: card.id },
    data: { prizeClaimedAt: new Date(), chosenRewardId: reward.id },
  })
  bus.emit('rewards.card.prize-claimed', {
    cardId: card.id,
    profileId: card.profileId,
    templateId: card.templateId,
    rewardId: reward.id,
    redemptionId: redemption.id,
  })
  return {
    kind: 'reward',
    redemptionId: redemption.id,
    rewardId: reward.id,
    emoji: reward.emoji,
    name: reward.name,
  }
}

export type ChooseResult = {
  card: CardResolved
  /** Set when the choice claimed a finished card — the mint happened now. */
  payout: PunchPayout | null
}

/** The kid names their prize — or claims it on a finished card. On an OPEN card
 *  this just moves the pointer (changeable anytime, nothing mints). On a finished,
 *  unclaimed card the pick mints on the spot; the claim is compare-and-set on
 *  `prizeClaimedAt` so a double-tap mints once. `rewardId: null` is only honoured
 *  when every option is retired — the escape hatch pays coins at the priciest
 *  option's cost. */
export async function choosePrize(
  bus: EventBus,
  input: { cardId: string; rewardId: string | null }
): Promise<ChooseResult> {
  const card = await getCard(input.cardId)
  if (!card) throw new PunchCardError('Card not found', 404)
  if (card.template.payoutKind !== 'reward') {
    throw new PunchCardError('That card pays P-Bucks — there is nothing to pick', 409)
  }
  if (card.completedAt && card.prizeClaimedAt) {
    throw new PunchCardError('That card already got its prize', 409)
  }

  const options = await rewardsPrisma.reward.findMany({
    where: { id: { in: card.template.payoutOptionIds } },
  })
  const offered = options.filter((r) => r.active)

  if (input.rewardId === null) {
    if (offered.length > 0) {
      throw new PunchCardError('Pick one of the prizes on the card')
    }
    if (!card.completedAt) {
      throw new PunchCardError('Nothing to claim until the card is full', 409)
    }
    const priciest = options.reduce((m, r) => Math.max(m, r.cost), 0)
    const won = await rewardsPrisma.punchCard.updateMany({
      where: { id: card.id, prizeClaimedAt: null },
      data: { prizeClaimedAt: new Date() },
    })
    if (won.count !== 1) throw new PunchCardError('That card already got its prize', 409)
    const label = `Card finished — ${card.template.glyph} ${card.template.name}`
    const { balance } = await postEntry(bus, {
      profileId: card.profileId,
      delta: priciest,
      reason: `${label} (prizes retired)`,
      sourceType: 'punch_card',
      sourceId: card.id,
    })
    await openFreshCard(card)
    const final = await getCard(card.id)
    return {
      card: await resolveOne(final ?? card),
      payout: { kind: 'coins', coins: priciest, balance, fallback: true },
    }
  }

  const picked = offered.find((r) => r.id === input.rewardId)
  if (!picked) throw new PunchCardError('That prize is not on this card')

  if (!card.completedAt) {
    const updated = await rewardsPrisma.punchCard.update({
      where: { id: card.id },
      data: { chosenRewardId: picked.id },
      include: templateInclude,
    })
    return { card: await resolveOne(updated), payout: null }
  }

  const won = await rewardsPrisma.punchCard.updateMany({
    where: { id: card.id, prizeClaimedAt: null },
    data: { prizeClaimedAt: new Date(), chosenRewardId: picked.id },
  })
  if (won.count !== 1) throw new PunchCardError('That card already got its prize', 409)
  const payout = await mintPrize(bus, card, picked)
  await openFreshCard(card)
  const final = await getCard(card.id)
  return { card: await resolveOne(final ?? card), payout }
}

/** The parent takes a card off the fridge (M4/6 review gate): the OPEN card goes,
 *  punches and all — effort lost is the parent's call, and the confirm names it.
 *  A completed card is history (or an unclaimed prize) and cannot be taken down.
 *
 *  Deleting the row alone is not a removal — the next read would lazily
 *  materialize a fresh card, because the kid is still in the template's audience.
 *  So the take-down also ends the eligibility: the kid leaves the audience (an
 *  "everyone" audience freezes into the explicit eligible list minus them), and a
 *  template left with nobody retires. Re-adding them in the Catalog drawer is the
 *  way back. */
export async function removeCard(
  cardId: string,
  profiles: { id: string; tier: number }[]
): Promise<CardWithTemplate> {
  const card = await getCard(cardId)
  if (!card) throw new PunchCardError('Card not found', 404)
  if (card.completedAt) {
    throw new PunchCardError('That card is finished — it stays in the history', 409)
  }

  const t = card.template
  const newAudience =
    t.audience.length > 0
      ? t.audience.filter((id) => id !== card.profileId)
      : profiles
          .filter((p) => p.tier <= 3 && UUID_RE.test(p.id) && p.id !== card.profileId)
          .map((p) => p.id)

  await rewardsPrisma.$transaction(async (tx) => {
    await tx.punch.deleteMany({ where: { cardId } })
    await tx.punchCard.delete({ where: { id: cardId } })
    await tx.punchCardTemplate.update({
      where: { id: t.id },
      data: { audience: newAudience, ...(newAudience.length === 0 ? { active: false } : {}) },
    })
  })
  return card
}

/** After an audience edit, untouched (zero-punch) open cards for kids no longer
 *  covered are swept away — they were lazy materializations, not effort. A punched
 *  card survives and needs the explicit take-down. */
export async function sweepUntouchedCards(
  template: PunchTemplateRecord,
  profiles: { id: string; tier: number }[]
): Promise<void> {
  const eligible = new Set(
    profiles
      .filter((p) =>
        template.audience.length > 0 ? template.audience.includes(p.id) : p.tier <= 3
      )
      .map((p) => p.id)
  )
  const open = await rewardsPrisma.punchCard.findMany({
    where: { templateId: template.id, completedAt: null, count: 0 },
    select: { id: true, profileId: true },
  })
  const stale = open.filter((c) => !eligible.has(c.profileId)).map((c) => c.id)
  if (stale.length > 0) {
    await rewardsPrisma.punchCard.deleteMany({ where: { id: { in: stale } } })
  }
}

/** The parent's stray-pen-mark eraser: removes the NEWEST punch from an open card.
 *  A finished card is settled — its payout already landed (or waits on the kid's
 *  pick), so the correction there is the ticket revoke, not an un-punch. */
export async function undoPunch(cardId: string): Promise<CardResolved> {
  const card = await getCard(cardId)
  if (!card) throw new PunchCardError('Card not found', 404)
  if (card.completedAt) {
    throw new PunchCardError('That card is finished — revoke its payout instead', 409)
  }
  if (card.count === 0) throw new PunchCardError('Nothing to undo on that card', 409)

  const updated = await rewardsPrisma.$transaction(async (tx) => {
    const newest = await tx.punch.findFirst({
      where: { cardId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    })
    if (newest) await tx.punch.delete({ where: { id: newest.id } })
    return tx.punchCard.update({
      where: { id: cardId },
      data: { count: { decrement: 1 } },
      include: templateInclude,
    })
  })
  return resolveOne(updated)
}
