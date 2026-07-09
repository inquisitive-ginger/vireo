import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { EventInputSchema, type EventInput } from '@family-os/schemas'
import { calendarPrisma } from '@family-os/plugin-calendar/db'

const DAY_MS = 24 * 60 * 60 * 1000
const WEEK_MS = 7 * DAY_MS
const MAX_OCCURRENCES = 520 // ~10 years of weeks — a hard guard against runaway expansion

// ─── Row shapes (the generated Prisma types stay inside the plugin package) ──────

type AttendeeRow = { eventId: string; profileId: string }
type ExceptionRow = { eventId: string; occurrenceDate: Date; kind: string }
type EventRow = {
  id: string
  title: string
  description: string | null
  createdBy: string
  startsAt: Date
  endsAt: Date | null
  allDay: boolean
  location: string | null
  recurrence: string | null
  recurrenceUntil: Date | null
  isActivity: boolean
  status: string
  source: string
  reminderMinutes: number | null
  createdAt: Date
  updatedAt: Date
  attendees: AttendeeRow[]
  exceptions?: ExceptionRow[]
}

// ─── Validation ─────────────────────────────────────────────────────────────────

type ParsedEvent = {
  title: string
  description: string | null
  attendeeIds: string[]
  startsAt: Date
  endsAt: Date | null
  allDay: boolean
  location: string | null
  recurrence: 'weekly' | null
  recurrenceUntil: Date | null
  reminderMinutes: number | null
  isActivity: boolean
}

type ParseResult = { ok: true; data: ParsedEvent } | { ok: false; status: number; error: unknown }

/** Validates a create/edit body against the shared Zod schema (ADR convention —
 *  schemas live in `@family-os/schemas` so the story-3 drawer reuses this one),
 *  then resolves attendee existence against the platform profiles (an unknown id
 *  → 404, separate from the 400 shape check) and derives `isActivity`/`ownerId`. */
async function parseEventBody(body: unknown): Promise<ParseResult> {
  const result = EventInputSchema.safeParse(body)
  if (!result.success) return { ok: false, status: 400, error: result.error.flatten() }
  const input: EventInput = result.data

  // Dedupe then confirm every attendee is a real profile.
  const attendeeIds = [...new Set(input.attendeeIds)]
  if (attendeeIds.length > 0) {
    const found = await prisma.profile.findMany({
      where: { id: { in: attendeeIds } },
      select: { id: true },
    })
    if (found.length !== attendeeIds.length) {
      return { ok: false, status: 404, error: 'Attendee not found' }
    }
  }

  const recurrence = input.recurrence ?? null
  // Derived, never user-chosen (ADR 038): a weekly event owned by exactly one
  // person is that person's standing Activity.
  const isActivity = recurrence === 'weekly' && attendeeIds.length === 1

  return {
    ok: true,
    data: {
      title: input.title,
      description: input.description,
      attendeeIds,
      startsAt: new Date(input.startsAt),
      endsAt: input.endsAt ? new Date(input.endsAt) : null,
      allDay: input.allDay,
      location: input.location,
      recurrence,
      // recurrence_until is only meaningful for a recurring series.
      recurrenceUntil: recurrence && input.recurrenceUntil ? new Date(input.recurrenceUntil) : null,
      reminderMinutes: input.reminderMinutes ?? null,
      isActivity,
    },
  }
}

// ─── Serialization & recurrence expansion ────────────────────────────────────────

const dateKey = (d: Date) => d.toISOString().slice(0, 10)

/** `ownerId` is derived from the attendee set: the single id when solo, else null
 *  (Family, or shared). Preserves the published-event payload contract. */
const deriveOwnerId = (attendeeIds: string[]) => (attendeeIds.length === 1 ? attendeeIds[0] : null)

/** Shapes one event (or one expanded occurrence) for the wire. An occurrence gets
 *  a stable synthetic id `"{eventId}:{date}"`; the canonical id is always on
 *  `seriesId` so the client can act on the whole series. */
