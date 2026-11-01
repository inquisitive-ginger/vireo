import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { PERMISSION_REGISTRY } from '@family-os/platform/server'
import { mealPrisma } from '@family-os/plugin-meals/db'
import { shoppingPrisma } from '@family-os/plugin-shopping/db'

import type { LightMyRequestResponse } from 'fastify'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

// Fixed UUIDs for test profiles — owner_id/created_by are @db.Uuid
const PARENT_ID = '00000000-3ea1-0001-0000-000000000001' // tier 4
const TEEN_ID = '00000000-3ea1-0001-0000-000000000002' // tier 3
const KID_ID = '00000000-3ea1-0001-0000-000000000004' // tier 1
const ALL_IDS = [PARENT_ID, TEEN_ID, KID_ID]

const WEEK = { from: '2026-08-09', to: '2026-08-15' }

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

async function clearMeals() {
  await mealPrisma.plannedMeal.deleteMany({})
}

async function planMeal(cookie: string, payload: Record<string, unknown>) {
  return app.inject({ method: 'POST', url: '/api/meals/plan', headers: { cookie }, payload })
}

beforeAll(async () => {
  app = await buildServer()

  await prisma.profile.upsert({
    where: { id: PARENT_ID },
    update: { name: 'Dad', tier: 4 },
    create: { id: PARENT_ID, name: 'Dad', tier: 4 },
  })
  await prisma.profile.upsert({
    where: { id: TEEN_ID },
    update: { name: 'Teen', tier: 3 },
    create: { id: TEEN_ID, name: 'Teen', tier: 3 },
  })
  await prisma.profile.upsert({
    where: { id: KID_ID },
    update: { name: 'Kid', tier: 1 },
    create: { id: KID_ID, name: 'Kid', tier: 1 },
  })
})

afterAll(async () => {
  await clearMeals()
  await prisma.profile.deleteMany({ where: { id: { in: ALL_IDS } } })
  await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })
  await app.close()
  await prisma.$disconnect()
  await mealPrisma.$disconnect()
})

beforeEach(clearMeals)

// ─── POST /api/meals/plan ─────────────────────────────────────────────────────

describe('POST /api/meals/plan', () => {
  it('creates a planned meal and returns 201 for a tier-4 profile', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await planMeal(cookie, {
      date: '2026-08-13',
      title: 'Rigatoni',
      sides: 'roasted veggies, garlic bread',
      tryBite: 'the veggies',
      ownerId: PARENT_ID,
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.date).toBe('2026-08-13')
    expect(body.title).toBe('Rigatoni')
    expect(body.sides).toBe('roasted veggies, garlic bread')
    expect(body.kind).toBe('cooked')
    expect(body.ownerId).toBe(PARENT_ID)
    expect(body.tryBite).toBe('the veggies')
  })

  it('accepts an unclaimed meal — ownerId null is a first-class state', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await planMeal(cookie, { date: '2026-08-13', title: 'Tacos' })
    expect(res.statusCode).toBe(201)
    expect(res.json().ownerId).toBeNull()
  })

  it('rejects a second dinner on the same day with 409', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await planMeal(cookie, { date: '2026-08-13', title: 'Tacos' })
    const res = await planMeal(cookie, { date: '2026-08-13', title: 'Pizza' })
    expect(res.statusCode).toBe(409)
  })

  it('rejects a missing title with 400', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await planMeal(cookie, { date: '2026-08-13' })
    expect(res.statusCode).toBe(400)
  })

  it('returns 403 for a tier-3 profile — planning is manage-only', async () => {
    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await planMeal(cookie, { date: '2026-08-13', title: 'Tacos' })
    expect(res.statusCode).toBe(403)
  })

  it('stores a recipe link and collapses a blank one to null', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const linked = await planMeal(cookie, {
      date: '2026-08-13',
      title: 'Rigatoni',
      recipeUrl: 'https://www.seriouseats.com/rigatoni-alla-vodka',
    })
    expect(linked.statusCode).toBe(201)
    expect(linked.json().recipeUrl).toBe('https://www.seriouseats.com/rigatoni-alla-vodka')

    const blank = await planMeal(cookie, { date: '2026-08-14', title: 'Tacos', recipeUrl: '  ' })
    expect(blank.statusCode).toBe(201)
    expect(blank.json().recipeUrl).toBeNull()
  })

  // The value lands in an href on every profile's screen, so a non-http(s)
  // scheme is stored XSS — it has to fail at the route, not at render time.
  it.each(['javascript:alert(1)', 'data:text/html,<script>x</script>', 'rigatoni alla vodka'])(
    'rejects %s as a recipe link with 400',
    async (recipeUrl) => {
      const cookie = await getCookieForProfile(PARENT_ID)
      const res = await planMeal(cookie, { date: '2026-08-13', title: 'Rigatoni', recipeUrl })
      expect(res.statusCode).toBe(400)
    }
  )
})

