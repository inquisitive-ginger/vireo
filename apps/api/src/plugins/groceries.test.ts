import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { PERMISSION_REGISTRY } from '@family-os/platform/server'
import { mealPrisma } from '@family-os/plugin-meals/db'

import type { LightMyRequestResponse } from 'fastify'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

// Fixed UUIDs for test profiles — added_by/owner_id are @db.Uuid
const PARENT_ID = '00000000-3ea2-0002-0000-000000000001' // tier 4
const TEEN_ID = '00000000-3ea2-0002-0000-000000000002' // tier 3
const KID2_ID = '00000000-3ea2-0002-0000-000000000003' // tier 2
const KID_ID = '00000000-3ea2-0002-0000-000000000004' // tier 1
const ALL_IDS = [PARENT_ID, TEEN_ID, KID2_ID, KID_ID]

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

async function defaultListId(): Promise<string> {
  const list = await mealPrisma.groceryList.findFirstOrThrow({
    where: { kind: 'permanent' },
    orderBy: { sortOrder: 'asc' },
  })
  return list.id
}

async function clearGroceries() {
  await mealPrisma.groceryItem.deleteMany({})
  await mealPrisma.groceryAisleOverride.deleteMany({})
  // Permanent lists are seeded once by the migration and stay put; only
  // runtime lists (created by tests) are torn down between them.
  await mealPrisma.groceryList.deleteMany({ where: { kind: 'runtime' } })
  // Same for the completion dictionary: the migration's starter set is dated
  // 2000-01-01, anything a test taught it carries a real timestamp.
  await mealPrisma.groceryEntry.deleteMany({
    where: { lastAddedAt: { gt: new Date('2001-01-01T00:00:00Z') } },
  })
}

async function clearMeals() {
  await mealPrisma.plannedMeal.deleteMany({})
}

async function addItem(cookie: string, listId: string, payload: Record<string, unknown>) {
  return app.inject({
    method: 'POST',
    url: `/api/groceries/lists/${listId}/items`,
    headers: { cookie },
    payload,
  })
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
    where: { id: KID2_ID },
    update: { name: 'Emma', tier: 2 },
    create: { id: KID2_ID, name: 'Emma', tier: 2 },
  })
  await prisma.profile.upsert({
    where: { id: KID_ID },
    update: { name: 'Kid', tier: 1 },
    create: { id: KID_ID, name: 'Kid', tier: 1 },
  })
})

afterAll(async () => {
  await clearGroceries()
  await clearMeals()
  // A stray notification against one of these ids blocks the profile delete
  // below with a FK violation (notifications_profile_id_fkey) — clear first.
  await prisma.notification.deleteMany({ where: { profileId: { in: ALL_IDS } } })
  await prisma.profile.deleteMany({ where: { id: { in: ALL_IDS } } })
  await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })
  await app.close()
  await prisma.$disconnect()
  await mealPrisma.$disconnect()
})

beforeEach(async () => {
  await clearGroceries()
  await clearMeals()
})

// ─── GET /api/groceries/lists ──────────────────────────────────────────────────

describe('GET /api/groceries/lists', () => {
  it('shows the seeded permanent lists even with no items — dim at zero, never hidden', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/groceries/lists',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    const { lists } = res.json()
    const names = lists.map((l: { name: string }) => l.name)
    expect(names).toEqual(expect.arrayContaining(['Grocery Store', 'Costco']))
    for (const list of lists) {
      expect(list.kind).toBe('permanent')
      expect(list.itemCount).toBe(0)
    }
  })

  it('hides a runtime list until it holds an item, then shows it', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = await app.inject({
      method: 'POST',
      url: '/api/groceries/lists',
      headers: { cookie },
      payload: { name: 'Home Depot' },
    })
    const runtimeId = created.json().id

    const beforeItem = await app.inject({
      method: 'GET',
      url: '/api/groceries/lists',
      headers: { cookie },
    })
    expect(beforeItem.json().lists.map((l: { id: string }) => l.id)).not.toContain(runtimeId)

    await addItem(cookie, runtimeId, { name: 'Lumber' })

    const afterItem = await app.inject({
      method: 'GET',
      url: '/api/groceries/lists',
      headers: { cookie },
    })
    const shown = afterItem.json().lists.find((l: { id: string }) => l.id === runtimeId)
    expect(shown).toBeTruthy()
    expect(shown.itemCount).toBe(1)
  })

  it('a tier-1 profile may view', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/groceries/lists',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
  })
})

