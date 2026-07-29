import { prisma } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { calendarPrisma } from '@family-os/plugin-calendar/db'
import { notify } from './notify'
import { occurrenceDateKey, occurrenceStarts } from './recurrence'

const MINUTE_MS = 60 * 1000
const DAY_MS = 24 * 60 * MINUTE_MS
const TICK_MS = 60 * 1000
const LEDGER_RETENTION_MS = 30 * DAY_MS // fired rows older than this are prunable

// ─── Row shapes (generated Prisma types stay inside the plugin package) ──────────

type AttendeeRow = { profileId: string }
type ExceptionRow = { occurrenceDate: Date; kind: string }
type EventRow = {
  id: string
  title: string
  location: string | null
  startsAt: Date
  recurrence: string | null
  recurrenceDayOffsets: number[]
  recurrenceUntil: Date | null
  reminderMinutes: number | null
  attendees: AttendeeRow[]
  exceptions: ExceptionRow[]
}

const dateKey = occurrenceDateKey

/** The occurrences of `event` whose reminder has just come due at `now`: those
 *  starting in `(now, now + reminderMinutes]`, i.e. `startsAt - reminderMinutes <= now`
 *  while the occurrence is still in the future (a reminder after the event started is
 *  stale, so it is never fired). Expansion — weekly and daily alike — comes from the
 *  shared `occurrenceStarts` (ADR 038, ADR 057); the `>` filter turns its inclusive
 *  window into this path's half-open one. */
function dueOccurrences(event: EventRow, now: Date): { start: Date; date: string }[] {
  if (event.reminderMinutes == null) return []
  const nowMs = now.getTime()
  const throughMs = nowMs + event.reminderMinutes * MINUTE_MS
  return occurrenceStarts(event, nowMs, throughMs)
    .filter((s) => s > nowMs)
    .map((s) => ({ start: new Date(s), date: dateKey(new Date(s)) }))
}

function formatLead(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hrs = minutes / 60
  return hrs === 1 ? '1 hr' : `${hrs} hr`
}

/** AC4: an owned/shared event reminds its attendees plus every tier-4 parent; a
 *  Family event (no attendees) reminds everyone. `notify()` applies the tier gate,
 *  so tier-1 members simply receive nothing. */
async function reminderAudience(event: EventRow): Promise<string[]> {
  const attendeeIds = event.attendees.map((a) => a.profileId)
  if (attendeeIds.length === 0) {
    const all = await prisma.profile.findMany({ select: { id: true } })
    return all.map((p) => p.id)
  }
  const parents = await prisma.profile.findMany({ where: { tier: 4 }, select: { id: true } })
  return [...new Set([...attendeeIds, ...parents.map((p) => p.id)])]
}

async function fireReminder(
  eventBus: EventBus,
  event: EventRow,
  start: Date,
  now: Date
): Promise<void> {
  const audience = await reminderAudience(event)
  // The real time until this occurrence, not the configured lead: an event nearer
  // than its reminder window (e.g. created 5 min out with a 10 min reminder) fires
  // now but does not start in 10 min. Ceil so the common case still reads a round
  // "10 min" rather than "9"; cap at the lead so it can never overstate.
  const lead = Math.min(
    event.reminderMinutes!,
    Math.max(1, Math.ceil((start.getTime() - now.getTime()) / MINUTE_MS))
  )
  const body = `Starts in ${formatLead(lead)}${event.location ? ` · ${event.location}` : ''}`
  await Promise.all(
    audience.map((profileId) =>
      notify(eventBus, profileId, {
        title: event.title,
        body,
        variant: 'info',
        priority: 'alert',
      })
    )
  )
}

/** One scheduler tick: fire every reminder that has come due at `now` and has not
 *  fired before. Exactly-once is enforced by claiming the `reminder_log` row before
 *  dispatch; a failed dispatch releases the claim so the next tick retries. Exported
 *  for tests (driven with a mocked `now`). */
export async function runReminderTick(eventBus: EventBus, now = new Date()): Promise<void> {
  const events = (await calendarPrisma.event.findMany({
    where: { reminderMinutes: { not: null } },
    include: { attendees: { select: { profileId: true } }, exceptions: true },
  })) as unknown as EventRow[]

  for (const event of events) {
    for (const occurrence of dueOccurrences(event, now)) {
      const occurrenceDate = new Date(`${occurrence.date}T00:00:00.000Z`)
      try {
        await calendarPrisma.reminderLog.create({
          data: { eventId: event.id, occurrenceDate, firedAt: now },
        })
      } catch {
        // Unique-violation on the (event, occurrence) PK — already fired. Skip.
        continue
      }
      try {
        await fireReminder(eventBus, event, occurrence.start, now)
      } catch (err) {
        console.error('[reminders] dispatch failed, releasing claim to retry', {
          eventId: event.id,
          date: occurrence.date,
          err,
        })
        await calendarPrisma.reminderLog
          .delete({ where: { eventId_occurrenceDate: { eventId: event.id, occurrenceDate } } })
          .catch(() => {})
      }
    }
  }

  await calendarPrisma.reminderLog.deleteMany({
    where: { firedAt: { lt: new Date(now.getTime() - LEDGER_RETENTION_MS) } },
  })
}

/** Starts the 60s reminder poll. Returns a stop handle. One in-flight tick at a
 *  time — a slow tick never overlaps the next. */
export function startReminderScheduler(eventBus: EventBus): () => void {
  let running = false
  const interval = setInterval(async () => {
    if (running) return
    running = true
    try {
      await runReminderTick(eventBus)
    } catch (err) {
      console.error('[reminders] tick failed', err)
    } finally {
      running = false
    }
  }, TICK_MS)
  interval.unref?.()
  return () => clearInterval(interval)
}
