import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { chorePrisma } from '@family-os/plugin-chores/db'
import * as pushModule from './push'

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
  // Clear chores tables so count assertions stay deterministic across suites.
  await chorePrisma.xpBalance.deleteMany({})
  await chorePrisma.task.deleteMany({})
  await chorePrisma.routine.deleteMany({})
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
    // A free chore scores base XP — derived, not defaulted (ADR 056).
    expect(body.xpReward).toBe(5)
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

  it('derives xpReward from the coin tier (ADR 056)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: 'Big chore', assigneeId: KID_ID, coinReward: 5 },
    })
    expect(res.statusCode).toBe(201)
    expect(res.json().xpReward).toBe(55)
  })

  it('ignores a client-sent xpReward', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: 'Sneaky chore', assigneeId: KID_ID, coinReward: 2, xpReward: 999 },
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

  /* The board draws a face on every row (ADR 042), which it can only do if the
     join carries the avatar. This route already loaded the profile row and threw
     the field away — the same latent gap family-feed shipped with — so chores
     could never have rendered a photo. Locked here so it can't regress silently. */
  it('includes the joined assignee avatar', async () => {
    await prisma.profile.update({
      where: { id: KID_ID },
      data: { avatarUrl: `/api/profiles/${KID_ID}/avatar?v=abc123` },
    })
    await chorePrisma.task.create({
      data: { title: 'Task with a face', assigneeId: KID_ID, createdBy: PARENT_ID },
    })
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/chores/tasks',
      headers: { cookie },
    })
    expect(res.json().tasks[0].assigneeAvatarUrl).toBe(`/api/profiles/${KID_ID}/avatar?v=abc123`)
  })

  it('returns a null avatar for a member with no photo', async () => {
    // Explicit, not seed-dependent: the profile seed persists across tests in this
    // file, so a sibling test setting an avatar must not decide this one's outcome.
    await prisma.profile.update({ where: { id: KID_ID }, data: { avatarUrl: null } })
    await chorePrisma.task.create({
      data: { title: 'Faceless task', assigneeId: KID_ID, createdBy: PARENT_ID },
    })
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/chores/tasks',
      headers: { cookie },
    })
    expect(res.json().tasks[0].assigneeAvatarUrl).toBeNull()
  })
})

// ─── PATCH /api/chores/tasks/:id/complete ─────────────────────────────────────

