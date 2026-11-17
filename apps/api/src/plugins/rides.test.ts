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

// Tue 17 Nov 2026 and the Tuesday after.
const TUE = '2026-11-17'
const NEXT_TUE = '2026-11-24'

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
    payload,
  })
}

async function seedTuesday() {
  const runs = [
    { kidId: TEDDY, weekday: 2, kind: 'dropoff', minutes: 495, driverId: HALLIE },
    { kidId: ZOE, weekday: 2, kind: 'dropoff', minutes: 515, driverId: ZACH },
    { kidId: TEDDY, weekday: 2, kind: 'pickup', minutes: 990, driverId: HALLIE },
    { kidId: ZOE, weekday: 2, kind: 'pickup', place: 'yarn club', minutes: 1050, driverId: null },
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

describe('the usual week', () => {
  it('D-092 a parent sets a kid’s run on a weekday and it lists back [F-041]', async () => {
    const res = await addRun({
      kidId: TEDDY,
      weekday: 2,
      kind: 'pickup',
      minutes: 990,
      driverId: HALLIE,
    })
    expect(res.statusCode).toBe(201)
    const list = await app.inject({
      method: 'GET',
      url: '/api/rides/runs',
      headers: { cookie: await cookieFor(TEDDY) },
    })
    expect(list.json().runs).toEqual([
      expect.objectContaining({
        kidId: TEDDY,
        weekday: 2,
        kind: 'pickup',
        place: null,
        minutes: 990,
        driverId: HALLIE,
      }),
    ])
  })

  it('D-092 a parent changes who usually drives a run [F-041]', async () => {
    const id = (
      await addRun({ kidId: TEDDY, weekday: 2, kind: 'pickup', minutes: 990, driverId: HALLIE })
    ).json().id
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/rides/runs/${id}`,
      headers: { cookie: await cookieFor(ZACH) },
      payload: { driverId: ZACH },
    })
    expect(res.json().driverId).toBe(ZACH)
  })

  it('D-086 only a parent drives, and only a kid is driven [F-041]', async () => {
    expect(
      (await addRun({ kidId: TEDDY, weekday: 2, kind: 'pickup', minutes: 990, driverId: ZOE }))
        .statusCode
    ).toBe(400)
    expect(
      (await addRun({ kidId: ZACH, weekday: 2, kind: 'pickup', minutes: 990, driverId: HALLIE }))
        .statusCode
    ).toBe(400)
  })

  it('D-086 runs are school days only, Monday to Friday [F-041]', async () => {
    expect(
      (await addRun({ kidId: TEDDY, weekday: 6, kind: 'pickup', minutes: 990 })).statusCode
    ).toBe(400)
  })

  it('D-092 below tier 4 the usual week is read-only [F-041]', async () => {
    expect(
      (await addRun({ kidId: TEDDY, weekday: 2, kind: 'pickup', minutes: 990 }, ZOE)).statusCode
    ).toBe(403)
    const id = (await addRun({ kidId: TEDDY, weekday: 2, kind: 'pickup', minutes: 990 })).json().id
    const del = await app.inject({
      method: 'DELETE',
      url: `/api/rides/runs/${id}`,
      headers: { cookie: await cookieFor(ZOE) },
    })
    expect(del.statusCode).toBe(403)
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
      [1050, 'Nobody yet picks up Zoë at yarn club', null],
    ])
    expect(mark.label).toBe('4 school runs, 1 open')
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

  it('D-087 a parent’s mark carries the endpoint and the drivers; a kid’s does not [F-042]', async () => {
    await seedTuesday()
    const [parent] = await marks(TUE, TUE)
    expect(parent.act?.endpoint).toBe(`/api/rides/days/${TUE}`)
    expect(parent.act?.owners).toEqual(expect.arrayContaining([HALLIE, ZACH]))
    expect(parent.act?.owners).not.toContain(ZOE)
    const [kid] = await marks(TUE, TUE, TEDDY)
    expect(kid.lines).toHaveLength(4)
    expect(kid.act).toBeUndefined()
  })
})

describe('changing a day', () => {
  it('D-087 claiming an open run changes that day only, never the usual week [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay(TUE, { lineId: ids[3], ownerId: ZACH })).statusCode).toBe(204)
    const [today] = await marks(TUE, TUE)
    expect(today.lines?.[3]).toMatchObject({
      ownerId: ZACH,
      text: 'Zach picks up Zoë at yarn club',
    })
    expect(today.label).toBe('4 school runs')
    const [next] = await marks(NEXT_TUE, NEXT_TUE)
    expect(next.lines?.[3].ownerId).toBeNull()
    const run = await ridesPrisma.schoolRun.findUnique({ where: { id: ids[3] } })
    expect(run?.driverId).toBeNull()
  })

  it('D-087 swapping a run to the other parent, then back, leaves no change behind [F-042]', async () => {
    const ids = await seedTuesday()
    await changeDay(TUE, { lineId: ids[2], ownerId: ZACH })
    expect((await marks(TUE, TUE))[0].lines?.[2].ownerId).toBe(ZACH)
    await changeDay(TUE, { lineId: ids[2], ownerId: HALLIE })
    expect(await ridesPrisma.runDay.count({ where: { runId: ids[2] } })).toBe(0)
  })

  it('D-094 clearing a run takes it off that day, and restoring brings it back [F-042]', async () => {
    const ids = await seedTuesday()
    await changeDay(TUE, { lineId: ids[3], ownerId: null, cleared: true })
    const [cleared] = await marks(TUE, TUE)
    expect(cleared.lines?.[3].cleared).toBe(true)
    expect(cleared.label).toBe('3 school runs')
    await changeDay(TUE, { lineId: ids[3], ownerId: null, cleared: false })
    expect((await marks(TUE, TUE))[0].lines?.[3].cleared).toBe(false)
  })

  it('D-094 a day with every run cleared keeps its mark so a run can be restored [F-042]', async () => {
    const ids = await seedTuesday()
    for (const id of ids) await changeDay(TUE, { lineId: id, ownerId: null, cleared: true })
    expect((await marks(TUE, TUE))[0].label).toBe('School runs cleared')
  })

  it('D-086 below tier 4 a day can’t be changed [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay(TUE, { lineId: ids[3], ownerId: ZOE }, ZOE)).statusCode).toBe(403)
  })

  it('D-086 a day can only go to a parent [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay(TUE, { lineId: ids[3], ownerId: ZOE })).statusCode).toBe(400)
  })

  it('D-087 an impossible date is refused, never rolled over [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay('2026-02-30', { lineId: ids[0], ownerId: ZACH })).statusCode).toBe(400)
  })

  it('D-086 the family dashboard is not a kid [F-041]', async () => {
    expect(
      (await addRun({ kidId: 'family', weekday: 2, kind: 'pickup', minutes: 990 })).statusCode
    ).toBe(400)
  })

  it('D-087 a run can only change on a day it falls on [F-042]', async () => {
    const ids = await seedTuesday()
    expect((await changeDay('2026-11-18', { lineId: ids[0], ownerId: ZACH })).statusCode).toBe(404)
  })
})
