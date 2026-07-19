import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { prisma, createEventBus } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { calendarPrisma } from '@family-os/plugin-calendar/db'
import { runReminderTick } from './reminder-scheduler'

// Fixed clock — reminders are computed relative to this `now`.
const NOW = new Date('2026-08-01T12:00:00.000Z')
const inMinutes = (m: number) => new Date(NOW.getTime() + m * 60 * 1000)

const DAD_ID = '00000000-1e11-0001-0000-000000000001' // tier 4
const MOM_ID = '00000000-1e11-0001-0000-000000000002' // tier 4
const TEEN_ID = '00000000-1e11-0001-0000-000000000003' // tier 3
const TWEEN_ID = '00000000-1e11-0001-0000-000000000004' // tier 2
const KID_ID = '00000000-1e11-0001-0000-000000000005' // tier 1
const PROFILES: [string, string, number][] = [
  [DAD_ID, 'Dad', 4],
  [MOM_ID, 'Mom', 4],
  [TEEN_ID, 'Teen', 3],
  [TWEEN_ID, 'Tween', 2],
  [KID_ID, 'Kid', 1],
]
const ALL_IDS = PROFILES.map(([id]) => id)

let bus: EventBus

type EventOverrides = {
  startsAt?: Date
  reminderMinutes?: number | null
  attendeeIds?: string[]
  recurrence?: string | null
  recurrenceUntil?: Date | null
}

async function makeEvent(o: EventOverrides = {}) {
  const attendeeIds = o.attendeeIds ?? []
  return calendarPrisma.event.create({
    data: {
      title: 'Dentist',
      createdBy: DAD_ID,
      startsAt: o.startsAt ?? inMinutes(30),
      reminderMinutes: o.reminderMinutes === undefined ? 30 : o.reminderMinutes,
      recurrence: o.recurrence ?? null,
      recurrenceUntil: o.recurrenceUntil ?? null,
      attendees: { create: attendeeIds.map((profileId) => ({ profileId })) },
    },
  })
}

const notifCount = (profileId: string) => prisma.notification.count({ where: { profileId } })

beforeAll(async () => {
  bus = createEventBus()
  for (const [id, name, tier] of PROFILES) {
    await prisma.profile.upsert({
      where: { id },
      update: { name, tier },
      create: { id, name, tier },
    })
  }
})

afterAll(async () => {
  await calendarPrisma.event.deleteMany({})
  await prisma.notification.deleteMany({ where: { profileId: { in: ALL_IDS } } })
  await prisma.profile.deleteMany({ where: { id: { in: ALL_IDS } } })
  await prisma.$disconnect()
  await calendarPrisma.$disconnect()
})

beforeEach(async () => {
  await calendarPrisma.reminderLog.deleteMany({})
  await calendarPrisma.event.deleteMany({})
  await prisma.notification.deleteMany({ where: { profileId: { in: ALL_IDS } } })
})

