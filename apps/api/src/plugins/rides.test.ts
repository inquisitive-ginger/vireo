import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '@family-os/platform/server'
import type { DayMark } from '@family-os/platform/types'
import { ridesPrisma } from '@family-os/plugin-rides/db'
import { buildServer } from '../server'

let app: FastifyInstance

const HALLIE = '00000000-71de-0001-0000-000000000001' // tier 4
const ZACH = '00000000-71de-0001-0000-000000000002' // tier 4
const TEDDY = '00000000-71de-0001-0000-000000000003' // tier 2
const ZOE = '00000000-71de-0001-0000-000000000004' // tier 3
const ALL_IDS = [HALLIE, ZACH, TEDDY, ZOE]

// Tue 17 Nov 2026, the Tuesday before and the two after.
const LAST_TUE = '2026-11-10'
const TUE = '2026-11-17'
const NEXT_TUE = '2026-11-24'
const TUE_AFTER = '2026-12-01'

function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

const cookies = new Map<string, string>()
async function cookieFor(profileId: string): Promise<string> {
  const cached = cookies.get(profileId)
  if (cached) return cached
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/verify-pin',
    payload: { pin: '1234', targetProfileId: profileId },
  })
  const cookie = getCookie(res)
  cookies.set(profileId, cookie)
  return cookie
}

async function addRun(payload: Record<string, unknown>, as = HALLIE) {
  return app.inject({
    method: 'POST',
    url: '/api/rides/runs',
    headers: { cookie: await cookieFor(as) },
    payload: { from: TUE, ...payload },
  })
}

async function week(on: string, as = HALLIE) {
  const res = await app.inject({
    method: 'GET',
    url: `/api/rides/week?on=${on}`,
    headers: { cookie: await cookieFor(as) },
  })
  return res.json().runs as Array<{ id: string; driverId: string; weekday: number }>
}

async function seedTuesday() {
  const runs = [
    { kidId: TEDDY, weekday: 2, kind: 'dropoff', minutes: 495, driverId: HALLIE },
    { kidId: ZOE, weekday: 2, kind: 'dropoff', minutes: 515, driverId: ZACH },
    { kidId: TEDDY, weekday: 2, kind: 'pickup', minutes: 990, driverId: HALLIE },
    { kidId: ZOE, weekday: 2, kind: 'pickup', place: 'yarn club', minutes: 1050, driverId: ZACH },
  ]
  const ids: string[] = []
  for (const run of runs) ids.push((await addRun(run)).json().id)
  return ids
}

async function marks(from: string, to: string, as = HALLIE): Promise<DayMark[]> {
  const res = await app.inject({
    method: 'GET',
    url: `/api/calendar/day-marks?from=${from}&to=${to}`,
    headers: { cookie: await cookieFor(as) },
  })
  return (res.json().marks as DayMark[]).filter((m) => m.glyph === 'car')
}

async function changeDay(date: string, body: Record<string, unknown>, as = HALLIE) {
  return app.inject({
    method: 'POST',
    url: `/api/rides/days/${date}`,
    headers: { cookie: await cookieFor(as) },
    payload: body,
  })
}

beforeAll(async () => {
  app = await buildServer()
  const hash = await bcrypt.hash('1234', 10)
  await prisma.systemConfig.upsert({
    where: { key: 'family_pin_hash' },
    update: { value: hash },
    create: { key: 'family_pin_hash', value: hash, updatedBy: null },
  })
  for (const [id, name, tier] of [
    [HALLIE, 'Hallie', 4],
    [ZACH, 'Zach', 4],
    [TEDDY, 'Teddy', 2],
    [ZOE, 'Zoë', 3],
  ] as const) {
    await prisma.profile.upsert({
      where: { id },
      update: { name, tier },
      create: { id, name, tier },
    })
  }
})

afterAll(async () => {
  await ridesPrisma.schoolRun.deleteMany({})
  await prisma.profile.deleteMany({ where: { id: { in: ALL_IDS } } })
  await prisma.systemConfig.deleteMany({ where: { key: 'family_pin_hash' } })
  await app.close()
  await ridesPrisma.$disconnect()
})

beforeEach(async () => {
  await ridesPrisma.schoolRun.deleteMany({})
})

const driverOnDay = async (date: string, i: number) =>
  (await marks(date, date))[0].lines?.[i].ownerId

