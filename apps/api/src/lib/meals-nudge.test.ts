import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { prisma, createEventBus } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { mealPrisma } from '@family-os/plugin-meals/db'
import { runMealsNudgeTick } from './meals-nudge'

const DAD_ID = '00000000-2e11-0002-0000-000000000001' // tier 4
const MOM_ID = '00000000-2e11-0002-0000-000000000002' // tier 4
const TEEN_ID = '00000000-2e11-0002-0000-000000000003' // tier 3
const TWEEN_ID = '00000000-2e11-0002-0000-000000000004' // tier 2 (a plausible owner)
const KID_ID = '00000000-2e11-0002-0000-000000000005' // tier 1
const PROFILES: [string, string, number][] = [
  [DAD_ID, 'Dad', 4],
  [MOM_ID, 'Mom', 4],
  [TEEN_ID, 'Teen', 3],
  [TWEEN_ID, 'Tween', 2],
  [KID_ID, 'Kid', 1],
]
const ALL_IDS = PROFILES.map(([id]) => id)

// Local-component fixed day; matches how `todayDateOnly` reads `now` regardless
// of the machine's timezone (both derive Y/M/D the same way).
const atHour = (hour: number, minute = 0) => new Date(2026, 7, 1, hour, minute, 0)
const DAY_ONLY = new Date(Date.UTC(2026, 7, 1))
const OTHER_DAY_ONLY = new Date(Date.UTC(2026, 7, 2))

let bus: EventBus

type MealOverrides = {
  title?: string
  kind?: string
  ownerId?: string | null
  tryBite?: string | null
}

