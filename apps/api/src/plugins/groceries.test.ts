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

async function clearGroceries() {
  await mealPrisma.groceryItem.deleteMany({})
  await mealPrisma.groceryAisleOverride.deleteMany({})
}

async function clearMeals() {
  await mealPrisma.plannedMeal.deleteMany({})
}

async function addItem(cookie: string, payload: Record<string, unknown>) {
  return app.inject({ method: 'POST', url: '/api/groceries', headers: { cookie }, payload })
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

// ─── POST /api/groceries ───────────────────────────────────────────────────────

describe('POST /api/groceries', () => {
  it('creates an item and files it by the dictionary — tier 1 may add', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await addItem(cookie, { name: 'Milk' })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.name).toBe('Milk')
    expect(body.category).toBe('Dairy')
    expect(body.status).toBe('needed')
    expect(body.sourceType).toBe('manual')
  })

  it('files an unknown word into Other', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, { name: 'Flibbertigibbet' })
    expect(res.json().category).toBe('Other')
  })

  it('notes manual attribution as "<name> added these"', async () => {
    const cookie = await getCookieForProfile(KID2_ID)
    const res = await addItem(cookie, { name: 'Snap peas' })
    expect(res.json().note).toBe('Emma added these')
  })

  it('rejects a missing name with 400', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await addItem(cookie, {})
    expect(res.statusCode).toBe(400)
  })

  it('an override files ahead of the dictionary', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    await mealPrisma.groceryAisleOverride.create({
      data: { normalizedName: 'milk', category: 'Pantry' },
    })
    const res = await addItem(parentCookie, { name: 'Milk' })
    expect(res.json().category).toBe('Pantry')
  })
})

// ─── GET /api/groceries ────────────────────────────────────────────────────────

describe('GET /api/groceries', () => {
  it('returns items sorted by the fixed aisle walk order', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await addItem(cookie, { name: 'Rice' }) // Pantry
    await addItem(cookie, { name: 'Chicken thighs' }) // Meat
    await addItem(cookie, { name: 'Apples' }) // Produce

    const res = await app.inject({ method: 'GET', url: '/api/groceries', headers: { cookie } })
    expect(res.statusCode).toBe(200)
    const { items } = res.json()
    expect(items.map((i: { category: string }) => i.category)).toEqual([
      'Produce',
      'Meat',
      'Pantry',
    ])
  })

  it('a tier-1 profile may view', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({ method: 'GET', url: '/api/groceries', headers: { cookie } })
    expect(res.statusCode).toBe(200)
  })
})

// ─── POST /api/groceries/:id/aisle ─────────────────────────────────────────────

describe('POST /api/groceries/:id/aisle', () => {
  it('re-files the item and teaches an override for the next add', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = (await addItem(cookie, { name: 'Kombucha' })).json()
    expect(created.category).toBe('Other')

    const corrected = await app.inject({
      method: 'POST',
      url: `/api/groceries/${created.id}/aisle`,
      headers: { cookie },
      payload: { category: 'Pantry' },
    })
    expect(corrected.statusCode).toBe(200)
    expect(corrected.json().category).toBe('Pantry')

    const nextAdd = (await addItem(cookie, { name: 'kombucha' })).json()
    expect(nextAdd.category).toBe('Pantry')
  })

  it('rejects a category outside the fixed aisle list with 400', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = (await addItem(cookie, { name: 'Kombucha' })).json()
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

  it('returns 403 for a tier-3 profile — teaching a family-wide override is tier 4 (manage)', async () => {
    const parentCookie = await getCookieForProfile(PARENT_ID)
    const created = (await addItem(parentCookie, { name: 'Kombucha' })).json()

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

  it('comma-splits needs into items noted with their meal', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const meal = await planMealWithNeeds(cookie, 'chicken thighs, broccoli')

    const res = await app.inject({
      method: 'POST',
      url: '/api/groceries/push-needs',
      headers: { cookie },
      payload: { mealId: meal.id },
    })
    expect(res.statusCode).toBe(200)
    const { items } = res.json()
    expect(items).toHaveLength(2)
    const names = items.map((i: { name: string }) => i.name).sort()
    expect(names).toEqual(['broccoli', 'chicken thighs'])
    for (const item of items) {
      expect(item.note).toMatch(/^for \w+'s Rigatoni$/)
      expect(item.sourceType).toBe('meal')
    }
  })

  it('dedupes by normalized name against an open item', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await addItem(cookie, { name: 'Broccoli' })
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
    const created = (await addItem(cookie, { name: 'Broccoli' })).json()
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
  })
})