// ─── POST /api/groceries/lists ─────────────────────────────────────────────────

describe('POST /api/groceries/lists', () => {
  it('a tier-4 profile creates a runtime list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/lists',
      headers: { cookie },
      payload: { name: 'Trader Joe’s' },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.name).toBe('Trader Joe’s')
    expect(body.kind).toBe('runtime')
    expect(body.itemCount).toBe(0)
  })

  it('rejects a tier-3 profile — creating a list is tier 4 (ADR 067)', async () => {
    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/lists',
      headers: { cookie },
      payload: { name: 'Costco run' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('rejects a missing name with 400', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/lists',
      headers: { cookie },
      payload: {},
    })
    expect(res.statusCode).toBe(400)
  })
})

// ─── GET /api/groceries/lists/:id ──────────────────────────────────────────────

describe('GET /api/groceries/lists/:id', () => {
  it('returns the list and its items, sorted by the fixed aisle walk order', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    await addItem(cookie, listId, { name: 'Rice' }) // Pantry
    await addItem(cookie, listId, { name: 'Chicken thighs' }) // Meat
    await addItem(cookie, listId, { name: 'Apples' }) // Produce

    const res = await app.inject({
      method: 'GET',
      url: `/api/groceries/lists/${listId}`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    const { list, items } = res.json()
    expect(list.id).toBe(listId)
    expect(items.map((i: { category: string }) => i.category)).toEqual([
      'Produce',
      'Meat',
      'Pantry',
    ])
  })

  it('404s an unknown list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/groceries/lists/00000000-0000-0000-0000-000000000099',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(404)
  })
})

// ─── POST /api/groceries/lists/:id/items ───────────────────────────────────────

describe('POST /api/groceries/lists/:id/items', () => {
  it('creates an item on the given list and files it by the dictionary — tier 1 may add', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const listId = await defaultListId()
    const res = await addItem(cookie, listId, { name: 'Milk' })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.name).toBe('Milk')
    expect(body.category).toBe('Dairy')
    expect(body.status).toBe('needed')
    expect(body.sourceType).toBe('manual')
    expect(body.listId).toBe(listId)
  })

  it('files an unknown word into Other', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    const res = await addItem(cookie, listId, { name: 'Flibbertigibbet' })
    expect(res.json().category).toBe('Other')
  })

  it('notes manual attribution as "<name> added these" — computed, unused by the client', async () => {
    const cookie = await getCookieForProfile(KID2_ID)
    const listId = await defaultListId()
    const res = await addItem(cookie, listId, { name: 'Snap peas' })
    expect(res.json().note).toBe('Emma added these')
  })

  it('rejects a missing name with 400', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    const res = await addItem(cookie, listId, {})
    expect(res.statusCode).toBe(400)
  })

  it('404s an unknown list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, '00000000-0000-0000-0000-000000000099', { name: 'Milk' })
    expect(res.statusCode).toBe(404)
  })

  it('an override files ahead of the dictionary', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    await mealPrisma.groceryAisleOverride.create({
      data: { normalizedName: 'milk', category: 'Pantry' },
    })
    const res = await addItem(parentCookie, listId, { name: 'Milk' })
    expect(res.json().category).toBe('Pantry')
  })

  it('hasOverride is true once a per-family override exists for the name', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    await mealPrisma.groceryAisleOverride.create({
      data: { normalizedName: 'milk', category: 'Pantry' },
    })
    expect((await addItem(cookie, listId, { name: 'Milk' })).json().hasOverride).toBe(true)
  })

  it('two different lists keep separate items — a Costco add never lands on Grocery Store', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const groceryStoreId = await defaultListId()
    const costco = await mealPrisma.groceryList.findFirstOrThrow({ where: { name: 'Costco' } })

    await addItem(cookie, groceryStoreId, { name: 'Milk' })
    await addItem(cookie, costco.id, { name: 'Paper towels' })

    const groceryStoreView = await app.inject({
      method: 'GET',
      url: `/api/groceries/lists/${groceryStoreId}`,
      headers: { cookie },
    })
    expect(groceryStoreView.json().items.map((i: { name: string }) => i.name)).toEqual(['Milk'])
  })
})

