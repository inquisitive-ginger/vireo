import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import bcrypt from 'bcryptjs'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { rewardsPrisma } from '@family-os/plugin-rewards/db'
import { getBalance } from '../lib/ledger'

let app: FastifyInstance

const PARENT_ID = '00000000-4ee5-0002-0000-000000000001' // tier 4
const TWEEN_ID = '00000000-4ee5-0002-0000-000000000002' // tier 2
const KID_ID = '00000000-4ee5-0002-0000-000000000003' // tier 1

function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

async function getCookieForProfile(profileId: string): Promise<string> {
  const hash = await bcrypt.hash('1234', 10)
  await prisma.systemConfig.upsert({
    where: { key: 'family_pin_hash' },
    update: { value: hash },
    create: { key: 'family_pin_hash', value: hash, updatedBy: null },
  })
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/verify-pin',
    payload: { pin: '1234', targetProfileId: profileId },
  })
  return getCookie(res)
}

function makeTemplate(
  over: Partial<{
    name: string
    glyph: string
    goal: number
    payoutKind: string
    payoutCoins: number | null
    payoutOptionIds: string[]
    audience: string[]
    active: boolean
  }> = {}
) {
  return rewardsPrisma.punchCardTemplate.create({
    data: {
      name: 'Try bites',
      glyph: '🥦',
      goal: 3,
      payoutKind: 'coins',
      payoutCoins: 10,
      payoutOptionIds: [],
      audience: [],
      active: true,
      ...over,
    },
  })
}

function makeReward(over: Partial<{ cost: number; stock: number | null; active: boolean }> = {}) {
  return rewardsPrisma.reward.create({
    data: {
      name: 'Ice cream run',
      emoji: '🍦',
      cost: 25,
      requiresApproval: true,
      audience: [],
      stock: null,
      active: true,
      createdBy: PARENT_ID,
      ...over,
    },
  })
}

/** Materializes and returns the kid's open card for a template via the read route. */
async function openCardFor(cookie: string, templateId: string): Promise<{ id: string }> {
  const res = await app.inject({
    method: 'GET',
    url: '/api/rewards/punch-cards',
    headers: { cookie },
  })
  expect(res.statusCode).toBe(200)
  const card = res.json().cards.find((c: { templateId: string }) => c.templateId === templateId)
  expect(card).toBeDefined()
  return card
}

beforeAll(async () => {
  app = await buildServer()
  for (const [id, name, tier] of [
    [PARENT_ID, 'Dad', 4],
    [TWEEN_ID, 'Tween', 2],
    [KID_ID, 'Kid', 1],
  ] as const) {
    await prisma.profile.upsert({
      where: { id },
      update: { name, tier },
      create: { id, name, tier },
    })
  }
  await prisma.profile.upsert({
    where: { id: 'family' },
    update: {},
    create: { id: 'family', name: 'Family', tier: 1 },
  })
})

afterAll(async () => {
  await cleanRewards()
  await app.close()
})

async function cleanRewards() {
  await rewardsPrisma.punch.deleteMany({})
  await rewardsPrisma.punchCard.deleteMany({})
  await rewardsPrisma.punchCardTemplate.deleteMany({})
  await rewardsPrisma.redemption.deleteMany({})
  await rewardsPrisma.reward.deleteMany({})
  await rewardsPrisma.ledgerEntry.deleteMany({})
  await rewardsPrisma.balance.deleteMany({})
}

beforeEach(cleanRewards)

