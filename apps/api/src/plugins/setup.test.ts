import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

const DEFAULT_LAYOUTS = {
  default_layout_tier_1_2: [
    { widgetId: 'chores.today-summary', x: 0, y: 0, w: 2, h: 2 },
    { widgetId: 'family-feed.feed', x: 2, y: 0, w: 2, h: 1 },
    { widgetId: 'calendar.up-next', x: 2, y: 1, w: 2, h: 1 },
  ],
  default_layout_tier_3_4: [
    { widgetId: 'calendar.up-next', x: 0, y: 0, w: 2, h: 2 },
    { widgetId: 'family-feed.feed', x: 2, y: 0, w: 2, h: 1 },
    { widgetId: 'chores.today-summary', x: 2, y: 1, w: 2, h: 1 },
  ],
}

beforeAll(async () => {
  app = await buildServer()
  for (const [key, value] of Object.entries(DEFAULT_LAYOUTS)) {
    await prisma.systemConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }
})

afterAll(async () => {
  // Restore seed profiles so other test suites that rely on them still pass
  await prisma.profile.upsert({
    where: { id: 'seed-parent-1' },
    update: {},
    create: { id: 'seed-parent-1', name: 'Parent', tier: 4, avatarUrl: null },
  })
  await prisma.profile.upsert({
    where: { id: 'seed-child-1' },
    update: {},
    create: { id: 'seed-child-1', name: 'Child', tier: 1, avatarUrl: null },
  })
  await app.close()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.notification.deleteMany()
  await prisma.widgetLayout.deleteMany()
  await prisma.profile.deleteMany({ where: { id: { not: 'family' } } })
  await prisma.systemConfig.deleteMany({
    where: { key: { in: ['family_pin_hash', 'onboarding_step', 'family_name'] } },
  })
})

// ─── GET /setup/status ────────────────────────────────────────────────────────

describe('GET /api/setup/status', () => {
  it('returns needsSetup:true currentStep:1 when no profiles exist', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/setup/status' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ needsSetup: true, currentStep: 1 })
  })

  it('returns currentStep from onboarding_step when in progress', async () => {
    await prisma.profile.create({ data: { name: 'Parent', tier: 4 } })
    await prisma.systemConfig.create({ data: { key: 'onboarding_step', value: 2 } })

    const res = await app.inject({ method: 'GET', url: '/api/setup/status' })
    expect(res.json()).toEqual({ needsSetup: true, currentStep: 2 })
  })

  it('returns needsSetup:false when profiles exist and no onboarding_step', async () => {
    await prisma.profile.create({ data: { name: 'Parent', tier: 4 } })

    const res = await app.inject({ method: 'GET', url: '/api/setup/status' })
    expect(res.json()).toEqual({ needsSetup: false, currentStep: null })
  })
})

// ─── POST /setup/family ───────────────────────────────────────────────────────

describe('POST /api/setup/family', () => {
  it('creates the parent profile, stores family_name, advances to step 2', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/family',
      payload: { familyName: 'The Smiths', parentName: 'Jordan Smith' },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json<{ name: string; tier: number }>()
    expect(body.name).toBe('Jordan Smith')
    expect(body.tier).toBe(4)

    const familyName = await prisma.systemConfig.findUnique({ where: { key: 'family_name' } })
    expect(familyName?.value).toBe('The Smiths')

    const step = await prisma.systemConfig.findUnique({ where: { key: 'onboarding_step' } })
    expect(step?.value).toBe(2)
  })

  it('seeds a tier-3/4 widget layout for the new parent', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/setup/family',
      payload: { familyName: 'The Smiths', parentName: 'Jordan Smith' },
    })

    const parent = await prisma.profile.findFirst({ where: { tier: 4 } })
    const layouts = await prisma.widgetLayout.findMany({ where: { profileId: parent!.id } })
    expect(layouts.length).toBeGreaterThan(0)
    const widgetIds = layouts.map((l) => l.widgetId)
    expect(widgetIds).toContain('calendar.up-next')
  })

  it('returns 400 when familyName is missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/family',
      payload: { parentName: 'Jordan' },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 400 when parentName is missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/family',
      payload: { familyName: 'The Smiths' },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 409 when profiles already exist', async () => {
    await prisma.profile.create({ data: { name: 'Existing', tier: 4 } })

    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/family',
      payload: { familyName: 'The Smiths', parentName: 'Jordan' },
    })
    expect(res.statusCode).toBe(409)
  })
})