async function makeMeal(o: MealOverrides = {}) {
  return mealPrisma.plannedMeal.create({
    data: {
      date: DAY_ONLY,
      title: o.title ?? 'Rigatoni',
      kind: o.kind ?? 'cooked',
      ownerId: o.ownerId ?? null,
      tryBite: o.tryBite ?? null,
      createdBy: DAD_ID,
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
  await mealPrisma.plannedMeal.deleteMany({})
  await prisma.notification.deleteMany({ where: { profileId: { in: ALL_IDS } } })
  await prisma.profile.deleteMany({ where: { id: { in: ALL_IDS } } })
  await prisma.$disconnect()
  await mealPrisma.$disconnect()
})

beforeEach(async () => {
  await mealPrisma.dinnerNudgeLog.deleteMany({})
  await mealPrisma.plannedMeal.deleteMany({})
  await prisma.notification.deleteMany({ where: { profileId: { in: ALL_IDS } } })
})

describe('meals nudge tick', () => {
  it('fires nothing before the escalation hour (15:59)', async () => {
    await makeMeal({ ownerId: TWEEN_ID })
    await runMealsNudgeTick(bus, atHour(15, 59))

    for (const id of ALL_IDS) expect(await notifCount(id)).toBe(0)
    expect(await mealPrisma.dinnerNudgeLog.count()).toBe(0)
  })

  it('nudges the owner at the escalation hour, carrying the try bite (AC1)', async () => {
    await makeMeal({ ownerId: TWEEN_ID, title: 'Rigatoni', tryBite: 'the veggies' })
    await runMealsNudgeTick(bus, atHour(16, 0))

    expect(await notifCount(TWEEN_ID)).toBe(1)
    const notif = await prisma.notification.findFirst({ where: { profileId: TWEEN_ID } })
    expect(notif?.title).toBe("You've got dinner tonight: Rigatoni")
    expect(notif?.body).toContain('the veggies')
    for (const id of [DAD_ID, MOM_ID, TEEN_ID, KID_ID]) expect(await notifCount(id)).toBe(0)
  })

  it('nudges every tier-4 parent when the dinner is unclaimed and uncovered (AC2)', async () => {
    await makeMeal({ ownerId: null, kind: 'cooked' })
    await runMealsNudgeTick(bus, atHour(16, 0))

    expect(await notifCount(DAD_ID)).toBe(1)
    expect(await notifCount(MOM_ID)).toBe(1)
    const notif = await prisma.notification.findFirst({ where: { profileId: DAD_ID } })
    expect(notif?.title).toBe("Nobody's got dinner.")
    for (const id of [TEEN_ID, TWEEN_ID, KID_ID]) expect(await notifCount(id)).toBe(0)
  })

  it('nudges nobody for an isCovered day — going out (AC2)', async () => {
    await makeMeal({ ownerId: null, kind: 'out' })
    await runMealsNudgeTick(bus, atHour(16, 0))

    for (const id of ALL_IDS) expect(await notifCount(id)).toBe(0)
  })

  it('nudges nobody for an isCovered day — ownerless takeout (AC2)', async () => {
    await makeMeal({ ownerId: null, kind: 'takeout' })
    await runMealsNudgeTick(bus, atHour(16, 0))

    for (const id of ALL_IDS) expect(await notifCount(id)).toBe(0)
  })

  it('nudges nobody when no meal is planned at all (AC2)', async () => {
    await runMealsNudgeTick(bus, atHour(16, 0))

    for (const id of ALL_IDS) expect(await notifCount(id)).toBe(0)
    expect(await mealPrisma.dinnerNudgeLog.count()).toBe(0)
  })

  it('fires nothing at or after dinner-done (20:00) (AC4)', async () => {
    await makeMeal({ ownerId: null, kind: 'cooked' })
    await runMealsNudgeTick(bus, atHour(20, 0))

    for (const id of ALL_IDS) expect(await notifCount(id)).toBe(0)
  })

  it('fires exactly once per audience across repeated ticks — restart re-entry (AC3)', async () => {
    await makeMeal({ ownerId: TWEEN_ID })
    await runMealsNudgeTick(bus, atHour(16, 0))
    await runMealsNudgeTick(bus, atHour(16, 1))
    await runMealsNudgeTick(bus, atHour(17, 0))

    expect(await notifCount(TWEEN_ID)).toBe(1)
    expect(await mealPrisma.dinnerNudgeLog.count()).toBe(1)
  })

  it('a restart that spans 16:00 still fires — due-ness is computed on read (AC3)', async () => {
    // No tick ever ran before 16:00; the first tick observed is already 16:47,
    // as if the process was down across the escalation hour.
    await makeMeal({ ownerId: null, kind: 'cooked' })
    await runMealsNudgeTick(bus, atHour(16, 47))

    expect(await notifCount(DAD_ID)).toBe(1)
  })

  it('claiming after the tier-4 nudge fires the owner nudge and does not re-nudge tier 4 (AC5)', async () => {
    const meal = await makeMeal({ ownerId: null, kind: 'cooked' })
    await runMealsNudgeTick(bus, atHour(16, 0))
    expect(await notifCount(DAD_ID)).toBe(1)
    expect(await notifCount(MOM_ID)).toBe(1)

    await mealPrisma.plannedMeal.update({ where: { id: meal.id }, data: { ownerId: TWEEN_ID } })
    await runMealsNudgeTick(bus, atHour(16, 5))

    expect(await notifCount(TWEEN_ID)).toBe(1) // owner nudge fired
    expect(await notifCount(DAD_ID)).toBe(1) // unchanged — no re-nudge
    expect(await notifCount(MOM_ID)).toBe(1) // unchanged — no re-nudge
  })

  it('a day edited onto a new date is not blocked by the old date’s claim', async () => {
    const meal = await makeMeal({ ownerId: null, kind: 'cooked' })
    await runMealsNudgeTick(bus, atHour(16, 0))
    expect(await notifCount(DAD_ID)).toBe(1)

    await mealPrisma.plannedMeal.update({
      where: { id: meal.id },
      data: { date: OTHER_DAY_ONLY },
    })
    // "Today" is still DAY_ONLY in this tick — nothing planned for it any more.
    await runMealsNudgeTick(bus, atHour(16, 10))
    expect(await notifCount(DAD_ID)).toBe(1) // no second nudge for the vacated day
  })
})
