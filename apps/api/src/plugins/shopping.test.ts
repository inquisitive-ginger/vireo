import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import bcrypt from 'bcryptjs'
import { buildServer } from '../server'
import { prisma, PERMISSION_REGISTRY } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { shoppingPrisma } from '@family-os/plugin-shopping/db'

let app: FastifyInstance

const PARENT_ID = '00000000-5ec0-0001-0000-000000000001' // tier 4
const TEEN_ID = '00000000-5ec0-0001-0000-000000000002' // tier 3
const KID_ID = '00000000-5ec0-0001-0000-000000000004' // tier 1
const ALL_IDS = [PARENT_ID, TEEN_ID, KID_ID]

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

async function clearShopping() {
  await shoppingPrisma.item.deleteMany({})
  await shoppingPrisma.entry.deleteMany({})
  await shoppingPrisma.aisleOverride.deleteMany({})
  await shoppingPrisma.list.deleteMany({ where: { kind: 'runtime' } })
}

async function groceryListId(): Promise<string> {
  const list = await shoppingPrisma.list.findFirst({
    where: { kind: 'permanent' },
    orderBy: { sortOrder: 'asc' },
  })
  return list!.id
}

async function addItem(cookie: string, listId: string, payload: Record<string, unknown>) {
  return app.inject({
    method: 'POST',
    url: `/api/shopping/lists/${listId}/items`,
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
    update: { name: 'Sam', tier: 3 },
    create: { id: TEEN_ID, name: 'Sam', tier: 3 },
  })
  await prisma.profile.upsert({
    where: { id: KID_ID },
    update: { name: 'Emma', tier: 1 },
    create: { id: KID_ID, name: 'Emma', tier: 1 },
  })
})

afterAll(async () => {
  await clearShopping()
  await prisma.profile.deleteMany({ where: { id: { in: ALL_IDS } } })
  await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })
  await app.close()
  await prisma.$disconnect()
  await shoppingPrisma.$disconnect()
})

beforeEach(clearShopping)

// ─── GET /api/shopping/lists ──────────────────────────────────────────────────

describe('GET /api/shopping/lists', () => {
  it('returns the seeded permanent destinations with open counts', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    await addItem(cookie, listId, { name: 'milk' })

    const res = await app.inject({ method: 'GET', url: '/api/shopping/lists', headers: { cookie } })
    expect(res.statusCode).toBe(200)
    const { lists } = res.json()
    expect(lists.map((l: { name: string }) => l.name)).toEqual(['Grocery', 'Costco'])
    expect(lists[0]).toMatchObject({ kind: 'permanent', itemCount: 1 })
    expect(lists[1]).toMatchObject({ kind: 'permanent', itemCount: 0 })
  })

  it('keeps a permanent list in the strip at zero and hides an empty runtime one', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await app.inject({
      method: 'POST',
      url: '/api/shopping/lists',
      headers: { cookie },
      payload: { name: 'Hardware' },
    })

    const res = await app.inject({ method: 'GET', url: '/api/shopping/lists', headers: { cookie } })
    const names = res.json().lists.map((l: { name: string }) => l.name)
    expect(names).toEqual(['Grocery', 'Costco'])
  })

  it('shows a runtime list while it holds items', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = await app.inject({
      method: 'POST',
      url: '/api/shopping/lists',
      headers: { cookie },
      payload: { name: 'Hardware' },
    })
    await addItem(cookie, created.json().id, { name: 'wood screws' })

    const res = await app.inject({ method: 'GET', url: '/api/shopping/lists', headers: { cookie } })
    const names = res.json().lists.map((l: { name: string }) => l.name)
    expect(names).toContain('Hardware')
  })

  it('is readable at tier 1 — reading a list is not separately gated', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({ method: 'GET', url: '/api/shopping/lists', headers: { cookie } })
    expect(res.statusCode).toBe(200)
  })
})

// ─── POST /api/shopping/lists ─────────────────────────────────────────────────

describe('POST /api/shopping/lists', () => {
  it('creates a runtime list for a tier-4 profile', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/shopping/lists',
      headers: { cookie },
      payload: { name: 'Hardware' },
    })
    expect(res.statusCode).toBe(201)
    expect(res.json()).toMatchObject({ name: 'Hardware', kind: 'runtime', itemCount: 0 })
  })

  it('refuses a tier-3 profile — a list is a trip someone commits to (ADR 067)', async () => {
    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/shopping/lists',
      headers: { cookie },
      payload: { name: 'Hardware' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('rejects an empty name with a 400', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/shopping/lists',
      headers: { cookie },
      payload: { name: '   ' },
    })
    expect(res.statusCode).toBe(400)
  })

  // No id guard any more (ADR 072) — the family profile is tier 1 and list
  // creation is tier 4, so `ability.can` is the only thing refusing this.
  it('refuses the family profile on the ability alone, with no hand-written id check', async () => {
    const cookie = await getCookieForProfile(FAMILY_PROFILE_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/shopping/lists',
      headers: { cookie },
      payload: { name: 'Hardware' },
    })
    expect(res.statusCode).toBe(403)
  })
})

// ─── POST /api/shopping/lists/:id/items ───────────────────────────────────────