function serializeEvent(
  event: EventRow,
  occurrence?: { startsAt: Date; endsAt: Date | null; date: string }
) {
  const attendeeIds = event.attendees.map((a) => a.profileId)
  const startsAt = occurrence ? occurrence.startsAt : event.startsAt
  const endsAt = occurrence ? occurrence.endsAt : event.endsAt
  return {
    id: occurrence ? `${event.id}:${occurrence.date}` : event.id,
    seriesId: event.id,
    occurrenceDate: occurrence ? occurrence.date : null,
    isOccurrence: Boolean(occurrence),
    title: event.title,
    description: event.description,
    attendeeIds,
    ownerId: deriveOwnerId(attendeeIds),
    createdBy: event.createdBy,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt ? endsAt.toISOString() : null,
    allDay: event.allDay,
    location: event.location,
    recurrence: event.recurrence,
    recurrenceUntil: event.recurrenceUntil ? dateKey(event.recurrenceUntil) : null,
    isActivity: event.isActivity,
    status: event.status,
    source: event.source,
    reminderMinutes: event.reminderMinutes,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  }
}

const overlaps = (startMs: number, endMs: number, from: Date, to: Date) =>
  startMs <= to.getTime() && endMs >= from.getTime()

/** Expands a weekly series into the occurrences overlapping `[from, to]`, skipping
 *  any date with a `cancelled` exception and stopping at `recurrenceUntil` (ADR 038). */
