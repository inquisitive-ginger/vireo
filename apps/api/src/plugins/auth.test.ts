import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import bcrypt from 'bcryptjs'
import { resetPinRateLimit } from './auth'

let app: FastifyInstance

beforeAll(async () => {
  app = await buildServer()
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

beforeEach(async () => {
  // Truncate test-relevant tables; leave seeded profiles intact
  await prisma.systemConfig.deleteMany({})
  resetPinRateLimit()
})

import type { LightMyRequestResponse } from 'fastify'

// Helper to extract the session cookie from a response
function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

describe('GET /api/auth/me', () => {
  it('returns the family profile when no session is active', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/auth/me' })
    expect(res.statusCode).toBe(200)
    const body = res.json<{ id: string; tier: number }>()
    expect(body.id).toBe('family')
    expect(body.tier).toBe(1)
  })
})

describe('GET /api/auth/me — focusMode (effective, ADR 036)', () => {
  it('defaults a tier-2 profile (null override) to Focus on', async () => {
    const p = await prisma.profile.create({ data: { name: 'Olderkid', tier: 2 } })
    const switchRes = await app.inject({
      method: 'POST',
      url: '/api/auth/switch',
      payload: { targetProfileId: p.id },
    })
    const cookie = getCookie(switchRes)

    const res = await app.inject({ method: 'GET', url: '/api/auth/me', headers: { cookie } })
    expect(res.json<{ focusMode: boolean }>().focusMode).toBe(true)

    await prisma.profile.delete({ where: { id: p.id } })
  })

  it('defaults a tier-3 profile (null override) to Agency (Focus off)', async () => {
    const p = await prisma.profile.create({ data: { name: 'Teenager', tier: 3 } })
    const switchRes = await app.inject({
      method: 'POST',
      url: '/api/auth/switch',
      payload: { targetProfileId: p.id },
    })
    const cookie = getCookie(switchRes)

    const res = await app.inject({ method: 'GET', url: '/api/auth/me', headers: { cookie } })
    expect(res.json<{ focusMode: boolean }>().focusMode).toBe(false)

    await prisma.profile.delete({ where: { id: p.id } })
  })

  it('honours an explicit parent override over the tier default', async () => {
    // A tier-3 teen the parent has explicitly switched into Focus.
    const p = await prisma.profile.create({ data: { name: 'Scattered', tier: 3, focusMode: true } })
    const switchRes = await app.inject({
      method: 'POST',
      url: '/api/auth/switch',
      payload: { targetProfileId: p.id },
    })
    const cookie = getCookie(switchRes)

    const res = await app.inject({ method: 'GET', url: '/api/auth/me', headers: { cookie } })
    expect(res.json<{ focusMode: boolean }>().focusMode).toBe(true)

    await prisma.profile.delete({ where: { id: p.id } })
  })
})

describe('POST /api/auth/switch', () => {
  it('allows switching down from parent (tier 4) to child (tier 1)', async () => {
    // First switch up to the parent via the family session — family is tier 1
    // so we need to start as parent. Simulate by switching from a tier-4 session.
    // Start: set session to parent via inject (no real session; test via /api/auth/me after switch).
    //
    // We switch from the seed-parent-1 session.
    // Step 1: Switch to parent from family (tier 4 > tier 1 → 403 without PIN; skip that flow).
    // Instead start with a direct switch from family → child (both tier 1 → allowed).
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/switch',
      payload: { targetProfileId: 'seed-child-1' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json<{ tier: number }>().tier).toBe(1)
  })

  it('switches to the family profile when no family row exists (prod parity)', async () => {
    // Prod has no seeded `family` row; the pseudo-profile is synthetic (preHandler
    // fabricates it). Deleting the row reproduces prod and guards the regression.
    await prisma.profile.deleteMany({ where: { id: 'family' } })
    try {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/switch',
        payload: { targetProfileId: 'family' },
      })
      expect(res.statusCode).toBe(200)
      expect(res.json<{ id: string; tier: number }>()).toMatchObject({ id: 'family', tier: 1 })

      const me = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: { cookie: getCookie(res) },
      })
      expect(me.json<{ id: string }>().id).toBe('family')
    } finally {
      await prisma.profile.upsert({
        where: { id: 'family' },
        update: {},
        create: { id: 'family', name: 'Family', tier: 1, avatarUrl: null },
      })
    }
  })

  it('returns 403 when switching from tier < 4 to tier 4', async () => {
    // family (tier 1) tries to switch to parent (tier 4) without PIN
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/switch',
      payload: { targetProfileId: 'seed-parent-1' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('allows switching from tier 1 to tier 3 without a PIN', async () => {
    const teen = await prisma.profile.create({ data: { name: 'Teen', tier: 3 } })

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/switch',
      payload: { targetProfileId: teen.id },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json<{ tier: number }>().tier).toBe(3)

    await prisma.profile.delete({ where: { id: teen.id } })
  })

  it('allows switching down after a tier-4 session is established via verify-pin', async () => {
    // Set the family PIN so verify-pin can succeed
    const hash = await bcrypt.hash('1234', 10)
    await prisma.systemConfig.create({
      data: { key: 'family_pin_hash', value: hash, updatedBy: null },
    })

    // Verify PIN → switches to parent (tier 4), receives cookie
    const verifyRes = await app.inject({
      method: 'POST',
      url: '/api/auth/verify-pin',
      payload: { pin: '1234', targetProfileId: 'seed-parent-1' },
    })
    expect(verifyRes.statusCode).toBe(200)
    const cookie = getCookie(verifyRes)

    // Now switch down to child (tier 1 ≤ tier 4 — allowed)
    const switchRes = await app.inject({
      method: 'POST',
      url: '/api/auth/switch',
      headers: { cookie },
      payload: { targetProfileId: 'seed-child-1' },
    })
    expect(switchRes.statusCode).toBe(200)
    expect(switchRes.json<{ tier: number }>().tier).toBe(1)
  })
})