// ─── GET /api/meals/plan ──────────────────────────────────────────────────────

describe('GET /api/meals/plan', () => {
  it('returns the range for a tier-1 profile — everyone reads the plan', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    await planMeal(parentCookie, { date: '2026-08-13', title: 'Rigatoni' })
    await planMeal(parentCookie, { date: '2026-08-20', title: 'Next week' })

    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'GET',
      url: `/api/meals/plan?from=${WEEK.from}&to=${WEEK.to}`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    const { meals } = res.json()
    expect(meals).toHaveLength(1)
    expect(meals[0].title).toBe('Rigatoni')
  })

  it('rejects a missing range with 400', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({ method: 'GET', url: '/api/meals/plan', headers: { cookie } })
    expect(res.statusCode).toBe(400)
  })
})

// ─── PATCH /api/meals/plan/:id ────────────────────────────────────────────────

describe('PATCH /api/meals/plan/:id', () => {
  it('updates the full field set for a tier-4 profile', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = (await planMeal(cookie, { date: '2026-08-13', title: 'Tacos' })).json()

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/meals/plan/${created.id}`,
      headers: { cookie },
      payload: { date: '2026-08-13', title: 'Fish tacos', kind: 'takeout', ownerId: TEEN_ID },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.title).toBe('Fish tacos')
    expect(body.kind).toBe('takeout')
    expect(body.ownerId).toBe(TEEN_ID)
  })

  it('returns 403 for a tier-3 profile — edits stay behind manage', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const created = (await planMeal(parentCookie, { date: '2026-08-13', title: 'Tacos' })).json()

    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/meals/plan/${created.id}`,
      headers: { cookie },
      payload: { date: '2026-08-13', title: 'Renamed' },
    })
    expect(res.statusCode).toBe(403)
  })
})

// ─── POST /api/meals/plan/:id/move ────────────────────────────────────────────