describe('reminder scheduler', () => {
  it('fires a notification at startsAt - reminderMinutes (AC1)', async () => {
    const event = await makeEvent({
      startsAt: inMinutes(30),
      reminderMinutes: 30,
      attendeeIds: [TWEEN_ID],
    })
    await runReminderTick(bus, NOW)

    expect(await notifCount(TWEEN_ID)).toBe(1)
    const log = await calendarPrisma.reminderLog.findMany({ where: { eventId: event.id } })
    expect(log).toHaveLength(1)
  })

  it('fires nothing for an event with no reminder (AC2)', async () => {
    await makeEvent({ startsAt: inMinutes(30), reminderMinutes: null, attendeeIds: [TWEEN_ID] })
    await runReminderTick(bus, NOW)

    expect(await notifCount(TWEEN_ID)).toBe(0)
    expect(await calendarPrisma.reminderLog.count()).toBe(0)
  })

  it('does not fire before the reminder window opens', async () => {
    await makeEvent({ startsAt: inMinutes(120), reminderMinutes: 30, attendeeIds: [TWEEN_ID] })
    await runReminderTick(bus, NOW)

    expect(await notifCount(TWEEN_ID)).toBe(0)
  })

  it('does not fire for an occurrence already started (stale)', async () => {
    await makeEvent({ startsAt: inMinutes(-10), reminderMinutes: 30, attendeeIds: [TWEEN_ID] })
    await runReminderTick(bus, NOW)

    expect(await notifCount(TWEEN_ID)).toBe(0)
    expect(await calendarPrisma.reminderLog.count()).toBe(0)
  })

  it('fires exactly once across repeated ticks (AC6 dedup)', async () => {
    await makeEvent({ startsAt: inMinutes(30), reminderMinutes: 30, attendeeIds: [TWEEN_ID] })
    await runReminderTick(bus, NOW)
    await runReminderTick(bus, NOW)

    expect(await notifCount(TWEEN_ID)).toBe(1)
    expect(await calendarPrisma.reminderLog.count()).toBe(1)
  })

  it('reminds an owned event to its attendees plus every tier-4 parent (AC4)', async () => {
    await makeEvent({ startsAt: inMinutes(30), attendeeIds: [TWEEN_ID] })
    await runReminderTick(bus, NOW)

    expect(await notifCount(TWEEN_ID)).toBe(1) // attendee
    expect(await notifCount(DAD_ID)).toBe(1) // parent
    expect(await notifCount(MOM_ID)).toBe(1) // parent
    expect(await notifCount(TEEN_ID)).toBe(0) // not an attendee, not a parent
    expect(await notifCount(KID_ID)).toBe(0)
  })

  it('reminds a Family event (no attendees) to everyone tier 2+ (AC4)', async () => {
    await makeEvent({ startsAt: inMinutes(30), attendeeIds: [] })
    await runReminderTick(bus, NOW)

    for (const id of [DAD_ID, MOM_ID, TEEN_ID, TWEEN_ID]) {
      expect(await notifCount(id)).toBe(1)
    }
    expect(await notifCount(KID_ID)).toBe(0) // tier 1 — notify() gate
  })

  it('reminds a recurring event for the occurrence falling in the window (AC3)', async () => {
    // Weekly series whose 2nd occurrence lands at NOW + 30 min.
    const base = new Date(inMinutes(30).getTime() - 2 * 7 * 24 * 60 * 60 * 1000)
    await makeEvent({ startsAt: base, recurrence: 'weekly', attendeeIds: [TWEEN_ID] })
    await runReminderTick(bus, NOW)

    expect(await notifCount(TWEEN_ID)).toBe(1)
    const log = await calendarPrisma.reminderLog.findFirst()
    expect(log?.occurrenceDate.toISOString().slice(0, 10)).toBe('2026-08-01')
  })

  it('stops recurring reminders after recurrence_until (AC3)', async () => {
    const base = new Date(inMinutes(30).getTime() - 2 * 7 * 24 * 60 * 60 * 1000)
    await makeEvent({
      startsAt: base,
      recurrence: 'weekly',
      recurrenceUntil: new Date('2026-07-25'),
      attendeeIds: [TWEEN_ID],
    })
    await runReminderTick(bus, NOW)

    expect(await notifCount(TWEEN_ID)).toBe(0)
  })

  it('does not fire once the time is edited out of the window (AC5)', async () => {
    const event = await makeEvent({ startsAt: inMinutes(30), attendeeIds: [TWEEN_ID] })
    await calendarPrisma.event.update({
      where: { id: event.id },
      data: { startsAt: inMinutes(180) },
    })
    await runReminderTick(bus, NOW)

    expect(await notifCount(TWEEN_ID)).toBe(0)
  })

  it('cancels a reminder and cleans its ledger when the event is deleted (AC5)', async () => {
    const event = await makeEvent({ startsAt: inMinutes(30), attendeeIds: [TWEEN_ID] })
    await runReminderTick(bus, NOW)
    expect(await calendarPrisma.reminderLog.count()).toBe(1)

    await calendarPrisma.event.delete({ where: { id: event.id } })
    expect(await calendarPrisma.reminderLog.count()).toBe(0) // FK cascade
  })
})
