import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { chorePrisma } from '@family-os/plugin-chores/db'
import { xpForCoins } from '@family-os/plugin-chores/economy'
import { ChoreRoutineInputSchema, ChoreTaskInputSchema } from '@family-os/schemas'
import { notify } from '../lib/notify'
import {
  DATE_KEY_RE,
  latestScheduledOnOrBefore,
  nextScheduledOnOrAfter,
} from '../lib/chore-routines'

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

/** Credits `xpReward` to the assignee's running `xp_balances` total — ONCE per task,
 *  ever.
 *
 * XP is progression: it only goes up and is never debited on reopen (unlike P-Bucks).
 * So re-completing a reopened chore must not re-award, or a reopen→complete cycle
 * farms XP without bound. `xp_awarded` is the claim: an atomic `updateMany` flips it
 * false→true and only the winner credits, which also makes a redelivered event a
 * no-op. The whole thing is one transaction so a failed credit doesn't leave the
 * task marked awarded. */
async function handleXpAward(payload: unknown): Promise<void> {
  const { taskId, assigneeId, xpReward } = payload as TaskCompletedPayload

  await chorePrisma.$transaction(async (tx) => {
    const claimed = await tx.task.updateMany({
      where: { id: taskId, status: 'completed', xpAwarded: false },
      data: { xpAwarded: true },
    })
    if (claimed.count === 0) return // already awarded, or no longer completed

    await tx.xpBalance.upsert({
      where: { profileId: assigneeId },
      update: { totalXp: { increment: xpReward } },
      create: { profileId: assigneeId, totalXp: xpReward },
    })
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

// ─── Routine reconciliation ──────────────────────────────────────────────────

const dateKeyOf = (d: Date | null): string | null => (d ? d.toISOString().slice(0, 10) : null)

const isUniqueViolation = (err: unknown): boolean =>
  typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002'

/** Materializes routine occurrences lazily, on read — never from a clock, because
 * the server does not know when the household's day rolls over; `todayKey` is the
 * client's local date. Invariant: at most one open (pending) row per routine.
 *
 * - No open row → spawn the next occurrence: an ongoing routine spawns today's
 *   (unless today's already exists completed — done for today, back tomorrow, and
 *   the (routineId, dueDate) unique is that guard); a days routine spawns the next
 *   scheduled day, which may be in the future ("Due Mon" is visible ahead).
 * - An open row that fell behind rolls forward: a missed scheduled day stays
 *   overdue only until the next occurrence arrives, then re-dates to it — this
 *   week's trash, not last week's debt. An ongoing row just tracks today.
 *
 * Concurrent reads race benignly: rolls are idempotent updates, and the loser of a
 * spawn race hits the unique index and is a no-op. */
async function reconcileRoutines(todayKey: string): Promise<void> {
  const routines = await chorePrisma.routine.findMany({ where: { endedAt: null } })
  if (routines.length === 0) return

  const openTasks = await chorePrisma.task.findMany({
    where: { routineId: { in: routines.map((r) => r.id) }, status: 'pending' },
  })
  const openByRoutine = new Map(openTasks.map((t) => [t.routineId, t]))

  for (const routine of routines) {
    const open = openByRoutine.get(routine.id)

    if (open) {
      const openKey = dateKeyOf(open.dueDate)
      const target =
        routine.kind === 'ongoing'
          ? todayKey
          : latestScheduledOnOrBefore(todayKey, routine.repeatDays)
      if (target && openKey && openKey < target) {
        await chorePrisma.task.update({
          where: { id: open.id },
          data: { dueDate: new Date(target) },
        })
      }
      continue
    }

    const due =
      routine.kind === 'ongoing' ? todayKey : nextScheduledOnOrAfter(todayKey, routine.repeatDays)
    if (!due) continue

    try {
      await chorePrisma.task.create({
        data: {
          title: routine.title,
          description: routine.description,
          assigneeId: routine.assigneeId,
          createdBy: routine.createdBy,
          dueDate: new Date(due),
          xpReward: xpForCoins(routine.coinReward),
          coinReward: routine.coinReward,
          requiresApproval: routine.requiresApproval && routine.coinReward > 0,
          routineId: routine.id,
        },
      })
    } catch (err) {
      if (!isUniqueViolation(err)) throw err
    }
  }
}

const choresPlugin: FastifyPluginAsync = async (fastify) => {
  // POST /chores/tasks — create and assign a task (tier 4 only)
  fastify.post('/chores/tasks', async (request, reply) => {
    if (!request.ability.can('create', 'chores.Task')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = ChoreTaskInputSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const input = parsed.data

    // Null = up for grabs — the task belongs to the household until claimed.
    const assignee = input.assigneeId
      ? await prisma.profile.findUnique({ where: { id: input.assigneeId } })
      : null
    if (input.assigneeId && !assignee) {
      return reply.status(404).send({ error: 'Assignee not found' })
    }

    // XP is derived from the tier, never client-set (ADR 056). A free chore has
    // nothing to hold.
    const task = await chorePrisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        assigneeId: assignee?.id ?? null,
        createdBy: request.profile.id,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        xpReward: xpForCoins(input.coinReward),
        coinReward: input.coinReward,
        requiresApproval: input.requiresApproval && input.coinReward > 0,
      },
    })

    fastify.eventBus.emit('chores.task.created', {
      taskId: task.id,
      assigneeId: task.assigneeId,
      createdBy: task.createdBy,
      title: task.title,
    })

    return reply.status(201).send(serializeTask(task, assignee))
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

    const parsed = ChoreTaskInputSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const input = parsed.data

    const assignee = input.assigneeId
      ? await prisma.profile.findUnique({ where: { id: input.assigneeId } })
      : null
    if (input.assigneeId && !assignee) {
      return reply.status(404).send({ error: 'Assignee not found' })
    }

    // Re-derive XP on every edit — a legacy hand-picked value drains here (ADR 056).
    const task = await chorePrisma.task.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        assigneeId: assignee?.id ?? null,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        xpReward: xpForCoins(input.coinReward),
        coinReward: input.coinReward,
        requiresApproval: input.requiresApproval && input.coinReward > 0,
      },
    })

    return serializeTask(task, assignee)
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

    // A held payout is voided when its chore is deleted (M4/3b) — the rewards ledger
    // listens (ADR 048), so chores stays ignorant of it. Carries the completion
    // instance so rewards can void the exact pending payout, if any.
    fastify.eventBus.emit('chores.task.deleted', {
      taskId: existing.id,
      assigneeId: existing.assigneeId,
      coinReward: existing.coinReward,
      completedAt: existing.completedAt?.toISOString() ?? null,
    })

    return reply.status(204).send()
  })

  // GET /chores/tasks — tiers 1–3 see their own assigned tasks plus anything up
  // for grabs; tier 4 (admin) and the family pseudo-profile see the whole family's.
  // `?today=YYYY-MM-DD` is the client's local date; routine occurrences materialize
  // here, on read (see reconcileRoutines) — the fallback to the server's UTC date
  // only serves clients that predate the param.
  fastify.get('/chores/tasks', async (request) => {
    const { today } = request.query as { today?: string }
    const todayKey =
      typeof today === 'string' && DATE_KEY_RE.test(today)
        ? today
        : new Date().toISOString().slice(0, 10)
    await reconcileRoutines(todayKey)

    const isFamilyDashboard = request.profile.id === FAMILY_PROFILE_ID
    const seesAll = request.profile.tier >= 4 || isFamilyDashboard
    const where = seesAll ? {} : { OR: [{ assigneeId: request.profile.id }, { assigneeId: null }] }

    const tasks = await chorePrisma.task.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { dueDate: { sort: 'asc', nulls: 'last' } },
        { createdAt: 'asc' },
      ],
    })

    const assigneeIds = [...new Set(tasks.map((t) => t.assigneeId).filter((id) => id !== null))]
    const profiles = assigneeIds.length
      ? await prisma.profile.findMany({ where: { id: { in: assigneeIds } } })
      : []
    const profileById = new Map(profiles.map((p) => [p.id, p]))

    const routineIds = [...new Set(tasks.map((t) => t.routineId).filter((id) => id !== null))]
    const routines = routineIds.length
      ? await chorePrisma.routine.findMany({ where: { id: { in: routineIds } } })
      : []
    const routineById = new Map(routines.map((r) => [r.id, r]))

    return {
      tasks: tasks.map((t) =>
        serializeTask(
          t,
          t.assigneeId ? profileById.get(t.assigneeId) : null,
          t.routineId ? routineById.get(t.routineId) : null
        )
      ),
    }
  })

  // PATCH /chores/tasks/:id/claim — take an up-for-grabs task for yourself. From
  // that instant it is an ordinary assigned task, so payouts, XP, and approval
  // holds work untouched. Any member may claim; the family pseudo-profile is a
  // viewer, not a person, and cannot.
  fastify.patch('/chores/tasks/:id/claim', async (request, reply) => {
    if (request.profile.id === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    // Claiming is the first half of doing — the same capability that gates complete.
    if (!request.ability.can('complete', 'chores.Task')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const task = await chorePrisma.task.findUnique({ where: { id } })
    if (!task) {
      return reply.status(404).send({ error: 'Task not found' })
    }
    if (task.status === 'completed' || task.assigneeId) {
      return reply.status(409).send({ error: 'Task is not up for grabs' })
    }

    // The null guard in the filter settles a two-kids race: the second tap matches
    // zero rows and is told someone beat them to it.
    const claimed = await chorePrisma.task.updateMany({
      where: { id, status: 'pending', assigneeId: null },
      data: { assigneeId: request.profile.id },
    })
    if (claimed.count === 0) {
      return reply.status(409).send({ error: 'Task is not up for grabs' })
    }

    const updated = await chorePrisma.task.findUniqueOrThrow({ where: { id } })
    const routine = updated.routineId
      ? await chorePrisma.routine.findUnique({ where: { id: updated.routineId } })
      : null
    const assignee = await prisma.profile.findUnique({ where: { id: request.profile.id } })
    return serializeTask(updated, assignee, routine)
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

    // The economy credits the assignee, so an unclaimed task has nobody to pay —
    // claim (or assign) first.
    if (!task.assigneeId) {
      return reply.status(409).send({ error: 'Task is up for grabs — claim it first' })
    }

    const updated = await chorePrisma.task.update({
      where: { id },
      data: { status: 'completed', completedAt: new Date() },
    })

    fastify.eventBus.emit('chores.task.completed', {
      taskId: updated.id,
      assigneeId: updated.assigneeId,
      xpReward: updated.xpReward,
      coinReward: updated.coinReward,
      // The rewards ledger holds the payout instead of crediting when this is set
      // (M4/3b) — the earner owns the flag (ADR 048).
      requiresApproval: updated.requiresApproval,
      completedAt: updated.completedAt?.toISOString() ?? new Date().toISOString(),
      title: updated.title,
      createdBy: updated.createdBy,
      completedBy: request.profile.id,
    })

    const assignee = updated.assigneeId
      ? await prisma.profile.findUnique({ where: { id: updated.assigneeId } })
      : null
    return serializeTask(updated, assignee)
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

    // The completion instance being reversed — the rewards debit is keyed by it
    // (source_id = `${taskId}@${completedAt}`) so a later re-completion re-earns
    // rather than colliding with the original credit.
    const reversedCompletedAt = task.completedAt?.toISOString() ?? null

    const updated = await chorePrisma.task.update({
      where: { id },
      data: { status: 'pending', completedAt: null },
    })

    fastify.eventBus.emit('chores.task.reopened', {
      taskId: updated.id,
      assigneeId: updated.assigneeId,
      xpReward: updated.xpReward,
      coinReward: updated.coinReward,
      completedAt: reversedCompletedAt,
      title: updated.title,
    })

    const assignee = updated.assigneeId
      ? await prisma.profile.findUnique({ where: { id: updated.assigneeId } })
      : null
    return serializeTask(updated, assignee)
  })

  // POST /chores/routines — start a routine (tier 4). No row is spawned here: the
  // first occurrence materializes on the next list read, which is the one spawn
  // path (the drawer's invalidation refetches immediately, so it appears at once).
  fastify.post('/chores/routines', async (request, reply) => {
    if (!request.ability.can('create', 'chores.Task')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = ChoreRoutineInputSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const input = parsed.data

    if (input.assigneeId) {
      const assignee = await prisma.profile.findUnique({ where: { id: input.assigneeId } })
      if (!assignee) {
        return reply.status(404).send({ error: 'Assignee not found' })
      }
    }

    const routine = await chorePrisma.routine.create({
      data: {
        title: input.title,
        description: input.description,
        assigneeId: input.assigneeId,
        createdBy: request.profile.id,
        kind: input.kind,
        repeatDays: [...new Set(input.repeatDays)].sort(),
        coinReward: input.coinReward,
        requiresApproval: input.requiresApproval && input.coinReward > 0,
      },
    })

    return reply.status(201).send(serializeRoutine(routine))
  })

  // PATCH /chores/routines/:id — edit the rule + fields for all future occurrences
  // (ADR 038's series-level contract). The open row is deleted and respawned from
  // the new rule on the next read rather than re-stamped in place — one spawn path,
  // and a rule change (Mon/Thu → Sat) can invalidate the open row's date anyway.
  fastify.patch('/chores/routines/:id', async (request, reply) => {
    if (!request.ability.can('update', 'chores.Task')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await chorePrisma.routine.findUnique({ where: { id } })
    if (!existing) {
      return reply.status(404).send({ error: 'Routine not found' })
    }

    const parsed = ChoreRoutineInputSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const input = parsed.data

    if (input.assigneeId) {
      const assignee = await prisma.profile.findUnique({ where: { id: input.assigneeId } })
      if (!assignee) {
        return reply.status(404).send({ error: 'Assignee not found' })
      }
    }

    const routine = await chorePrisma.routine.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        assigneeId: input.assigneeId,
        kind: input.kind,
        repeatDays: [...new Set(input.repeatDays)].sort(),
        coinReward: input.coinReward,
        requiresApproval: input.requiresApproval && input.coinReward > 0,
      },
    })
    // Pending rows carry no payouts or XP, so deleting them is side-effect-free;
    // completed history is untouched.
    await chorePrisma.task.deleteMany({ where: { routineId: id, status: 'pending' } })

    return serializeRoutine(routine)
  })

  // DELETE /chores/routines/:id — end the routine: stop spawning and remove the
  // open row. The routine row stays (completed history points at it), as does
  // everything already done and paid.
  fastify.delete('/chores/routines/:id', async (request, reply) => {
    if (!request.ability.can('delete', 'chores.Task')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await chorePrisma.routine.findUnique({ where: { id } })
    if (!existing) {
      return reply.status(404).send({ error: 'Routine not found' })
    }

    await chorePrisma.routine.update({ where: { id }, data: { endedAt: new Date() } })
    await chorePrisma.task.deleteMany({ where: { routineId: id, status: 'pending' } })

    return reply.status(204).send()
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
  assigneeId: string | null
  createdBy: string
  status: string
  dueDate: Date | null
  routineId: string | null
  xpReward: number
  coinReward: number
  requiresApproval: boolean
  xpAwarded: boolean
  createdAt: Date
  completedAt: Date | null
}

type RoutineRow = {
  id: string
  title: string
  description: string | null
  assigneeId: string | null
  createdBy: string
  kind: string
  repeatDays: number[]
  coinReward: number
  requiresApproval: boolean
  createdAt: Date
  endedAt: Date | null
}

function serializeRoutine(routine: RoutineRow) {
  return {
    id: routine.id,
    title: routine.title,
    description: routine.description,
    assigneeId: routine.assigneeId,
    kind: routine.kind,
    repeatDays: routine.repeatDays,
    coinReward: routine.coinReward,
    requiresApproval: routine.requiresApproval,
    createdAt: routine.createdAt.toISOString(),
    endedAt: routine.endedAt ? routine.endedAt.toISOString() : null,
  }
}

/* The assignee's identity, as the client needs it to draw a row: a name for the
   label and the hue hash, and the avatar for the face. The avatar URL was being
   dropped here even though every call site already held the profile row — the
   same latent gap ADR 042 found in family-feed, and the reason chores could never
   have rendered a member's photo. */
type AssigneeRef =
  | { name: string; avatarUrl: string | null; identityHue: string | null }
  | null
  | undefined

function serializeTask(task: TaskRow, assignee: AssigneeRef, routine?: RoutineRow | null) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    assigneeId: task.assigneeId,
    // Null assignee = up for grabs; the client renders the household (Hearth)
    // treatment, so there is no name to fall back to.
    assigneeName: task.assigneeId ? (assignee?.name ?? 'Unknown') : null,
    assigneeAvatarUrl: assignee?.avatarUrl ?? null,
    // The row spine is the assignee's hue in every state (ADR 043), so it must travel
    // with the task rather than be re-derived from `assigneeName` — a hash collides,
    // and a rename would silently re-colour the person (ADR 044).
    assigneeHue: assignee?.identityHue ?? null,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : null,
    routineId: task.routineId,
    // What the row needs to say "↻ Mon & Thu" / "back tomorrow" — rule truth stays
    // on the routine; the task mirrors the rest of the fields at spawn.
    routine: routine ? { kind: routine.kind, repeatDays: routine.repeatDays } : null,
    xpReward: task.xpReward,
    coinReward: task.coinReward,
    requiresApproval: task.requiresApproval,
    // A pending task with this set was completed before → reopened, not fresh.
    xpAwarded: task.xpAwarded,
    createdBy: task.createdBy,
    createdAt: task.createdAt.toISOString(),
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
  }
}

export default fp(choresPlugin, { name: 'chores' })