describe('seeding the week', () => {
  it('D-097 a parent seeds a kid’s run, with its driver, from the week it was set in [F-041]', async () => {
    const res = await addRun({
      kidId: TEDDY,
      weekday: 2,
      kind: 'pickup',
      minutes: 990,
      driverId: HALLIE,
    })
    expect(res.statusCode).toBe(201)
    expect(await week(TUE, TEDDY)).toEqual([
      expect.objectContaining({
        kidId: TEDDY,
        weekday: 2,
        kind: 'pickup',
        place: null,
        minutes: 990,
        driverId: HALLIE,
      }),
    ])
    expect(await week(LAST_TUE)).toEqual([])
  })

  it('D-098 a run can’t be seeded without a driver [F-041]', async () => {
    expect(
      (await addRun({ kidId: TEDDY, weekday: 2, kind: 'pickup', minutes: 990 })).statusCode
    ).toBe(400)
  })

  it('D-097 changing a run’s driver in the editor holds from that week on, not before [F-041]', async () => {
    const [id] = await seedTuesday()
    const res = await app.inject({
      method: 'POST',
      url: `/api/rides/runs/${id}/driver`,
      headers: { cookie: await cookieFor(ZACH) },
      payload: { driverId: ZACH, from: NEXT_TUE },
    })
    expect(res.statusCode).toBe(204)
    expect(await driverOnDay(TUE, 0)).toBe(HALLIE)
    expect(await driverOnDay(NEXT_TUE, 0)).toBe(ZACH)
    expect(await driverOnDay(TUE_AFTER, 0)).toBe(ZACH)
  })

  it('D-097 removing a run takes it off from that week on, and earlier weeks keep it [F-041]', async () => {
    const [id] = await seedTuesday()
    const del = await app.inject({
      method: 'DELETE',
      url: `/api/rides/runs/${id}?from=${NEXT_TUE}`,
      headers: { cookie: await cookieFor(HALLIE) },
    })
    expect(del.statusCode).toBe(204)
    expect((await marks(TUE, TUE))[0].lines).toHaveLength(4)
    expect((await marks(NEXT_TUE, NEXT_TUE))[0].lines).toHaveLength(3)
  })

  it('D-086 only a parent drives, and only a kid is driven — never the family dashboard [F-041]', async () => {
    expect(
      (await addRun({ kidId: TEDDY, weekday: 2, kind: 'pickup', minutes: 990, driverId: ZOE }))
        .statusCode
    ).toBe(400)
    expect(
      (await addRun({ kidId: ZACH, weekday: 2, kind: 'pickup', minutes: 990, driverId: HALLIE }))
        .statusCode
    ).toBe(400)
    expect(
      (
        await addRun({
          kidId: 'family',
          weekday: 2,
          kind: 'pickup',
          minutes: 990,
          driverId: HALLIE,
        })
      ).statusCode
    ).toBe(400)
  })

  it('D-086 runs are school days only, Monday to Friday [F-041]', async () => {
    expect(
      (await addRun({ kidId: TEDDY, weekday: 6, kind: 'pickup', minutes: 990, driverId: HALLIE }))
        .statusCode
    ).toBe(400)
  })

  it('D-086 below tier 4 the week is read-only [F-041]', async () => {
    expect(
      (
        await addRun(
          { kidId: TEDDY, weekday: 2, kind: 'pickup', minutes: 990, driverId: HALLIE },
          ZOE
        )
      ).statusCode
    ).toBe(403)
  })
})

