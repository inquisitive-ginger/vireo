import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '@family-os/platform/server'
import { DEFAULT_LAYOUTS, prominenceFor } from '@family-os/platform/types'
import { buildServer } from '../server'

/* GET /home/layout — the route that renders the home dashboard, and which had no test.
   That gap is why the composition could drift: the seed kept a second copy of the
   layouts, the API derived prominence from the first, and a profile's layout was
   FROZEN into `widget_layouts` on its first page load. The result was the new elevation
   rungs painted onto the old geometry, with nothing failing. */

let app: FastifyInstance

function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

// No default_layout_* rows exist unless a test writes one: the seed stopped
// pre-populating them (auto-bug #116 — a seeded row is a cache of the default
// that wins over a later correction), so the route's normal path is the in-code
// DEFAULT_LAYOUTS and a config row is a deliberate override.
async function clearConfig() {
  await prisma.systemConfig.deleteMany({ where: { key: { in: Object.keys(DEFAULT_LAYOUTS) } } })
}

async function cookieFor(targetProfileId: string): Promise<string> {
  const hash = await bcrypt.hash('1234', 10)
  await prisma.systemConfig.upsert({
    where: { key: 'family_pin_hash' },
    update: { value: hash },
    create: { key: 'family_pin_hash', value: hash, updatedBy: null },
  })
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/verify-pin',
    payload: { pin: '1234', targetProfileId },
  })
  return getCookie(res)
}

type Slot = { widgetId: string; x: number; y: number; w: number; h: number; prominence: string }

async function layoutFor(profileId: string): Promise<Slot[]> {
  const res = await app.inject({
    method: 'GET',
    url: '/api/home/layout',
    headers: { cookie: await cookieFor(profileId) },
  })
  expect(res.statusCode).toBe(200)
  return res.json() as Slot[]
}

beforeAll(async () => {
  app = await buildServer()
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.widgetLayout.deleteMany()
  await clearConfig()
})

describe('GET /api/home/layout', () => {
  /* Parents get NO feature (ADR 039, amended): they open this surface to triage, and
     calendar/chores/feed are all live answers to "what needs me". The calendar still
     leads by size and position — elevation just declines to overstate the dominance. */
  it('gives a parent no feature, and still leads with the calendar by size and position', async () => {
    const slots = await layoutFor('seed-parent-1')
    expect(slots.filter((s) => s.prominence === 'feature')).toHaveLength(0)

    const calendar = slots.find((s) => s.widgetId === 'calendar.up-next')!
    expect(calendar).toMatchObject({ x: 0, y: 0, w: 2, h: 4, prominence: 'card' })
    expect(slots.find((s) => s.widgetId === 'family-feed.feed')!.prominence).toBe('quiet')
  })

  // The fridge tablet sits on the family pseudo-profile; it now triages exactly
  // like a parent rather than leading with a full-width feed banner.
  it('gives the family pseudo-profile the same tier-4 layout as a parent', async () => {
    const slots = await layoutFor('family')
    expect(slots.filter((s) => s.prominence === 'feature')).toHaveLength(0)

    const calendar = slots.find((s) => s.widgetId === 'calendar.up-next')!
    expect(calendar).toMatchObject({ x: 0, y: 0, w: 2, h: 4, prominence: 'card' })
    expect(slots.find((s) => s.widgetId === 'family-feed.feed')!.prominence).toBe('quiet')
  })

  it('leads a kid with the wallet as the one feature', async () => {
    const slots = await layoutFor('seed-child-1')
    const features = slots.filter((s) => s.prominence === 'feature')
    expect(features).toHaveLength(1)
    expect(features[0].widgetId).toBe('rewards.wallet')
  })

  /* The reported bug: chores (card) rendered BELOW the feed (quiet) in the right-hand
     column, because geometry came from a stale seed while prominence came from the
     re-ranked code. Position and elevation both say "how much does this matter" — if
     they disagree, one of them is lying. */
  it('stacks the higher rung above the lower one in a column', async () => {
    const RANK: Record<string, number> = { feature: 0, card: 1, quiet: 2 }
    const slots = await layoutFor('seed-parent-1')

    const chores = slots.find((s) => s.widgetId === 'chores.today-summary')!
    const feed = slots.find((s) => s.widgetId === 'family-feed.feed')!
    expect(chores.x).toBe(feed.x) // same column
    expect(chores.y).toBeLessThan(feed.y) // chores on top
    expect(RANK[chores.prominence]).toBeLessThan(RANK[feed.prominence])
  })

  /* A default must never be frozen. It used to be written into `widget_layouts` on the
     first read, so a corrected default could never reach an existing profile. */
  it('does not persist the default — it serves it', async () => {
    await layoutFor('seed-parent-1')
    await layoutFor('seed-parent-1')
    const rows = await prisma.widgetLayout.findMany({ where: { profileId: 'seed-parent-1' } })
    expect(rows).toHaveLength(0)
  })

  it('serves a config-row override over the in-code default', async () => {
    const before = await layoutFor('seed-parent-1')
    expect(before.find((s) => s.widgetId === 'chores.today-summary')!.y).toBe(2)

    // A deploy-level geometry override — the hook the unseeded config key exists for.
    await prisma.systemConfig.create({
      data: {
        key: 'default_layout_tier_3_4',
        value: [
          { widgetId: 'calendar.up-next', x: 0, y: 0, w: 2, h: 2 },
          { widgetId: 'chores.today-summary', x: 2, y: 0, w: 2, h: 1 },
          { widgetId: 'family-feed.feed', x: 2, y: 1, w: 2, h: 1 },
        ],
      },
    })

    const after = await layoutFor('seed-parent-1')
    expect(after.find((s) => s.widgetId === 'chores.today-summary')!.y).toBe(0)
    // Prominence is still derived from the code, not the stored geometry.
    expect(after.find((s) => s.widgetId === 'chores.today-summary')!.prominence).toBe(
      prominenceFor('default_layout_tier_3_4', 'chores.today-summary')
    )
  })

  it('lets a customized layout win, once one exists', async () => {
    await prisma.widgetLayout.create({
      data: { profileId: 'seed-parent-1', widgetId: 'calendar.up-next', x: 0, y: 0, w: 4, h: 1 },
    })
    const slots = await layoutFor('seed-parent-1')
    expect(slots).toHaveLength(1)
    expect(slots[0]).toMatchObject({ widgetId: 'calendar.up-next', w: 4, prominence: 'card' })
  })
})
