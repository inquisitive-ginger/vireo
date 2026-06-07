import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import type { LightMyRequestResponse } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

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

async function getTier3Cookie(): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/switch',
    payload: { targetProfileId: 'seed-teen-1' },
  })
  return getCookie(res)
}

async function getTier2Cookie(): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/switch',
    payload: { targetProfileId: 'seed-child-2' },
  })
  return getCookie(res)
}

const TEST_SUBSCRIPTION = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
  keys: { p256dh: 'test-p256dh-key', auth: 'test-auth-key' },
}

beforeAll(async () => {
  app = await buildServer()

  await prisma.profile.upsert({
    where: { id: 'seed-teen-1' },
    update: { tier: 3 },
    create: { id: 'seed-teen-1', name: 'Teen', tier: 3 },
  })
  await prisma.profile.upsert({
    where: { id: 'seed-child-2' },
    update: { tier: 2 },
    create: { id: 'seed-child-2', name: 'OlderKid', tier: 2 },
  })
})

afterAll(async () => {
  await prisma.profile.deleteMany({ where: { id: { in: ['seed-teen-1', 'seed-child-2'] } } })
  await app.close()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.pushSubscription.deleteMany()
  await prisma.profile.updateMany({
    where: { id: { in: ['seed-parent-1', 'seed-teen-1'] } },
    data: { pushEnabled: false },
  })
  await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })
})

// ─── GET /push/vapid-public-key ───────────────────────────────────────────────

describe('GET /api/push/vapid-public-key', () => {
  it('returns a non-null public key', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/push/vapid-public-key' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(typeof body.publicKey).toBe('string')
    expect(body.publicKey.length).toBeGreaterThan(0)
  })
})

// ─── POST /push/subscribe ─────────────────────────────────────────────────────

describe('POST /api/push/subscribe', () => {
  it('stores a subscription for a tier 4 profile', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/push/subscribe',
      headers: { cookie },
      payload: TEST_SUBSCRIPTION,
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().ok).toBe(true)

    const stored = await prisma.pushSubscription.findUnique({
      where: { endpoint: TEST_SUBSCRIPTION.endpoint },
    })
    expect(stored).not.toBeNull()
    expect(stored?.profileId).toBe('seed-parent-1')
    expect(stored?.p256dhKey).toBe('test-p256dh-key')
    expect(stored?.authKey).toBe('test-auth-key')
  })

  it('does not set push_enabled for tier 4 (always qualifies)', async () => {
    const cookie = await getTier4Cookie()

    await app.inject({
      method: 'POST',
      url: '/api/push/subscribe',
      headers: { cookie },
      payload: TEST_SUBSCRIPTION,
    })

    const profile = await prisma.profile.findUnique({ where: { id: 'seed-parent-1' } })
    expect(profile?.pushEnabled).toBe(false)
  })

  it('stores subscription and sets push_enabled for tier 3', async () => {
    const cookie = await getTier3Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/push/subscribe',
      headers: { cookie },
      payload: TEST_SUBSCRIPTION,
    })

    expect(res.statusCode).toBe(200)

    const stored = await prisma.pushSubscription.findUnique({
      where: { endpoint: TEST_SUBSCRIPTION.endpoint },
    })
    expect(stored?.profileId).toBe('seed-teen-1')

    const profile = await prisma.profile.findUnique({ where: { id: 'seed-teen-1' } })
    expect(profile?.pushEnabled).toBe(true)
  })

  it('returns 403 for tier 2 and below', async () => {
    const cookie = await getTier2Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/push/subscribe',
      headers: { cookie },
      payload: TEST_SUBSCRIPTION,
    })

    expect(res.statusCode).toBe(403)
    const count = await prisma.pushSubscription.count()
    expect(count).toBe(0)
  })

  it('returns 403 for unauthenticated (family pseudo-profile, tier 1)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/push/subscribe',
      payload: TEST_SUBSCRIPTION,
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 400 when required fields are missing', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/push/subscribe',
      headers: { cookie },
      payload: { endpoint: 'https://example.com' },
    })

    expect(res.statusCode).toBe(400)
  })
})

// ─── POST /push/unsubscribe ───────────────────────────────────────────────────

describe('POST /api/push/unsubscribe', () => {
  it('removes a subscription for tier 4', async () => {
    const cookie = await getTier4Cookie()

    await prisma.pushSubscription.create({
      data: {
        profileId: 'seed-parent-1',
        endpoint: TEST_SUBSCRIPTION.endpoint,
        p256dhKey: 'k',
        authKey: 'a',
      },
    })

    const res = await app.inject({
      method: 'POST',
      url: '/api/push/unsubscribe',
      headers: { cookie },
      payload: { endpoint: TEST_SUBSCRIPTION.endpoint },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().ok).toBe(true)
    const remaining = await prisma.pushSubscription.count({
      where: { profileId: 'seed-parent-1' },
    })
    expect(remaining).toBe(0)
  })

  it('clears push_enabled for tier 3 when last subscription removed', async () => {
    const cookie = await getTier3Cookie()

    await prisma.pushSubscription.create({
      data: {
        profileId: 'seed-teen-1',
        endpoint: TEST_SUBSCRIPTION.endpoint,
        p256dhKey: 'k',
        authKey: 'a',
      },
    })
    await prisma.profile.update({ where: { id: 'seed-teen-1' }, data: { pushEnabled: true } })

    await app.inject({
      method: 'POST',
      url: '/api/push/unsubscribe',
      headers: { cookie },
      payload: { endpoint: TEST_SUBSCRIPTION.endpoint },
    })

    const profile = await prisma.profile.findUnique({ where: { id: 'seed-teen-1' } })
    expect(profile?.pushEnabled).toBe(false)
  })

  it('keeps push_enabled for tier 3 if other subscriptions remain', async () => {
    const cookie = await getTier3Cookie()

    await prisma.pushSubscription.createMany({
      data: [
        {
          profileId: 'seed-teen-1',
          endpoint: 'https://endpoint-1.test',
          p256dhKey: 'k1',
          authKey: 'a1',
        },
        {
          profileId: 'seed-teen-1',
          endpoint: 'https://endpoint-2.test',
          p256dhKey: 'k2',
          authKey: 'a2',
        },
      ],
    })
    await prisma.profile.update({ where: { id: 'seed-teen-1' }, data: { pushEnabled: true } })

    await app.inject({
      method: 'POST',
      url: '/api/push/unsubscribe',
      headers: { cookie },
      payload: { endpoint: 'https://endpoint-1.test' },
    })

    const profile = await prisma.profile.findUnique({ where: { id: 'seed-teen-1' } })
    expect(profile?.pushEnabled).toBe(true)
  })

  it('returns 403 for tier 2 and below', async () => {
    const cookie = await getTier2Cookie()
    const res = await app.inject({
      method: 'POST',
      url: '/api/push/unsubscribe',
      headers: { cookie },
      payload: { endpoint: 'https://example.com' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 400 when endpoint is missing', async () => {
    const cookie = await getTier4Cookie()
    const res = await app.inject({
      method: 'POST',
      url: '/api/push/unsubscribe',
      headers: { cookie },
      payload: {},
    })
    expect(res.statusCode).toBe(400)
  })
})
