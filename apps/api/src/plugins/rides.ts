import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import type { DayMark } from '@family-os/platform/types'
import { ridesPrisma } from '@family-os/plugin-rides/db'
import { dateKeys, dayRuns, runText } from '@family-os/plugin-rides/lib/runs'
import type { RunKind, SchoolRun } from '@family-os/plugin-rides/lib/runs'
import { RunDaySchema, SchoolRunInputSchema, SchoolRunPatchSchema } from '@family-os/schemas'

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

type RunRow = Awaited<ReturnType<typeof ridesPrisma.schoolRun.create>>

function serializeRun(run: RunRow): SchoolRun {
  return {
    id: run.id,
    kidId: run.kidId,
    weekday: run.weekday,
    kind: run.kind as RunKind,
    place: run.place,
    minutes: run.minutes,
    driverId: run.driverId,
  }
}

/** Drivers are parents (tier 4); kids are everyone below (D-086, 3e). */
async function isDriver(id: string) {
  const profile = await prisma.profile.findUnique({ where: { id }, select: { tier: true } })
  return profile?.tier === 4
}

async function isKid(id: string) {
  const profile = await prisma.profile.findUnique({ where: { id }, select: { tier: true } })
  return profile !== null && profile.tier < 4
}

async function loadDays(from: string, to: string) {
  const [runs, overrides] = await Promise.all([
    ridesPrisma.schoolRun.findMany(),
    ridesPrisma.runDay.findMany({ where: { date: { gte: new Date(from), lte: new Date(to) } } }),
  ])
  return {
    runs: runs.map(serializeRun),
    overrides: overrides.map((o) => ({
      runId: o.runId,
      date: o.date.toISOString().slice(0, 10),
      driverId: o.driverId,
      cleared: o.cleared,
    })),
  }
}

const ridesPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get('/rides/runs', async (request, reply) => {
    if (!request.ability.can('view', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const runs = await ridesPrisma.schoolRun.findMany({ orderBy: { minutes: 'asc' } })
    return { runs: runs.map(serializeRun) }
  })

  fastify.post('/rides/runs', async (request, reply) => {
    if (!request.ability.can('manage', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const parsed = SchoolRunInputSchema.safeParse(request.body ?? {})
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const input = parsed.data
    if (!(await isKid(input.kidId))) return reply.status(400).send({ error: 'Not a kid' })
    if (input.driverId && !(await isDriver(input.driverId))) {
      return reply.status(400).send({ error: 'Only a parent can drive' })
    }
    const run = await ridesPrisma.schoolRun.create({
      data: { ...input, createdBy: request.profile.id },
    })
    return reply.status(201).send(serializeRun(run))
  })

  fastify.patch('/rides/runs/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const parsed = SchoolRunPatchSchema.safeParse(request.body ?? {})
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const { id } = request.params as { id: string }
    const existing = await ridesPrisma.schoolRun.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Run not found' })
    if (parsed.data.driverId && !(await isDriver(parsed.data.driverId))) {
      return reply.status(400).send({ error: 'Only a parent can drive' })
    }
    const run = await ridesPrisma.schoolRun.update({ where: { id }, data: parsed.data })
    return serializeRun(run)
  })

  fastify.delete('/rides/runs/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    const existing = await ridesPrisma.schoolRun.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Run not found' })
    await ridesPrisma.schoolRun.delete({ where: { id } })
    return reply.status(204).send()
  })

  // Claim, swap or clear one run for one day (D-087, D-094). The usual week is
  // never touched; a change that lands back on the usual driver drops the row.
  fastify.post('/rides/days/:date', async (request, reply) => {
    if (!request.ability.can('update', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { date } = request.params as { date: string }
    if (!DATE_KEY.test(date)) return reply.status(400).send({ error: 'Expected YYYY-MM-DD' })
    const parsed = RunDaySchema.safeParse(request.body ?? {})
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const { lineId, ownerId, cleared } = parsed.data

    const run = await ridesPrisma.schoolRun.findUnique({ where: { id: lineId } })
    if (!run || dayRuns([serializeRun(run)], [], date).length === 0) {
      return reply.status(404).send({ error: 'No such run that day' })
    }
    if (ownerId && !(await isDriver(ownerId))) {
      return reply.status(400).send({ error: 'Only a parent can drive' })
    }

    const key = { runId_date: { runId: lineId, date: new Date(date) } }
    if (!cleared && ownerId === run.driverId) {
      await ridesPrisma.runDay.deleteMany({ where: { runId: lineId, date: new Date(date) } })
    } else {
      const data = { driverId: ownerId, cleared, updatedBy: request.profile.id }
      await ridesPrisma.runDay.upsert({
        where: key,
        update: data,
        create: { runId: lineId, date: new Date(date), ...data },
      })
    }
    return reply.status(204).send()
  })

  // Day-mark provider (ADR 050/066, D-087). One mark per day that has school
  // runs; its lines are the runs, and `act` rides along only for a caller who
  // can change them.
  fastify.dayMarks.register({
    name: 'rides',
    action: 'view',
    subject: 'rides.Run',
    async fetch(from, to, ability) {
      const { runs, overrides } = await loadDays(from, to)
      if (runs.length === 0) return []

      const profiles = await prisma.profile.findMany({
        select: { id: true, name: true, tier: true },
      })
      const names = new Map(profiles.map((p) => [p.id, p.name]))
      const owners = profiles.filter((p) => p.tier === 4).map((p) => p.id)
      const canAct = ability.can('update', 'rides.Run')

      const marks: DayMark[] = []
      for (const date of dateKeys(from, to)) {
        const day = dayRuns(runs, overrides, date)
        if (day.length === 0) continue
        const live = day.filter((r) => !r.cleared)
        const open = live.filter((r) => !r.driverId).length
        marks.push({
          date,
          glyph: 'car',
          label:
            live.length === 0
              ? 'School runs cleared'
              : `${live.length} school ${live.length === 1 ? 'run' : 'runs'}${open ? `, ${open} open` : ''}`,
          lines: day.map((r) => ({
            id: r.id,
            minutes: r.minutes,
            text: runText(r, names),
            ownerId: r.driverId,
            cleared: r.cleared,
          })),
          ...(canAct ? { act: { endpoint: `/api/rides/days/${date}`, owners } } : {}),
        })
      }
      return marks
    },
  })
}

export default fp(ridesPlugin, { name: 'rides', dependencies: ['calendar'] })