describe('PATCH /api/chores/tasks/:id/complete', () => {
  async function createTask(assigneeId: string, xpReward = 10) {
    return chorePrisma.task.create({
      data: { title: 'Complete me', assigneeId, createdBy: PARENT_ID, xpReward },
    })
  }

  it('completes the assignee’s own task (200) and sets status + completed_at', async () => {
    const task = await createTask(KID_ID)
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.status).toBe('completed')
    expect(body.completedAt).toBeTruthy()
  })

  it('lets a tier-4 parent complete anyone’s task (200)', async () => {
    const task = await createTask(KID_ID)
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().status).toBe('completed')
  })

  it('returns 403 when a non-assignee, non-admin tries to complete', async () => {
    const task = await createTask(KID_ID)
    const cookie = await getCookieForProfile(TWEEN_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 409 when the task is already completed', async () => {
    const task = await createTask(KID_ID)
    const cookie = await getCookieForProfile(KID_ID)
    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie },
    })
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(409)
  })

  it('returns 404 for an unknown task id', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/00000000-c40e-0001-0000-0000000000ee/complete`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(404)
  })

  it('emits chores.task.completed with the full payload', async () => {
    const task = await createTask(KID_ID, 15)
    const cookie = await getCookieForProfile(KID_ID)
    const events: unknown[] = []
    const off = app.eventBus.on('chores.task.completed', (p) => events.push(p))
    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie },
    })
    off()
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      taskId: task.id,
      assigneeId: KID_ID,
      xpReward: 15,
    })
    expect((events[0] as { completedAt: string }).completedAt).toBeTruthy()
  })
})

// ─── PATCH /api/chores/tasks/:id/reopen ───────────────────────────────────────

describe('PATCH /api/chores/tasks/:id/reopen', () => {
  async function createCompletedTask(assigneeId: string) {
    return chorePrisma.task.create({
      data: {
        title: 'Reopen me',
        assigneeId,
        createdBy: PARENT_ID,
        status: 'completed',
        completedAt: new Date(),
      },
    })
  }

  it('lets a tier-4 parent reopen a completed task (200) — clears completed_at', async () => {
    const task = await createCompletedTask(KID_ID)
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/reopen`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.status).toBe('pending')
    expect(body.completedAt).toBeNull()
  })

  it('returns 403 when the assignee (non-admin) tries to reopen', async () => {
    const task = await createCompletedTask(KID_ID)
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/reopen`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 409 when the task is not completed', async () => {
    const task = await chorePrisma.task.create({
      data: { title: 'Still pending', assigneeId: KID_ID, createdBy: PARENT_ID },
    })
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/reopen`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(409)
  })

  it('emits chores.task.reopened', async () => {
    const task = await createCompletedTask(KID_ID)
    const cookie = await getCookieForProfile(PARENT_ID)
    const events: unknown[] = []
    const off = app.eventBus.on('chores.task.reopened', (p) => events.push(p))
    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/reopen`,
      headers: { cookie },
    })
    off()
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({ taskId: task.id, assigneeId: KID_ID })
  })
})

// ─── PATCH /api/chores/tasks/:id (edit) ──────────────────────────────────────

describe('PATCH /api/chores/tasks/:id', () => {
  async function createTask(assigneeId = KID_ID) {
    return chorePrisma.task.create({
      data: { title: 'Original', assigneeId, createdBy: PARENT_ID, xpReward: 10 },
    })
  }

  it('updates a task’s fields and returns 200 for a tier-4 profile', async () => {
    const task = await createTask()
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}`,
      headers: { cookie },
      payload: { title: 'Edited', assigneeId: TWEEN_ID, coinReward: 2, dueDate: '2026-07-01' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.title).toBe('Edited')
    expect(body.assigneeId).toBe(TWEEN_ID)
    expect(body.assigneeName).toBe('Tween')
    // An edit re-derives — the legacy hand-picked 10 drains to the formula (ADR 056).
    expect(body.xpReward).toBe(25)
    expect(body.dueDate).toBe('2026-07-01')
  })

  it('returns 403 for a tier-3 profile', async () => {
    const task = await createTask()
    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}`,
      headers: { cookie },
      payload: { title: 'Nope', assigneeId: KID_ID },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 404 for an unknown task id', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/chores/tasks/00000000-c40e-0001-0000-0000000000ee',
      headers: { cookie },
      payload: { title: 'Ghost', assigneeId: KID_ID },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 400 when title is empty', async () => {
    const task = await createTask()
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}`,
      headers: { cookie },
      payload: { title: '   ', assigneeId: KID_ID },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 404 when the new assignee does not exist', async () => {
    const task = await createTask()
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}`,
      headers: { cookie },
      payload: { title: 'Edited', assigneeId: '00000000-c40e-0001-0000-0000000000ff' },
    })
    expect(res.statusCode).toBe(404)
  })

  it('clears the due date when an empty string is sent', async () => {
    const task = await chorePrisma.task.create({
      data: { title: 'Dated', assigneeId: KID_ID, createdBy: PARENT_ID, dueDate: new Date() },
    })
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}`,
      headers: { cookie },
      payload: { title: 'Dated', assigneeId: KID_ID, dueDate: '' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().dueDate).toBeNull()
  })
})

// ─── DELETE /api/chores/tasks/:id ────────────────────────────────────────────