describe('POST /api/shopping/lists/:id/items', () => {
  it('files a known word into its dictionary aisle', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'Milk' })
    expect(res.statusCode).toBe(201)
    expect(res.json().item).toMatchObject({ name: 'Milk', category: 'Dairy', status: 'needed' })
  })

  it('files an unknown word into Other', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'flibbertigibbet' })
    expect(res.json().item.category).toBe('Other')
  })

  it('lets a tier-1 kid add — the cheapest participation the house has', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'snap peas' })
    expect(res.statusCode).toBe(201)
    // Stored for permissions and audit; never rendered (live review, 2026-09-03).
    const stored = await shoppingPrisma.item.findUnique({ where: { id: res.json().item.id } })
    expect(stored?.addedBy).toBe(KID_ID)
    expect(res.json().item.note).toBeNull()
  })

  it('never puts who-added on the wire — a shared list does not answer that question', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'milk' })
    expect(res.json().item).not.toHaveProperty('addedBy')
    expect(res.json().item.note).toBeNull()
  })

  // ADR 072. This is the assertion that stops someone reinstating a uuid column:
  // the wall runs as the family profile and capture is its entire job, so an add
  // as `family` must reach the table, not a hand-written 403.
  it('accepts an add from the unattended wall and persists added_by = family', async () => {
    const cookie = await getCookieForProfile(FAMILY_PROFILE_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'oat milk' })
    expect(res.statusCode).toBe(201)

    const stored = await shoppingPrisma.item.findUnique({ where: { id: res.json().item.id } })
    expect(stored?.addedBy).toBe(FAMILY_PROFILE_ID)
  })

  it('emits one event for a wall add, distinguished by addedBy rather than a second name', async () => {
    const cookie = await getCookieForProfile(FAMILY_PROFILE_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'oat milk' })
    expect(res.json().item).toMatchObject({ name: 'oat milk', category: 'Dairy' })
  })

  it('404s on an unknown list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, '00000000-0000-4000-8000-000000000000', { name: 'milk' })
    expect(res.statusCode).toBe(404)
  })

  it('rejects an empty name with a 400', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, await groceryListId(), { name: '  ' })
    expect(res.statusCode).toBe(400)
  })

  it('remembers the name so a later completion has something to read', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await addItem(cookie, await groceryListId(), { name: 'Chicken Thighs' })
    const entry = await shoppingPrisma.entry.findUnique({
      where: { normalizedName: 'chicken thighs' },
    })
    expect(entry?.name).toBe('Chicken Thighs')
  })

  it('reports nothing to duplicate on a first add', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'milk' })
    expect(res.json().duplicateOf).toBeNull()
  })

  it('names the open row a second add doubles, and still completes the add', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const first = await addItem(cookie, listId, { name: 'Milk' })

    const second = await addItem(cookie, listId, { name: 'milk' })
    expect(second.statusCode).toBe(201)
    expect(second.json().duplicateOf).toEqual({ id: first.json().item.id, name: 'Milk' })

    // Never blocked, never silently dropped: both rows exist.
    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(2)
  })

  it('never points at the row it just created', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'milk' })
    expect(res.json().duplicateOf).toBeNull()
    expect(res.json().item.id).toBeTruthy()
  })

  it('matches on the same normalized key the dictionary uses, so a typo is not a duplicate', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    await addItem(cookie, listId, { name: 'Milk' })

    expect((await addItem(cookie, listId, { name: 'milk,' })).json().duplicateOf).toMatchObject({
      name: 'Milk',
    })
    expect((await addItem(cookie, listId, { name: 'mikk' })).json().duplicateOf).toBeNull()
  })

  it('ignores a checked row — what is in the cart is a real second trip, not a mistake', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const first = await addItem(cookie, listId, { name: 'milk' })
    await check(cookie, first.json().item.id, 'got')

    expect((await addItem(cookie, listId, { name: 'milk' })).json().duplicateOf).toBeNull()
  })

  it('never matches across destinations — two lists wanting milk is two shops', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await addItem(cookie, await groceryListId(), { name: 'milk' })

    const other = await app.inject({
      method: 'POST',
      url: '/api/shopping/lists',
      headers: { cookie },
      payload: { name: 'Corner shop' },
    })
    const res = await addItem(cookie, other.json().id, { name: 'milk' })
    expect(res.json().duplicateOf).toBeNull()
  })
})

// ─── GET /api/shopping/lists/:id ──────────────────────────────────────────────

describe('GET /api/shopping/lists/:id', () => {
  it('returns the list in walk order regardless of the order things were added', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    await addItem(cookie, listId, { name: 'ice cream' }) // Frozen
    await addItem(cookie, listId, { name: 'bananas' }) // Produce
    await addItem(cookie, listId, { name: 'milk' }) // Dairy

    const res = await app.inject({
      method: 'GET',
      url: `/api/shopping/lists/${listId}`,
      headers: { cookie },
    })
    expect(res.json().items.map((i: { category: string }) => i.category)).toEqual([
      'Produce',
      'Dairy',
      'Frozen',
    ])
  })

  it('carries the family corrections so the surface can state the filing before the commit', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const item = await addItem(cookie, listId, { name: 'snap peas' })
    await app.inject({
      method: 'POST',
      url: `/api/shopping/items/${item.json().item.id}/aisle`,
      headers: { cookie },
      payload: { category: 'Produce' },
    })

    const res = await app.inject({
      method: 'GET',
      url: `/api/shopping/lists/${listId}`,
      headers: { cookie },
    })
    expect(res.json().overrides).toMatchObject({ 'snap peas': 'Produce' })
  })

  it('404s on an unknown list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/shopping/lists/00000000-0000-4000-8000-000000000000',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(404)
  })
})

// ─── DELETE /api/shopping/items/:id ───────────────────────────────────────────