describe('POST /api/meals/plan/:id/move', () => {
  // Far enough out that "past" never catches up with the fixtures.
  const TUE = '2099-06-02'
  const WED = '2099-06-03'
  const THU = '2099-06-04'

  async function move(cookie: string, id: string, date: string) {
    return app.inject({
      method: 'POST',
      url: `/api/meals/plan/${id}/move`,
      headers: { cookie },
      payload: { date },
    })
  }

  async function dateOf(id: string) {
    const row = await mealPrisma.plannedMeal.findUniqueOrThrow({ where: { id } })
    return row.date.toISOString().slice(0, 10)
  }

  it('moves a dinner onto an empty day', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const tacos = (await planMeal(cookie, { date: WED, title: 'Tacos' })).json()

    const res = await move(cookie, tacos.id, THU)
    expect(res.statusCode).toBe(200)
    expect(res.json().meals).toEqual([expect.objectContaining({ id: tacos.id, date: THU })])
    expect(await dateOf(tacos.id)).toBe(THU)
  })

  it('swaps two dinners when the day is taken — and nothing else moves', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const chicken = (await planMeal(cookie, { date: TUE, title: 'Chicken' })).json()
    const tacos = (await planMeal(cookie, { date: WED, title: 'Tacos' })).json()
    const fish = (await planMeal(cookie, { date: THU, title: 'Fish' })).json()

    const events: unknown[] = []
    const off = app.eventBus.on('meals.dinner.planned', (p) => events.push(p))
    const res = await move(cookie, tacos.id, TUE)
    off()

    expect(res.statusCode).toBe(200)
    expect(await dateOf(tacos.id)).toBe(TUE)
    expect(await dateOf(chicken.id)).toBe(WED)
    expect(await dateOf(fish.id)).toBe(THU)
    const slots = await mealPrisma.plannedMeal.findMany({ select: { slot: true } })
    expect(slots.every((s) => s.slot === 'dinner')).toBe(true)
    expect(events).toEqual([
      expect.objectContaining({ mealId: tacos.id, date: TUE }),
      expect.objectContaining({ mealId: chicken.id, date: WED }),
    ])
  })

  it('refuses a past day as the source or the target', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const past = (await planMeal(cookie, { date: '2026-08-13', title: 'Old' })).json()
    const future = (await planMeal(cookie, { date: WED, title: 'Tacos' })).json()

    expect((await move(cookie, past.id, WED)).statusCode).toBe(400)
    expect((await move(cookie, future.id, '2026-08-12')).statusCode).toBe(400)
    expect(await dateOf(past.id)).toBe('2026-08-13')
    expect(await dateOf(future.id)).toBe(WED)
  })

  it('404s on an unknown meal', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await move(cookie, '00000000-0000-0000-0000-000000000000', WED)
    expect(res.statusCode).toBe(404)
  })

  it('400s a body without a date', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const tacos = (await planMeal(cookie, { date: WED, title: 'Tacos' })).json()
    const res = await move(cookie, tacos.id, 'Thursday')
    expect(res.statusCode).toBe(400)
  })

  it('returns 403 for a tier-3 profile — moving stays behind manage', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const tacos = (await planMeal(parentCookie, { date: WED, title: 'Tacos' })).json()

    const cookie = await getCookieForProfile(TEEN_ID)
    expect((await move(cookie, tacos.id, THU)).statusCode).toBe(403)
  })
})

// ─── POST /api/meals/plan/:id/claim ───────────────────────────────────────────

describe('POST /api/meals/plan/:id/claim', () => {
  it('sets the claimer as owner of an unclaimed meal (tier 3+)', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const created = (await planMeal(parentCookie, { date: '2026-08-13', title: 'Tacos' })).json()

    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'POST',
      url: `/api/meals/plan/${created.id}/claim`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().ownerId).toBe(TEEN_ID)
  })

  it('returns 409 when the meal is already claimed', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const created = (
      await planMeal(parentCookie, { date: '2026-08-13', title: 'Tacos', ownerId: PARENT_ID })
    ).json()

    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'POST',
      url: `/api/meals/plan/${created.id}/claim`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(409)
  })

  it('returns 403 for a tier-1 profile — claiming is tier 3+', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const created = (await planMeal(parentCookie, { date: '2026-08-13', title: 'Tacos' })).json()

    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'POST',
      url: `/api/meals/plan/${created.id}/claim`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(403)
  })
})

// ─── DELETE /api/meals/plan/:id ───────────────────────────────────────────────

