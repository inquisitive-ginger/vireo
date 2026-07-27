import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { IDENTITY_HUES } from '@family-os/schemas'
import bcrypt from 'bcryptjs'

/* The member identity colour (ADR 044).
 *
 * The invariant under test everywhere below: a hue is UNIQUE across the family. The app's
 * whole colour language is "colour = person", so a duplicate hue does not degrade the
 * mapping — it points it at two people at once. */

let app: FastifyInstance

function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

beforeAll(async () => {
  app = await buildServer()
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.permissionOverride.deleteMany()
  await prisma.profile.deleteMany({
    where: { id: { notIn: ['family', 'seed-parent-1', 'seed-child-1'] } },
  })
  // The seeds are shared across the suite; park them with no colour so each test starts
  // against a free palette.
  await prisma.profile.updateMany({
    where: { id: { in: ['seed-parent-1', 'seed-child-1'] } },
    data: { identityHue: null },
  })
})

async function tier4Cookie(): Promise<string> {
  const hash = await bcrypt.hash('1234', 10)
  await prisma.systemConfig.upsert({
    where: { key: 'family_pin_hash' },
    update: { value: hash },
    create: { key: 'family_pin_hash', value: hash, updatedBy: null },
  })
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/verify-pin',
    payload: { pin: '1234', targetProfileId: 'seed-parent-1' },
  })
  return getCookie(res)
}

/** A session for a non-tier-4 profile — no PIN needed to switch down. */
async function kidCookie(): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/switch',
    payload: { targetProfileId: 'seed-child-1' },
  })
  return getCookie(res)
}

describe('a colour is assigned on creation, never demanded before it', () => {
  it('gives a new profile the next free hue', async () => {
    const cookie = await tier4Cookie()
    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles',
      headers: { cookie },
      payload: { name: 'Nora', tier: 2 },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().identityHue).toBe(IDENTITY_HUES[0])
  })

  it('never hands the same hue to two members', async () => {
    const cookie = await tier4Cookie()
    const hues: string[] = []
    for (const name of ['Nora', 'Sam', 'Ivy']) {
      const res = await app.inject({
        method: 'POST',
        url: '/api/profiles',
        headers: { cookie },
        payload: { name, tier: 2 },
      })
      hues.push(res.json().identityHue)
    }
    expect(new Set(hues).size).toBe(3)
  })

  it('refuses the ninth member rather than doubling a colour — the palette is the household cap', async () => {
    const cookie = await tier4Cookie()
    // Fill the palette outright.
    for (const [i, hue] of IDENTITY_HUES.entries()) {
      await prisma.profile.create({ data: { name: `M${i}`, tier: 2, identityHue: hue } })
    }
    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles',
      headers: { cookie },
      payload: { name: 'Ninth', tier: 2 },
    })
    expect(res.statusCode).toBe(409)
    expect(res.json().error).toMatch(/every colour is taken/i)
    // ...and it did NOT create a colourless member.
    expect(await prisma.profile.findFirst({ where: { name: 'Ninth' } })).toBeNull()
  })
})

describe('PUT /api/profiles/:id/color', () => {
  it('takes a free colour', async () => {
    const cookie = await tier4Cookie()
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/seed-child-1/color',
      headers: { cookie },
      payload: { identityHue: 'moss' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().identityHue).toBe('moss')
  })

  it('409s on a colour someone already holds, and names them', async () => {
    const cookie = await tier4Cookie()
    await prisma.profile.update({
      where: { id: 'seed-parent-1' },
      data: { identityHue: 'plum' },
    })
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/seed-child-1/color',
      headers: { cookie },
      payload: { identityHue: 'plum' },
    })
    expect(res.statusCode).toBe(409)
    // You cannot trade with someone you cannot see.
    expect(res.json().error).toBe('Parent already has that colour')
  })

  it('lets a member re-select the colour they already hold (not a self-collision)', async () => {
    const cookie = await tier4Cookie()
    await prisma.profile.update({ where: { id: 'seed-child-1' }, data: { identityHue: 'sky' } })
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/seed-child-1/color',
      headers: { cookie },
      payload: { identityHue: 'sky' },
    })
    expect(res.statusCode).toBe(200)
  })

  it('rejects a colour outside the palette — there is no custom colour input', async () => {
    const cookie = await tier4Cookie()
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/seed-child-1/color',
      headers: { cookie },
      payload: { identityHue: 'neon-green' },
    })
    expect(res.statusCode).toBe(400)
  })

  it('refuses the household — Hearth is reserved and is not a member (ADR 041)', async () => {
    const cookie = await tier4Cookie()
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/family/color',
      headers: { cookie },
      payload: { identityHue: 'teal' },
    })
    expect(res.statusCode).toBe(400)
    expect(await prisma.profile.findUnique({ where: { id: 'family' } })).toMatchObject({
      identityHue: null,
    })
  })

  it('404s for an unknown profile', async () => {
    const cookie = await tier4Cookie()
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/00000000-0000-0000-0000-000000000000/color',
      headers: { cookie },
      payload: { identityHue: 'teal' },
    })
    expect(res.statusCode).toBe(404)
  })
})