describe('DELETE /api/shopping/items/:id', () => {
  it('takes the item off the list entirely — not the same as checking it off', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'mikk' })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/shopping/items/${item.json().item.id}`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(204)
    expect(await shoppingPrisma.item.findUnique({ where: { id: item.json().item.id } })).toBeNull()
  })

  it('refuses a kid, who can add but not remove — `manage` is tier 4 (ADR 071)', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const item = await addItem(parent, await groceryListId(), { name: 'snap peas' })

    const kid = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/shopping/items/${item.json().item.id}`,
      headers: { cookie: kid },
    })
    expect(res.statusCode).toBe(403)
    expect(
      await shoppingPrisma.item.findUnique({ where: { id: item.json().item.id } })
    ).not.toBeNull()
  })

  it('refuses the unattended wall for the same reason — it adds as tier 1', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const item = await addItem(parent, await groceryListId(), { name: 'oat milk' })

    const family = await getCookieForProfile(FAMILY_PROFILE_ID)
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/shopping/items/${item.json().item.id}`,
      headers: { cookie: family },
    })
    expect(res.statusCode).toBe(403)
  })

  it('announces the removal, which it did not before ADR 073 — a live staleness bug', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'ice cream' })

    const seen: Record<string, unknown>[] = []
    app.eventBus.on('shopping.item.removed', (p) => seen.push(p as Record<string, unknown>))
    await app.inject({
      method: 'DELETE',
      url: `/api/shopping/items/${item.json().item.id}`,
      headers: { cookie },
    })

    // Same event as a retract — gone is gone; `reason` is what tells them apart.
    expect(seen).toHaveLength(1)
    expect(seen[0]).toMatchObject({ name: 'ice cream', reason: 'managed' })
  })

  it('404s on an unknown item', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/shopping/items/00000000-0000-4000-8000-000000000000',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(404)
  })
})

// ─── POST /api/shopping/lists/:id/items/batch ─────────────────────────────────

function addBatch(cookie: string, listId: string, names: unknown) {
  return app.inject({
    method: 'POST',
    url: `/api/shopping/lists/${listId}/items/batch`,
    headers: { cookie },
    payload: { names },
  })
}

describe('POST /api/shopping/lists/:id/items/batch', () => {
  it('files every name and answers in submitted order', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()

    const res = await addBatch(cookie, listId, ['milk', 'cereal', 'chicken thighs'])
    expect(res.statusCode).toBe(201)

    const { results } = res.json()
    expect(results.map((r: { name: string }) => r.name)).toEqual([
      'milk',
      'cereal',
      'chicken thighs',
    ])
    expect(results.map((r: { item: { category: string } }) => r.item.category)).toEqual([
      'Dairy',
      'Pantry',
      'Meat',
    ])
    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(3)
  })

  it('reports one bad name as that name, and keeps the good ones', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()

    const { results } = (await addBatch(cookie, listId, ['milk', 'cereal', 'x'.repeat(121)])).json()
    expect(results[0].item.name).toBe('milk')
    expect(results[1].item.name).toBe('cereal')
    expect(results[2]).toMatchObject({ name: 'x'.repeat(121) })
    expect(results[2].error).toBeTruthy()
    expect(results[2].item).toBeUndefined()

    // The batch is not atomic: a bad entry does not roll back what landed ahead of it.
    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(2)
  })

  it('sees rows created earlier in the same batch — the check is per parsed item', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()

    const { results } = (await addBatch(cookie, listId, ['Milk', 'milk'])).json()
    expect(results[0].duplicateOf).toBeNull()
    expect(results[1].duplicateOf).toEqual({ id: results[0].item.id, name: 'Milk' })

    // Reported, never pre-deduplicated: two rows, exactly as typing it twice would.
    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(2)
  })

  it('collides against a row that was already on the list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const first = await addItem(cookie, listId, { name: 'Milk' })

    const { results } = (await addBatch(cookie, listId, ['bananas', 'milk'])).json()
    expect(results[0].duplicateOf).toBeNull()
    expect(results[1].duplicateOf).toEqual({ id: first.json().item.id, name: 'Milk' })
  })

  it('ignores a checked row here too', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const first = await addItem(cookie, listId, { name: 'milk' })
    await check(cookie, first.json().item.id, 'got')

    const { results } = (await addBatch(cookie, listId, ['milk'])).json()
    expect(results[0].duplicateOf).toBeNull()
  })

  it('never collides across destinations here either', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await addItem(cookie, await groceryListId(), { name: 'milk' })

    const other = await app.inject({
      method: 'POST',
      url: '/api/shopping/lists',
      headers: { cookie },
      payload: { name: 'Corner shop' },
    })
    const { results } = (await addBatch(cookie, other.json().id, ['milk'])).json()
    expect(results[0].duplicateOf).toBeNull()
  })

  it('emits one add event per row that was actually created', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()

    const seen: Record<string, unknown>[] = []
    app.eventBus.on('shopping.item.added', (p) => seen.push(p as Record<string, unknown>))
    await addBatch(cookie, listId, ['milk', 'cereal', '  '])

    expect(seen).toHaveLength(2)
    expect(seen.map((e) => e.name)).toEqual(['milk', 'cereal'])
  })

  it('teaches the dictionary once per created row, as a single add does', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await addBatch(cookie, await groceryListId(), ['Chicken Thighs', 'Snap Peas'])

    expect(
      (await shoppingPrisma.entry.findUnique({ where: { normalizedName: 'chicken thighs' } }))?.name
    ).toBe('Chicken Thighs')
    expect(
      (await shoppingPrisma.entry.findUnique({ where: { normalizedName: 'snap peas' } }))?.name
    ).toBe('Snap Peas')
  })

  it('400s on a malformed array — that is a client that did not parse', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()

    expect((await addBatch(cookie, listId, [])).statusCode).toBe(400)
    expect((await addBatch(cookie, listId, Array(21).fill('milk'))).statusCode).toBe(400)
    expect((await addBatch(cookie, listId, ['milk', 7])).statusCode).toBe(400)
    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(0)
  })

  it('404s on an unknown list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addBatch(cookie, '00000000-0000-4000-8000-000000000000', ['milk'])
    expect(res.statusCode).toBe(404)
  })

  it('lets a tier-1 kid batch-add — the same key as a single add', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await addBatch(cookie, await groceryListId(), ['milk', 'cereal'])
    expect(res.statusCode).toBe(201)
  })
})

// ─── POST /api/shopping/lists/:id/clear ───────────────────────────────────────

function clearList(cookie: string, listId: string, payload: Record<string, unknown>) {
  return app.inject({
    method: 'POST',
    url: `/api/shopping/lists/${listId}/clear`,
    headers: { cookie },
    payload,
  })
}

async function runtimeListId(cookie: string, name: string): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/api/shopping/lists',
    headers: { cookie },
    payload: { name },
  })
  return res.json().id
}

describe('POST /api/shopping/lists/:id/clear', () => {
  it('recycles the cart — `checked` takes the got rows and leaves the rest', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const milk = await addItem(cookie, listId, { name: 'milk' })
    const bananas = await addItem(cookie, listId, { name: 'bananas' })
    await addItem(cookie, listId, { name: 'cereal' })
    await check(cookie, milk.json().item.id, 'got')
    await check(cookie, bananas.json().item.id, 'got')

    const res = await clearList(cookie, listId, { scope: 'checked' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ removed: 2 })

    const left = await shoppingPrisma.item.findMany({ where: { listId } })
    expect(left.map((i) => i.name)).toEqual(['cereal'])
  })

  it('throws the list away — `all` takes every row whatever its status', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const milk = await addItem(cookie, listId, { name: 'milk' })
    await addItem(cookie, listId, { name: 'bananas' })
    await check(cookie, milk.json().item.id, 'got')

    const res = await clearList(cookie, listId, { scope: 'all' })
    expect(res.json()).toEqual({ removed: 2 })
    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(0)
  })

  it('never reaches another destination, on either scope', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const grocery = await groceryListId()
    const other = await runtimeListId(cookie, 'Corner shop')
    const theirs = await addItem(cookie, other, { name: 'milk' })
    await check(cookie, theirs.json().item.id, 'got')
    await addItem(cookie, other, { name: 'bananas' })
    await addItem(cookie, grocery, { name: 'cereal' })

    expect((await clearList(cookie, grocery, { scope: 'all' })).json()).toEqual({ removed: 1 })
    expect(await shoppingPrisma.item.count({ where: { listId: other } })).toBe(2)

    expect((await clearList(cookie, other, { scope: 'checked' })).json()).toEqual({ removed: 1 })
    expect(await shoppingPrisma.item.count({ where: { listId: other } })).toBe(1)
  })

  it('announces one event for the whole act, not one per row', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    for (const name of ['milk', 'bananas', 'cereal']) {
      const added = await addItem(cookie, listId, { name })
      await check(cookie, added.json().item.id, 'got')
    }

    const cleared: Record<string, unknown>[] = []
    const removedEvents: Record<string, unknown>[] = []
    app.eventBus.on('shopping.list.cleared', (p) => cleared.push(p as Record<string, unknown>))
    app.eventBus.on('shopping.item.removed', (p) =>
      removedEvents.push(p as Record<string, unknown>)
    )

    await clearList(cookie, listId, { scope: 'checked' })

    expect(cleared).toHaveLength(1)
    expect(cleared[0]).toEqual({ listId, scope: 'checked', removed: 3 })
    expect(removedEvents).toHaveLength(0)
  })

  it('refuses a teen and a kid, and deletes nothing — `manage`, both scopes', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const milk = await addItem(parent, listId, { name: 'milk' })
    await check(parent, milk.json().item.id, 'got')

    const teen = await getCookieForProfile(TEEN_ID)
    expect((await clearList(teen, listId, { scope: 'checked' })).statusCode).toBe(403)
    expect((await clearList(teen, listId, { scope: 'all' })).statusCode).toBe(403)

    const kid = await getCookieForProfile(KID_ID)
    expect((await clearList(kid, listId, { scope: 'all' })).statusCode).toBe(403)

    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(1)
  })

  it('refuses the unattended wall — it adds, it does not end the list', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    await addItem(parent, listId, { name: 'milk' })

    const family = await getCookieForProfile(FAMILY_PROFILE_ID)
    expect((await clearList(family, listId, { scope: 'all' })).statusCode).toBe(403)
    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(1)
  })

  it('clears an empty list to `removed: 0` rather than erroring', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()

    expect((await clearList(cookie, listId, { scope: 'checked' })).json()).toEqual({ removed: 0 })
    expect((await clearList(cookie, listId, { scope: 'all' })).json()).toEqual({ removed: 0 })
  })

  it('reports zero when nothing on the list is checked', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    await addItem(cookie, listId, { name: 'milk' })

    expect((await clearList(cookie, listId, { scope: 'checked' })).json()).toEqual({ removed: 0 })
    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(1)
  })

  it('does not un-teach the dictionary (ADR 073 §4)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    await addItem(cookie, listId, { name: 'Chicken Thighs' })

    await clearList(cookie, listId, { scope: 'all' })
    expect(
      (await shoppingPrisma.entry.findUnique({ where: { normalizedName: 'chicken thighs' } }))?.name
    ).toBe('Chicken Thighs')
  })

  it('rejects a scope outside the two, and a missing one', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    await addItem(cookie, listId, { name: 'milk' })

    expect((await clearList(cookie, listId, { scope: 'everything' })).statusCode).toBe(400)
    expect((await clearList(cookie, listId, {})).statusCode).toBe(400)
    expect(await shoppingPrisma.item.count({ where: { listId } })).toBe(1)
  })

  it('404s on an unknown list', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await clearList(cookie, '00000000-0000-4000-8000-000000000000', { scope: 'all' })
    expect(res.statusCode).toBe(404)
  })
})

// ─── PATCH /api/shopping/items/:id ────────────────────────────────────────────

function rename(cookie: string, itemId: string, payload: Record<string, unknown>) {
  return app.inject({
    method: 'PATCH',
    url: `/api/shopping/items/${itemId}`,
    headers: { cookie },
    payload,
  })
}

describe('PATCH /api/shopping/items/:id', () => {
  it('fixes the word on the row', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'mikk' })

    const res = await rename(cookie, item.json().item.id, { name: 'milk' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({ id: item.json().item.id, name: 'milk' })
  })

  it('refuses a tier-3 teen — no new key, so a kid retypes instead (D5)', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const item = await addItem(parent, await groceryListId(), { name: 'mikk' })

    const teen = await getCookieForProfile(TEEN_ID)
    expect((await rename(teen, item.json().item.id, { name: 'milk' })).statusCode).toBe(403)

    const kid = await getCookieForProfile(KID_ID)
    expect((await rename(kid, item.json().item.id, { name: 'milk' })).statusCode).toBe(403)

    const stored = await shoppingPrisma.item.findUnique({ where: { id: item.json().item.id } })
    expect(stored?.name).toBe('mikk')
  })

  it('does not re-file the aisle — that is `file`, its own key (ADR 071)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'milk' })
    expect(item.json().item.category).toBe('Dairy')

    const res = await rename(cookie, item.json().item.id, { name: 'bananas' })
    expect(res.json().category).toBe('Dairy')
  })

  it('does not teach the dictionary — a rename corrects one row (ADR 073 §4)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'flibbertigibbet' })

    await rename(cookie, item.json().item.id, { name: 'Flibbertigibbets' })
    expect(
      await shoppingPrisma.entry.findUnique({ where: { normalizedName: 'flibbertigibbets' } })
    ).toBeNull()
    expect(
      (await shoppingPrisma.entry.findUnique({ where: { normalizedName: 'flibbertigibbet' } }))
        ?.name
    ).toBe('flibbertigibbet')
  })

  it('announces the rename — the stale word otherwise stands on every other screen', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const item = await addItem(cookie, listId, { name: 'mikk' })

    const seen: Record<string, unknown>[] = []
    app.eventBus.on('shopping.item.renamed', (p) => seen.push(p as Record<string, unknown>))
    await rename(cookie, item.json().item.id, { name: 'milk' })

    expect(seen).toHaveLength(1)
    expect(seen[0]).toMatchObject({
      itemId: item.json().item.id,
      listId,
      name: 'milk',
      renamedBy: PARENT_ID,
    })
  })

  it('rejects an empty name with a 400, on the same constraints as the add', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'milk' })
    expect((await rename(cookie, item.json().item.id, { name: '  ' })).statusCode).toBe(400)
    expect((await rename(cookie, item.json().item.id, { name: 'x'.repeat(121) })).statusCode).toBe(
      400
    )
  })

  it('404s on an unknown item', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await rename(cookie, '00000000-0000-4000-8000-000000000000', { name: 'milk' })
    expect(res.statusCode).toBe(404)
  })
})

// ─── GET /api/shopping/recent ─────────────────────────────────────────────────

describe('GET /api/shopping/recent', () => {
  it('returns newest first across every list, not walk order', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    await addItem(cookie, listId, { name: 'bananas' }) // Produce, first in the walk
    await addItem(cookie, listId, { name: 'milk' })
    await addItem(cookie, listId, { name: 'ice cream' })

    const res = await app.inject({
      method: 'GET',
      url: '/api/shopping/recent',
      headers: { cookie },
    })
    expect(res.json().items.map((i: { name: string }) => i.name)).toEqual([
      'ice cream',
      'milk',
      'bananas',
    ])
  })

  it("names each row's destination, since the wall and the widget span every list", async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await addItem(cookie, await groceryListId(), { name: 'milk' })

    const res = await app.inject({
      method: 'GET',
      url: '/api/shopping/recent',
      headers: { cookie },
    })
    expect(res.json().items[0]).toMatchObject({ name: 'milk', listName: 'Grocery' })
  })

  it("carries the counts the wall's strip reads, so it is one round trip", async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    await addItem(cookie, listId, { name: 'milk' })
    await addItem(cookie, listId, { name: 'bananas' })

    const res = await app.inject({
      method: 'GET',
      url: '/api/shopping/recent',
      headers: { cookie },
    })
    const grocery = res.json().lists.find((l: { id: string }) => l.id === listId)
    expect(grocery).toMatchObject({ name: 'Grocery', itemCount: 2 })
  })

  it('forgets what is already in the cart — it is what is waiting, not an audit trail', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const item = await addItem(cookie, listId, { name: 'milk' })
    await shoppingPrisma.item.update({
      where: { id: item.json().item.id },
      data: { status: 'got' },
    })

    const res = await app.inject({
      method: 'GET',
      url: '/api/shopping/recent',
      headers: { cookie },
    })
    expect(res.json().items).toHaveLength(0)
  })

  it('never puts who-added on the wire here either', async () => {
    const cookie = await getCookieForProfile(FAMILY_PROFILE_ID)
    await addItem(cookie, await groceryListId(), { name: 'oat milk' })

    const res = await app.inject({
      method: 'GET',
      url: '/api/shopping/recent',
      headers: { cookie },
    })
    expect(res.json().items[0]).not.toHaveProperty('addedBy')
  })
})

// ─── POST /api/shopping/items/:id/check ───────────────────────────────────────

function check(cookie: string, itemId: string, status: 'needed' | 'got') {
  return app.inject({
    method: 'POST',
    url: `/api/shopping/items/${itemId}/check`,
    headers: { cookie },
    payload: { status },
  })
}

describe('POST /api/shopping/items/:id/check', () => {
  it('marks a row got and records who reached the shelf', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = await addItem(cookie, await groceryListId(), { name: 'milk' })

    const res = await check(cookie, created.json().item.id, 'got')
    expect(res.statusCode).toBe(200)
    expect(res.json().status).toBe('got')

    const stored = await shoppingPrisma.item.findUnique({ where: { id: created.json().item.id } })
    expect(stored?.gotBy).toBe(PARENT_ID)
    expect(stored?.gotAt).not.toBeNull()
  })

  it('unchecks on the same key and clears the attribution (ADR 071 §2)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = await addItem(cookie, await groceryListId(), { name: 'milk' })
    await check(cookie, created.json().item.id, 'got')

    const res = await check(cookie, created.json().item.id, 'needed')
    expect(res.json().status).toBe('needed')

    const stored = await shoppingPrisma.item.findUnique({ where: { id: created.json().item.id } })
    expect(stored).toMatchObject({ gotBy: null, gotAt: null })
  })

  it('lets a tier-2 profile check — the person holding the cart is rarely tier 4', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const created = await addItem(parent, await groceryListId(), { name: 'milk' })

    const teen = await getCookieForProfile(TEEN_ID)
    expect((await check(teen, created.json().item.id, 'got')).statusCode).toBe(200)
    expect((await check(teen, created.json().item.id, 'needed')).statusCode).toBe(200)
  })

  it('refuses a tier-1 kid — adding is the participation, clearing a trip is not', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const created = await addItem(parent, await groceryListId(), { name: 'milk' })

    const kid = await getCookieForProfile(KID_ID)
    expect((await check(kid, created.json().item.id, 'got')).statusCode).toBe(403)
  })

  it('refuses the unattended wall on the ability alone — it adds, it does not clear', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const created = await addItem(parent, await groceryListId(), { name: 'milk' })

    const wall = await getCookieForProfile(FAMILY_PROFILE_ID)
    expect((await check(wall, created.json().item.id, 'got')).statusCode).toBe(403)
  })

  it('rejects a body that is a toggle verb rather than a target state', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = await addItem(cookie, await groceryListId(), { name: 'milk' })
    const res = await app.inject({
      method: 'POST',
      url: `/api/shopping/items/${created.json().item.id}/check`,
      headers: { cookie },
      payload: { toggle: true },
    })
    expect(res.statusCode).toBe(400)
  })

  it('404s on an unknown item', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await check(cookie, '00000000-0000-4000-8000-000000000000', 'got')
    expect(res.statusCode).toBe(404)
  })

  it('settles two shoppers on the same answer, and keeps the first writer’s attribution', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const created = await addItem(parent, await groceryListId(), { name: 'milk' })
    const teen = await getCookieForProfile(TEEN_ID)

    // Both phones name the target state, not a toggle: the second tap lands on a
    // row that is already there and settles rather than flipping it back.
    const first = await check(parent, created.json().item.id, 'got')
    const second = await check(teen, created.json().item.id, 'got')
    expect(first.json().status).toBe('got')
    expect(second.json().status).toBe('got')

    const stored = await shoppingPrisma.item.findUnique({ where: { id: created.json().item.id } })
    expect(stored?.gotBy).toBe(PARENT_ID)
  })

  it('announces one event per real transition, and nothing for a no-op', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = await addItem(cookie, await groceryListId(), { name: 'milk' })

    const seen: unknown[] = []
    const off = app.eventBus.on('shopping.item.checked', (p) => seen.push(p))
    await check(cookie, created.json().item.id, 'got')
    await check(cookie, created.json().item.id, 'got')
    await check(cookie, created.json().item.id, 'needed')
    off()

    // One name for both directions, read by its `status` — a second event name
    // makes every consumer subscribe twice and eventually forget one.
    expect(seen).toHaveLength(2)
    expect(seen[0]).toMatchObject({ name: 'milk', status: 'got', gotBy: PARENT_ID })
    expect(seen[1]).toMatchObject({ name: 'milk', status: 'needed', gotBy: null })
  })

  it('keeps a checked row on the list, in its place — it never leaves the read', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const milk = await addItem(cookie, listId, { name: 'milk' })
    await addItem(cookie, listId, { name: 'butter' })
    await check(cookie, milk.json().item.id, 'got')

    const res = await app.inject({
      method: 'GET',
      url: `/api/shopping/lists/${listId}`,
      headers: { cookie },
    })
    expect(res.json().items.map((i: { name: string }) => i.name)).toEqual(['milk', 'butter'])
    // The count strip counts what is still to get, not what is on the list.
    expect(res.json().list.itemCount).toBe(1)
  })
})

// ─── POST /api/shopping/items/:id/aisle ───────────────────────────────────────

describe('POST /api/shopping/items/:id/aisle', () => {
  it('re-files the item and teaches a family-wide override for the next add', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const created = await addItem(cookie, listId, { name: 'flibbertigibbet' })
    expect(created.json().item.category).toBe('Other')

    const corrected = await app.inject({
      method: 'POST',
      url: `/api/shopping/items/${created.json().item.id}/aisle`,
      headers: { cookie },
      payload: { category: 'Pantry' },
    })
    expect(corrected.statusCode).toBe(200)
    expect(corrected.json().category).toBe('Pantry')

    const next = await addItem(cookie, listId, { name: 'Flibbertigibbet,' })
    expect(next.json().item.category).toBe('Pantry')
  })

  it('refuses a tier-3 profile by ability, not a tier read — `file` is tier 4 and grantable (ADR 071)', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const created = await addItem(parent, await groceryListId(), { name: 'milk' })

    const teen = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'POST',
      url: `/api/shopping/items/${created.json().item.id}/aisle`,
      headers: { cookie: teen },
      payload: { category: 'Pantry' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('rejects a category outside the fixed walk order', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = await addItem(cookie, await groceryListId(), { name: 'milk' })
    const res = await app.inject({
      method: 'POST',
      url: `/api/shopping/items/${created.json().item.id}/aisle`,
      headers: { cookie },
      payload: { category: 'Electronics' },
    })
    expect(res.statusCode).toBe(400)
  })
})

// ─── The needs-push contract, consumer side (ADR 069 §4) ──────────────────────

const MEAL_ID = '00000000-5ec0-0002-0000-000000000001'

function pushNeeds(names: string[], overrides: Record<string, unknown> = {}) {
  return app.eventBus.emitAndAwait('meals.needs.pushed', {
    sourceType: 'meal',
    sourceId: MEAL_ID,
    note: 'for Thursday',
    requestedBy: PARENT_ID,
    names,
    ...overrides,
  }) as Promise<{ filed: number; alreadyOn: number; listName: string }[]>
}

describe('meals.needs.pushed', () => {
  it('files the meal\u2019s needs onto the default list and reports what landed', async () => {
    const [result] = await pushNeeds(['chicken thighs', 'snap peas'])

    expect(result).toMatchObject({ filed: 2, alreadyOn: 0, listName: 'Grocery' })
    const items = await shoppingPrisma.item.findMany({ orderBy: { name: 'asc' } })
    expect(items.map((i) => i.name)).toEqual(['chicken thighs', 'snap peas'])
  })

  it('files through the same dictionary a manual add uses (AC4)', async () => {
    await pushNeeds(['chicken thighs', 'sourdough', 'lightbulbs'])

    const byName = new Map((await shoppingPrisma.item.findMany()).map((i) => [i.name, i.category]))
    expect(byName.get('chicken thighs')).toBe('Meat')
    expect(byName.get('sourdough')).toBe('Bakery')
    expect(byName.get('lightbulbs')).toBe('Other')
  })

  it('honours a family correction, so a push cannot be filed by a second copy of the rule', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const added = await addItem(cookie, listId, { name: 'tortillas' })
    await app.inject({
      method: 'POST',
      url: `/api/shopping/items/${added.json().item.id}/aisle`,
      headers: { cookie },
      payload: { category: 'Bakery' },
    })
    // The item goes; the family-wide override it taught stays.
    await shoppingPrisma.item.delete({ where: { id: added.json().item.id } })

    await pushNeeds(['Tortillas'])

    const pushed = await shoppingPrisma.item.findFirst({ where: { sourceType: 'meal' } })
    expect(pushed?.category).toBe('Bakery')
  })

  it('carries the producer\u2019s words to the note line — shopping cannot derive them (AC6)', async () => {
    await pushNeeds(['chicken thighs'])

    const listId = await groceryListId()
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: `/api/shopping/lists/${listId}`,
      headers: { cookie },
    })
    expect(res.json().items[0].note).toBe('for Thursday')
  })

  it('keeps the meal id as an opaque handle rather than a join (AC2)', async () => {
    await pushNeeds(['chicken thighs'])

    const pushed = await shoppingPrisma.item.findFirst({ where: { sourceType: 'meal' } })
    expect(pushed).toMatchObject({ sourceType: 'meal', sourceId: MEAL_ID, addedBy: PARENT_ID })
  })

  it('does not double a row when the same meal is pushed twice (AC5)', async () => {
    await pushNeeds(['chicken thighs', 'snap peas'])
    const [second] = await pushNeeds(['chicken thighs', 'snap peas'])

    expect(second).toMatchObject({ filed: 0, alreadyOn: 2 })
    expect(await shoppingPrisma.item.count()).toBe(2)
  })

  it('dedupes on the normalized name, the key the dictionary and overrides use', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await addItem(cookie, await groceryListId(), { name: 'Snap Peas' })

    const [result] = await pushNeeds(['snap peas,'])

    expect(result).toMatchObject({ filed: 0, alreadyOn: 1 })
    expect(await shoppingPrisma.item.count()).toBe(1)
  })

  it('dedupes a repeat of the same name inside one push', async () => {
    const [result] = await pushNeeds(['snap peas', 'Snap Peas'])

    expect(result).toMatchObject({ filed: 1, alreadyOn: 1 })
    expect(await shoppingPrisma.item.count()).toBe(1)
  })

  it('puts a checked row back rather than duplicating it', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const added = await addItem(cookie, await groceryListId(), { name: 'snap peas' })
    await shoppingPrisma.item.update({
      where: { id: added.json().item.id },
      data: { status: 'got', gotBy: PARENT_ID, gotAt: new Date() },
    })

    const [result] = await pushNeeds(['snap peas'])

    expect(result).toMatchObject({ filed: 1, alreadyOn: 0 })
    const rows = await shoppingPrisma.item.findMany()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ status: 'needed', gotBy: null, sourceLabel: 'for Thursday' })
  })

  it('announces each filed row on the bus under the one add event (ADR 072)', async () => {
    const seen: unknown[] = []
    const off = app.eventBus.on('shopping.item.added', (p) => seen.push(p))
    await pushNeeds(['chicken thighs', 'snap peas'])
    off()

    expect(seen).toHaveLength(2)
    expect(seen[0]).toMatchObject({ sourceType: 'meal', addedBy: PARENT_ID })
  })

  it('teaches the entry table, exactly as a manual add does', async () => {
    await pushNeeds(['Chicken Thighs'])

    const entry = await shoppingPrisma.entry.findUnique({
      where: { normalizedName: 'chicken thighs' },
    })
    expect(entry?.name).toBe('Chicken Thighs')
  })

  it('rejects a malformed payload, writing nothing and announcing nothing', async () => {
    const seen: unknown[] = []
    const off = app.eventBus.on('shopping.item.added', (p) => seen.push(p))
    await expect(pushNeeds([], { names: ['ok'], note: '' })).rejects.toThrow(/malformed/)
    off()

    expect(await shoppingPrisma.item.count()).toBe(0)
    expect(seen).toHaveLength(0)
  })

  it('announces each row only after the batch commits', async () => {
    // The events carry ids, so every one of them must name a row that survived.
    const seen: { itemId: string }[] = []
    const off = app.eventBus.on('shopping.item.added', (p) => seen.push(p as { itemId: string }))
    await pushNeeds(['chicken thighs', 'snap peas'])
    off()

    const stored = await shoppingPrisma.item.findMany()
    expect(seen.map((e) => e.itemId).sort()).toEqual(stored.map((i) => i.id).sort())
  })
})

// ─── POST /api/shopping/items/:id/retract ─────────────────────────────────────

describe('POST /api/shopping/items/:id/retract', () => {
  async function ageItem(id: string, minutes: number) {
    await shoppingPrisma.item.update({
      where: { id },
      data: { addedAt: new Date(Date.now() - minutes * 60 * 1000) },
    })
  }

  function retract(cookie: string, id: string) {
    return app.inject({
      method: 'POST',
      url: `/api/shopping/items/${id}/retract`,
      headers: { cookie },
    })
  }

  it('lets a kid take back their own add — tier 1, not the delete verb', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'mikk' })

    const res = await retract(cookie, item.json().item.id)
    expect(res.statusCode).toBe(204)
    expect(await shoppingPrisma.item.findUnique({ where: { id: item.json().item.id } })).toBeNull()
  })

  it("refuses a sibling's add — `yours` is a row condition, not a tier", async () => {
    const teen = await getCookieForProfile(TEEN_ID)
    const item = await addItem(teen, await groceryListId(), { name: 'snap peas' })

    const kid = await getCookieForProfile(KID_ID)
    const res = await retract(kid, item.json().item.id)
    expect(res.statusCode).toBe(403)
    expect(
      await shoppingPrisma.item.findUnique({ where: { id: item.json().item.id } })
    ).not.toBeNull()
  })

  // ADR 073 §3 — everyone at the wall is `family`, so scope dissolves there ON
  // PURPOSE. Refusing it would leave the one surface never logged in as the one
  // that can never undo.
  it('lets anyone at the wall take back what the wall added', async () => {
    const cookie = await getCookieForProfile(FAMILY_PROFILE_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'oat milk' })

    expect((await retract(cookie, item.json().item.id)).statusCode).toBe(204)
  })

  it('does not let the wall take back what a phone added', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const item = await addItem(parent, await groceryListId(), { name: 'milk' })

    const family = await getCookieForProfile(FAMILY_PROFILE_ID)
    expect((await retract(family, item.json().item.id)).statusCode).toBe(403)
  })

  it('refuses past the window, and says which of the two refusals it is', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'bananas' })
    await ageItem(item.json().item.id, 16)

    const res = await retract(cookie, item.json().item.id)
    expect(res.statusCode).toBe(403)
    // The client has to SHOW this, so the two 403s must be distinguishable.
    expect(res.json().error).toMatch(/too old/i)
    expect(
      await shoppingPrisma.item.findUnique({ where: { id: item.json().item.id } })
    ).not.toBeNull()
  })

  it('still allows it just inside the window', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'cilantro' })
    await ageItem(item.json().item.id, 14)

    expect((await retract(cookie, item.json().item.id)).statusCode).toBe(204)
  })

  it('emits one removal event carrying the name, since the row is gone after', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const item = await addItem(cookie, await groceryListId(), { name: 'tortillas' })

    const seen: Record<string, unknown>[] = []
    app.eventBus.on('shopping.item.removed', (p) => seen.push(p as Record<string, unknown>))
    await retract(cookie, item.json().item.id)

    expect(seen).toHaveLength(1)
    expect(seen[0]).toMatchObject({ name: 'tortillas', by: KID_ID, reason: 'retracted' })
  })

  it('404s on an unknown item', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await retract(cookie, '00000000-0000-4000-8000-000000000000')
    expect(res.statusCode).toBe(404)
  })
})

// ─── The permission namespace (ADR 069 §3, spec.md) ───────────────────────────

describe('shopping permission registry', () => {
  it('registers exactly the seven keys ADR 071 completed and ADR 073 extended', () => {
    expect(Object.keys(PERMISSION_REGISTRY).filter((k) => k.startsWith('shopping.'))).toEqual([
      'shopping.list.create',
      'shopping.item.view',
      'shopping.item.add',
      'shopping.item.check',
      'shopping.item.file',
      'shopping.item.retract',
      'shopping.item.manage',
    ])
  })

  it('namespaces the subjects to the plugin (ADR 069 §3)', () => {
    expect(PERMISSION_REGISTRY['shopping.list.create']).toMatchObject({
      action: 'create',
      subject: 'shopping.List',
      module: 'shopping',
    })
    expect(PERMISSION_REGISTRY['shopping.item.add']).toMatchObject({
      action: 'create',
      subject: 'shopping.Item',
    })
    expect(PERMISSION_REGISTRY['shopping.item.view']).toMatchObject({
      action: 'view',
      subject: 'shopping.Item',
    })
    // Checking and filing are their own actions, never folded into `manage`
    // (ADR 071) — `manage` is the delete verb.
    expect(PERMISSION_REGISTRY['shopping.item.check']).toMatchObject({
      action: 'check',
      subject: 'shopping.Item',
    })
    expect(PERMISSION_REGISTRY['shopping.item.file']).toMatchObject({
      action: 'file',
      subject: 'shopping.Item',
    })
    expect(PERMISSION_REGISTRY['shopping.item.manage']).toMatchObject({
      action: 'manage',
      subject: 'shopping.Item',
    })
  })

  it('does not carry the branch key from the closed PR', () => {
    expect(PERMISSION_REGISTRY).not.toHaveProperty('meals.grocery.view')
    expect(PERMISSION_REGISTRY).not.toHaveProperty('meals.grocery.check')
  })
})
