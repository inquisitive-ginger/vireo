import { prisma } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { calendarPrisma } from '@family-os/plugin-calendar/db'
import { notify } from './notify'

const MINUTE_MS = 60 * 1000
const DAY_MS = 24 * 60 * MINUTE_MS
const WEEK_MS = 7 * DAY_MS
const TICK_MS = 60 * 1000
const MAX_OCCURRENCES = 520 // mirror calendar.ts — a hard guard against runaway expansion
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
  recurrenceUntil: Date | null
  reminderMinutes: number | null
  attendees: AttendeeRow[]
  exceptions: ExceptionRow[]
}

const dateKey = (d: Date) => d.toISOString().slice(0, 10)

/** Occurrence starts (epoch ms) in the half-open window `(afterMs, throughMs]`,
 *  respecting weekly recurrence, `recurrenceUntil`, and `cancelled` exceptions.
 *  Mirrors the compute-on-read expansion in calendar.ts (ADR 038) — no occurrence
 *  rows are materialized. */
function occurrenceStarts(event: EventRow, afterMs: number, throughMs: number): number[] {
  const base = event.startsAt.getTime()
  if (event.recurrence !== 'weekly') {
    return base > afterMs && base <= throughMs ? [base] : []
  }
  const untilMs = event.recurrenceUntil ? event.recurrenceUntil.getTime() + DAY_MS : Infinity
  const cancelled = new Set(
    event.exceptions.filter((e) => e.kind === 'cancelled').map((e) => dateKey(e.occurrenceDate))
  )

  let k = afterMs > base ? Math.floor((afterMs - base) / WEEK_MS) : 0
  const out: number[] = []
  for (let i = 0; i < MAX_OCCURRENCES; i++, k++) {
    const start = base + k * WEEK_MS
    if (start > throughMs || start >= untilMs) break
    if (start <= afterMs) continue
    if (cancelled.has(dateKey(new Date(start)))) continue
    out.push(start)
  }
  return out
}

/** The occurrences of `event` whose reminder has just come due at `now`: those
 *  starting in `(now, now + reminderMinutes]`, i.e. `startsAt - reminderMinutes <= now`
 *  while the occurrence is still in the future (a reminder after the event started is
 *  stale, so it is never fired). */
function dueOccurrences(event: EventRow, now: Date): { start: Date; date: string }[] {
  if (event.reminderMinutes == null) return []
  const nowMs = now.getTime()
  const throughMs = nowMs + event.reminderMinutes * MINUTE_MS
  return occurrenceStarts(event, nowMs, throughMs).map((s) => ({
    start: new Date(s),
    date: dateKey(new Date(s)),
  }))
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

async function fireReminder(eventBus: EventBus, event: EventRow): Promise<void> {
  const audience = await reminderAudience(event)
  const body = `Starts in ${formatLead(event.reminderMinutes!)}${
    event.location ? ` · ${event.location}` : ''
  }`
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
        await fireReminder(eventBus, event)
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
