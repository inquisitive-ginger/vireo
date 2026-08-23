import { prisma } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { mealPrisma } from '@family-os/plugin-meals/db'
import { ESCALATION_HOUR, DINNER_DONE_HOUR, isCovered } from '@family-os/plugin-meals/lib/meals'
import { notify } from './notify'

const TICK_MS = 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const LEDGER_RETENTION_MS = 30 * DAY_MS // fired rows older than this are prunable

type Audience = 'owner' | 'tier4'
type MealRow = Awaited<ReturnType<typeof mealPrisma.plannedMeal.findFirst>>

/** `date` is `@db.Date` with no timezone math (meals.ts precedent) — this poll
 *  assumes the API server and the family share one local clock (single-Pi
 *  deployment), the same stance the widget's `ESCALATION_HOUR`/`DINNER_DONE_HOUR`
 *  already take against `now.getHours()`. Builds the UTC-midnight `Date` the
 *  column stores for "today" in that local calendar day. */
function todayDateOnly(now: Date): Date {
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

async function fireOwnerNudge(eventBus: EventBus, meal: NonNullable<MealRow>): Promise<void> {
  await notify(eventBus, meal.ownerId!, {
    title: `You've got dinner tonight: ${meal.title}`,
    body: meal.tryBite ? `Try bite: ${meal.tryBite}` : undefined,
    variant: 'info',
    priority: 'alert',
  })
}

/** AC2: every tier-4 parent, one notification each — `notify()`'s tier gate
 *  already keeps this from reaching anyone under tier 2 (moot here; tier 4 is
 *  the query), and the family profile (tier 1) is never a parent so it is never
 *  in this list. */
async function fireTier4Nudge(eventBus: EventBus): Promise<void> {
  const parents = await prisma.profile.findMany({ where: { tier: 4 }, select: { id: true } })
  await Promise.all(
    parents.map((p) =>
      notify(eventBus, p.id, {
        title: "Nobody's got dinner.",
        variant: 'warning',
        priority: 'alert',
      })
    )
  )
}

/** Claims `(date, audience)` before dispatch — a unique violation means this
 *  audience already fired for this day, so skip. A failed dispatch deletes the
 *  claim so the next tick retries (ADR 045's shape, verbatim). */
async function fireNudge(
  eventBus: EventBus,
  meal: NonNullable<MealRow>,
  date: Date,
  audience: Audience
): Promise<void> {
  try {
    await mealPrisma.dinnerNudgeLog.create({ data: { date, audience, mealId: meal.id } })
  } catch {
    // Unique-violation on the (date, audience) PK — already fired today. Skip.
    return
  }
  try {
    if (audience === 'owner') await fireOwnerNudge(eventBus, meal)
    else await fireTier4Nudge(eventBus)
  } catch (err) {
    console.error('[meals] nudge dispatch failed, releasing claim to retry', {
      date,
      audience,
      err,
    })
    await mealPrisma.dinnerNudgeLog
      .delete({ where: { date_audience: { date, audience } } })
      .catch(() => {})
  }
}

/** One tick of the afternoon nudge (ADR 045 precedent, spec.md §"Day-level
 *  nudge"). Window is `[ESCALATION_HOUR, DINNER_DONE_HOUR)` — the same hour the
 *  widget escalates at, imported from the one place that constant lives.
 *  Exported for tests (driven with a mocked `now`). */
export async function runMealsNudgeTick(eventBus: EventBus, now = new Date()): Promise<void> {
  const hour = now.getHours()
  if (hour < ESCALATION_HOUR || hour >= DINNER_DONE_HOUR) return

  const date = todayDateOnly(now)
  const meal = await mealPrisma.plannedMeal.findFirst({ where: { date, slot: 'dinner' } })
  if (!meal) return // AC2: no meal at all nudges nobody

  if (meal.ownerId) {
    await fireNudge(eventBus, meal, date, 'owner')
  } else if (!isCovered(meal)) {
    // AC2: isCovered() days (going out, ownerless takeout) nudge nobody.
    await fireNudge(eventBus, meal, date, 'tier4')
  }

  await mealPrisma.dinnerNudgeLog.deleteMany({
    where: { firedAt: { lt: new Date(now.getTime() - LEDGER_RETENTION_MS) } },
  })
}

/** Starts the 60s meals-nudge poll. Returns a stop handle. One in-flight tick at
 *  a time — a slow tick never overlaps the next. */
export function startMealsNudgeScheduler(eventBus: EventBus): () => void {
  let running = false
  const interval = setInterval(async () => {
    if (running) return
    running = true
    try {
      await runMealsNudgeTick(eventBus)
    } catch (err) {
      console.error('[meals] nudge tick failed', err)
    } finally {
      running = false
    }
  }, TICK_MS)
  interval.unref?.()
  return () => clearInterval(interval)
}
