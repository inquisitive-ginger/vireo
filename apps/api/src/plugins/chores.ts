import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { chorePrisma } from '@family-os/plugin-chores/db'
import { notify } from '../lib/notify'

const DEFAULT_XP_REWARD = 10

// ─── XP subscriber ───────────────────────────────────────────────────────────

type TaskCompletedPayload = {
  taskId: string
  assigneeId: string
  xpReward: number
  completedAt: string
  title?: string
  createdBy?: string
  /** Profile that performed the completion (assignee, or a tier-4 admin check-off). */
  completedBy?: string
}

/** Credits `xpReward` to the assignee's running `xp_balances` total.
 *
 * Idempotency guard: re-fetches the task before crediting and bails out if it
 * is no longer `completed` (guards against replayed or reversed events). */
async function handleXpAward(payload: unknown): Promise<void> {
  const { taskId, assigneeId, xpReward } = payload as TaskCompletedPayload

  // Idempotency guard — confirm the task is still completed.
  const task = await chorePrisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.status !== 'completed') return

  await chorePrisma.xpBalance.upsert({
    where: { profileId: assigneeId },
    update: { totalXp: { increment: xpReward } },
    create: { profileId: assigneeId, totalXp: xpReward },
  })
}

// ─── Parent-notification subscriber ──────────────────────────────────────────

/** Notifies the task's creator (the assigning parent) when it is completed.
 *
 * Looks up the assignee name from the platform schema (the event payload carries
 * `assigneeId` but not the name). If `createdBy` is absent the subscriber logs
 * a warning and skips cleanly — no crash. Skips when the creator completed the
 * task themselves (a tier-4 admin check-off) — no point notifying you of your
 * own action. */
async function handleParentNotification(payload: unknown, eventBus: EventBus): Promise<void> {
  const { taskId, assigneeId, xpReward, title, createdBy, completedBy } =
    payload as TaskCompletedPayload

  if (!createdBy) {
    console.warn('[chores] task.completed event missing createdBy — skipping notification', {
      taskId,
    })
    return
  }

  // The creator checked off their own assigned task — don't self-notify.
  if (completedBy && completedBy === createdBy) return

  // Look up the assignee name for the notification title.
  const assigneeProfile = await prisma.profile.findUnique({ where: { id: assigneeId } })
  const assigneeName = assigneeProfile?.name ?? 'Someone'

  const taskTitle = title ?? 'a chore'

  // Route through the shared server notify() path so persistence, history
  // pruning, and Web Push (priority `alert` → tier 4/3) stay consistent with
  // POST /notifications. notify() handles the tier-1 / missing-profile skip.
  await notify(eventBus, createdBy, {
    title: `${assigneeName} completed ${taskTitle}`,
    body: `Earned ${xpReward} XP`,
    variant: 'info',
    priority: 'alert',
  })
}

// The unattended dashboard resolves to the family pseudo-profile (id "family",
// tier 1) — a non-UUID id. It sees the whole family's chores (family framing),
// and the non-UUID id must never reach the uuid assignee_id filter (P2007).

type CreateTaskBody = {
  title?: unknown
  assigneeId?: unknown
  description?: unknown
  dueDate?: unknown
  xpReward?: unknown
}

