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
    expect(res.json()).toMatchObject({ name: 'Milk', category: 'Dairy', status: 'needed' })
  })

  it('files an unknown word into Other', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'flibbertigibbet' })
    expect(res.json().category).toBe('Other')
  })

  it('lets a tier-1 kid add — the cheapest participation the house has', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'snap peas' })
    expect(res.statusCode).toBe(201)
    // Stored for permissions and audit; never rendered (live review, 2026-09-03).
    const stored = await shoppingPrisma.item.findUnique({ where: { id: res.json().id } })
    expect(stored?.addedBy).toBe(KID_ID)
    expect(res.json().note).toBeNull()
  })

  it('never puts who-added on the wire — a shared list does not answer that question', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'milk' })
    expect(res.json()).not.toHaveProperty('addedBy')
    expect(res.json().note).toBeNull()
  })

  // ADR 072. This is the assertion that stops someone reinstating a uuid column:
  // the wall runs as the family profile and capture is its entire job, so an add
  // as `family` must reach the table, not a hand-written 403.
  it('accepts an add from the unattended wall and persists added_by = family', async () => {
    const cookie = await getCookieForProfile(FAMILY_PROFILE_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'oat milk' })
    expect(res.statusCode).toBe(201)

    const stored = await shoppingPrisma.item.findUnique({ where: { id: res.json().id } })
    expect(stored?.addedBy).toBe(FAMILY_PROFILE_ID)
  })

  it('emits one event for a wall add, distinguished by addedBy rather than a second name', async () => {
    const cookie = await getCookieForProfile(FAMILY_PROFILE_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'oat milk' })
    expect(res.json()).toMatchObject({ name: 'oat milk', category: 'Dairy' })
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
      url: `/api/shopping/items/${item.json().id}/aisle`,
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
    await shoppingPrisma.item.update({ where: { id: item.json().id }, data: { status: 'got' } })

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

// ─── POST /api/shopping/items/:id/aisle ───────────────────────────────────────

describe('POST /api/shopping/items/:id/aisle', () => {
  it('re-files the item and teaches a family-wide override for the next add', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const listId = await groceryListId()
    const created = await addItem(cookie, listId, { name: 'flibbertigibbet' })
    expect(created.json().category).toBe('Other')

    const corrected = await app.inject({
      method: 'POST',
      url: `/api/shopping/items/${created.json().id}/aisle`,
      headers: { cookie },
      payload: { category: 'Pantry' },
    })
    expect(corrected.statusCode).toBe(200)
    expect(corrected.json().category).toBe('Pantry')

    const next = await addItem(cookie, listId, { name: 'Flibbertigibbet,' })
    expect(next.json().category).toBe('Pantry')
  })

  it('refuses a tier-3 profile by ability, not a tier read — `file` is tier 4 and grantable (ADR 071)', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const created = await addItem(parent, await groceryListId(), { name: 'milk' })

    const teen = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'POST',
      url: `/api/shopping/items/${created.json().id}/aisle`,
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
      url: `/api/shopping/items/${created.json().id}/aisle`,
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
      url: `/api/shopping/items/${added.json().id}/aisle`,
      headers: { cookie },
      payload: { category: 'Bakery' },
    })
    // The item goes; the family-wide override it taught stays.
    await shoppingPrisma.item.delete({ where: { id: added.json().id } })

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
      where: { id: added.json().id },
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

// ─── The permission namespace (ADR 069 §3, spec.md) ───────────────────────────

describe('shopping permission registry', () => {
  it('registers exactly the six keys ADR 071 completed', () => {
    expect(Object.keys(PERMISSION_REGISTRY).filter((k) => k.startsWith('shopping.'))).toEqual([
      'shopping.list.create',
      'shopping.item.view',
      'shopping.item.add',
      'shopping.item.check',
      'shopping.item.file',
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