describe('punch templates (tier-4 CRUD)', () => {
  it('creates a coins template', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/rewards/punch-templates',
      headers: { cookie },
      payload: {
        name: 'Reading nights',
        glyph: '📚',
        goal: 10,
        payoutKind: 'coins',
        payoutCoins: 10,
      },
    })

    expect(res.statusCode).toBe(201)
    expect(res.json().template).toMatchObject({
      name: 'Reading nights',
      goal: 10,
      payoutKind: 'coins',
      payoutCoins: 10,
      payoutOptionIds: [],
      audience: null,
      active: true,
    })
  })

  it('refuses a template below tier 4', async () => {
    const cookie = await getCookieForProfile(TWEEN_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/rewards/punch-templates',
      headers: { cookie },
      payload: { name: 'X', glyph: '🎈', goal: 5, payoutKind: 'coins', payoutCoins: 5 },
    })
    expect(res.statusCode).toBe(403)
  })

  it('refuses a payout promising both coins and a choice', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const reward = await makeReward()
    const res = await app.inject({
      method: 'POST',
      url: '/api/rewards/punch-templates',
      headers: { cookie },
      payload: {
        name: 'X',
        glyph: '🎈',
        goal: 5,
        payoutKind: 'coins',
        payoutCoins: 5,
        payoutOptionIds: [reward.id],
      },
    })
    expect(res.statusCode).toBe(400)
  })

  it('accepts the whole catalog as the option set — no small cap', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const many = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        rewardsPrisma.reward.create({
          data: {
            name: `Reward ${i}`,
            emoji: '🎁',
            cost: 10,
            requiresApproval: false,
            audience: [],
            active: true,
            createdBy: PARENT_ID,
          },
        })
      )
    )

    const res = await app.inject({
      method: 'POST',
      url: '/api/rewards/punch-templates',
      headers: { cookie },
      payload: {
        name: 'Anything you like',
        glyph: '🎁',
        goal: 10,
        payoutKind: 'reward',
        payoutOptionIds: many.map((r) => r.id),
      },
    })

    expect(res.statusCode).toBe(201)
    expect(res.json().template.payoutOptions).toHaveLength(10)
  })

  it('refuses a choice with an option that does not exist', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/rewards/punch-templates',
      headers: { cookie },
      payload: {
        name: 'X',
        glyph: '🎈',
        goal: 5,
        payoutKind: 'reward',
        payoutOptionIds: ['00000000-4ee5-0002-0000-0000000000ff'],
      },
    })
    expect(res.statusCode).toBe(400)
  })

  it('swaps the payout as a unit on PATCH and serves the option faces', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const reward = await makeReward()
    const template = await makeTemplate()

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/rewards/punch-templates/${template.id}`,
      headers: { cookie },
      payload: { payoutKind: 'reward', payoutOptionIds: [reward.id] },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().template).toMatchObject({
      payoutKind: 'reward',
      payoutOptionIds: [reward.id],
      payoutCoins: null,
    })
    expect(res.json().template.payoutOptions).toHaveLength(1)
    expect(res.json().template.payoutOptions[0]).toMatchObject({ emoji: '🍦', cost: 25 })
  })

  it('hard-deletes an untouched template, empty materializations and all', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const kidCookie = await getCookieForProfile(KID_ID)
    const template = await makeTemplate()
    await openCardFor(kidCookie, template.id)

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-templates/${template.id}`,
      headers: { cookie: parentCookie },
    })

    expect(res.json()).toMatchObject({ deleted: true })
    expect(await rewardsPrisma.punchCard.count()).toBe(0)
  })

  it('retires a template once a card holds a punch', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const kidCookie = await getCookieForProfile(KID_ID)
    const template = await makeTemplate()
    const card = await openCardFor(kidCookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: kidCookie },
    })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-templates/${template.id}`,
      headers: { cookie: parentCookie },
    })

    expect(res.json()).toMatchObject({ retired: true })
    expect(res.json().template.active).toBe(false)
  })
})

describe('GET /rewards/punch-cards', () => {
  it('materializes an open card per active template for the kid', async () => {
    const template = await makeTemplate()
    const cookie = await getCookieForProfile(KID_ID)

    const res = await app.inject({
      method: 'GET',
      url: '/api/rewards/punch-cards',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.cards).toHaveLength(1)
    expect(body.cards[0]).toMatchObject({
      templateId: template.id,
      profileId: KID_ID,
      count: 0,
      completedAt: null,
    })
    expect(body.cards[0].template).toMatchObject({ name: 'Try bites', goal: 3 })
    expect(body.finished).toEqual([])
  })

  it('scopes an audience template to the kids it names', async () => {
    await makeTemplate({ audience: [TWEEN_ID] })
    const cookie = await getCookieForProfile(KID_ID)

    const res = await app.inject({
      method: 'GET',
      url: '/api/rewards/punch-cards',
      headers: { cookie },
    })
    expect(res.json().cards).toEqual([])
  })

  it('forces a kid to their own cards whatever they ask for', async () => {
    await makeTemplate()
    const cookie = await getCookieForProfile(KID_ID)

    const res = await app.inject({
      method: 'GET',
      url: `/api/rewards/punch-cards?profileId=${TWEEN_ID}`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().cards.every((c: { profileId: string }) => c.profileId === KID_ID)).toBe(true)
  })

  it('gives tier 4 every card, materialized for tiers 1–3 and not the parent', async () => {
    await makeTemplate()
    const cookie = await getCookieForProfile(PARENT_ID)

    const res = await app.inject({
      method: 'GET',
      url: '/api/rewards/punch-cards',
      headers: { cookie },
    })

    // Membership, not an exact list — other suites' fixture kids share the DB and
    // legitimately materialize too when their files run first.
    const profiles = res.json().cards.map((c: { profileId: string }) => c.profileId)
    expect(profiles).toContain(TWEEN_ID)
    expect(profiles).toContain(KID_ID)
    expect(profiles).not.toContain(PARENT_ID)
    expect(profiles).not.toContain('family')
  })

  it('refuses the family pseudo-profile', async () => {
    const cookie = await getCookieForProfile('family')
    const res = await app.inject({
      method: 'GET',
      url: '/api/rewards/punch-cards',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(403)
  })

  it('keeps a retired template’s open card going but opens no new ones', async () => {
    const template = await makeTemplate()
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })
    await rewardsPrisma.punchCardTemplate.update({
      where: { id: template.id },
      data: { active: false },
    })

    const res = await app.inject({
      method: 'GET',
      url: '/api/rewards/punch-cards',
      headers: { cookie },
    })

    expect(res.json().cards).toHaveLength(1)
    expect(res.json().cards[0]).toMatchObject({ id: card.id, count: 1 })
  })
})

describe('POST /rewards/punch-cards/:id/punch', () => {
  it('stamps the kid’s own card', async () => {
    const template = await makeTemplate()
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)

    const res = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({ completed: false, payout: null })
    expect(res.json().card.count).toBe(1)
    expect(await rewardsPrisma.punch.count({ where: { cardId: card.id } })).toBe(1)
  })

  it('404s someone else’s card', async () => {
    const template = await makeTemplate()
    const kidCookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(kidCookie, template.id)
    const tweenCookie = await getCookieForProfile(TWEEN_ID)

    const res = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: tweenCookie },
    })
    expect(res.statusCode).toBe(404)
  })

  it('pays coins at the goal, retains the card, and opens a fresh one', async () => {
    const template = await makeTemplate({ goal: 2, payoutCoins: 10 })
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)
    const events: Record<string, unknown>[] = []
    const off = app.eventBus.on('rewards.card.completed', (p) =>
      events.push(p as Record<string, unknown>)
    )

    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })
    const res = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })
    off()

    expect(res.json()).toMatchObject({
      completed: true,
      payout: { kind: 'coins', coins: 10, balance: 10 },
    })
    expect(res.json().card.completedAt).not.toBeNull()
    expect(await getBalance(KID_ID)).toBe(10)
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({ profileId: KID_ID, payout: { coins: 10 } })

    const open = await rewardsPrisma.punchCard.findMany({ where: { completedAt: null } })
    expect(open).toHaveLength(1)
    expect(open[0]).toMatchObject({ templateId: template.id, profileId: KID_ID, count: 0 })
  })

  it('mints the chosen prize at the goal — through an empty stock', async () => {
    const reward = await makeReward({ stock: 0 })
    const template = await makeTemplate({
      goal: 1,
      payoutKind: 'reward',
      payoutCoins: null,
      payoutOptionIds: [reward.id],
    })
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/prize`,
      headers: { cookie },
      payload: { rewardId: reward.id },
    })

    const res = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })

    expect(res.json().payout).toMatchObject({ kind: 'reward', rewardId: reward.id, emoji: '🍦' })
    expect(res.json().prizePending).toBe(false)
    const ticket = await rewardsPrisma.redemption.findFirst({ where: { profileId: KID_ID } })
    expect(ticket).toMatchObject({ rewardId: reward.id, cost: 0, status: 'owned' })
    expect(await getBalance(KID_ID)).toBe(0)
  })

  it('completes unclaimed when no prize was picked, and the sheet claims it', async () => {
    const reward = await makeReward()
    const other = await rewardsPrisma.reward.create({
      data: {
        name: 'Bake something',
        emoji: '🍪',
        cost: 10,
        requiresApproval: false,
        audience: [],
        active: true,
        createdBy: PARENT_ID,
      },
    })
    const template = await makeTemplate({
      goal: 1,
      payoutKind: 'reward',
      payoutCoins: null,
      payoutOptionIds: [reward.id, other.id],
    })
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)

    const punch = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })
    expect(punch.json()).toMatchObject({ completed: true, payout: null, prizePending: true })
    expect(await rewardsPrisma.redemption.count()).toBe(0)

    // The unclaimed card rides with the open cards so the picker can reach it —
    // and NO fresh card sits beside it yet: the new sheet goes up only once the
    // prize business is settled (the round-7 review bug).
    const list = await app.inject({
      method: 'GET',
      url: '/api/rewards/punch-cards',
      headers: { cookie },
    })
    const ofTemplate = list
      .json()
      .cards.filter((c: { templateId: string }) => c.templateId === template.id)
    expect(ofTemplate).toHaveLength(1)
    expect(ofTemplate[0]).toMatchObject({
      id: card.id,
      completedAt: expect.any(String),
      prizeClaimedAt: null,
    })
    expect(ofTemplate[0].template.payoutOptions).toHaveLength(2)

    const claim = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/prize`,
      headers: { cookie },
      payload: { rewardId: other.id },
    })
    expect(claim.json().payout).toMatchObject({ kind: 'reward', rewardId: other.id, emoji: '🍪' })
    const ticket = await rewardsPrisma.redemption.findFirst({ where: { profileId: KID_ID } })
    expect(ticket).toMatchObject({ rewardId: other.id, cost: 0, status: 'owned' })

    // The claim is what opens the next card.
    const fresh = await rewardsPrisma.punchCard.findMany({
      where: { templateId: template.id, completedAt: null },
    })
    expect(fresh).toHaveLength(1)
    expect(fresh[0]).toMatchObject({ profileId: KID_ID, count: 0, chosenRewardId: null })

    const again = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/prize`,
      headers: { cookie },
      payload: { rewardId: reward.id },
    })
    expect(again.statusCode).toBe(409)
  })

  it('lets the kid change their pick on an open card, and rejects an off-card prize', async () => {
    const reward = await makeReward()
    const stranger = await rewardsPrisma.reward.create({
      data: {
        name: 'Movie night',
        emoji: '🍿',
        cost: 15,
        requiresApproval: false,
        audience: [],
        active: true,
        createdBy: PARENT_ID,
      },
    })
    const template = await makeTemplate({
      goal: 3,
      payoutKind: 'reward',
      payoutCoins: null,
      payoutOptionIds: [reward.id],
    })
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)

    const pick = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/prize`,
      headers: { cookie },
      payload: { rewardId: reward.id },
    })
    expect(pick.json().card).toMatchObject({ chosenRewardId: reward.id })
    expect(pick.json().card.chosenReward).toMatchObject({ emoji: '🍦' })
    expect(pick.json().payout).toBeNull()
    expect(await rewardsPrisma.redemption.count()).toBe(0)

    const off = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/prize`,
      headers: { cookie },
      payload: { rewardId: stranger.id },
    })
    expect(off.statusCode).toBe(400)
  })

  it('pays the priciest option in coins when every option is retired at claim', async () => {
    const reward = await makeReward({ cost: 25, active: false })
    const template = await makeTemplate({
      goal: 1,
      payoutKind: 'reward',
      payoutCoins: null,
      payoutOptionIds: [reward.id],
    })
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })

    const claim = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/prize`,
      headers: { cookie },
      payload: { rewardId: null },
    })

    expect(claim.json().payout).toMatchObject({ kind: 'coins', coins: 25, fallback: true })
    expect(await getBalance(KID_ID)).toBe(25)
    expect(await rewardsPrisma.redemption.count()).toBe(0)
  })

  it('409s a punch on a finished card', async () => {
    const template = await makeTemplate({ goal: 1 })
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })

    const res = await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(409)
  })
})

describe('DELETE /rewards/punch-cards/:id/punch (parent undo)', () => {
  it('removes the newest punch', async () => {
    const template = await makeTemplate()
    const kidCookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(kidCookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: kidCookie },
    })
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: kidCookie },
    })
    const parentCookie = await getCookieForProfile(PARENT_ID)

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: parentCookie },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().card.count).toBe(1)
    expect(await rewardsPrisma.punch.count({ where: { cardId: card.id } })).toBe(1)
  })

  it('is a tier-4 power', async () => {
    const template = await makeTemplate()
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(403)
  })

  it('409s an empty card', async () => {
    const template = await makeTemplate()
    const kidCookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(kidCookie, template.id)
    const parentCookie = await getCookieForProfile(PARENT_ID)

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: parentCookie },
    })
    expect(res.statusCode).toBe(409)
  })

  it('409s a finished card — the payout is settled', async () => {
    const template = await makeTemplate({ goal: 1 })
    const kidCookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(kidCookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: kidCookie },
    })
    const parentCookie = await getCookieForProfile(PARENT_ID)

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: parentCookie },
    })
    expect(res.statusCode).toBe(409)
  })
})

describe('DELETE /rewards/punch-cards/:id (take-down)', () => {
  it('takes an open card down, punches and all — and it STAYS down', async () => {
    const template = await makeTemplate()
    const kidCookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(kidCookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: kidCookie },
    })
    const parentCookie = await getCookieForProfile(PARENT_ID)

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-cards/${card.id}`,
      headers: { cookie: parentCookie },
    })

    expect(res.json()).toMatchObject({ removed: true })
    expect(await rewardsPrisma.punchCard.count({ where: { id: card.id } })).toBe(0)
    expect(await rewardsPrisma.punch.count({ where: { cardId: card.id } })).toBe(0)

    // The kid left the audience (an "everyone" audience freezes into the explicit
    // list minus them), so the next read does NOT materialize a fresh card — the
    // live bug the review caught.
    const after = await rewardsPrisma.punchCardTemplate.findUnique({ where: { id: template.id } })
    expect(after?.audience).not.toContain(KID_ID)
    expect(after?.audience).toContain(TWEEN_ID)
    const reread = await app.inject({
      method: 'GET',
      url: '/api/rewards/punch-cards',
      headers: { cookie: kidCookie },
    })
    expect(
      reread.json().cards.filter((c: { templateId: string }) => c.templateId === template.id)
    ).toEqual([])
  })

  it('retires a template whose last kid is taken off it', async () => {
    const template = await makeTemplate({ audience: [KID_ID] })
    const kidCookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(kidCookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: kidCookie },
    })
    const parentCookie = await getCookieForProfile(PARENT_ID)

    await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-cards/${card.id}`,
      headers: { cookie: parentCookie },
    })

    const after = await rewardsPrisma.punchCardTemplate.findUnique({ where: { id: template.id } })
    expect(after).toMatchObject({ audience: [], active: false })
  })

  it('is a tier-4 power', async () => {
    const template = await makeTemplate()
    const cookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(cookie, template.id)

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-cards/${card.id}`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(403)
  })

  it('409s a finished card — history stays', async () => {
    const template = await makeTemplate({ goal: 1 })
    const kidCookie = await getCookieForProfile(KID_ID)
    const card = await openCardFor(kidCookie, template.id)
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${card.id}/punch`,
      headers: { cookie: kidCookie },
    })
    const parentCookie = await getCookieForProfile(PARENT_ID)

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/punch-cards/${card.id}`,
      headers: { cookie: parentCookie },
    })
    expect(res.statusCode).toBe(409)
  })
})

