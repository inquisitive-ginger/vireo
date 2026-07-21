import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import type { LightMyRequestResponse } from 'fastify'
import { buildServer } from '../server'
import { prisma, PERMISSION_REGISTRY } from '@family-os/platform/server'
import { formatIssueBody, formatIssueTitle } from '../lib/github-issue'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

async function getTier4Cookie(): Promise<string> {
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

async function getTier1Cookie(): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/switch',
    payload: { targetProfileId: 'seed-child-1' },
  })
  return getCookie(res)
}

const CONTEXT = {
  route: '/calendar',
  buildHash: 'a3f10c4',
  viewport: { width: 820, height: 1180 },
  userAgent: 'Mozilla/5.0 (iPad)',
  consoleErrors: ['TypeError: x is not a function'],
}

async function fileReport(cookie: string, description = 'The picker looks broken') {
  return app.inject({
    method: 'POST',
    url: '/api/bug-reports',
    headers: { cookie },
    payload: { description, context: CONTEXT },
  })
}

beforeAll(async () => {
  app = await buildServer()
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.bugReport.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.systemConfig.deleteMany({ where: { key: { in: ['family_pin_hash'] } } })
})

// ─── POST /bug-reports ────────────────────────────────────────────────────────

describe('POST /api/bug-reports', () => {
  it('files a report and stores the captured context', async () => {
    const cookie = await getTier4Cookie()
    const res = await fileReport(cookie)

    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.status).toBe('new')
    expect(body.context.route).toBe('/calendar')
    expect(body.context.buildHash).toBe('a3f10c4')

    const saved = await prisma.bugReport.findUnique({ where: { id: body.id } })
    expect(saved?.reporterId).toBe('seed-parent-1')
    expect(saved?.githubIssueNumber).toBeNull()
  })

  // The whole point of the tier decision (ADR 046): the youngest user is the likeliest
  // to hit a rough edge and the least able to route around it.
  it('lets a tier-1 profile file a report', async () => {
    const cookie = await getTier1Cookie()
    const res = await fileReport(cookie, 'the chores page went white')

    expect(res.statusCode).toBe(201)
    const saved = await prisma.bugReport.findFirst({ where: { reporterId: 'seed-child-1' } })
    expect(saved?.description).toBe('the chores page went white')
  })

  it('rejects an empty description', async () => {
    const cookie = await getTier4Cookie()
    const res = await app.inject({
      method: 'POST',
      url: '/api/bug-reports',
      headers: { cookie },
      payload: { description: '   ', context: CONTEXT },
    })

    expect(res.statusCode).toBe(400)
    expect(await prisma.bugReport.count()).toBe(0)
  })

  it('rejects a report with no route in its context', async () => {
    const cookie = await getTier4Cookie()
    const res = await app.inject({
      method: 'POST',
      url: '/api/bug-reports',
      headers: { cookie },
      payload: { description: 'broken', context: { buildHash: 'abc' } },
    })

    expect(res.statusCode).toBe(400)
  })

  it('caps stored console errors so an error loop cannot post unbounded data', async () => {
    const cookie = await getTier4Cookie()
    const res = await app.inject({
      method: 'POST',
      url: '/api/bug-reports',
      headers: { cookie },
      payload: {
        description: 'looping',
        context: { ...CONTEXT, consoleErrors: Array.from({ length: 50 }, (_, i) => `err ${i}`) },
      },
    })

    expect(res.statusCode).toBe(400)
  })
})

// ─── GET /bug-reports ─────────────────────────────────────────────────────────

