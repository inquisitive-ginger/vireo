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

  it('refuses the unattended family profile', async () => {
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
    expect(res.json().note).toBe('Emma added')
  })

  it('refuses the unattended family profile — there is nobody to attribute the add to', async () => {
    const cookie = await getCookieForProfile(FAMILY_PROFILE_ID)
    const res = await addItem(cookie, await groceryListId(), { name: 'milk' })
    expect(res.statusCode).toBe(403)
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

  it('refuses a tier-3 profile by ability, not a tier read — the key is grantable (ADR 018)', async () => {
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

// ─── The permission namespace (ADR 069 §3, spec.md) ───────────────────────────

describe('shopping permission registry', () => {
  it('registers exactly the three keys spec.md names', () => {
    expect(Object.keys(PERMISSION_REGISTRY).filter((k) => k.startsWith('shopping.'))).toEqual([
      'shopping.list.create',
      'shopping.item.add',
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
    expect(PERMISSION_REGISTRY['shopping.item.manage']).toMatchObject({
      action: 'manage',
      subject: 'shopping.Item',
    })
  })

  it('does not carry the branch key that read the list — viewing is a grant, not a key', () => {
    expect(PERMISSION_REGISTRY).not.toHaveProperty('shopping.item.view')
    expect(PERMISSION_REGISTRY).not.toHaveProperty('meals.grocery.view')
  })
})