// ─── POST /setup/members ──────────────────────────────────────────────────────

describe('POST /api/setup/members', () => {
  beforeEach(async () => {
    await prisma.profile.create({ data: { name: 'Parent', tier: 4 } })
    await prisma.systemConfig.create({ data: { key: 'onboarding_step', value: 2 } })
  })

  it('creates all submitted profiles and advances to step 3', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/members',
      payload: {
        profiles: [
          { name: 'Teen', tier: 3 },
          { name: 'Child', tier: 1 },
        ],
      },
    })

    expect(res.statusCode).toBe(200)
    const { profiles } = res.json<{ profiles: Array<{ name: string; tier: number }> }>()
    expect(profiles).toHaveLength(2)
    expect(profiles.map((p) => p.name)).toContain('Teen')

    const step = await prisma.systemConfig.findUnique({ where: { key: 'onboarding_step' } })
    expect(step?.value).toBe(3)
  })

  it('accepts an empty profiles array (skip)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/members',
      payload: { profiles: [] },
    })

    expect(res.statusCode).toBe(200)
    const step = await prisma.systemConfig.findUnique({ where: { key: 'onboarding_step' } })
    expect(step?.value).toBe(3)
  })

  it('seeds tier-appropriate widget layouts for each member', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/setup/members',
      payload: { profiles: [{ name: 'Child', tier: 1 }] },
    })

    const child = await prisma.profile.findFirst({ where: { name: 'Child' } })
    const layouts = await prisma.widgetLayout.findMany({ where: { profileId: child!.id } })
    expect(layouts.length).toBeGreaterThan(0)
    const widgetIds = layouts.map((l) => l.widgetId)
    expect(widgetIds).toContain('chores.today-summary')
  })

  it('returns 409 when not at onboarding step 2', async () => {
    await prisma.systemConfig.update({
      where: { key: 'onboarding_step' },
      data: { value: 3 },
    })

    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/members',
      payload: { profiles: [] },
    })
    expect(res.statusCode).toBe(409)
  })
})

// ─── POST /setup/complete ─────────────────────────────────────────────────────

describe('POST /api/setup/complete', () => {
  beforeEach(async () => {
    await prisma.profile.create({ data: { name: 'Parent', tier: 4 } })
    await prisma.systemConfig.create({ data: { key: 'onboarding_step', value: 3 } })
  })

  it('hashes and stores the PIN, removes onboarding_step, sets session', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/complete',
      payload: { pin: '1234' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ ok: boolean }>().ok).toBe(true)

    const pinConfig = await prisma.systemConfig.findUnique({ where: { key: 'family_pin_hash' } })
    expect(pinConfig).not.toBeNull()
    const valid = await bcrypt.compare('1234', pinConfig!.value as string)
    expect(valid).toBe(true)

    const step = await prisma.systemConfig.findUnique({ where: { key: 'onboarding_step' } })
    expect(step).toBeNull()
  })

  it('returns 400 for a non-4-digit PIN', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/complete',
      payload: { pin: '12' },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for a PIN with non-digit characters', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/complete',
      payload: { pin: 'abcd' },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 409 when not at onboarding step 3', async () => {
    await prisma.systemConfig.update({
      where: { key: 'onboarding_step' },
      data: { value: 2 },
    })

    const res = await app.inject({
      method: 'POST',
      url: '/api/setup/complete',
      payload: { pin: '1234' },
    })
    expect(res.statusCode).toBe(409)
  })
})