// ─── POST /api/groceries/:id/aisle ─────────────────────────────────────────────

describe('GET /api/groceries/entries', () => {
  it('ships seeded, so completion guesses on day one', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/groceries/entries',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    const names = res.json().entries.map((e: { name: string }) => e.name)
    expect(names).toContain('Butter')
  })

  it('an add teaches the dictionary, and the newest add leads', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const listId = await defaultListId()
    await addItem(cookie, listId, { name: 'Sriracha' })
    await addItem(cookie, listId, { name: 'Kombucha' })

    const res = await app.inject({
      method: 'GET',
      url: '/api/groceries/entries',
      headers: { cookie },
    })
    const names = res.json().entries.map((e: { name: string }) => e.name)
    expect(names.slice(0, 2)).toEqual(['Kombucha', 'Sriracha'])
  })

  it('one entry per normalized name — re-adding a name does not duplicate it', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const listId = await defaultListId()
    await addItem(cookie, listId, { name: 'Snap peas' })
    await addItem(cookie, listId, { name: 'Snap Peas,' })

    const res = await app.inject({
      method: 'GET',
      url: '/api/groceries/entries',
      headers: { cookie },
    })
    const entries = res.json().entries as { normalizedName: string; name: string }[]
    const matches = entries.filter((e) => e.normalizedName === 'snap peas')
    // The newest spelling wins, so the field stops offering the older one.
    expect(matches).toEqual([{ normalizedName: 'snap peas', name: 'Snap Peas,' }])
  })

  it('survives the list being emptied — history is not a DISTINCT over items', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const listId = await defaultListId()
    await addItem(cookie, listId, { name: 'Kombucha' })
    await mealPrisma.groceryItem.deleteMany({})

    const res = await app.inject({
      method: 'GET',
      url: '/api/groceries/entries',
      headers: { cookie },
    })
    const names = res.json().entries.map((e: { name: string }) => e.name)
    expect(names).toContain('Kombucha')
  })
})

describe('POST /api/groceries/:id/aisle', () => {
  it('re-files the item and teaches an override for the next add', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    const created = (await addItem(cookie, listId, { name: 'Kombucha' })).json()
    expect(created.category).toBe('Other')

    const corrected = await app.inject({
      method: 'POST',
      url: `/api/groceries/${created.id}/aisle`,
      headers: { cookie },
      payload: { category: 'Pantry' },
    })
    expect(corrected.statusCode).toBe(200)
    expect(corrected.json().category).toBe('Pantry')

    const nextAdd = (await addItem(cookie, listId, { name: 'kombucha' })).json()
    expect(nextAdd.category).toBe('Pantry')
    expect(nextAdd.hasOverride).toBe(true)
  })

  it('"Leave it" (category: Other) teaches an override too, retiring the one-time prompt', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    const created = (await addItem(cookie, listId, { name: 'Paper towels' })).json()
    expect(created.category).toBe('Other')
    expect(created.hasOverride).toBe(false)

    const left = await app.inject({
      method: 'POST',
      url: `/api/groceries/${created.id}/aisle`,
      headers: { cookie },
      payload: { category: 'Other' },
    })
    expect(left.statusCode).toBe(200)
    expect(left.json().category).toBe('Other')
    expect(left.json().hasOverride).toBe(true)

    // A fresh fetch of the same item — not just the mutation's own response —
    // still reports hasOverride, which is what actually keeps the prompt gone.
    const list = await app.inject({
      method: 'GET',
      url: `/api/groceries/lists/${listId}`,
      headers: { cookie },
    })
    const refetched = list.json().items.find((i: { id: string }) => i.id === created.id)
    expect(refetched.hasOverride).toBe(true)
  })

  it('rejects a category outside the fixed aisle list with 400', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    const created = (await addItem(cookie, listId, { name: 'Kombucha' })).json()
    const res = await app.inject({
      method: 'POST',
      url: `/api/groceries/${created.id}/aisle`,
      headers: { cookie },
      payload: { category: 'Bogus' },
    })
    expect(res.statusCode).toBe(400)
  })

  it('404s an unknown item', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/00000000-0000-0000-0000-000000000099/aisle',
      headers: { cookie },
      payload: { category: 'Produce' },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 403 for a tier-3 profile — the gate is ability.can(manage), not a tier read (ADR 067)', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    const created = (await addItem(parentCookie, listId, { name: 'Kombucha' })).json()

    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'POST',
      url: `/api/groceries/${created.id}/aisle`,
      headers: { cookie },
      payload: { category: 'Pantry' },
    })
    expect(res.statusCode).toBe(403)
  })
})