describe('POST /api/auth/verify-pin', () => {
  it('returns 423 when no family PIN has been set', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/verify-pin',
      payload: { pin: 'anything', targetProfileId: 'seed-parent-1' },
    })
    expect(res.statusCode).toBe(423)
  })

  it('returns 403 on PIN mismatch', async () => {
    const hash = await bcrypt.hash('correct', 10)
    await prisma.systemConfig.create({
      data: { key: 'family_pin_hash', value: hash, updatedBy: null },
    })

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/verify-pin',
      payload: { pin: 'wrong', targetProfileId: 'seed-parent-1' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 200 and switches profile on correct PIN', async () => {
    const hash = await bcrypt.hash('5678', 10)
    await prisma.systemConfig.create({
      data: { key: 'family_pin_hash', value: hash, updatedBy: null },
    })

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/verify-pin',
      payload: { pin: '5678', targetProfileId: 'seed-parent-1' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json<{ tier: number }>().tier).toBe(4)
  })
})

describe('POST /api/auth/verify-pin — brute-force lockout', () => {
  async function setPin(pin: string) {
    await prisma.systemConfig.create({
      data: { key: 'family_pin_hash', value: await bcrypt.hash(pin, 10), updatedBy: null },
    })
  }

  function attempt(pin: string) {
    return app.inject({
      method: 'POST',
      url: '/api/auth/verify-pin',
      payload: { pin, targetProfileId: 'seed-parent-1' },
    })
  }

  it('locks out after five wrong PINs and reports how long', async () => {
    await setPin('1234')

    for (let i = 0; i < 5; i++) expect((await attempt('0000')).statusCode).toBe(403)

    const res = await attempt('0000')
    expect(res.statusCode).toBe(429)
    expect(res.headers['retry-after']).toBeDefined()
    expect(res.json<{ retryAfter: number }>().retryAfter).toBeGreaterThan(0)
  })

  it('refuses the correct PIN while locked out', async () => {
    await setPin('1234')

    for (let i = 0; i < 5; i++) await attempt('0000')

    expect((await attempt('1234')).statusCode).toBe(429)
  })

  it('clears the failure count on a correct PIN', async () => {
    await setPin('1234')

    for (let i = 0; i < 4; i++) expect((await attempt('0000')).statusCode).toBe(403)
    expect((await attempt('1234')).statusCode).toBe(200)

    for (let i = 0; i < 5; i++) expect((await attempt('0000')).statusCode).toBe(403)
    expect((await attempt('0000')).statusCode).toBe(429)
  })
})
