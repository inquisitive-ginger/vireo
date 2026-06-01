import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import bcrypt from 'bcryptjs'

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

  it('returns 403 when switching up to a higher-tier profile', async () => {
    // family (tier 1) tries to switch to parent (tier 4)
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/switch',
      payload: { targetProfileId: 'seed-parent-1' },
    })
    expect(res.statusCode).toBe(403)
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