describe('DELETE /api/meals/plan/:id', () => {
  it('deletes for tier 4 and 404s a second delete', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = (await planMeal(cookie, { date: '2026-08-13', title: 'Tacos' })).json()

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/meals/plan/${created.id}`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(204)

    const again = await app.inject({
      method: 'DELETE',
      url: `/api/meals/plan/${created.id}`,
      headers: { cookie },
    })
    expect(again.statusCode).toBe(404)
  })
})

// ─── POST /api/meals/push-needs — the contract, producer side (ADR 069 §4) ────

describe('POST /api/meals/push-needs', () => {
  async function plannedWithNeeds(cookie: string, needs: string | null) {
    const res = await planMeal(cookie, {
      date: '2026-08-13',
      title: 'Tacos',
      kind: 'cooked',
      ownerId: null,
      needs,
    })
    return res.json().id as string
  }

  function push(cookie: string, body: Record<string, unknown>) {
    return app.inject({
      method: 'POST',
      url: '/api/meals/push-needs',
      headers: { cookie },
      payload: body,
    })
  }

  beforeEach(async () => {
    await shoppingPrisma.item.deleteMany({})
    await shoppingPrisma.entry.deleteMany({})
    await shoppingPrisma.aisleOverride.deleteMany({})
  })

  it('publishes the meal\u2019s needs and reports the consumer\u2019s counts', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const mealId = await plannedWithNeeds(cookie, 'chicken thighs, snap peas')

    const res = await push(cookie, { mealId })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({ filed: 2, alreadyOn: 0, listName: 'Grocery' })
  })

  it('sends the words the note line needs — the producer owes them (ADR 069 §3)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const mealId = await plannedWithNeeds(cookie, 'chicken thighs')

    await push(cookie, { mealId })

    const item = await shoppingPrisma.item.findFirst({ where: { sourceType: 'meal' } })
    // 2026-08-13 is a Thursday.
    expect(item?.sourceLabel).toBe('for Thursday')
  })

  it('reports what actually landed, not what was sent — dedupe makes them differ', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const mealId = await plannedWithNeeds(cookie, 'chicken thighs, snap peas')

    await push(cookie, { mealId })
    const second = await push(cookie, { mealId })

    expect(second.json()).toMatchObject({ filed: 0, alreadyOn: 2 })
  })

  it('lets a tier-1 kid push — pushing IS an add, and adding is tier 1 (ADR 071)', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const mealId = await plannedWithNeeds(parent, 'cereal')

    const res = await push(await getCookieForProfile(KID_ID), { mealId })

    expect(res.statusCode).toBe(200)
  })

  it('refuses on a revoked shopping.item.add, by ability rather than a tier read', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const mealId = await plannedWithNeeds(cookie, 'cereal')
    await prisma.permissionOverride.create({
      data: { profileId: TEEN_ID, action: 'create', subject: 'shopping.Item', type: 'revoke' },
    })

    const res = await push(await getCookieForProfile(TEEN_ID), { mealId })
    await prisma.permissionOverride.deleteMany({ where: { profileId: TEEN_ID } })

    expect(res.statusCode).toBe(403)
    expect(await shoppingPrisma.item.count()).toBe(0)
  })

  it('404s on an unknown meal', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await push(cookie, { mealId: '00000000-0000-4000-8000-000000000000' })
    expect(res.statusCode).toBe(404)
  })

  it('400s on a body that is not a meal id', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await push(cookie, { mealId: 'tacos' })
    expect(res.statusCode).toBe(400)
  })

  it('400s a meal with nothing listed rather than reporting an empty success', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const mealId = await plannedWithNeeds(cookie, null)

    const res = await push(cookie, { mealId })

    expect(res.statusCode).toBe(400)
  })

  it('still reports the filing result when another plugin also subscribes', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const mealId = await plannedWithNeeds(cookie, 'chicken thighs')
    const off = app.eventBus.on('meals.needs.pushed', () => ({ logged: true }))

    const res = await push(cookie, { mealId })
    off()

    expect(res.json()).toMatchObject({ filed: 1, listName: 'Grocery' })
    // NOTE: this proves tolerance, not the pick. Handlers run in registration
    // order and `shopping` registers at boot, so a co-subscriber added here is
    // always second and the route would pass even on a `!= null` match. The
    // case that actually needs the shape check — a co-subscriber registered
    // FIRST — is not reachable through the bus's API, so the guarantee rests on
    // the predicate in `meals.ts` rather than on this test.
  })

  it('never writes a shopping row itself — the rows carry the consumer\u2019s filing', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const mealId = await plannedWithNeeds(cookie, 'chicken thighs')

    await push(cookie, { mealId })

    const item = await shoppingPrisma.item.findFirst()
    expect(item).toMatchObject({ category: 'Meat', sourceType: 'meal', sourceId: mealId })
  })
})

// ─── Permission registry ──────────────────────────────────────────────────────

describe('meals permission registry', () => {
  it('registers the module permissions with their subjects', () => {
    expect(PERMISSION_REGISTRY['meals.plan.view']).toMatchObject({
      module: 'meals',
      action: 'view',
      subject: 'meals.PlannedMeal',
    })
    expect(PERMISSION_REGISTRY['meals.dinner.claim']).toMatchObject({
      module: 'meals',
      action: 'update',
      subject: 'meals.PlannedMeal',
    })
  })
})