describe('GET /api/bug-reports', () => {
  it('returns only your own reports below tier 4', async () => {
    const parentCookie = await getTier4Cookie()
    await fileReport(parentCookie, 'parent report')
    const childCookie = await getTier1Cookie()
    await fileReport(childCookie, 'child report')

    const res = await app.inject({
      method: 'GET',
      url: '/api/bug-reports',
      headers: { cookie: childCookie },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body).toHaveLength(1)
    expect(body[0].description).toBe('child report')
  })

  it('returns the whole household to tier 4, with the reporter hue for the spine', async () => {
    const childCookie = await getTier1Cookie()
    await fileReport(childCookie, 'child report')
    const parentCookie = await getTier4Cookie()
    await fileReport(parentCookie, 'parent report')

    const res = await app.inject({
      method: 'GET',
      url: '/api/bug-reports',
      headers: { cookie: parentCookie },
    })

    const body = res.json()
    expect(body).toHaveLength(2)
    // ADR 044 — a payload carrying a person carries their hue, or the board cannot
    // paint the spine.
    expect(body[0].reporter).toHaveProperty('identityHue')
    expect(body[0].reporter.name).toBeTruthy()
  })
})

// ─── PATCH /bug-reports/:id ───────────────────────────────────────────────────

describe('PATCH /api/bug-reports/:id', () => {
  it('moves a report and notifies the reporter when it goes live', async () => {
    const cookie = await getTier4Cookie()
    const created = (await fileReport(cookie)).json()

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/bug-reports/${created.id}`,
      headers: { cookie },
      payload: { status: 'deployed', resolution: 'The picker stylesheet is linked again.' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().status).toBe('deployed')

    const notifications = await prisma.notification.findMany({
      where: { profileId: 'seed-parent-1' },
    })
    expect(notifications).toHaveLength(1)
    expect(notifications[0]?.title).toBe('Fixed and live')
    expect(notifications[0]?.body).toBe('The picker stylesheet is linked again.')
  })

  it('does not notify for intermediate statuses', async () => {
    const cookie = await getTier4Cookie()
    const created = (await fileReport(cookie)).json()

    await app.inject({
      method: 'PATCH',
      url: `/api/bug-reports/${created.id}`,
      headers: { cookie },
      payload: { status: 'fixing' },
    })

    expect(await prisma.notification.count()).toBe(0)
  })

  // Guarded on the transition, not the value — re-saving a deployed report must not
  // ping the reporter a second time.
  it('notifies once, not on every save of an already-deployed report', async () => {
    const cookie = await getTier4Cookie()
    const created = (await fileReport(cookie)).json()

    for (let i = 0; i < 3; i++) {
      await app.inject({
        method: 'PATCH',
        url: `/api/bug-reports/${created.id}`,
        headers: { cookie },
        payload: { status: 'deployed' },
      })
    }

    expect(await prisma.notification.count()).toBe(1)
  })

  it('refuses triage below tier 4', async () => {
    const parentCookie = await getTier4Cookie()
    const created = (await fileReport(parentCookie)).json()
    const childCookie = await getTier1Cookie()

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/bug-reports/${created.id}`,
      headers: { cookie: childCookie },
      payload: { status: 'deployed' },
    })

    expect(res.statusCode).toBe(403)
  })

  it('404s an unknown report', async () => {
    const cookie = await getTier4Cookie()
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/bug-reports/11111111-1111-1111-1111-111111111111',
      headers: { cookie },
      payload: { status: 'deployed' },
    })

    expect(res.statusCode).toBe(404)
  })

  it('rejects a status outside the lifecycle', async () => {
    const cookie = await getTier4Cookie()
    const created = (await fileReport(cookie)).json()

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/bug-reports/${created.id}`,
      headers: { cookie },
      payload: { status: 'ascended' },
    })

    expect(res.statusCode).toBe(400)
  })
})

// ─── The GitHub bridge ────────────────────────────────────────────────────────

describe('issue formatting', () => {
  it('puts every captured field in the body a fixer reads', () => {
    const body = formatIssueBody({
      id: 'report-1',
      description: 'The picker looks broken',
      context: CONTEXT,
      reporterName: 'Teddy',
      reporterTier: 2,
    })

    expect(body).toContain('The picker looks broken')
    expect(body).toContain('/calendar')
    expect(body).toContain('a3f10c4')
    expect(body).toContain('820×1180')
    expect(body).toContain('TypeError: x is not a function')
    expect(body).toContain('Teddy')
  })

  it('omits the console section when nothing errored', () => {
    const body = formatIssueBody({
      id: 'report-1',
      description: 'looks odd',
      context: { ...CONTEXT, consoleErrors: [] },
      reporterName: 'Teddy',
      reporterTier: 2,
    })

    expect(body).not.toContain('## Console errors')
  })

  it('titles the issue with the reporter’s own words, truncated', () => {
    expect(formatIssueTitle('Short one')).toBe('Short one')
    expect(formatIssueTitle('a'.repeat(200))).toHaveLength(78)
    expect(formatIssueTitle('first line\nsecond line')).toBe('first line')
  })
})

describe('permission registry', () => {
  it('registers the report capability so a parent can revoke it per-profile', () => {
    expect(PERMISSION_REGISTRY['platform.bug-report.create']).toMatchObject({
      action: 'create',
      subject: 'platform.BugReport',
    })
  })
})
