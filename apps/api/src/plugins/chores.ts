import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { chorePrisma } from '@family-os/plugin-chore-engine/db'

const DEFAULT_XP_REWARD = 10

// The unattended dashboard resolves to the family pseudo-profile (id "family",
// tier 1) — a non-UUID id. It sees the whole family's chores (family framing),
// and the non-UUID id must never reach the uuid assignee_id filter (P2007).
const FAMILY_PROFILE_ID = 'family'

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
