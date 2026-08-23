import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { mealPrisma } from '@family-os/plugin-meals/db'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

// Fixed UUIDs for test profiles — owner_id is @db.Uuid.
const PARENT_ID = '00000000-da54-0001-0000-000000000001' // tier 4
const KID_ID = '00000000-da54-0001-0000-000000000002' // tier 1
const ALL_IDS = [PARENT_ID, KID_ID]

const RANGE = '?from=2026-08-24&to=2026-08-24'

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

async function getDayMarks(cookie: string) {
  return app.inject({
    method: 'GET',
    url: `/api/calendar/day-marks${RANGE}`,
    headers: { cookie },
  })
}

beforeAll(async () => {
  app = await buildServer()
  await prisma.profile.upsert({
    where: { id: PARENT_ID },
    update: { name: 'Zach', tier: 4 },
    create: { id: PARENT_ID, name: 'Zach', tier: 4 },
  })
  await prisma.profile.upsert({
    where: { id: KID_ID },
    update: { name: 'Kid', tier: 1 },
    create: { id: KID_ID, name: 'Kid', tier: 1 },
  })
})

afterAll(async () => {
  await clearMeals()
  await prisma.permissionOverride.deleteMany({ where: { profileId: { in: ALL_IDS } } })
  await prisma.profile.deleteMany({ where: { id: { in: ALL_IDS } } })
  await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })
  await app.close()
  await prisma.$disconnect()
  await mealPrisma.$disconnect()
})

beforeEach(async () => {
  await clearMeals()
  await prisma.permissionOverride.deleteMany({ where: { profileId: { in: ALL_IDS } } })
})

describe('GET /calendar/day-marks — meals provider (ADR 050)', () => {
  it('marks a claimed dinner — owner, glyph, and attribution label', async () => {
    await mealPrisma.plannedMeal.create({
      data: {
        date: new Date('2026-08-24'),
        title: 'Rigatoni',
        kind: 'cooked',
        ownerId: PARENT_ID,
        createdBy: PARENT_ID,
      },
    })
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await getDayMarks(cookie)
    expect(res.statusCode).toBe(200)
    const { marks } = res.json()
    expect(marks).toEqual([
      { date: '2026-08-24', ownerId: PARENT_ID, glyph: 'utensils', label: "Zach's got dinner" },
    ])
  })

  it('makes no mark for an unclaimed day (AC5)', async () => {
    await mealPrisma.plannedMeal.create({
      data: { date: new Date('2026-08-24'), title: 'Tacos', kind: 'cooked', createdBy: PARENT_ID },
    })
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await getDayMarks(cookie)
    expect(res.json().marks).toEqual([])
  })

  it('makes no mark for a covered-but-ownerless day — isCovered() is not the gate (AC5)', async () => {
    // kind: 'takeout' with no owner is isCovered() === true in the meals module,
    // but it still has no WHO — the day mark's entire payload — so no mark.
    await mealPrisma.plannedMeal.create({
      data: { date: new Date('2026-08-24'), title: '', kind: 'takeout', createdBy: PARENT_ID },
    })
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await getDayMarks(cookie)
    expect(res.json().marks).toEqual([])
  })

  it('403s the surface the same way GET /calendar/events does when calendar.event.view is revoked', async () => {
    await prisma.permissionOverride.create({
      data: { profileId: KID_ID, action: 'view', subject: 'calendar.Event', type: 'revocation' },
    })
    const cookie = await getCookieForProfile(KID_ID)
    const res = await getDayMarks(cookie)
    expect(res.statusCode).toBe(403)
  })

  it("filters the meals provider out (not a 403) when the caller lacks meals.PlannedMeal view — the calendar's own gate stays open (ADR 066)", async () => {
    await mealPrisma.plannedMeal.create({
      data: {
        date: new Date('2026-08-24'),
        title: 'Rigatoni',
        kind: 'cooked',
        ownerId: PARENT_ID,
        createdBy: PARENT_ID,
      },
    })
    await prisma.permissionOverride.create({
      data: { profileId: KID_ID, action: 'view', subject: 'meals.PlannedMeal', type: 'revocation' },
    })
    const cookie = await getCookieForProfile(KID_ID)
    const res = await getDayMarks(cookie)
    expect(res.statusCode).toBe(200)
    expect(res.json().marks).toEqual([])
  })

  it('requires from and to', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/calendar/day-marks',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(400)
  })
})