describe('who may change a colour (ADR 044 — choosing your own colour is not administration)', () => {
  it('lets a tier-1 kid change their OWN colour', async () => {
    const cookie = await kidCookie()
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/seed-child-1/color',
      headers: { cookie },
      payload: { identityHue: 'indigo' },
    })
    expect(res.statusCode).toBe(200)
  })

  it('does NOT let a kid change someone else’s', async () => {
    const cookie = await kidCookie()
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/seed-parent-1/color',
      headers: { cookie },
      payload: { identityHue: 'indigo' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('lets tier 4 change anyone’s', async () => {
    const cookie = await tier4Cookie()
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/seed-child-1/color',
      headers: { cookie },
      payload: { identityHue: 'marigold' },
    })
    expect(res.statusCode).toBe(200)
  })

  it('honours a parent revoking platform.Color for one profile', async () => {
    await prisma.permissionOverride.create({
      data: {
        profileId: 'seed-child-1',
        action: 'update',
        subject: 'platform.Color',
        type: 'revocation',
      },
    })
    const cookie = await kidCookie()
    const res = await app.inject({
      method: 'PUT',
      url: '/api/profiles/seed-child-1/color',
      headers: { cookie },
      payload: { identityHue: 'indigo' },
    })
    expect(res.statusCode).toBe(403)
  })
})

describe('the hue travels with the person', () => {
  it('is returned by GET /api/profiles', async () => {
    await prisma.profile.update({ where: { id: 'seed-child-1' }, data: { identityHue: 'moss' } })
    const res = await app.inject({ method: 'GET', url: '/api/profiles' })
    const child = res.json().find((p: { id: string }) => p.id === 'seed-child-1')
    expect(child.identityHue).toBe('moss')
  })

  it('is returned by /api/auth/me', async () => {
    await prisma.profile.update({ where: { id: 'seed-child-1' }, data: { identityHue: 'sage' } })
    const cookie = await kidCookie()
    const res = await app.inject({ method: 'GET', url: '/api/auth/me', headers: { cookie } })
    expect(res.json().identityHue).toBe('sage')
  })

  it('rides on a chores task, so the row spine never re-derives it from a name', async () => {
    // chores.tasks keys assignee_id AND created_by as real uuids, so neither the actor
    // nor the assignee can be one of the suite's string-id seeds.
    const parent = await prisma.profile.create({ data: { name: 'Ada', tier: 4 } })
    const kid = await prisma.profile.create({
      data: { name: 'Nora', tier: 2, identityHue: 'plum' },
    })

    const hash = await bcrypt.hash('1234', 10)
    await prisma.systemConfig.upsert({
      where: { key: 'family_pin_hash' },
      update: { value: hash },
      create: { key: 'family_pin_hash', value: hash, updatedBy: null },
    })
    const cookie = getCookie(
      await app.inject({
        method: 'POST',
        url: '/api/auth/verify-pin',
        payload: { pin: '1234', targetProfileId: parent.id },
      })
    )

    const created = await app.inject({
      method: 'POST',
      url: '/api/chores/tasks',
      headers: { cookie },
      payload: { title: 'Bins', assigneeId: kid.id },
    })
    expect(created.statusCode).toBe(201)
    expect(created.json().assigneeHue).toBe('plum')
  })
})