function expandWeekly(event: EventRow, from: Date, to: Date) {
  const base = event.startsAt.getTime()
  const duration = (event.endsAt ? event.endsAt.getTime() : base) - base
  // recurrence_until is an inclusive date — allow any occurrence starting before
  // the day after it.
  const untilMs = event.recurrenceUntil ? event.recurrenceUntil.getTime() + DAY_MS : Infinity
  const cancelled = new Set(
    (event.exceptions ?? [])
      .filter((e) => e.kind === 'cancelled')
      .map((e) => dateKey(e.occurrenceDate))
  )

  // Skip ahead to the first occurrence that could still overlap `from`.
  let k = 0
  if (from.getTime() - duration > base) {
    k = Math.max(0, Math.floor((from.getTime() - duration - base) / WEEK_MS))
  }

  const out: ReturnType<typeof serializeEvent>[] = []
  for (let i = 0; i < MAX_OCCURRENCES; i++, k++) {
    const startMs = base + k * WEEK_MS
    if (startMs > to.getTime() || startMs >= untilMs) break
    const endMs = startMs + duration
    if (!overlaps(startMs, endMs, from, to)) continue
    const date = dateKey(new Date(startMs))
    if (cancelled.has(date)) continue
    out.push(
      serializeEvent(event, {
        startsAt: new Date(startMs),
        endsAt: event.endsAt ? new Date(endMs) : null,
        date,
      })
    )
  }
  return out
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const calendarPlugin: FastifyPluginAsync = async (fastify) => {
  // GET /calendar/events?from=&to= — the shared calendar: every tier 1+ sees all
  // events, with recurring series expanded into occurrences within the range.
  fastify.get('/calendar/events', async (request, reply) => {
    if (!request.ability.can('view', 'calendar.Event')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { from: fromRaw, to: toRaw } = request.query as { from?: string; to?: string }
    if (!fromRaw || !toRaw) {
      return reply.status(400).send({ error: 'from and to are required' })
    }
    const from = new Date(fromRaw)
    const to = new Date(toRaw)
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return reply.status(400).send({ error: 'Invalid from/to' })
    }

    const events = (await calendarPrisma.event.findMany({
      include: { attendees: true, exceptions: true },
    })) as unknown as EventRow[]

    const result: ReturnType<typeof serializeEvent>[] = []
    for (const event of events) {
      if (event.recurrence === 'weekly') {
        result.push(...expandWeekly(event, from, to))
      } else {
        const endMs = (event.endsAt ?? event.startsAt).getTime()
        if (overlaps(event.startsAt.getTime(), endMs, from, to)) {
          result.push(serializeEvent(event))
        }
      }
    }
    result.sort((a, b) => a.startsAt.localeCompare(b.startsAt))

    return { events: result }
  })

  // GET /calendar/activities — the Activities lens (story #5). Returns each
  // standing activity as its canonical series (NOT expanded into occurrences):
  // an activity is a weekly-recurring event owned by exactly one person, derived
  // as `is_activity` on write (ADR 038). Same shared-calendar view rule as events
  // (tier 1+ sees them; management stays tier-4 on the event routes). The client
  // derives weekday + time from `startsAt` and the season end from
  // `recurrenceUntil`, so no range is needed here.
  fastify.get('/calendar/activities', async (request, reply) => {
    if (!request.ability.can('view', 'calendar.Event')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const events = (await calendarPrisma.event.findMany({
      where: { isActivity: true },
      include: { attendees: true, exceptions: true },
      orderBy: { startsAt: 'asc' },
    })) as unknown as EventRow[]

    return { activities: events.map((event) => serializeEvent(event)) }
  })

  // POST /calendar/events — create an event (tier 4).
  fastify.post('/calendar/events', async (request, reply) => {
    if (!request.ability.can('create', 'calendar.Event')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = await parseEventBody(request.body)
    if (!parsed.ok) return reply.status(parsed.status).send({ error: parsed.error })
    const d = parsed.data

    const event = (await calendarPrisma.event.create({
      data: {
        title: d.title,
        description: d.description,
        createdBy: request.profile.id,
        startsAt: d.startsAt,
        endsAt: d.endsAt,
        allDay: d.allDay,
        location: d.location,
        recurrence: d.recurrence,
        recurrenceUntil: d.recurrenceUntil,
        isActivity: d.isActivity,
        reminderMinutes: d.reminderMinutes,
        attendees: { create: d.attendeeIds.map((profileId) => ({ profileId })) },
      },
      include: { attendees: true, exceptions: true },
    })) as unknown as EventRow

    fastify.eventBus.emit('calendar.event.created', {
      eventId: event.id,
      ownerId: deriveOwnerId(d.attendeeIds),
      createdBy: event.createdBy,
      title: event.title,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt ? event.endsAt.toISOString() : null,
      allDay: event.allDay,
      recurrence: event.recurrence,
    })

    return reply.status(201).send(serializeEvent(event))
  })

  // PATCH /calendar/events/:id — edit the whole series (tier 4). The drawer submits
  // the full field set, so attendees are replaced wholesale.
  fastify.patch('/calendar/events/:id', async (request, reply) => {
    if (!request.ability.can('update', 'calendar.Event')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await calendarPrisma.event.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Event not found' })

    const parsed = await parseEventBody(request.body)
    if (!parsed.ok) return reply.status(parsed.status).send({ error: parsed.error })
    const d = parsed.data

    const event = (await calendarPrisma.event.update({
      where: { id },
      data: {
        title: d.title,
        description: d.description,
        startsAt: d.startsAt,
        endsAt: d.endsAt,
        allDay: d.allDay,
        location: d.location,
        recurrence: d.recurrence,
        recurrenceUntil: d.recurrenceUntil,
        isActivity: d.isActivity,
        reminderMinutes: d.reminderMinutes,
        attendees: {
          deleteMany: {},
          create: d.attendeeIds.map((profileId) => ({ profileId })),
        },
      },
      include: { attendees: true, exceptions: true },
    })) as unknown as EventRow

    fastify.eventBus.emit('calendar.event.updated', {
      eventId: event.id,
      ownerId: deriveOwnerId(d.attendeeIds),
      title: event.title,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt ? event.endsAt.toISOString() : null,
      allDay: event.allDay,
      recurrence: event.recurrence,
    })

    return serializeEvent(event)
  })

  // DELETE /calendar/events/:id — delete the whole series, or with ?occurrence=
  // YYYY-MM-DD skip just that one weekly occurrence via a cancellation exception
  // (tier 4). Idempotent in both modes.
  fastify.delete('/calendar/events/:id', async (request, reply) => {
    if (!request.ability.can('delete', 'calendar.Event')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const { occurrence } = request.query as { occurrence?: string }

    const existing = (await calendarPrisma.event.findUnique({
      where: { id },
      include: { attendees: true },
    })) as unknown as EventRow | null
    if (!existing) return reply.status(404).send({ error: 'Event not found' })

    // Skip one occurrence — write a cancellation exception, leave the series intact.
    if (occurrence) {
      if (existing.recurrence !== 'weekly') {
        return reply.status(400).send({ error: 'Event is not recurring' })
      }
      const date = new Date(`${occurrence}T00:00:00.000Z`)
      if (isNaN(date.getTime())) {
        return reply.status(400).send({ error: 'Invalid occurrence date' })
      }
      await calendarPrisma.eventException.upsert({
        where: { eventId_occurrenceDate: { eventId: id, occurrenceDate: date } },
        update: { kind: 'cancelled' },
        create: { eventId: id, occurrenceDate: date, kind: 'cancelled' },
      })
      return reply.status(204).send()
    }

    // Delete the whole series — attendees and exceptions cascade.
    await calendarPrisma.event.delete({ where: { id } })

    fastify.eventBus.emit('calendar.event.deleted', {
      eventId: existing.id,
      ownerId: deriveOwnerId(existing.attendees.map((a) => a.profileId)),
    })

    return reply.status(204).send()
  })
}

export default fp(calendarPlugin, { name: 'calendar' })
