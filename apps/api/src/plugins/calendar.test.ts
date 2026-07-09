import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import { buildServer } from '../server'
import { prisma, PERMISSION_REGISTRY } from '@family-os/platform/server'
import { calendarPrisma } from '@family-os/plugin-calendar/db'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

// Fixed UUIDs for test profiles.
const PARENT_ID = '00000000-ca1e-0001-0000-000000000001' // tier 4
const TEEN_ID = '00000000-ca1e-0001-0000-000000000002' // tier 3
const TWEEN_ID = '00000000-ca1e-0001-0000-000000000003' // tier 2
const KID_ID = '00000000-ca1e-0001-0000-000000000004' // tier 1
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

async function clearEvents() {
  // Exceptions + attendees cascade from events, but clear explicitly for clarity.
  await calendarPrisma.eventException.deleteMany({})
  await calendarPrisma.eventAttendee.deleteMany({})
  await calendarPrisma.event.deleteMany({})
}

type Payload = Record<string, unknown>

async function createEvent(cookie: string, payload: Payload): Promise<LightMyRequestResponse> {
  return app.inject({
    method: 'POST',
    url: '/api/calendar/events',
    headers: { cookie },
    payload,
  })
}

async function listEvents(cookie: string, from: string, to: string) {
  const res = await app.inject({
    method: 'GET',
    url: `/api/calendar/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    headers: { cookie },
  })
  return res
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
  await clearEvents()
  await prisma.profile.deleteMany({ where: { id: { in: ALL_IDS } } })
  await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })
  await app.close()
  await prisma.$disconnect()
  await calendarPrisma.$disconnect()
})

beforeEach(async () => {
  await clearEvents()
})

// ─── Permission registry ─────────────────────────────────────────────────────

describe('permission registry', () => {
  it('registers the calendar view + create keys', () => {
    expect(PERMISSION_REGISTRY['calendar.event.view']).toMatchObject({
      subject: 'calendar.Event',
      action: 'view',
    })
    expect(PERMISSION_REGISTRY['calendar.event.create']).toMatchObject({
      subject: 'calendar.Event',
      action: 'create',
    })
  })
})

// ─── Create / authorization ──────────────────────────────────────────────────

describe('POST /calendar/events — create & authorization', () => {
  it('creates an event for tier 4 (201)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Dentist',
      startsAt: '2026-07-01T14:00:00.000Z',
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body).toMatchObject({
      title: 'Dentist',
      attendeeIds: [],
      ownerId: null,
      isOccurrence: false,
    })
    expect(body.seriesId).toBe(body.id)
  })

  it('rejects create for tiers 1–3 (403)', async () => {
    for (const id of [TEEN_ID, TWEEN_ID, KID_ID]) {
      const cookie = await getCookieForProfile(id)
      const res = await createEvent(cookie, { title: 'Nope', startsAt: '2026-07-01T14:00:00.000Z' })
      expect(res.statusCode).toBe(403)
    }
  })

  it('requires a title', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, { startsAt: '2026-07-01T14:00:00.000Z' })
    expect(res.statusCode).toBe(400)
  })

  it('creates a solo (owned) event and derives ownerId', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Kid haircut',
      startsAt: '2026-07-02T15:00:00.000Z',
      attendeeIds: [KID_ID],
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.attendeeIds).toEqual([KID_ID])
    expect(body.ownerId).toBe(KID_ID)
  })

  it('creates a Family event (no attendees)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Sunday dinner',
      startsAt: '2026-07-05T23:00:00.000Z',
      attendeeIds: [],
    })
    expect(res.statusCode).toBe(201)
    expect(res.json().ownerId).toBeNull()
  })

  it('creates a shared event (2+ attendees) with ownerId null', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Date night',
      startsAt: '2026-07-04T23:00:00.000Z',
      attendeeIds: [PARENT_ID, TEEN_ID],
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.attendeeIds).toHaveLength(2)
    expect(body.ownerId).toBeNull()
  })

  it('returns 404 for a well-formed but unknown attendee id', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Ghost',
      startsAt: '2026-07-02T15:00:00.000Z',
      attendeeIds: ['00000000-0000-0000-0000-0000000000ff'],
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 400 for a malformed attendee id (Zod shape check)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Malformed',
      startsAt: '2026-07-02T15:00:00.000Z',
      attendeeIds: ['not-a-uuid'],
    })
    expect(res.statusCode).toBe(400)
  })

  it('emits calendar.event.created with the published payload', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const events: Record<string, unknown>[] = []
    const off = app.eventBus.on('calendar.event.created', (p) => events.push(p as never))
    const res = await createEvent(cookie, {
      title: 'Recital',
      startsAt: '2026-07-02T15:00:00.000Z',
      attendeeIds: [KID_ID],
    })
    off()
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      eventId: res.json().id,
      ownerId: KID_ID,
      createdBy: PARENT_ID,
      title: 'Recital',
      allDay: false,
      recurrence: null,
    })
  })
})

// ─── Shape: all-day & multi-day ──────────────────────────────────────────────

describe('event shape — all-day & multi-day', () => {
  it('round-trips an all-day event', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Holiday',
      startsAt: '2026-07-10T00:00:00.000Z',
      allDay: true,
    })
    expect(res.statusCode).toBe(201)
    expect(res.json().allDay).toBe(true)
  })

  it('round-trips a multi-day span', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Zach to London',
      startsAt: '2026-07-12T08:00:00.000Z',
      endsAt: '2026-07-15T20:00:00.000Z',
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.startsAt).toBe('2026-07-12T08:00:00.000Z')
    expect(body.endsAt).toBe('2026-07-15T20:00:00.000Z')
  })

  it('rejects endsAt before startsAt', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Backwards',
      startsAt: '2026-07-12T08:00:00.000Z',
      endsAt: '2026-07-11T20:00:00.000Z',
    })
    expect(res.statusCode).toBe(400)
  })
})

// ─── List & weekly expansion ─────────────────────────────────────────────────

describe('GET /calendar/events — list & weekly expansion', () => {
  it('requires from and to', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({
      method: 'GET',
      url: '/api/calendar/events',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns events overlapping the range for any tier 1+ (shared calendar)', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    await createEvent(parent, { title: 'In range', startsAt: '2026-07-15T14:00:00.000Z' })
    await createEvent(parent, { title: 'Out of range', startsAt: '2026-09-01T14:00:00.000Z' })

    // A tier-1 kid reads the shared calendar.
    const kid = await getCookieForProfile(KID_ID)
    const res = await listEvents(kid, '2026-07-01T00:00:00.000Z', '2026-07-31T23:59:59.000Z')
    expect(res.statusCode).toBe(200)
    const titles = res.json().events.map((e: { title: string }) => e.title)
    expect(titles).toContain('In range')
    expect(titles).not.toContain('Out of range')
  })

  it('expands a weekly series into one occurrence per week within range, not past recurrenceUntil', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    // Every Tuesday 17:15, starting 2026-07-07, until 2026-07-28 (inclusive).
    await createEvent(cookie, {
      title: 'Gymnastics',
      startsAt: '2026-07-07T17:15:00.000Z',
      attendeeIds: [KID_ID],
      recurrence: 'weekly',
      recurrenceUntil: '2026-07-28',
    })

    const res = await listEvents(cookie, '2026-07-01T00:00:00.000Z', '2026-08-31T23:59:59.000Z')
    const occ = res.json().events.filter((e: { title: string }) => e.title === 'Gymnastics')
    // Tuesdays: 07-07, 07-14, 07-21, 07-28 → 4 occurrences, none in August.
    expect(occ).toHaveLength(4)
    expect(occ.map((e: { occurrenceDate: string }) => e.occurrenceDate)).toEqual([
      '2026-07-07',
      '2026-07-14',
      '2026-07-21',
      '2026-07-28',
    ])
    // Each occurrence is flagged and carries a synthetic id + the canonical seriesId.
    expect(occ[0].isOccurrence).toBe(true)
    expect(occ[0].isActivity).toBe(true)
    expect(occ[0].id).toBe(`${occ[0].seriesId}:2026-07-07`)
  })

  it('clips weekly expansion to the queried window', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    await createEvent(cookie, {
      title: 'Trash day',
      startsAt: '2026-07-01T12:00:00.000Z',
      recurrence: 'weekly',
    })
    const res = await listEvents(cookie, '2026-07-08T00:00:00.000Z', '2026-07-21T23:59:59.000Z')
    const occ = res.json().events.filter((e: { title: string }) => e.title === 'Trash day')
    expect(occ.map((e: { occurrenceDate: string }) => e.occurrenceDate)).toEqual([
      '2026-07-08',
      '2026-07-15',
    ])
  })
})

// ─── Activities lens ─────────────────────────────────────────────────────────

async function listActivities(cookie: string) {
  return app.inject({ method: 'GET', url: '/api/calendar/activities', headers: { cookie } })
}

describe('GET /calendar/activities — the Activities lens', () => {
  it('returns only weekly single-owner series (not one-offs, Family, or shared)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    // An activity: weekly + exactly one owner.
    await createEvent(cookie, {
      title: 'Gymnastics',
      startsAt: '2026-07-07T17:15:00.000Z',
      attendeeIds: [KID_ID],
      recurrence: 'weekly',
      recurrenceUntil: '2026-08-25',
    })
    // Not activities: one-off owned, Family weekly (no owner), shared weekly (2 owners).
    await createEvent(cookie, {
      title: 'Haircut',
      startsAt: '2026-07-02T15:00:00.000Z',
      attendeeIds: [KID_ID],
    })
    await createEvent(cookie, {
      title: 'Trash day',
      startsAt: '2026-07-01T12:00:00.000Z',
      recurrence: 'weekly',
    })
    await createEvent(cookie, {
      title: 'Date night',
      startsAt: '2026-07-04T23:00:00.000Z',
      attendeeIds: [PARENT_ID, TEEN_ID],
      recurrence: 'weekly',
    })

    const res = await listActivities(cookie)
    expect(res.statusCode).toBe(200)
    const acts = res.json().activities as Record<string, unknown>[]
    expect(acts.map((a) => a.title)).toEqual(['Gymnastics'])
    // Canonical series (not an expanded occurrence) carrying the lens's fields.
    expect(acts[0]).toMatchObject({
      isActivity: true,
      ownerId: KID_ID,
      recurrenceUntil: '2026-08-25',
      isOccurrence: false,
    })
    expect(acts[0].seriesId).toBe(acts[0].id)
  })

  it('is readable by any tier 1+ (shared calendar)', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    await createEvent(parent, {
      title: 'Swim',
      startsAt: '2026-07-09T18:00:00.000Z',
      attendeeIds: [KID_ID],
      recurrence: 'weekly',
    })
    const kid = await getCookieForProfile(KID_ID)
    const res = await listActivities(kid)
    expect(res.statusCode).toBe(200)
    const titles = (res.json().activities as { title: string }[]).map((a) => a.title)
    expect(titles).toContain('Swim')
  })
})

// ─── Update ──────────────────────────────────────────────────────────────────

describe('PATCH /calendar/events/:id', () => {
  async function seed(): Promise<string> {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Original',
      startsAt: '2026-07-02T15:00:00.000Z',
      attendeeIds: [KID_ID],
    })
    return res.json().id
  }

  it('updates fields and replaces attendees for tier 4 (200) and emits updated', async () => {
    const id = await seed()
    const cookie = await getCookieForProfile(PARENT_ID)
    const events: Record<string, unknown>[] = []
    const off = app.eventBus.on('calendar.event.updated', (p) => events.push(p as never))
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/calendar/events/${id}`,
      headers: { cookie },
      payload: { title: 'Edited', startsAt: '2026-07-02T16:00:00.000Z', attendeeIds: [TEEN_ID] },
    })
    off()
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.title).toBe('Edited')
    expect(body.attendeeIds).toEqual([TEEN_ID])
    expect(body.ownerId).toBe(TEEN_ID)
    expect(events[0]).toMatchObject({ eventId: id, ownerId: TEEN_ID, title: 'Edited' })
  })

  it('rejects update for tier 3 (403)', async () => {
    const id = await seed()
    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/calendar/events/${id}`,
      headers: { cookie },
      payload: { title: 'Hijack', startsAt: '2026-07-02T16:00:00.000Z' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('returns 404 for an unknown id', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/calendar/events/00000000-0000-0000-0000-0000000000aa',
      headers: { cookie },
      payload: { title: 'X', startsAt: '2026-07-02T16:00:00.000Z' },
    })
    expect(res.statusCode).toBe(404)
  })
})

// ─── Delete: series & per-occurrence skip ────────────────────────────────────

describe('DELETE /calendar/events/:id', () => {
  async function seedWeekly(): Promise<string> {
    const cookie = await getCookieForProfile(PARENT_ID)
    const res = await createEvent(cookie, {
      title: 'Gymnastics',
      startsAt: '2026-07-07T17:15:00.000Z',
      attendeeIds: [KID_ID],
      recurrence: 'weekly',
      recurrenceUntil: '2026-07-28',
    })
    return res.json().id
  }

  it('deletes the whole series for tier 4 (204) and emits deleted', async () => {
    const id = await seedWeekly()
    const cookie = await getCookieForProfile(PARENT_ID)
    const events: Record<string, unknown>[] = []
    const off = app.eventBus.on('calendar.event.deleted', (p) => events.push(p as never))
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/calendar/events/${id}`,
      headers: { cookie },
    })
    off()
    expect(res.statusCode).toBe(204)
    expect(events[0]).toMatchObject({ eventId: id, ownerId: KID_ID })
    expect(await calendarPrisma.event.findUnique({ where: { id } })).toBeNull()
  })

  it('rejects delete for tier 3 (403)', async () => {
    const id = await seedWeekly()
    const cookie = await getCookieForProfile(TEEN_ID)
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/calendar/events/${id}`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(403)
  })

  it('skips one occurrence via ?occurrence= and is idempotent', async () => {
    const id = await seedWeekly()
    const cookie = await getCookieForProfile(PARENT_ID)

    // Cancel the 07-14 occurrence.
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/calendar/events/${id}?occurrence=2026-07-14`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(204)

    // Re-issuing is idempotent.
    const again = await app.inject({
      method: 'DELETE',
      url: `/api/calendar/events/${id}?occurrence=2026-07-14`,
      headers: { cookie },
    })
    expect(again.statusCode).toBe(204)

    // The series survives; only 07-14 is gone.
    const list = await listEvents(cookie, '2026-07-01T00:00:00.000Z', '2026-07-31T23:59:59.000Z')
    const dates = list
      .json()
      .events.filter((e: { title: string }) => e.title === 'Gymnastics')
      .map((e: { occurrenceDate: string }) => e.occurrenceDate)
    expect(dates).toEqual(['2026-07-07', '2026-07-21', '2026-07-28'])
  })

  it('rejects ?occurrence= on a non-recurring event (400)', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)
    const created = await createEvent(cookie, {
      title: 'One-off',
      startsAt: '2026-07-02T15:00:00.000Z',
    })
    const id = created.json().id
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/calendar/events/${id}?occurrence=2026-07-02`,
      headers: { cookie },
    })
    expect(res.statusCode).toBe(400)
  })
})