describe('DELETE /api/chores/tasks/:id', () => {
  async function createTask(assigneeId = KID_ID) {
    return chorePrisma.task.create({
      data: { title: 'Remove me', assigneeId, createdBy: PARENT_ID },
    })
  }

  it('removes a task and returns 204 for a tier-4 profile', async () => {
    const task = await createTask()
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/chores/tasks/${task.id}`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(204)
    expect(await chorePrisma.task.findUnique({ where: { id: task.id } })).toBeNull()
  })

  it('returns 403 for a tier-3 profile and leaves the task intact', async () => {
    const task = await createTask()
    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/chores/tasks/${task.id}`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(403)
    expect(await chorePrisma.task.findUnique({ where: { id: task.id } })).not.toBeNull()
  })

  it('returns 404 for an unknown task id', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/chores/tasks/00000000-c40e-0001-0000-0000000000ee',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(404)
  })
})

// ─── GET /api/chores/xp ──────────────────────────────────────────────────────

describe('GET /api/chores/xp', () => {
  it('returns 0 for a profile with no completed tasks', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({ method: 'GET', url: '/api/chores/xp', headers: { cookie } })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ totalXp: 0 })
  })

  it('returns the correct cumulative total after multiple completions', async () => {
    const cookie = await getCookieForProfile(KID_ID)

    const t1 = await chorePrisma.task.create({
      data: { title: 'Task 1', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 10 },
    })
    const t2 = await chorePrisma.task.create({
      data: { title: 'Task 2', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 15 },
    })

    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${t1.id}/complete`,
      headers: { cookie },
    })
    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${t2.id}/complete`,
      headers: { cookie },
    })

    // XP subscriber is async (fire-and-forget) — wait briefly for it to settle.
    await new Promise((resolve) => setTimeout(resolve, 50))

    const res = await app.inject({
      method: 'GET',
      url: '/api/chores/xp',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().totalXp).toBe(25)
  })
})

// ─── XP subscriber (unit) ─────────────────────────────────────────────────────

// ─── Routines + up-for-grabs ──────────────────────────────────────────────────

// Fixed local date keys — 2026-07-30 is a Thursday.
const WED = '2026-07-29'
const THU = '2026-07-30'
const FRI = '2026-07-31'
const NEXT_THU = '2026-08-06'

async function getTasks(cookie: string, today: string) {
  const res = await app.inject({
    method: 'GET',
    url: `/api/chores/tasks?today=${today}`,
    headers: { cookie },
  })
  expect(res.statusCode).toBe(200)
  return res.json().tasks as Array<{
    id: string
    title: string
    status: string
    dueDate: string | null
    assigneeId: string | null
    assigneeName: string | null
    routineId: string | null
    routine: { kind: string; repeatDays: number[] } | null
  }>
}

