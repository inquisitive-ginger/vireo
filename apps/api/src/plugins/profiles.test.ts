import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import type { LightMyRequestResponse } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { DEFAULT_LAYOUTS } from '@family-os/platform/types'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

beforeAll(async () => {
  app = await buildServer()
  // Geometry only, from the ONE definition — these files used to keep their own stale
  // copies of the composition (feed above chores), which is how the drift hid.
  for (const [key, items] of Object.entries(DEFAULT_LAYOUTS)) {
    const value = items.map(({ widgetId, x, y, w, h }) => ({ widgetId, x, y, w, h }))
    await prisma.systemConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.notification.deleteMany()
  await prisma.widgetLayout.deleteMany()
  await prisma.permissionOverride.deleteMany()
  await prisma.profile.deleteMany({
    where: { id: { notIn: ['family', 'seed-parent-1', 'seed-child-1'] } },
  })
  await prisma.systemConfig.deleteMany({
    where: { key: { in: ['family_pin_hash', 'family_name'] } },
  })
})

// Helper: set the family PIN and get a tier-4 session cookie via verify-pin
async function getTier4Cookie(): Promise<string> {
  const hash = await bcrypt.hash('1234', 10)
  await prisma.systemConfig.upsert({
    where: { key: 'family_pin_hash' },
    update: { value: hash },
    create: { key: 'family_pin_hash', value: hash, updatedBy: null },
  })
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/verify-pin',
    payload: { pin: '1234', targetProfileId: 'seed-parent-1' },
  })
  return getCookie(res)
}

// ─── POST /profiles ───────────────────────────────────────────────────────────

describe('POST /api/profiles', () => {
  it('creates a profile without freezing a widget layout into it', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles',
      headers: { cookie },
      payload: { name: 'Jordan', tier: 2 },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json<{ id: string; name: string; tier: number }>()
    expect(body.name).toBe('Jordan')
    expect(body.tier).toBe(2)

    // No layout is persisted at creation — GET /home/layout serves the current default
    // until the profile actually customizes it, so a corrected default still reaches it.
    const layouts = await prisma.widgetLayout.findMany({ where: { profileId: body.id } })
    expect(layouts).toHaveLength(0)
  })

  it('serves a new tier-4 profile the tier-3/4 composition', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles',
      headers: { cookie },
      payload: { name: 'Alex', tier: 4 },
    })
    const { id } = res.json<{ id: string }>()

    // Read it the way the shell does — the layout is resolved on read, not stored, so
    // asserting on `widget_layouts` rows would now be asserting on an empty table.
    const hash = await bcrypt.hash('1234', 10)
    await prisma.systemConfig.upsert({
      where: { key: 'family_pin_hash' },
      update: { value: hash },
      create: { key: 'family_pin_hash', value: hash, updatedBy: null },
    })
    const pin = await app.inject({
      method: 'POST',
      url: '/api/auth/verify-pin',
      payload: { pin: '1234', targetProfileId: id },
    })
    const layoutRes = await app.inject({
      method: 'GET',
      url: '/api/home/layout',
      headers: { cookie: getCookie(pin) },
    })
    const slots = layoutRes.json<{ widgetId: string; x: number; prominence: string }[]>()
    // Parents get no feature rung (ADR 039, amended); the calendar leads the first column.
    expect(slots.find((s) => s.widgetId === 'calendar.up-next')).toMatchObject({ x: 0 })
    expect(slots.filter((s) => s.prominence === 'feature')).toHaveLength(0)
    expect(slots.find((s) => s.widgetId === 'family-feed.feed')?.prominence).toBe('quiet')
  })

  it('returns 403 when session is tier < 4', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles',
      payload: { name: 'Jordan', tier: 2 },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 400 when name is missing', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles',
      headers: { cookie },
      payload: { tier: 2 },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 400 when tier is out of range', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles',
      headers: { cookie },
      payload: { name: 'Jordan', tier: 5 },
    })
    expect(res.statusCode).toBe(400)
  })
})

// ─── PATCH /profiles/:id ──────────────────────────────────────────────────────