describe('the rides mark', () => {
  it('D-087 a day with school runs gets one car mark whose lines are its runs, in time order [F-042]', async () => {
    await seedTuesday()
    const [mark] = await marks(TUE, TUE)
    expect(mark.lines?.map((l) => [l.minutes, l.text, l.ownerId])).toEqual([
      [495, 'Hallie drops off Teddy', HALLIE],
      [515, 'Zach drops off Zoë', ZACH],
      [990, 'Hallie picks up Teddy', HALLIE],
      [1050, 'Zach picks up Zoë at yarn club', ZACH],
    ])
    expect(mark.label).toBe('4 school runs')
  })

  it('D-087 the calendar’s range instants still find the day’s mark [F-042]', async () => {
    await seedTuesday()
    const from = new Date(2026, 10, 17).toISOString()
    const to = new Date(2026, 10, 18).toISOString()
    expect((await marks(from, to)).map((m) => m.date)).toContain(TUE)
  })

  it('D-094 a day with no runs gets no mark [F-042]', async () => {
    await seedTuesday()
    expect((await marks('2026-11-16', '2026-11-22')).map((m) => m.date)).toEqual([TUE])
  })

  it('D-097 a parent’s mark carries the endpoint, the drivers and the week editor; a kid’s does not [F-042]', async () => {
    await seedTuesday()
    const [parent] = await marks(TUE, TUE)
    expect(parent.act?.endpoint).toBe(`/api/rides/days/${TUE}`)
    expect(parent.act?.owners).toEqual(expect.arrayContaining([HALLIE, ZACH]))
    expect(parent.act?.owners).not.toContain(ZOE)
    expect(parent.act?.manage).toEqual({ href: `/rides/week?on=${TUE}`, label: 'Set the week' })
    const [kid] = await marks(TUE, TUE, TEDDY)
    expect(kid.lines).toHaveLength(4)
    expect(kid.act).toBeUndefined()
  })

  it('D-097 with no runs yet, a parent gets one mark on today that sets the week up, and a kid gets none [F-041]', async () => {
    const today = new Date()
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const [setup] = await marks(key, key)
    expect(setup).toMatchObject({ label: 'Set up school runs', lines: [] })
    expect(setup.act?.manage?.label).toBe('Set up school runs')
    expect(await marks(key, key, TEDDY)).toEqual([])
  })
})

describe('changing a day', () => {
  it('D-097 a swap holds from its day on: earlier weeks keep the old driver, later weeks take the new one [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay(NEXT_TUE, { lineId: ids[2], ownerId: ZACH })).statusCode).toBe(204)
    expect(await driverOnDay(TUE, 2)).toBe(HALLIE)
    expect(await driverOnDay(TUE_AFTER, 2)).toBe(ZACH)
    expect(await driverOnDay(NEXT_TUE, 2)).toBe(ZACH)
    expect((await marks(NEXT_TUE, NEXT_TUE))[0].lines?.[2].text).toBe('Zach picks up Teddy')
  })

  it('D-097 a later swap wins from its own day, and swapping back returns the run [F-042]', async () => {
    const ids = await seedTuesday()
    await changeDay(TUE, { lineId: ids[2], ownerId: ZACH })
    await changeDay(TUE_AFTER, { lineId: ids[2], ownerId: HALLIE })
    expect(await driverOnDay(NEXT_TUE, 2)).toBe(ZACH)
    expect(await driverOnDay(TUE_AFTER, 2)).toBe(HALLIE)
  })

  it('D-099 "Not needed today" takes a run off that day only, and Restore brings it back [F-042]', async () => {
    const ids = await seedTuesday()
    await changeDay(TUE, { lineId: ids[3], ownerId: ZACH, cleared: true })
    const [today] = await marks(TUE, TUE)
    expect(today.lines?.[3].cleared).toBe(true)
    expect(today.label).toBe('3 school runs')
    expect((await marks(NEXT_TUE, NEXT_TUE))[0].lines?.[3].cleared).toBe(false)
    await changeDay(TUE, { lineId: ids[3], ownerId: ZACH, cleared: false })
    expect((await marks(TUE, TUE))[0].lines?.[3].cleared).toBe(false)
  })

  it('D-099 a day with every run not needed keeps its mark so a run can be restored [F-042]', async () => {
    const ids = await seedTuesday()
    const drivers = [HALLIE, ZACH, HALLIE, ZACH]
    for (const [i, id] of ids.entries())
      await changeDay(TUE, { lineId: id, ownerId: drivers[i], cleared: true })
    expect((await marks(TUE, TUE))[0].label).toBe('School runs not needed')
  })

  it('D-098 a day can’t be left without a driver, nor given to a kid [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay(TUE, { lineId: ids[3], ownerId: null })).statusCode).toBe(400)
    expect((await changeDay(TUE, { lineId: ids[3], ownerId: ZOE })).statusCode).toBe(400)
  })

  it('D-086 below tier 4 a day can’t be changed [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay(TUE, { lineId: ids[3], ownerId: HALLIE }, ZOE)).statusCode).toBe(403)
  })

  it('D-087 an impossible date is refused, never rolled over [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay('2026-02-30', { lineId: ids[0], ownerId: ZACH })).statusCode).toBe(400)
  })

  it('D-087 a run can only change on a day it falls on [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay('2026-11-18', { lineId: ids[0], ownerId: ZACH })).statusCode).toBe(404)
    expect((await changeDay(LAST_TUE, { lineId: ids[0], ownerId: ZACH })).statusCode).toBe(404)
  })
})