describe('chore routines', () => {
  async function createRoutine(
    cookie: string,
    payload: Record<string, unknown>
  ): Promise<LightMyRequestResponse> {
    return app.inject({ method: 'POST', url: '/api/chores/routines', headers: { cookie }, payload })
  }

  it('creates a routine for tier 4 and rejects tier 3', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const created = await createRoutine(parent, {
      title: 'Take out the trash',
      assigneeId: KID_ID,
      kind: 'days',
      repeatDays: [1, 4],
      coinReward: 2,
    })
    expect(created.statusCode).toBe(201)
    expect(created.json().kind).toBe('days')
    expect(created.json().repeatDays).toEqual([1, 4])

    const teen = await getCookieForProfile(TEEN_ID)
    const denied = await createRoutine(teen, {
      title: 'Nope',
      assigneeId: KID_ID,
      kind: 'ongoing',
    })
    expect(denied.statusCode).toBe(403)
  })

  it('rejects a days routine with no days', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const res = await createRoutine(parent, {
      title: 'Trash',
      assigneeId: KID_ID,
      kind: 'days',
      repeatDays: [],
    })
    expect(res.statusCode).toBe(400)
  })

  it('materializes the next scheduled occurrence on read, exactly once', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    await createRoutine(parent, {
      title: 'Take out the trash',
      assigneeId: KID_ID,
      kind: 'days',
      repeatDays: [4], // Thursdays
    })

    // Wednesday read → Thursday's row is visible ahead, once, wearing the rule.
    let tasks = await getTasks(parent, WED)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].dueDate).toBe(THU)
    expect(tasks[0].routine).toEqual({ kind: 'days', repeatDays: [4] })

    tasks = await getTasks(parent, WED)
    expect(tasks).toHaveLength(1)
  })

  it('ongoing: done for today, back tomorrow — and XP per occurrence', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const kid = await getCookieForProfile(KID_ID)
    await createRoutine(parent, {
      title: 'Empty the dishwasher',
      assigneeId: KID_ID,
      kind: 'ongoing',
    })

    let tasks = await getTasks(kid, THU)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].dueDate).toBe(THU)

    const complete = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${tasks[0].id}/complete`,
      headers: { cookie: kid },
    })
    expect(complete.statusCode).toBe(200)

    // Same-day read: stays done, no respawn (the (routineId, dueDate) unique).
    tasks = await getTasks(kid, THU)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].status).toBe('completed')

    // Next-day read: a fresh pending row.
    tasks = await getTasks(kid, FRI)
    expect(tasks).toHaveLength(2)
    const fresh = tasks.find((t) => t.status === 'pending')!
    expect(fresh.dueDate).toBe(FRI)

    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${fresh.id}/complete`,
      headers: { cookie: kid },
    })
    // Each occurrence is its own row, so each pays XP once (5 base × 2).
    await vi.waitFor(async () => {
      const balance = await chorePrisma.xpBalance.findUnique({ where: { profileId: KID_ID } })
      expect(balance?.totalXp).toBe(10)
    })
  })

  it('a missed day stays overdue, then rolls forward at the next occurrence', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    await createRoutine(parent, {
      title: 'Take out the trash',
      assigneeId: KID_ID,
      kind: 'days',
      repeatDays: [4],
    })

    let tasks = await getTasks(parent, THU)
    expect(tasks[0].dueDate).toBe(THU)
    const openId = tasks[0].id

    // Friday: missed, still the same row (overdue on the client), no new spawn.
    tasks = await getTasks(parent, FRI)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].id).toBe(openId)
    expect(tasks[0].dueDate).toBe(THU)

    // Next Thursday: the open row re-dates — this week's trash, not last week's debt.
    tasks = await getTasks(parent, NEXT_THU)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].id).toBe(openId)
    expect(tasks[0].dueDate).toBe(NEXT_THU)
  })

  it('PATCH re-stamps: the open row respawns from the new rule', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const created = await createRoutine(parent, {
      title: 'Empty the dishwasher',
      assigneeId: KID_ID,
      kind: 'ongoing',
    })
    const routineId = created.json().id as string

    let tasks = await getTasks(parent, THU)
    expect(tasks).toHaveLength(1)

    const patched = await app.inject({
      method: 'PATCH',
      url: `/api/chores/routines/${routineId}`,
      headers: { cookie: parent },
      payload: { title: 'Load the dishwasher', assigneeId: null, kind: 'ongoing' },
    })
    expect(patched.statusCode).toBe(200)

    tasks = await getTasks(parent, THU)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Load the dishwasher')
    expect(tasks[0].assigneeId).toBeNull()
  })

  it('DELETE ends the routine: open row gone, history kept, no more spawns', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const kid = await getCookieForProfile(KID_ID)
    const created = await createRoutine(parent, {
      title: 'Empty the dishwasher',
      assigneeId: KID_ID,
      kind: 'ongoing',
    })
    const routineId = created.json().id as string

    let tasks = await getTasks(kid, THU)
    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${tasks[0].id}/complete`,
      headers: { cookie: kid },
    })
    // Friday's fresh row exists, then the routine ends.
    await getTasks(kid, FRI)
    const ended = await app.inject({
      method: 'DELETE',
      url: `/api/chores/routines/${routineId}`,
      headers: { cookie: parent },
    })
    expect(ended.statusCode).toBe(204)

    tasks = await getTasks(kid, FRI)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].status).toBe('completed')
  })
})

describe('up for grabs', () => {
  async function createUnassigned(cookie: string): Promise<string> {
    const res = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: 'Water the plants', assigneeId: null },
    })
    expect(res.statusCode).toBe(201)
    expect(res.json().assigneeName).toBeNull()
    return res.json().id as string
  }

  it('is visible to every member alongside their own tasks', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    await createUnassigned(parent)
    await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie: parent },
      payload: { title: 'Teen-only task', assigneeId: TEEN_ID },
    })

    const kid = await getCookieForProfile(KID_ID)
    const tasks = await getTasks(kid, THU)
    expect(tasks.map((t) => t.title)).toEqual(['Water the plants'])
  })

  it('claim takes it; a second claim and completing unclaimed are refused', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const taskId = await createUnassigned(parent)

    // Completing before anyone claims has nobody to pay.
    const early = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${taskId}/complete`,
      headers: { cookie: parent },
    })
    expect(early.statusCode).toBe(409)

    const kid = await getCookieForProfile(KID_ID)
    const claim = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${taskId}/claim`,
      headers: { cookie: kid },
    })
    expect(claim.statusCode).toBe(200)
    expect(claim.json().assigneeId).toBe(KID_ID)
    expect(claim.json().assigneeName).toBe('Kid')

    const tween = await getCookieForProfile(TWEEN_ID)
    const second = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${taskId}/claim`,
      headers: { cookie: tween },
    })
    expect(second.statusCode).toBe(409)

    // The claimer completes it like any assigned task.
    const complete = await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${taskId}/complete`,
      headers: { cookie: kid },
    })
    expect(complete.statusCode).toBe(200)
  })

  it('the family pseudo-profile cannot claim', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const taskId = await createUnassigned(parent)
    const res = await app.inject({ method: 'PATCH', url: `/api/chores/tasks/${taskId}/claim` })
    expect(res.statusCode).toBe(403)
  })
})

describe('XP event subscriber', () => {
  it('credits xpReward to the assignee on chores.task.completed', async () => {
    const task = await chorePrisma.task.create({
      data: { title: 'XP task', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 20 },
    })
    const cookie = await getCookieForProfile(KID_ID)

    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie },
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const balance = await chorePrisma.xpBalance.findUnique({ where: { profileId: KID_ID } })
    expect(balance?.totalXp).toBe(20)
  })

  it('accumulates XP across multiple completions', async () => {
    const cookie = await getCookieForProfile(KID_ID)

    const t1 = await chorePrisma.task.create({
      data: { title: 'First', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 5 },
    })
    const t2 = await chorePrisma.task.create({
      data: { title: 'Second', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 10 },
    })

    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${t1.id}/complete`,
      headers: { cookie },
    })
    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${t2.id}/complete`,
      headers: { cookie },
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const balance = await chorePrisma.xpBalance.findUnique({ where: { profileId: KID_ID } })
    expect(balance?.totalXp).toBe(15)
  })

  it('does not credit XP when the task status has been reverted to pending (reopen scenario)', async () => {
    // The idempotency guard re-fetches the task before crediting. If the task
    // was reopened before the handler fires, guard sees status='pending' and bails.
    const task = await chorePrisma.task.create({
      data: { title: 'Idempotent', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 10 },
    })

    // Revert to pending to simulate a reopen before the event handler fires.
    await chorePrisma.task.update({
      where: { id: task.id },
      data: { status: 'pending', completedAt: null },
    })

    app.eventBus.emit('chores.task.completed', {
      taskId: task.id,
      assigneeId: KID_ID,
      xpReward: 10,
      completedAt: new Date().toISOString(),
      title: task.title,
      createdBy: task.createdBy,
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const balance = await chorePrisma.xpBalance.findUnique({ where: { profileId: KID_ID } })
    expect(balance).toBeNull()
  })

  it('awards XP only once across a reopen → re-complete cycle', async () => {
    // XP is up-only and never debited on reopen, so re-completing must not re-award —
    // otherwise a reopen/complete loop farms XP without bound.
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)
    const task = await chorePrisma.task.create({
      data: { title: 'Mow', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 20 },
    })
    const complete = () =>
      app.inject({
        method: 'PATCH',
        url: `/api/chores/tasks/${task.id}/complete`,
        headers: { cookie: kid },
      })
    const reopen = () =>
      app.inject({
        method: 'PATCH',
        url: `/api/chores/tasks/${task.id}/reopen`,
        headers: { cookie: parent },
      })

    await complete()
    await new Promise((r) => setTimeout(r, 40))
    await reopen()
    await complete()
    await reopen()
    await complete()
    await new Promise((r) => setTimeout(r, 60))

    // Three completions, one award.
    const balance = await chorePrisma.xpBalance.findUnique({ where: { profileId: KID_ID } })
    expect(balance?.totalXp).toBe(20)
    // ...and the task carries the claim.
    const row = await chorePrisma.task.findUnique({ where: { id: task.id } })
    expect(row?.xpAwarded).toBe(true)
  })

  it('credits XP to the assignee, not the active session profile', async () => {
    // Parent (tier 4) completes a task on behalf of the kid.
    const task = await chorePrisma.task.create({
      data: { title: 'Parent completes', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 15 },
    })
    const parentCookie = await getCookieForProfile(PARENT_ID)

    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie: parentCookie },
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const kidBalance = await chorePrisma.xpBalance.findUnique({ where: { profileId: KID_ID } })
    const parentBalance = await chorePrisma.xpBalance.findUnique({
      where: { profileId: PARENT_ID },
    })
    expect(kidBalance?.totalXp).toBe(15)
    expect(parentBalance).toBeNull()
  })
})

// ─── Parent notification subscriber (integration) ────────────────────────────

describe('parent notification subscriber', () => {
  beforeEach(async () => {
    await prisma.notification.deleteMany({ where: { profileId: { in: ALL_IDS } } })
  })

  it('creates a notification for the task creator (parent) on completion', async () => {
    const task = await chorePrisma.task.create({
      data: {
        title: 'Take out trash',
        assigneeId: KID_ID,
        createdBy: PARENT_ID,
        xpReward: 10,
      },
    })
    const kidCookie = await getCookieForProfile(KID_ID)

    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie: kidCookie },
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const notifications = await prisma.notification.findMany({ where: { profileId: PARENT_ID } })
    expect(notifications).toHaveLength(1)
    expect(notifications[0].title).toBe('Kid completed Take out trash')
    expect(notifications[0].body).toBe('Earned 10 XP')
    expect(notifications[0].variant).toBe('info')
    expect(notifications[0].priority).toBe('alert')
  })

  it('does not notify the creator when they complete their own assigned task (admin check-off)', async () => {
    // A tier-4 parent creates a task and then checks it off themselves. The
    // completer equals the creator, so the self-notification must be suppressed.
    const task = await chorePrisma.task.create({
      data: {
        title: 'Parent self check-off',
        assigneeId: KID_ID,
        createdBy: PARENT_ID,
        xpReward: 10,
      },
    })
    const parentCookie = await getCookieForProfile(PARENT_ID)

    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie: parentCookie },
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const notifications = await prisma.notification.findMany({ where: { profileId: PARENT_ID } })
    expect(notifications).toHaveLength(0)
  })

  it('still notifies the creator when the assignee (a different profile) completes the task', async () => {
    // Regression guard for the self-notification skip: when completedBy differs
    // from createdBy, the creator must still be notified.
    const task = await chorePrisma.task.create({
      data: { title: 'Kid completes', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 10 },
    })
    const kidCookie = await getCookieForProfile(KID_ID)

    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie: kidCookie },
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const notifications = await prisma.notification.findMany({ where: { profileId: PARENT_ID } })
    expect(notifications).toHaveLength(1)
    expect(notifications[0].title).toBe('Kid completed Kid completes')
  })

  it('dispatches a Web Push to the tier-4 creator on completion', async () => {
    const pushSpy = vi.spyOn(pushModule, 'sendPushToProfile').mockResolvedValue()
    try {
      const task = await chorePrisma.task.create({
        data: { title: 'Walk dog', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 10 },
      })
      const kidCookie = await getCookieForProfile(KID_ID)

      await app.inject({
        method: 'PATCH',
        url: `/api/chores/tasks/${task.id}/complete`,
        headers: { cookie: kidCookie },
      })

      await new Promise((resolve) => setTimeout(resolve, 50))

      // The notification is priority 'alert' and the creator is tier 4, so the
      // shared notify() path must fire a push (regression guard: the subscriber
      // previously raw-inserted and skipped push entirely).
      expect(pushSpy).toHaveBeenCalledWith(
        PARENT_ID,
        expect.objectContaining({ title: 'Kid completed Walk dog' })
      )
    } finally {
      pushSpy.mockRestore()
    }
  })

  it('emits platform.notification.created so clients can refresh in realtime', async () => {
    const events: unknown[] = []
    const off = app.eventBus.on('platform.notification.created', (p) => events.push(p))
    try {
      const task = await chorePrisma.task.create({
        data: { title: 'Feed cat', assigneeId: KID_ID, createdBy: PARENT_ID, xpReward: 10 },
      })
      const kidCookie = await getCookieForProfile(KID_ID)

      await app.inject({
        method: 'PATCH',
        url: `/api/chores/tasks/${task.id}/complete`,
        headers: { cookie: kidCookie },
      })

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(events).toContainEqual(expect.objectContaining({ profileId: PARENT_ID }))
    } finally {
      off()
    }
  })

  it('notification title uses the assignee name from the platform schema', async () => {
    const task = await chorePrisma.task.create({
      data: { title: 'Clean room', assigneeId: TEEN_ID, createdBy: PARENT_ID, xpReward: 20 },
    })
    const teenCookie = await getCookieForProfile(TEEN_ID)

    await app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${task.id}/complete`,
      headers: { cookie: teenCookie },
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const notifications = await prisma.notification.findMany({ where: { profileId: PARENT_ID } })
    expect(notifications[0].title).toBe('Teen completed Clean room')
    expect(notifications[0].body).toBe('Earned 20 XP')
  })

  it('does not notify for tier-1 creator profiles', async () => {
    // Emit directly with createdBy = KID_ID (tier 1) — subscriber should skip.
    app.eventBus.emit('chores.task.completed', {
      taskId: '00000000-c40e-0001-0000-0000000099aa',
      assigneeId: TWEEN_ID,
      xpReward: 10,
      completedAt: new Date().toISOString(),
      title: 'Some task',
      createdBy: KID_ID,
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const notifications = await prisma.notification.findMany({ where: { profileId: KID_ID } })
    expect(notifications).toHaveLength(0)
  })

  it('skips silently when createdBy is missing from the event payload', async () => {
    const eventWithoutCreatedBy = {
      taskId: '00000000-c40e-0001-0000-0000000099bb',
      assigneeId: KID_ID,
      xpReward: 10,
      completedAt: new Date().toISOString(),
      title: 'Orphan task',
    }

    await expect(
      new Promise<void>((resolve) => {
        app.eventBus.emit(
          'chores.task.completed',
          eventWithoutCreatedBy as Parameters<typeof app.eventBus.emit>[1]
        )
        setTimeout(resolve, 50)
      })
    ).resolves.toBeUndefined()
  })
})