// ─── POST /api/groceries/push-needs ────────────────────────────────────────────

describe('POST /api/groceries/:id/check', () => {
  async function anItem(cookie: string, name = 'Milk') {
    const res = await addItem(cookie, await defaultListId(), { name })
    return res.json() as { id: string; status: string }
  }

  it('checks an item off and records who and when', async () => {
    const cookie = await getCookieForProfile(KID2_ID)
    const item = await anItem(cookie)

    const res = await app.inject({
      method: 'POST',
      url: `/api/groceries/${item.id}/check`,
      headers: { cookie },
      payload: { status: 'got' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().status).toBe('got')
    const row = await mealPrisma.groceryItem.findUniqueOrThrow({ where: { id: item.id } })
    expect(row.gotBy).toBe(KID2_ID)
    expect(row.gotAt).not.toBeNull()
  })

  it('unchecks, and clears the attribution — a mis-tap is undoable', async () => {
    const cookie = await getCookieForProfile(KID2_ID)
    const item = await anItem(cookie)
    const check = (status: string) =>
      app.inject({
        method: 'POST',
        url: `/api/groceries/${item.id}/check`,
        headers: { cookie },
        payload: { status },
      })

    await check('got')
    const res = await check('needed')

    expect(res.statusCode).toBe(200)
    expect(res.json().status).toBe('needed')
    const row = await mealPrisma.groceryItem.findUniqueOrThrow({ where: { id: item.id } })
    // Left set, a stale "Sam got it" would outlive the getting — and the
    // push-needs re-add path clears the same two columns.
    expect(row.gotBy).toBeNull()
    expect(row.gotAt).toBeNull()
  })

  it('names the target state, so a repeat is idempotent — two phones, one aisle', async () => {
    const cookie = await getCookieForProfile(KID2_ID)
    const item = await anItem(cookie)
    const check = () =>
      app.inject({
        method: 'POST',
        url: `/api/groceries/${item.id}/check`,
        headers: { cookie },
        payload: { status: 'got' },
      })

    await check()
    const res = await check()
    expect(res.json().status).toBe('got')
  })

  it('returns 403 for a tier-1 profile — adding is theirs, checking is not', async () => {
    const adder = await getCookieForProfile(KID2_ID)
    const item = await anItem(adder)
    const kid = await getCookieForProfile(KID_ID)

    const res = await app.inject({
      method: 'POST',
      url: `/api/groceries/${item.id}/check`,
      headers: { cookie: kid },
      payload: { status: 'got' },
    })

    expect(res.statusCode).toBe(403)
  })

  it('rejects a status outside the two with 400', async () => {
    const cookie = await getCookieForProfile(KID2_ID)
    const item = await anItem(cookie)

    const res = await app.inject({
      method: 'POST',
      url: `/api/groceries/${item.id}/check`,
      headers: { cookie },
      payload: { status: 'bagged' },
    })

    expect(res.statusCode).toBe(400)
  })

  it('404s an unknown item', async () => {
    const cookie = await getCookieForProfile(KID2_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/00000000-0000-0000-0000-0000000000ff/check',
      headers: { cookie },
      payload: { status: 'got' },
    })
    expect(res.statusCode).toBe(404)
  })

  it('a checked item holds its position in the aisle walk order', async () => {
    const cookie = await getCookieForProfile(KID2_ID)
    const listId = await defaultListId()
    await addItem(cookie, listId, { name: 'Bananas' })
    const milk = (await addItem(cookie, listId, { name: 'Milk' })).json() as { id: string }
    await addItem(cookie, listId, { name: 'Rice' })

    await app.inject({
      method: 'POST',
      url: `/api/groceries/${milk.id}/check`,
      headers: { cookie },
      payload: { status: 'got' },
    })

    const res = await app.inject({
      method: 'GET',
      url: `/api/groceries/lists/${listId}`,
      headers: { cookie },
    })
    const names = res.json().items.map((i: { name: string }) => i.name)
    // Produce → Dairy → Pantry, unchanged by the check: no bottom group.
    expect(names).toEqual(['Bananas', 'Milk', 'Rice'])
  })
})

describe('POST /api/groceries/push-needs', () => {
  async function planMealWithNeeds(cookie: string, needs: string) {
    return (
      await app.inject({
        method: 'POST',
        url: '/api/meals/plan',
        headers: { cookie },
        payload: { date: '2026-08-13', title: 'Rigatoni', needs },
      })
    ).json()
  }

  it('comma-splits needs into plain items on the default list — no note-line provenance', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const meal = await planMealWithNeeds(cookie, 'chicken thighs, broccoli')
    const listId = await defaultListId()

    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/push-needs',
      headers: { cookie },
      payload: { mealId: meal.id },
    })
    expect(res.statusCode).toBe(200)
    const { items, listId: returnedListId } = res.json()
    expect(returnedListId).toBe(listId)
    expect(items).toHaveLength(2)
    const names = items.map((i: { name: string }) => i.name).sort()
    expect(names).toEqual(['broccoli', 'chicken thighs'])
    for (const item of items) {
      expect(item.sourceType).toBe('meal')
      expect(item.listId).toBe(listId)
    }
  })

  it('dedupes by normalized name against an open item on the same list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    await addItem(cookie, listId, { name: 'Broccoli' })
    const meal = await planMealWithNeeds(cookie, 'broccoli')

    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/push-needs',
      headers: { cookie },
      payload: { mealId: meal.id },
    })
    expect(res.json().items).toHaveLength(0)

    const all = await mealPrisma.groceryItem.findMany()
    expect(all).toHaveLength(1) // no duplicate created
  })

  it('does not dedupe against the same name on a DIFFERENT list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const costco = await mealPrisma.groceryList.findFirstOrThrow({ where: { name: 'Costco' } })
    await addItem(cookie, costco.id, { name: 'Broccoli' })
    const meal = await planMealWithNeeds(cookie, 'broccoli')

    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/push-needs',
      headers: { cookie },
      payload: { mealId: meal.id },
    })
    // The Costco broccoli doesn't block the default-list push — it's a
    // different trip.
    expect(res.json().items).toHaveLength(1)
  })

  it('dedupes a repeated name WITHIN the same push, not just against pre-existing items', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const meal = await planMealWithNeeds(cookie, 'milk, eggs, milk')

    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/push-needs',
      headers: { cookie },
      payload: { mealId: meal.id },
    })
    expect(res.json().items).toHaveLength(2)

    const all = await mealPrisma.groceryItem.findMany()
    expect(all).toHaveLength(2)
  })

  it('re-adding an existing checked item unchecks it', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await defaultListId()
    const created = (await addItem(cookie, listId, { name: 'Broccoli' })).json()
    await mealPrisma.groceryItem.update({
      where: { id: created.id },
      data: { status: 'got', gotBy: PARENT_ID, gotAt: new Date() },
    })

    const meal = await planMealWithNeeds(cookie, 'broccoli')
    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/push-needs',
      headers: { cookie },
      payload: { mealId: meal.id },
    })
    const { items } = res.json()
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe(created.id)
    expect(items[0].status).toBe('needed')
  })

  it('404s an unknown meal', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/push-needs',
      headers: { cookie },
      payload: { mealId: '00000000-0000-0000-0000-000000000099' },
    })
    expect(res.statusCode).toBe(404)
  })
})

// ─── Permission registry ───────────────────────────────────────────────────────

describe('groceries permission registry', () => {
  it('registers the module permissions with their subjects', () => {
    expect(PERMISSION_REGISTRY['meals.grocery.view']).toMatchObject({
      module: 'meals',
      action: 'view',
      subject: 'meals.GroceryItem',
    })
    expect(PERMISSION_REGISTRY['meals.grocery.add']).toMatchObject({
      module: 'meals',
      action: 'create',
      subject: 'meals.GroceryItem',
    })
    expect(PERMISSION_REGISTRY['meals.grocery.check']).toMatchObject({
      module: 'meals',
      action: 'check',
      subject: 'meals.GroceryItem',
    })
    expect(PERMISSION_REGISTRY['meals.grocery-list.create']).toMatchObject({
      module: 'meals',
      action: 'create',
      subject: 'meals.GroceryList',
    })
  })
})
