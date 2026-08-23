import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma, createDayMarkRegistry } from '@family-os/platform/server'
import type { EventBus, DayMarkRegistry } from '@family-os/platform/server'
import { EventInputSchema, type EventInput } from '@family-os/schemas'
import { calendarPrisma } from '@family-os/plugin-calendar/db'
import { notify } from '../lib/notify'
import { startReminderScheduler } from '../lib/reminder-scheduler'
import { isRecurring, occurrenceDateKey, occurrenceStarts } from '../lib/recurrence'
import { aggregateDayMarks } from '../lib/day-marks'

// Registered here — the calendar is the surface that owns the day-marks read
// (ADR 050/066); providers (meals, later School) reach it via
// `fastify.dayMarks.register(...)`, never by calendar importing them.
declare module 'fastify' {
  interface FastifyInstance {
    dayMarks: DayMarkRegistry
  }
}

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
  recurrenceDayOffsets: number[]
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
  recurrence: 'weekly' | 'daily' | null
  recurrenceDayOffsets: number[]
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
  // Derived, never user-chosen (ADR 038, amended 2026-08-19): a weekly event with
  // any member attendees is a standing Activity for each of them; only Family
  // (zero-attendee) events stay out. A bounded daily window (ADR 057) is not a
  // standing commitment and never one.
  const isActivity = recurrence === 'weekly' && attendeeIds.length >= 1

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
      recurrenceDayOffsets:
        recurrence === 'daily'
          ? [...new Set(input.recurrenceDayOffsets ?? [])].sort((a, b) => a - b)
          : [],
      // recurrence_until is only meaningful for a recurring series.
      recurrenceUntil: recurrence && input.recurrenceUntil ? new Date(input.recurrenceUntil) : null,
      reminderMinutes: input.reminderMinutes ?? null,
      isActivity,
    },
  }
}

// ─── Serialization & recurrence expansion ────────────────────────────────────────

const dateKey = occurrenceDateKey

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
    // The canonical row's start — an occurrence overrides `startsAt` above, and
    // the edit drawer needs the series' own anchor to round-trip a range.
    seriesStartsAt: event.startsAt.toISOString(),
    allDay: event.allDay,
    location: event.location,
    recurrence: event.recurrence,
    recurrenceDayOffsets: event.recurrenceDayOffsets ?? [],
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

/** Expands a weekly or daily series into the occurrences overlapping `[from, to]`
 *  (ADR 038, ADR 057). The stepping, weekday-offset membership, `cancelled`
 *  exceptions, and `recurrenceUntil` all live in the shared `occurrenceStarts` —
 *  the reminder scheduler expands from the same module. */
function expandRecurring(event: EventRow, from: Date, to: Date) {
  const duration =
    (event.endsAt ? event.endsAt.getTime() : event.startsAt.getTime()) - event.startsAt.getTime()
  return occurrenceStarts(event, from.getTime(), to.getTime(), duration).map((startMs) =>
    serializeEvent(event, {
      startsAt: new Date(startMs),
      endsAt: event.endsAt ? new Date(startMs + duration) : null,
      date: dateKey(new Date(startMs)),
    })
  )
}

// ─── New-event notification (subscriber) ─────────────────────────────────────

type EventCreatedPayload = {
  eventId?: string
  createdBy?: string
  title?: string
  startsAt?: string
  allDay?: boolean
  recurrence?: string | null
}

