import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID, type DayMark } from '@family-os/platform/types'
import { ridesPrisma } from '@family-os/plugin-rides/db'
import {
  dateInWeek,
  dateKeys,
  dayRuns,
  driverOn,
  runText,
  runsOn,
} from '@family-os/plugin-rides/lib/runs'
import type { RunKind, SchoolRunRecord } from '@family-os/plugin-rides/lib/runs'
import { RunDaySchema, RunDriverSchema, SchoolRunInputSchema } from '@family-os/schemas'

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

function isRealDate(key: string) {
  if (!DATE_KEY.test(key)) return false
  const d = new Date(`${key}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(key)
}

const dateOnly = (key: string) => new Date(`${key}T00:00:00Z`)
const keyOf = (d: Date) => d.toISOString().slice(0, 10)

/** The calendar sends range instants; the api runs in the household's zone
 *  (docker-compose.prod.yml `TZ`), so local getters give the household date. */
function localKey(value: string | Date) {
  if (typeof value === 'string' && DATE_KEY.test(value)) return value
  const d = new Date(value)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const withDrivers = { drivers: true } as const
type RunRow = Awaited<
  ReturnType<typeof ridesPrisma.schoolRun.findMany<{ include: typeof withDrivers }>>
>[number]

function toRecord(run: RunRow): SchoolRunRecord {
  return {
    id: run.id,
    kidId: run.kidId,
    weekday: run.weekday,
    kind: run.kind as RunKind,
    place: run.place,
    minutes: run.minutes,
    startsOn: keyOf(run.startsOn),
    endsOn: run.endsOn ? keyOf(run.endsOn) : null,
    drivers: run.drivers.map((d) => ({ fromDate: keyOf(d.fromDate), driverId: d.driverId })),
  }
}

/** Drivers are parents (tier 4); kids are everyone below but the family dashboard. */
async function isDriver(id: string) {
  const profile = await prisma.profile.findUnique({ where: { id }, select: { tier: true } })
  return profile?.tier === 4
}

async function isKid(id: string) {
  const profile = await prisma.profile.findUnique({ where: { id }, select: { tier: true } })
  return id !== FAMILY_PROFILE_ID && profile !== null && profile.tier < 4
}

const ridesPlugin: FastifyPluginAsync = async (fastify) => {
  // The week holding `on`, as the editor shows it: each run that runs that
  // week, with its driver on its own day that week.
  fastify.get('/rides/week', async (request, reply) => {
    if (!request.ability.can('view', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { on } = request.query as { on?: string }
    const day = on && isRealDate(on) ? on : localKey(new Date())
    const rows = await ridesPrisma.schoolRun.findMany({
      include: withDrivers,
      orderBy: { minutes: 'asc' },
    })
    const runs = rows
      .map(toRecord)
      .filter((run) => runsOn(dateInWeek(day, run.weekday))(run))
      .map(({ drivers, ...run }) => ({
        ...run,
        driverId: driverOn(drivers, dateInWeek(day, run.weekday)),
      }))
    return { runs }
  })

  fastify.post('/rides/runs', async (request, reply) => {
    if (!request.ability.can('manage', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const parsed = SchoolRunInputSchema.safeParse(request.body ?? {})
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const { from, driverId, ...input } = parsed.data
    if (!isRealDate(from)) return reply.status(400).send({ error: 'Expected YYYY-MM-DD' })
    if (!(await isKid(input.kidId))) return reply.status(400).send({ error: 'Not a kid' })
    if (!(await isDriver(driverId))) {
      return reply.status(400).send({ error: 'Only a parent can drive' })
    }
    const startsOn = dateOnly(dateInWeek(from, input.weekday))
    const run = await ridesPrisma.schoolRun.create({
      data: {
        ...input,
        startsOn,
        createdBy: request.profile.id,
        drivers: { create: { fromDate: startsOn, driverId, updatedBy: request.profile.id } },
      },
      include: withDrivers,
    })
    return reply.status(201).send(toRecord(run))
  })

  // A new usual driver from the opened week on (D-097).
  fastify.post('/rides/runs/:id/driver', async (request, reply) => {
    if (!request.ability.can('manage', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const parsed = RunDriverSchema.safeParse(request.body ?? {})
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const { driverId, from } = parsed.data
    if (!isRealDate(from)) return reply.status(400).send({ error: 'Expected YYYY-MM-DD' })
    const { id } = request.params as { id: string }
    const run = await ridesPrisma.schoolRun.findUnique({ where: { id } })
    if (!run) return reply.status(404).send({ error: 'Run not found' })
    if (!(await isDriver(driverId))) {
      return reply.status(400).send({ error: 'Only a parent can drive' })
    }
    const day = dateInWeek(from, run.weekday)
    if (
      !runsOn(day)({
        weekday: run.weekday,
        startsOn: keyOf(run.startsOn),
        endsOn: run.endsOn && keyOf(run.endsOn),
      })
    ) {
      return reply.status(404).send({ error: 'That run isn’t on that week' })
    }
    // The editor sets the week from here on, over its own later changes.
    const fromDate = dateOnly(day)
    const data = { driverId, updatedBy: request.profile.id }
    await ridesPrisma.$transaction([
      ridesPrisma.runDriver.deleteMany({ where: { runId: id, fromDate: { gt: fromDate } } }),
      ridesPrisma.runDriver.upsert({
        where: { runId_fromDate: { runId: id, fromDate } },
        update: data,
        create: { runId: id, fromDate, ...data },
      }),
    ])
    return reply.status(204).send()
  })

  // Off the week from the opened week on; earlier weeks keep it.
  fastify.delete('/rides/runs/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    const { from } = request.query as { from?: string }
    if (!from || !isRealDate(from)) {
      return reply.status(400).send({ error: 'Expected ?from=YYYY-MM-DD' })
    }
    const run = await ridesPrisma.schoolRun.findUnique({ where: { id } })
    if (!run) return reply.status(404).send({ error: 'Run not found' })
    const endsOn = dateInWeek(from, run.weekday)
    if (run.endsOn && endsOn >= keyOf(run.endsOn)) return reply.status(204).send()
    if (endsOn <= keyOf(run.startsOn)) await ridesPrisma.schoolRun.delete({ where: { id } })
    else await ridesPrisma.schoolRun.update({ where: { id }, data: { endsOn: dateOnly(endsOn) } })
    return reply.status(204).send()
  })

  // Swap a run, or mark it "Not needed today", on one day only (D-099, D-100).
  // A change that lands back on the set week drops the day's row.
  fastify.post('/rides/days/:date', async (request, reply) => {
    if (!request.ability.can('update', 'rides.Run')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { date } = request.params as { date: string }
    if (!isRealDate(date)) return reply.status(400).send({ error: 'Expected YYYY-MM-DD' })
    const parsed = RunDaySchema.safeParse(request.body ?? {})
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const { lineId, ownerId, cleared } = parsed.data

    const row = await ridesPrisma.schoolRun.findUnique({
      where: { id: lineId },
      include: withDrivers,
    })
    const run = row && toRecord(row)
    if (!run || !runsOn(date)(run)) {
      return reply.status(404).send({ error: 'No such run that day' })
    }
    if (!(await isDriver(ownerId))) {
      return reply.status(400).send({ error: 'Only a parent can drive' })
    }

    const day = dateOnly(date)
    const usual = driverOn(run.drivers, date)
    if (ownerId === usual && !cleared) {
      await ridesPrisma.runDay.deleteMany({ where: { runId: lineId, date: day } })
    } else {
      const data = {
        driverId: ownerId === usual ? null : ownerId,
        skipped: cleared,
        updatedBy: request.profile.id,
      }
      await ridesPrisma.runDay.upsert({
        where: { runId_date: { runId: lineId, date: day } },
        update: data,
        create: { runId: lineId, date: day, ...data },
      })
    }
    return reply.status(204).send()
  })

  // Day-mark provider (ADR 050/066, D-087). One mark per day that has school
  // runs; its lines are the runs. A parent also gets `act`, and, before any run
  // exists, a mark on today that only sets the week up.
  fastify.dayMarks.register({
    name: 'rides',
    action: 'view',
    subject: 'rides.Run',
    async fetch(rangeFrom, rangeTo, ability) {
      const from = localKey(rangeFrom)
      const to = localKey(rangeTo)
      const canAct = ability.can('update', 'rides.Run')
      const [rows, dayRows, profiles] = await Promise.all([
        ridesPrisma.schoolRun.findMany({
          where: {
            startsOn: { lte: dateOnly(to) },
            OR: [{ endsOn: null }, { endsOn: { gt: dateOnly(from) } }],
          },
          include: withDrivers,
        }),
        ridesPrisma.runDay.findMany({
          where: { date: { gte: dateOnly(from), lte: dateOnly(to) } },
        }),
        prisma.profile.findMany({ select: { id: true, name: true, tier: true } }),
      ])
      const owners = profiles.filter((p) => p.tier === 4).map((p) => p.id)
      const act = (date: string, label: string) =>
        canAct
          ? {
              act: {
                endpoint: `/api/rides/days/${date}`,
                owners,
                manage: { href: `/rides/week?on=${date}`, label },
              },
            }
          : {}

      if (rows.length === 0) {
        const today = localKey(new Date())
        if (!canAct || today < from || today > to) return []
        const active = await ridesPrisma.schoolRun.count({
          where: { OR: [{ endsOn: null }, { endsOn: { gt: dateOnly(today) } }] },
        })
        if (active > 0) return []
        const label = 'Set up school runs'
        return [{ date: today, glyph: 'car', label, lines: [], ...act(today, label) }]
      }

      const runs = rows.map(toRecord)
      const changes = new Map(
        dayRows.map((d) => [
          `${d.runId}:${keyOf(d.date)}`,
          { driverId: d.driverId, skipped: d.skipped },
        ])
      )
      const names = new Map(profiles.map((p) => [p.id, p.name]))
      const marks: DayMark[] = []
      for (const date of dateKeys(from, to)) {
        const day = dayRuns(runs, changes, date)
        if (day.length === 0) continue
        const live = day.filter((r) => !r.skipped).length
        marks.push({
          date,
          glyph: 'car',
          label:
            live === 0 ? 'School runs not needed' : `${live} school ${live === 1 ? 'run' : 'runs'}`,
          lines: day.map((r) => ({
            id: r.id,
            minutes: r.minutes,
            text: runText(r, names),
            ownerId: r.driverId,
            cleared: r.skipped,
          })),
          ...act(date, 'Set the week'),
        })
      }
      return marks
    },
  })
}

export default fp(ridesPlugin, { name: 'rides', dependencies: ['calendar'] })