describe('audience sweep', () => {
  it('sweeps untouched cards for excluded kids, keeps punched ones', async () => {
    const template = await makeTemplate()
    const kidCookie = await getCookieForProfile(KID_ID)
    const tweenCookie = await getCookieForProfile(TWEEN_ID)
    const kidCard = await openCardFor(kidCookie, template.id)
    await openCardFor(tweenCookie, template.id)
    // The kid punched; the tween never touched theirs.
    await app.inject({
      method: 'POST',
      url: `/api/rewards/punch-cards/${kidCard.id}/punch`,
      headers: { cookie: kidCookie },
    })

    const parentCookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/rewards/punch-templates/${template.id}`,
      headers: { cookie: parentCookie },
      payload: { audience: [KID_ID] },
    })
    expect(res.statusCode).toBe(200)

    const open = await rewardsPrisma.punchCard.findMany({ where: { templateId: template.id } })
    expect(open).toHaveLength(1)
    expect(open[0]).toMatchObject({ profileId: KID_ID, count: 1 })
  })
})

describe('finished history', () => {
  it('rolls completed cards up per template for the chip shelf', async () => {
    const template = await makeTemplate({ goal: 1 })
    const cookie = await getCookieForProfile(KID_ID)
    for (let i = 0; i < 2; i++) {
      const card = await openCardFor(cookie, template.id)
      await app.inject({
        method: 'POST',
        url: `/api/rewards/punch-cards/${card.id}/punch`,
        headers: { cookie },
      })
    }

    const res = await app.inject({
      method: 'GET',
      url: '/api/rewards/punch-cards',
      headers: { cookie },
    })

    expect(res.json().finished).toHaveLength(1)
    expect(res.json().finished[0]).toMatchObject({
      templateId: template.id,
      profileId: KID_ID,
      name: 'Try bites',
      glyph: '🥦',
      count: 2,
    })
    expect(res.json().finished[0].lastFinishedAt).not.toBeNull()
  })
})