// Server-local time — the household's timezone on the Pi.
function formatEventStart(start: Date, allDay: boolean, recurrence: string | null): string {
  const day = start.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const when = allDay
    ? `${day} · All day`
    : `${day} · ${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  return recurrence ? `${when} · Repeats ${recurrence}` : when
}

/** Notifies every tier-4 parent except the creator when a new event lands on the
 *  calendar. A recurring series notifies once, at creation — the series is one row
 *  and `calendar.event.created` fires once (ADR 038). Routed through the shared
 *  notify() path; priority `alert` carries Web Push to tier 4 (ADR 029). */
async function handleEventCreatedNotification(payload: unknown, eventBus: EventBus): Promise<void> {
  const { eventId, createdBy, title, startsAt, allDay, recurrence } = payload as EventCreatedPayload

  if (!createdBy || !startsAt) {
    console.warn('[calendar] event.created missing createdBy/startsAt — skipping notification', {
      eventId,
    })
    return
  }

  const parents = await prisma.profile.findMany({ where: { tier: 4 }, select: { id: true } })
  const audience = parents.filter((p) => p.id !== createdBy)
  if (audience.length === 0) return

  const creator = await prisma.profile.findUnique({ where: { id: createdBy } })
  const creatorName = creator?.name ?? 'Someone'

  const body = formatEventStart(new Date(startsAt), allDay ?? false, recurrence ?? null)
  await Promise.all(
    audience.map(({ id }) =>
      notify(eventBus, id, {
        title: `${creatorName} added ${title ?? 'an event'}`,
        body,
        variant: 'info',
        priority: 'alert',
      })
    )
  )
}

// ─── Range query parsing (shared by /calendar/events and /calendar/day-marks) ────

type RangeQuery = { fromRaw: string; toRaw: string; from: Date; to: Date }
type RangeResult = { ok: true; range: RangeQuery } | { ok: false; status: number; error: string }

function parseRangeQuery(query: unknown): RangeResult {
  const { from: fromRaw, to: toRaw } = (query ?? {}) as { from?: string; to?: string }
  if (!fromRaw || !toRaw) {
    return { ok: false, status: 400, error: 'from and to are required' }
  }
  const from = new Date(fromRaw)
  const to = new Date(toRaw)
  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return { ok: false, status: 400, error: 'Invalid from/to' }
  }
  return { ok: true, range: { fromRaw, toRaw, from, to } }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const calendarPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('dayMarks', createDayMarkRegistry())

  // Time-based reminder poll (ADR 045). Not in tests — they drive `runReminderTick`
  // directly with a mocked clock; a live 60s interval would leak and fire on fixtures.
  if (process.env.NODE_ENV !== 'test') {
    const stop = startReminderScheduler(fastify.eventBus)
    fastify.addHook('onClose', async () => stop())
  }

  // GET /calendar/events?from=&to= — the shared calendar: every tier 1+ sees all
  // events, with recurring series expanded into occurrences within the range.
  fastify.get('/calendar/events', async (request, reply) => {
    if (!request.ability.can('view', 'calendar.Event')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = parseRangeQuery(request.query)
    if (!parsed.ok) return reply.status(parsed.status).send({ error: parsed.error })
    const { from, to } = parsed.range

    const events = (await calendarPrisma.event.findMany({
      include: { attendees: true, exceptions: true },
    })) as unknown as EventRow[]

    const result: ReturnType<typeof serializeEvent>[] = []
    for (const event of events) {
      if (isRecurring(event)) {
        result.push(...expandRecurring(event, from, to))
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

  // GET /calendar/day-marks?from=&to= — read-time provider aggregation (ADR 050).
  // The calendar surface gate (`calendar.event.view`) applies first, same as
  // /calendar/events; each provider's own gate applies inside `aggregateDayMarks`
  // (ADR 066). `plugins/calendar` never imports a provider — this route is the
  // only place the registry is read.
  fastify.get('/calendar/day-marks', async (request, reply) => {
    if (!request.ability.can('view', 'calendar.Event')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = parseRangeQuery(request.query)
    if (!parsed.ok) return reply.status(parsed.status).send({ error: parsed.error })
    const { fromRaw, toRaw } = parsed.range

    const marks = await aggregateDayMarks(fastify.dayMarks.list(), request.ability, fromRaw, toRaw)
    return { marks }
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
        recurrenceDayOffsets: d.recurrenceDayOffsets,
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

    // Re-arm reminders when the timing changes: the reminder ledger (ADR 045) is
    // keyed by occurrence *date*, so a same-day time move (or a reminder-lead change)
    // would otherwise stay suppressed by an already-fired row. Clearing the event's
    // ledger lets the scheduler fire the corrected reminder; past occurrences won't
    // re-fire (they're stale). A title/location-only edit leaves it untouched.
    const timingChanged =
      existing.startsAt.getTime() !== d.startsAt.getTime() ||
      existing.reminderMinutes !== d.reminderMinutes
    if (timingChanged) {
      await calendarPrisma.reminderLog.deleteMany({ where: { eventId: id } })
    }

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
        recurrenceDayOffsets: d.recurrenceDayOffsets,
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
      if (!isRecurring(existing)) {
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

  // ─── Event subscribers ─────────────────────────────────────────────────────

  // Errors are logged and swallowed so a failed notification never breaks
  // event creation (chores.ts convention).
  fastify.eventBus.on('calendar.event.created', (payload) => {
    void handleEventCreatedNotification(payload, fastify.eventBus).catch((err) =>
      fastify.log.error({ err }, '[calendar] event-created notification subscriber failed')
    )
  })
}

export default fp(calendarPlugin, { name: 'calendar' })