describe('PATCH /api/profiles/:id', () => {
  it('updates profile name', async () => {
    const cookie = await getTier4Cookie()
    const created = await prisma.profile.create({ data: { name: 'Old Name', tier: 2 } })

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/profiles/${created.id}`,
      headers: { cookie },
      payload: { name: 'New Name' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ name: string }>().name).toBe('New Name')
  })

  it('updates profile tier', async () => {
    const cookie = await getTier4Cookie()
    const created = await prisma.profile.create({ data: { name: 'Sam', tier: 1 } })

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/profiles/${created.id}`,
      headers: { cookie },
      payload: { tier: 3 },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ tier: number }>().tier).toBe(3)
  })

  it('sets and clears the focusMode override (ADR 036)', async () => {
    const cookie = await getTier4Cookie()
    const created = await prisma.profile.create({ data: { name: 'Riley', tier: 3 } })

    // Set an explicit override.
    const setRes = await app.inject({
      method: 'PATCH',
      url: `/api/profiles/${created.id}`,
      headers: { cookie },
      payload: { focusMode: true },
    })
    expect(setRes.statusCode).toBe(200)
    expect(setRes.json<{ focusMode: boolean | null }>().focusMode).toBe(true)

    // Clear it back to the tier default (null).
    const clearRes = await app.inject({
      method: 'PATCH',
      url: `/api/profiles/${created.id}`,
      headers: { cookie },
      payload: { focusMode: null },
    })
    expect(clearRes.statusCode).toBe(200)
    expect(clearRes.json<{ focusMode: boolean | null }>().focusMode).toBeNull()

    await prisma.profile.delete({ where: { id: created.id } })
  })

  it('returns 400 when editing the family profile', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/profiles/family',
      headers: { cookie },
      payload: { name: 'Whatever' },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 404 for a non-existent profile', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/profiles/nonexistent-id',
      headers: { cookie },
      payload: { name: 'Whatever' },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 400 when body has no updatable fields', async () => {
    const cookie = await getTier4Cookie()
    const created = await prisma.profile.create({ data: { name: 'Sam', tier: 2 } })

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/profiles/${created.id}`,
      headers: { cookie },
      payload: {},
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 403 when session is tier < 4', async () => {
    const created = await prisma.profile.create({ data: { name: 'Sam', tier: 2 } })

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/profiles/${created.id}`,
      payload: { name: 'Other' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 409 when demoting the last tier-4 profile', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/profiles/seed-parent-1',
      headers: { cookie },
      payload: { tier: 3 },
    })

    expect(res.statusCode).toBe(409)
  })

  it('clears overrides atomically when tier changes', async () => {
    const cookie = await getTier4Cookie()
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })
    await prisma.permissionOverride.create({
      data: {
        profileId: target.id,
        action: 'view',
        subject: 'platform.Plugin',
        type: 'revocation',
        grantedBy: 'seed-parent-1',
      },
    })

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/profiles/${target.id}`,
      headers: { cookie },
      payload: { tier: 2 },
    })

    expect(res.statusCode).toBe(200)
    const remaining = await prisma.permissionOverride.findMany({ where: { profileId: target.id } })
    expect(remaining).toHaveLength(0)
  })

  it('does not clear overrides when only name changes', async () => {
    const cookie = await getTier4Cookie()
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })
    await prisma.permissionOverride.create({
      data: {
        profileId: target.id,
        action: 'view',
        subject: 'platform.Plugin',
        type: 'revocation',
        grantedBy: 'seed-parent-1',
      },
    })

    await app.inject({
      method: 'PATCH',
      url: `/api/profiles/${target.id}`,
      headers: { cookie },
      payload: { name: 'New Name' },
    })

    const remaining = await prisma.permissionOverride.findMany({ where: { profileId: target.id } })
    expect(remaining).toHaveLength(1)
  })
})

// ─── DELETE /profiles/:id ─────────────────────────────────────────────────────

describe('DELETE /api/profiles/:id', () => {
  it('deletes a profile and its widget layouts', async () => {
    const cookie = await getTier4Cookie()
    const created = await prisma.profile.create({ data: { name: 'Gone', tier: 2 } })
    await prisma.widgetLayout.create({
      data: { profileId: created.id, widgetId: 'chores.today-summary', x: 0, y: 0, w: 2, h: 2 },
    })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/profiles/${created.id}`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ ok: boolean }>().ok).toBe(true)

    const stillExists = await prisma.profile.findUnique({ where: { id: created.id } })
    expect(stillExists).toBeNull()

    const layouts = await prisma.widgetLayout.findMany({ where: { profileId: created.id } })
    expect(layouts).toHaveLength(0)
  })

  it('returns 400 when deleting the family profile', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/profiles/family',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 404 for a non-existent profile', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/profiles/nonexistent-id',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 403 when session is tier < 4', async () => {
    const created = await prisma.profile.create({ data: { name: 'Sam', tier: 2 } })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/profiles/${created.id}`,
    })
    expect(res.statusCode).toBe(403)
  })
})

// ─── POST /auth/pin ───────────────────────────────────────────────────────────

describe('POST /api/auth/pin', () => {
  it('sets a new PIN when none exists', async () => {
    const cookie = await getTier4Cookie()
    // Clear the PIN set by getTier4Cookie
    await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin',
      headers: { cookie },
      payload: { newPin: '5678' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ ok: boolean }>().ok).toBe(true)

    const config = await prisma.systemConfig.findUnique({ where: { key: 'family_pin_hash' } })
    expect(config).not.toBeNull()
    const valid = await bcrypt.compare('5678', config!.value as string)
    expect(valid).toBe(true)
  })

  it('updates PIN when current PIN is provided and correct', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin',
      headers: { cookie },
      payload: { currentPin: '1234', newPin: '9999' },
    })

    expect(res.statusCode).toBe(200)
    const config = await prisma.systemConfig.findUnique({ where: { key: 'family_pin_hash' } })
    const valid = await bcrypt.compare('9999', config!.value as string)
    expect(valid).toBe(true)
  })

  it('returns 422 when PIN exists and currentPin is not provided', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin',
      headers: { cookie },
      payload: { newPin: '5678' },
    })

    expect(res.statusCode).toBe(422)
  })

  it('returns 403 when currentPin is wrong', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin',
      headers: { cookie },
      payload: { currentPin: 'wrong', newPin: '5678' },
    })

    // 'wrong' doesn't match /^\d{4}$/ → 400 from schema validation
    // so use a 4-digit wrong PIN
    expect([400, 403]).toContain(res.statusCode)
  })

  it('returns 403 when currentPin is a valid format but incorrect', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin',
      headers: { cookie },
      payload: { currentPin: '0000', newPin: '5678' },
    })

    expect(res.statusCode).toBe(403)
  })

  it('returns 400 for a non-4-digit newPin', async () => {
    const cookie = await getTier4Cookie()
    await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin',
      headers: { cookie },
      payload: { newPin: '12' },
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 403 when session is tier < 4', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin',
      payload: { newPin: '5678' },
    })
    expect(res.statusCode).toBe(403)
  })
})

// ─── GET /auth/pin-exists ─────────────────────────────────────────────────────

describe('GET /api/auth/pin-exists', () => {
  it('returns exists:false when no PIN has been set', async () => {
    const cookie = await getTier4Cookie()
    await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })

    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/pin-exists',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ exists: boolean }>().exists).toBe(false)
  })

  it('returns exists:true when a PIN is set', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/pin-exists',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ exists: boolean }>().exists).toBe(true)
  })

  it('returns 403 when session is tier < 4', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/auth/pin-exists' })
    expect(res.statusCode).toBe(403)
  })
})

// ─── POST /auth/pin/check ─────────────────────────────────────────────────────

describe('POST /api/auth/pin/check', () => {
  it('returns 200 when the PIN is correct', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin/check',
      headers: { cookie },
      payload: { pin: '1234' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ ok: boolean }>().ok).toBe(true)
  })

  it('returns 403 when the PIN is incorrect', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin/check',
      headers: { cookie },
      payload: { pin: '0000' },
    })

    expect(res.statusCode).toBe(403)
  })

  it('returns 423 when no PIN has been set', async () => {
    const cookie = await getTier4Cookie()
    await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin/check',
      headers: { cookie },
      payload: { pin: '1234' },
    })

    expect(res.statusCode).toBe(423)
  })

  it('returns 400 for a non-4-digit PIN', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin/check',
      headers: { cookie },
      payload: { pin: '12' },
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 403 when session is tier < 4', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/pin/check',
      payload: { pin: '1234' },
    })
    expect(res.statusCode).toBe(403)
  })
})

// ─── GET /profiles/:id/permissions ───────────────────────────────────────────

describe('GET /api/profiles/:id/permissions', () => {
  it('returns all registry permissions with correct inBaseline for tier 1', async () => {
    const cookie = await getTier4Cookie()
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })

    const res = await app.inject({
      method: 'GET',
      url: `/api/profiles/${target.id}/permissions`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    const { permissions } = res.json<{
      permissions: Array<{
        key: string
        inBaseline: boolean
        override: string | null
        overrideId: string | null
      }>
    }>()
    expect(permissions).toHaveLength(11)
    expect(permissions.every((p) => p.override === null && p.overrideId === null)).toBe(true)
    // tier 1 baseline: view platform.Plugin + view chores.Task + complete
    // chores.Task (every tier can complete its own assigned task) + view
    // calendar.Event (the shared family calendar — every tier reads it) + update
    // platform.Avatar (every tier sets its OWN photo — ADR 042) + update
    // platform.Color (every tier picks its OWN colour — ADR 044, same argument:
    // choosing how you appear is not administration)
    expect(permissions.find((p) => p.key === 'platform.plugin.view')?.inBaseline).toBe(true)
    expect(permissions.find((p) => p.key === 'chores.task.view')?.inBaseline).toBe(true)
    expect(permissions.find((p) => p.key === 'chores.task.complete')?.inBaseline).toBe(true)
    expect(permissions.find((p) => p.key === 'calendar.event.view')?.inBaseline).toBe(true)
    expect(permissions.find((p) => p.key === 'platform.profile.avatar')?.inBaseline).toBe(true)
    expect(permissions.find((p) => p.key === 'platform.profile.color')?.inBaseline).toBe(true)
    expect(permissions.find((p) => p.key === 'platform.profile.view')?.inBaseline).toBe(false)
    expect(permissions.find((p) => p.key === 'platform.profile.switch')?.inBaseline).toBe(false)
    expect(permissions.find((p) => p.key === 'family-feed.post.create')?.inBaseline).toBe(false)
    expect(permissions.find((p) => p.key === 'chores.task.create')?.inBaseline).toBe(false)
    expect(permissions.find((p) => p.key === 'calendar.event.create')?.inBaseline).toBe(false)
  })

  it('reflects an existing override in the response', async () => {
    const cookie = await getTier4Cookie()
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })
    const override = await prisma.permissionOverride.create({
      data: {
        profileId: target.id,
        action: 'view',
        subject: 'platform.Plugin',
        type: 'revocation',
        grantedBy: 'seed-parent-1',
      },
    })

    const res = await app.inject({
      method: 'GET',
      url: `/api/profiles/${target.id}/permissions`,
      headers: { cookie },
    })

    const { permissions } = res.json<{
      permissions: Array<{ key: string; override: string | null; overrideId: string | null }>
    }>()
    const p = permissions.find((p) => p.key === 'platform.plugin.view')
    expect(p?.override).toBe('revocation')
    expect(p?.overrideId).toBe(override.id)
  })

  it('returns 403 when session is tier < 4', async () => {
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })

    const res = await app.inject({
      method: 'GET',
      url: `/api/profiles/${target.id}/permissions`,
    })

    expect(res.statusCode).toBe(403)
  })

  it('returns 404 for a non-existent profile', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'GET',
      url: '/api/profiles/nonexistent/permissions',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(404)
  })
})

// ─── POST /profiles/:id/permissions ──────────────────────────────────────────

describe('POST /api/profiles/:id/permissions', () => {
  it('creates a revocation override for a baseline permission', async () => {
    const cookie = await getTier4Cookie()
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })

    const res = await app.inject({
      method: 'POST',
      url: `/api/profiles/${target.id}/permissions`,
      headers: { cookie },
      payload: { action: 'view', subject: 'platform.Plugin', type: 'revocation' },
    })

    expect(res.statusCode).toBe(200)
    const { id } = res.json<{ id: string }>()
    const saved = await prisma.permissionOverride.findUnique({ where: { id } })
    expect(saved?.type).toBe('revocation')
    expect(saved?.profileId).toBe(target.id)
    expect(saved?.grantedBy).toBe('seed-parent-1')
  })

  it('creates a grant override for a non-baseline permission', async () => {
    const cookie = await getTier4Cookie()
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })

    const res = await app.inject({
      method: 'POST',
      url: `/api/profiles/${target.id}/permissions`,
      headers: { cookie },
      payload: { action: 'switch', subject: 'platform.Profile', type: 'grant' },
    })

    expect(res.statusCode).toBe(200)
    const { id } = res.json<{ id: string }>()
    const saved = await prisma.permissionOverride.findUnique({ where: { id } })
    expect(saved?.type).toBe('grant')
  })

  it('returns 403 when trying to edit own profile overrides', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles/seed-parent-1/permissions',
      headers: { cookie },
      payload: { action: 'view', subject: 'platform.Plugin', type: 'revocation' },
    })

    expect(res.statusCode).toBe(403)
  })

  it('returns 403 when session is tier < 4', async () => {
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })

    const res = await app.inject({
      method: 'POST',
      url: `/api/profiles/${target.id}/permissions`,
      payload: { action: 'view', subject: 'platform.Plugin', type: 'revocation' },
    })

    expect(res.statusCode).toBe(403)
  })

  it('returns 404 for a non-existent profile', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles/nonexistent/permissions',
      headers: { cookie },
      payload: { action: 'view', subject: 'platform.Plugin', type: 'revocation' },
    })

    expect(res.statusCode).toBe(404)
  })

  it('returns 400 for an invalid body', async () => {
    const cookie = await getTier4Cookie()
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })

    const res = await app.inject({
      method: 'POST',
      url: `/api/profiles/${target.id}/permissions`,
      headers: { cookie },
      payload: { action: 'view' },
    })

    expect(res.statusCode).toBe(400)
  })
})

// ─── DELETE /profiles/:id/permissions/:permissionId ──────────────────────────

describe('DELETE /api/profiles/:id/permissions/:permissionId', () => {
  it('deletes an existing override', async () => {
    const cookie = await getTier4Cookie()
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })
    const override = await prisma.permissionOverride.create({
      data: {
        profileId: target.id,
        action: 'view',
        subject: 'platform.Plugin',
        type: 'revocation',
        grantedBy: 'seed-parent-1',
      },
    })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/profiles/${target.id}/permissions/${override.id}`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ ok: boolean }>().ok).toBe(true)
    expect(await prisma.permissionOverride.findUnique({ where: { id: override.id } })).toBeNull()
  })

  it('returns 403 when trying to edit own profile overrides', async () => {
    const cookie = await getTier4Cookie()
    const override = await prisma.permissionOverride.create({
      data: {
        profileId: 'seed-parent-1',
        action: 'view',
        subject: 'platform.Plugin',
        type: 'revocation',
        grantedBy: 'seed-parent-1',
      },
    })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/profiles/seed-parent-1/permissions/${override.id}`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(403)
  })

  it('returns 403 when session is tier < 4', async () => {
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })
    const override = await prisma.permissionOverride.create({
      data: {
        profileId: target.id,
        action: 'view',
        subject: 'platform.Plugin',
        type: 'revocation',
        grantedBy: 'seed-parent-1',
      },
    })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/profiles/${target.id}/permissions/${override.id}`,
    })

    expect(res.statusCode).toBe(403)
  })

  it('returns 404 when the override does not exist', async () => {
    const cookie = await getTier4Cookie()
    const target = await prisma.profile.create({ data: { name: 'Test', tier: 1 } })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/profiles/${target.id}/permissions/nonexistent-id`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(404)
  })
})

// ─── PATCH /settings/family-name ─────────────────────────────────────────────

describe('PATCH /api/settings/family-name', () => {
  it('sets the family name when none exists', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/settings/family-name',
      headers: { cookie },
      payload: { name: 'The Smiths' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json<{ familyName: string }>().familyName).toBe('The Smiths')

    const config = await prisma.systemConfig.findUnique({ where: { key: 'family_name' } })
    expect(config?.value).toBe('The Smiths')
  })

  it('updates an existing family name', async () => {
    const cookie = await getTier4Cookie()
    await prisma.systemConfig.create({ data: { key: 'family_name', value: 'The Joneses' } })

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/settings/family-name',
      headers: { cookie },
      payload: { name: 'The Smiths' },
    })

    expect(res.statusCode).toBe(200)
    const config = await prisma.systemConfig.findUnique({ where: { key: 'family_name' } })
    expect(config?.value).toBe('The Smiths')
  })

  it('returns 400 when name is empty', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/settings/family-name',
      headers: { cookie },
      payload: { name: '' },
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 403 when session is tier < 4', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/settings/family-name',
      payload: { name: 'The Smiths' },
    })
    expect(res.statusCode).toBe(403)
  })
})