const choresPlugin: FastifyPluginAsync = async (fastify) => {
  // POST /chores/tasks — create and assign a task (tier 4 only)
  fastify.post('/chores/tasks', async (request, reply) => {
    if (!request.ability.can('create', 'chores.Task')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const body = (request.body ?? {}) as CreateTaskBody

    const title = typeof body.title === 'string' ? body.title.trim() : ''
    if (title.length === 0) {
      return reply.status(400).send({ error: 'title is required' })
    }

    if (typeof body.assigneeId !== 'string' || body.assigneeId.length === 0) {
      return reply.status(400).send({ error: 'assigneeId is required' })
    }

    const assignee = await prisma.profile.findUnique({ where: { id: body.assigneeId } })
    if (!assignee) {
      return reply.status(404).send({ error: 'Assignee not found' })
    }

    const description =
      typeof body.description === 'string' && body.description.trim().length > 0
        ? body.description.trim()
        : null

    const dueDate =
      typeof body.dueDate === 'string' && body.dueDate.length > 0 ? new Date(body.dueDate) : null
    if (dueDate && isNaN(dueDate.getTime())) {
      return reply.status(400).send({ error: 'Invalid dueDate' })
    }

    const xpReward =
      typeof body.xpReward === 'number' && Number.isInteger(body.xpReward) && body.xpReward >= 0
        ? body.xpReward
        : DEFAULT_XP_REWARD

    const task = await chorePrisma.task.create({
      data: {
        title,
        description,
        assigneeId: assignee.id,
        createdBy: request.profile.id,
        dueDate,
        xpReward,
      },
    })

    fastify.eventBus.emit('chores.task.created', {
      taskId: task.id,
      assigneeId: task.assigneeId,
      createdBy: task.createdBy,
      title: task.title,
    })

    return reply.status(201).send(serializeTask(task, assignee.name))
  })

  // PATCH /chores/tasks/:id — edit a task's fields (tier 4 only / manage). Mirrors
  // the create validation; the edit drawer always submits the full field set.
  fastify.patch('/chores/tasks/:id', async (request, reply) => {
    if (!request.ability.can('update', 'chores.Task')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await chorePrisma.task.findUnique({ where: { id } })
    if (!existing) {
      return reply.status(404).send({ error: 'Task not found' })
    }

    const body = (request.body ?? {}) as CreateTaskBody

    const title = typeof body.title === 'string' ? body.title.trim() : ''
    if (title.length === 0) {
      return reply.status(400).send({ error: 'title is required' })
    }

    if (typeof body.assigneeId !== 'string' || body.assigneeId.length === 0) {
      return reply.status(400).send({ error: 'assigneeId is required' })
    }

    const assignee = await prisma.profile.findUnique({ where: { id: body.assigneeId } })
    if (!assignee) {
      return reply.status(404).send({ error: 'Assignee not found' })
    }

    const description =
      typeof body.description === 'string' && body.description.trim().length > 0
        ? body.description.trim()
        : null

    const dueDate =
      typeof body.dueDate === 'string' && body.dueDate.length > 0 ? new Date(body.dueDate) : null
    if (dueDate && isNaN(dueDate.getTime())) {
      return reply.status(400).send({ error: 'Invalid dueDate' })
    }

    const xpReward =
      typeof body.xpReward === 'number' && Number.isInteger(body.xpReward) && body.xpReward >= 0
        ? body.xpReward
        : existing.xpReward

    const task = await chorePrisma.task.update({
      where: { id },
      data: { title, description, assigneeId: assignee.id, dueDate, xpReward },
    })

    return serializeTask(task, assignee.name)
  })

  // DELETE /chores/tasks/:id — remove a task (tier 4 only / manage).
  fastify.delete('/chores/tasks/:id', async (request, reply) => {
    if (!request.ability.can('delete', 'chores.Task')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await chorePrisma.task.findUnique({ where: { id } })
    if (!existing) {
      return reply.status(404).send({ error: 'Task not found' })
    }

    await chorePrisma.task.delete({ where: { id } })
    return reply.status(204).send()
  })

  // GET /chores/tasks — tiers 1–3 see their own assigned tasks; tier 4 (admin)
  // and the family pseudo-profile see the whole family's tasks.
  fastify.get('/chores/tasks', async (request) => {
    const isFamilyDashboard = request.profile.id === FAMILY_PROFILE_ID
    const seesAll = request.profile.tier >= 4 || isFamilyDashboard
    const where = seesAll ? {} : { assigneeId: request.profile.id }

    const tasks = await chorePrisma.task.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { dueDate: { sort: 'asc', nulls: 'last' } },
        { createdAt: 'asc' },
      ],
    })

    const assigneeIds = [...new Set(tasks.map((t) => t.assigneeId))]
    const profiles = assigneeIds.length
      ? await prisma.profile.findMany({ where: { id: { in: assigneeIds } } })
      : []
    const nameById = new Map(profiles.map((p) => [p.id, p.name]))

    return {
      tasks: tasks.map((t) => serializeTask(t, nameById.get(t.assigneeId) ?? 'Unknown')),
    }
  })

  // PATCH /chores/tasks/:id/complete — mark a task done. The assignee can complete
  // their own task (row-level `complete` rule); a tier-4 parent can complete
  // anyone's (manage all). Auto-accepted — no approval step.
  fastify.patch('/chores/tasks/:id/complete', async (request, reply) => {
    const { id } = request.params as { id: string }

    const task = await chorePrisma.task.findUnique({ where: { id } })
    if (!task) {
      return reply.status(404).send({ error: 'Task not found' })
    }

    // Row-level ownership is enforced explicitly: @casl/prisma's typed
    // PrismaAbility keys subject instances by Prisma model name and can't carry
    // our namespaced string subject ('chores.Task'), so a `subject()`-tagged
    // check doesn't type-check (same limitation task-model hit with accessibleBy).
    // The CASL `complete` capability still gates (respecting overrides); the
    // assignee/tier-4 ownership is the row condition.
    const canComplete = request.ability.can('complete', 'chores.Task')
    const isOwnOrAdmin = request.profile.tier >= 4 || task.assigneeId === request.profile.id
    if (!canComplete || !isOwnOrAdmin) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    if (task.status === 'completed') {
      return reply.status(409).send({ error: 'Task already completed' })
    }

    const updated = await chorePrisma.task.update({
      where: { id },
      data: { status: 'completed', completedAt: new Date() },
    })

    fastify.eventBus.emit('chores.task.completed', {
      taskId: updated.id,
      assigneeId: updated.assigneeId,
      xpReward: updated.xpReward,
      completedAt: updated.completedAt?.toISOString() ?? new Date().toISOString(),
      title: updated.title,
      createdBy: updated.createdBy,
      completedBy: request.profile.id,
    })

    const assignee = await prisma.profile.findUnique({ where: { id: updated.assigneeId } })
    return serializeTask(updated, assignee?.name ?? 'Unknown')
  })

  // PATCH /chores/tasks/:id/reopen — un-complete a task. Tier-4 only (manage all):
  // a parent reverses a completion and the task resurfaces on the assignee's list.
  fastify.patch('/chores/tasks/:id/reopen', async (request, reply) => {
    if (!request.ability.can('reopen', 'chores.Task')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }

    const task = await chorePrisma.task.findUnique({ where: { id } })
    if (!task) {
      return reply.status(404).send({ error: 'Task not found' })
    }

    if (task.status !== 'completed') {
      return reply.status(409).send({ error: 'Task is not completed' })
    }

    const updated = await chorePrisma.task.update({
      where: { id },
      data: { status: 'pending', completedAt: null },
    })

    fastify.eventBus.emit('chores.task.reopened', {
      taskId: updated.id,
      assigneeId: updated.assigneeId,
      xpReward: updated.xpReward,
    })

    const assignee = await prisma.profile.findUnique({ where: { id: updated.assigneeId } })
    return serializeTask(updated, assignee?.name ?? 'Unknown')
  })

  // GET /chores/xp — returns the active profile's lifetime XP total (all tiers).
  fastify.get('/chores/xp', async (request) => {
    const profileId = request.profile.id
    const balance = await chorePrisma.xpBalance.findUnique({ where: { profileId } })
    return { totalXp: balance?.totalXp ?? 0 }
  })

  // ─── Event subscribers ─────────────────────────────────────────────────────

  // Register XP award + parent notification subscribers on plugin startup.
  // Both listen to chores.task.completed; errors are logged and swallowed so
  // one failing subscriber doesn't break the other.
  fastify.eventBus.on('chores.task.completed', (payload) => {
    void handleXpAward(payload).catch((err) =>
      fastify.log.error({ err }, '[chores] XP award subscriber failed')
    )
    void handleParentNotification(payload, fastify.eventBus).catch((err) =>
      fastify.log.error({ err }, '[chores] parent notification subscriber failed')
    )
  })
}

type TaskRow = {
  id: string
  title: string
  description: string | null
  assigneeId: string
  createdBy: string
  status: string
  dueDate: Date | null
  xpReward: number
  createdAt: Date
  completedAt: Date | null
}

function serializeTask(task: TaskRow, assigneeName: string) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    assigneeId: task.assigneeId,
    assigneeName,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : null,
    xpReward: task.xpReward,
    createdBy: task.createdBy,
    createdAt: task.createdAt.toISOString(),
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
  }
}

export default fp(choresPlugin, { name: 'chores' })
