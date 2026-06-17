import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { chorePrisma } from '@family-os/plugin-chore-engine/db'

import type { LightMyRequestResponse } from 'fastify'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

// Fixed UUIDs for test profiles — assignee_id/created_by are @db.Uuid
const PARENT_ID = '00000000-c40e-0001-0000-000000000001' // tier 4
const TEEN_ID = '00000000-c40e-0001-0000-000000000002' // tier 3
const TWEEN_ID = '00000000-c40e-0001-0000-000000000003' // tier 2
const KID_ID = '00000000-c40e-0001-0000-000000000004' // tier 1
const ALL_IDS = [PARENT_ID, TEEN_ID, TWEEN_ID, KID_ID]

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

async function clearTasks() {
  await chorePrisma.task.deleteMany({ where: { assigneeId: { in: ALL_IDS } } })
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
    where: { id: TWEEN_ID },
    update: { name: 'Tween', tier: 2 },
    create: { id: TWEEN_ID, name: 'Tween', tier: 2 },
  })
  await prisma.profile.upsert({
    where: { id: KID_ID },
    update: { name: 'Kid', tier: 1 },
    create: { id: KID_ID, name: 'Kid', tier: 1 },
  })
})

afterAll(async () => {
  await clearTasks()
  await prisma.profile.deleteMany({ where: { id: { in: ALL_IDS } } })
  await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })
  await app.close()
  await prisma.$disconnect()
  await chorePrisma.$disconnect()
})

beforeEach(clearTasks)

// ─── POST /api/chores/tasks ───────────────────────────────────────────────────

describe('POST /api/chores/tasks', () => {
  it('creates a task and returns 201 for a tier-4 profile', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: 'Take out the trash', assigneeId: KID_ID },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.title).toBe('Take out the trash')
    expect(body.assigneeId).toBe(KID_ID)
    expect(body.assigneeName).toBe('Kid')
    expect(body.status).toBe('pending')
    expect(body.xpReward).toBe(10)
    expect(body.createdBy).toBe(PARENT_ID)
    expect(body.id).toBeDefined()
    expect(body.createdAt).toBeDefined()
  })

  it('returns 403 for a tier-3 profile', async () => {
    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: 'Clean room', assigneeId: KID_ID },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 403 for the family pseudo-profile (no session)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      payload: { title: 'Clean room', assigneeId: KID_ID },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 400 when assigneeId is omitted', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: 'Unassigned task' },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 400 when title is empty', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: '   ', assigneeId: KID_ID },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 404 when the assignee does not exist', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: 'Ghost task', assigneeId: '00000000-c40e-0001-0000-0000000000ff' },
    })
    expect(res.statusCode).toBe(404)
  })

  it('honors a custom xpReward', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: 'Big chore', assigneeId: KID_ID, xpReward: 25 },
    })
    expect(res.statusCode).toBe(201)
    expect(res.json().xpReward).toBe(25)
  })
})

// ─── GET /api/chores/tasks ────────────────────────────────────────────────────

describe('GET /api/chores/tasks', () => {
  async function seedTasks() {
    await chorePrisma.task.create({
      data: { title: 'Kid task', assigneeId: KID_ID, createdBy: PARENT_ID },
    })
    await chorePrisma.task.create({
      data: { title: 'Tween task', assigneeId: TWEEN_ID, createdBy: PARENT_ID },
    })
    await chorePrisma.task.create({
      data: { title: 'Teen task', assigneeId: TEEN_ID, createdBy: PARENT_ID },
    })
  }

  it('returns an empty list when no tasks exist', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/chores/tasks',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().tasks).toEqual([])
  })

  it('returns all family tasks for the family pseudo-profile (no session)', async () => {
    // The default unattended state resolves to the family pseudo-profile (id
    // "family", tier 1). It sees the whole family's chores (family framing) and
    // must not crash on the uuid assignee_id column.
    await seedTasks()
    const res = await app.inject({ method: 'GET', url: '/api/chores/tasks' })
    expect(res.statusCode).toBe(200)
    expect(res.json().tasks).toHaveLength(3)
  })

  it('returns only the active profile’s tasks for a tier-1 profile', async () => {
    await seedTasks()
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/chores/tasks',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    const { tasks } = res.json()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].assigneeId).toBe(KID_ID)
    expect(tasks[0].title).toBe('Kid task')
  })

  it('returns only the active profile’s tasks for a tier-2 profile', async () => {
    await seedTasks()
    const cookie = await getCookieForProfile(TWEEN_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/chores/tasks',
      headers: { cookie },
    })
    const { tasks } = res.json()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].assigneeId).toBe(TWEEN_ID)
  })

  it('returns only the active profile’s tasks for a tier-3 profile', async () => {
    await seedTasks()
    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/chores/tasks',
      headers: { cookie },
    })
    const { tasks } = res.json()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].assigneeId).toBe(TEEN_ID)
  })

  it('returns all family tasks for a tier-4 profile', async () => {
    await seedTasks()
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/chores/tasks',
      headers: { cookie },
    })
    const { tasks } = res.json()
    expect(tasks).toHaveLength(3)
    expect(tasks.map((t: { assigneeName: string }) => t.assigneeName).sort()).toEqual([
      'Kid',
      'Teen',
      'Tween',
    ])
  })

  it('includes the joined assignee name', async () => {
    await chorePrisma.task.create({
      data: { title: 'Named task', assigneeId: KID_ID, createdBy: PARENT_ID },
    })
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/chores/tasks',
      headers: { cookie },
    })
    expect(res.json().tasks[0].assigneeName).toBe('Kid')
  })
})
