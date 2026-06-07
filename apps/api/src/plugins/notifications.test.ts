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

async function getTier1Cookie(): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/switch',
    payload: { targetProfileId: 'seed-child-1' },
  })
  return getCookie(res)
}

beforeAll(async () => {
  app = await buildServer()
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.notification.deleteMany()
  await prisma.systemConfig.deleteMany({
    where: { key: { in: ['family_pin_hash'] } },
  })
})

// ─── POST /notifications ──────────────────────────────────────────────────────

describe('POST /api/notifications', () => {
  it('persists a notification for tier 4 profile', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/notifications',
      headers: { cookie },
      payload: { title: 'Task done', variant: 'success', priority: 'info' },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.ok).toBe(true)
    expect(body.id).toBeTruthy()

    const saved = await prisma.notification.findUnique({ where: { id: body.id } })
    expect(saved?.title).toBe('Task done')
    expect(saved?.variant).toBe('success')
    expect(saved?.isRead).toBe(false)
  })

  it('does not persist for tier 1 profiles (family pseudo-profile)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/notifications',
      payload: { title: 'Should not persist', variant: 'info' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().ok).toBe(true)
    expect(res.json().id).toBeUndefined()

    const count = await prisma.notification.count()
    expect(count).toBe(0)
  })

  it('persists optional body field', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'POST',
      url: '/api/notifications',
      headers: { cookie },
      payload: { title: 'Alert!', body: 'Something needs attention', variant: 'warning' },
    })

    const saved = await prisma.notification.findUnique({ where: { id: res.json().id } })
    expect(saved?.body).toBe('Something needs attention')
  })

  it('prunes to 50 notifications on insert', async () => {
    const cookie = await getTier4Cookie()

    // Create 50 existing notifications
    await prisma.notification.createMany({
      data: Array.from({ length: 50 }, (_, i) => ({
        profileId: 'seed-parent-1',
        title: `Old notification ${i}`,
        variant: 'info',
        priority: 'info',
      })),
    })

    // Insert one more — should trigger pruning
    await app.inject({
      method: 'POST',
      url: '/api/notifications',
      headers: { cookie },
      payload: { title: 'New one', variant: 'success' },
    })

    const count = await prisma.notification.count({ where: { profileId: 'seed-parent-1' } })
    expect(count).toBe(50)
  })
})

// ─── GET /notifications ───────────────────────────────────────────────────────

describe('GET /api/notifications', () => {
  it('returns notifications newest first for tier 4 profile', async () => {
    const cookie = await getTier4Cookie()
    const now = new Date()
    const earlier = new Date(now.getTime() - 5000)

    await prisma.notification.createMany({
      data: [
        {
          profileId: 'seed-parent-1',
          title: 'First',
          variant: 'info',
          priority: 'info',
          createdAt: earlier,
        },
        {
          profileId: 'seed-parent-1',
          title: 'Second',
          variant: 'success',
          priority: 'info',
          createdAt: now,
        },
      ],
    })

    const res = await app.inject({ method: 'GET', url: '/api/notifications', headers: { cookie } })

    expect(res.statusCode).toBe(200)
    const notifications = res.json()
    expect(notifications).toHaveLength(2)
    expect(notifications[0].title).toBe('Second')
    expect(notifications[1].title).toBe('First')
  })

  it('returns 403 for tier 1 (family pseudo-profile)', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/notifications' })
    expect(res.statusCode).toBe(403)
  })

  it('only returns notifications for the active profile', async () => {
    const cookie = await getTier4Cookie()

    await prisma.notification.createMany({
      data: [
        { profileId: 'seed-parent-1', title: 'Mine', variant: 'info', priority: 'info' },
        { profileId: 'seed-child-1', title: 'Someone elses', variant: 'info', priority: 'info' },
      ],
    })

    const res = await app.inject({ method: 'GET', url: '/api/notifications', headers: { cookie } })
    const notifications = res.json()
    expect(notifications).toHaveLength(1)
    expect(notifications[0].title).toBe('Mine')
  })
})

// ─── GET /notifications/unread ────────────────────────────────────────────────

describe('GET /api/notifications/unread', () => {
  it('returns unread count and max severity', async () => {
    const cookie = await getTier4Cookie()

    await prisma.notification.createMany({
      data: [
        {
          profileId: 'seed-parent-1',
          title: 'A',
          variant: 'info',
          priority: 'info',
          isRead: false,
        },
        {
          profileId: 'seed-parent-1',
          title: 'B',
          variant: 'warning',
          priority: 'info',
          isRead: false,
        },
        {
          profileId: 'seed-parent-1',
          title: 'C',
          variant: 'success',
          priority: 'info',
          isRead: true,
        },
      ],
    })

    const res = await app.inject({
      method: 'GET',
      url: '/api/notifications/unread',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.unreadCount).toBe(2)
    expect(body.maxSeverity).toBe('warning')
  })

  it('returns null maxSeverity when no unread notifications', async () => {
    const cookie = await getTier4Cookie()

    const res = await app.inject({
      method: 'GET',
      url: '/api/notifications/unread',
      headers: { cookie },
    })

    const body = res.json()
    expect(body.unreadCount).toBe(0)
    expect(body.maxSeverity).toBeNull()
  })

  it('prioritises error over warning over info/success', async () => {
    const cookie = await getTier4Cookie()

    await prisma.notification.createMany({
      data: [
        {
          profileId: 'seed-parent-1',
          title: 'W',
          variant: 'warning',
          priority: 'info',
          isRead: false,
        },
        {
          profileId: 'seed-parent-1',
          title: 'E',
          variant: 'error',
          priority: 'info',
          isRead: false,
        },
        {
          profileId: 'seed-parent-1',
          title: 'S',
          variant: 'success',
          priority: 'info',
          isRead: false,
        },
      ],
    })

    const res = await app.inject({
      method: 'GET',
      url: '/api/notifications/unread',
      headers: { cookie },
    })

    expect(res.json().maxSeverity).toBe('error')
  })
})

// ─── POST /notifications/read ─────────────────────────────────────────────────

describe('POST /api/notifications/read', () => {
  it('marks all unread notifications as read', async () => {
    const cookie = await getTier4Cookie()

    await prisma.notification.createMany({
      data: [
        {
          profileId: 'seed-parent-1',
          title: 'A',
          variant: 'info',
          priority: 'info',
          isRead: false,
        },
        {
          profileId: 'seed-parent-1',
          title: 'B',
          variant: 'warning',
          priority: 'info',
          isRead: false,
        },
      ],
    })

    const res = await app.inject({
      method: 'POST',
      url: '/api/notifications/read',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().ok).toBe(true)

    const unread = await prisma.notification.count({
      where: { profileId: 'seed-parent-1', isRead: false },
    })
    expect(unread).toBe(0)
  })

  it('does not mark notifications of other profiles as read', async () => {
    const cookie = await getTier4Cookie()

    await prisma.notification.create({
      data: {
        profileId: 'seed-child-1',
        title: 'Other',
        variant: 'info',
        priority: 'info',
        isRead: false,
      },
    })

    await app.inject({ method: 'POST', url: '/api/notifications/read', headers: { cookie } })

    const count = await prisma.notification.count({
      where: { profileId: 'seed-child-1', isRead: false },
    })
    expect(count).toBe(1)
  })
})
