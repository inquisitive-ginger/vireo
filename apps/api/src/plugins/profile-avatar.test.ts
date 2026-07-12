import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import bcrypt from 'bcryptjs'

let app: FastifyInstance

// A real 1×1 WebP — the shape the client's canvas actually produces.
const WEBP = Buffer.from('UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v3AgAA=', 'base64')
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)
/** The thing that must never be stored: script inside an "image". */
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')

function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

/** Tier-4 (parent) session, via the family PIN. */
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

/** A non-tier-4 session — no PIN needed to switch down. */
async function childCookie(): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/switch',
    payload: { targetProfileId: 'seed-child-1' },
  })
  return getCookie(res)
}

function upload(id: string, cookie: string, bytes: Buffer, contentType = 'image/webp') {
  return app.inject({
    method: 'POST',
    url: `/api/profiles/${id}/avatar`,
    headers: { cookie, 'content-type': contentType },
    payload: bytes,
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
  await prisma.profileImage.deleteMany()
  await prisma.permissionOverride.deleteMany()
  await prisma.profile.updateMany({ data: { avatarUrl: null } })
  await prisma.systemConfig.deleteMany({ where: { key: { in: ['family_pin_hash'] } } })
})

describe('POST /api/profiles/:id/avatar', () => {
  it('stores the bytes and points avatarUrl at the hashed URL', async () => {
    const cookie = await tier4Cookie()
    const res = await upload('seed-parent-1', cookie, WEBP)

    expect(res.statusCode).toBe(200)
    const { avatarUrl } = res.json<{ avatarUrl: string }>()
    expect(avatarUrl).toMatch(/^\/api\/profiles\/seed-parent-1\/avatar\?v=[0-9a-f]{16}$/)

    const profile = await prisma.profile.findUnique({ where: { id: 'seed-parent-1' } })
    expect(profile?.avatarUrl).toBe(avatarUrl)

    const image = await prisma.profileImage.findUnique({ where: { profileId: 'seed-parent-1' } })
    expect(image?.mimeType).toBe('image/webp')
    expect(Buffer.from(image!.bytes)).toEqual(WEBP)
  })

  it('rejects an SVG even when the client swears it is a PNG', async () => {
    const cookie = await tier4Cookie()
    // The Content-Type is a lie; the bytes are what get sniffed (ADR 042).
    const res = await upload('seed-parent-1', cookie, SVG, 'image/png')

    expect(res.statusCode).toBe(415)
    expect(
      await prisma.profileImage.findUnique({ where: { profileId: 'seed-parent-1' } })
    ).toBeNull()
  })

  it('derives the stored type from the bytes, not the declared Content-Type', async () => {
    const cookie = await tier4Cookie()
    // Real PNG bytes, declared as WebP.
    const res = await upload('seed-parent-1', cookie, PNG, 'image/webp')

    expect(res.statusCode).toBe(200)
    const image = await prisma.profileImage.findUnique({ where: { profileId: 'seed-parent-1' } })
    expect(image?.mimeType).toBe('image/png')
  })

  it('rejects an empty body', async () => {
    const cookie = await tier4Cookie()
    const res = await upload('seed-parent-1', cookie, Buffer.alloc(0))
    expect(res.statusCode).toBe(400)
  })

  it('404s for a profile that does not exist', async () => {
    const cookie = await tier4Cookie()
    const res = await upload('00000000-0000-0000-0000-000000000000', cookie, WEBP)
    expect(res.statusCode).toBe(404)
  })

  it('replaces an existing photo and moves the hash', async () => {
    const cookie = await tier4Cookie()
    const first = await upload('seed-parent-1', cookie, WEBP)
    const second = await upload('seed-parent-1', cookie, PNG)

    const a = first.json<{ avatarUrl: string }>().avatarUrl
    const b = second.json<{ avatarUrl: string }>().avatarUrl
    expect(b).not.toBe(a)

    // Upsert, not insert — one row per profile.
    const rows = await prisma.profileImage.findMany({ where: { profileId: 'seed-parent-1' } })
    expect(rows).toHaveLength(1)
  })
})

describe('avatar permissions (ADR 042)', () => {
  it('lets a child set their OWN photo — choosing your face is not administration', async () => {
    const cookie = await childCookie()
    const res = await upload('seed-child-1', cookie, WEBP)
    expect(res.statusCode).toBe(200)
  })

  it("forbids a child setting someone else's photo", async () => {
    const cookie = await childCookie()
    const res = await upload('seed-parent-1', cookie, WEBP)
    expect(res.statusCode).toBe(403)
  })

  it("lets tier 4 set anyone's photo", async () => {
    const cookie = await tier4Cookie()
    const res = await upload('seed-child-1', cookie, WEBP)
    expect(res.statusCode).toBe(200)
  })

  it('forbids the family pseudo-profile setting its own photo — that is tier-4 only', async () => {
    // The household is tier 1, so without the carve-out the "own profile" branch
    // would let a family session change the household photo.
    const res = await app.inject({
      method: 'POST',
      url: '/api/profiles/family/avatar',
      headers: { 'content-type': 'image/webp' },
      payload: WEBP,
    })
    expect(res.statusCode).toBe(403)
  })

  it('lets tier 4 set the family photo', async () => {
    const cookie = await tier4Cookie()
    const res = await upload('family', cookie, WEBP)
    expect(res.statusCode).toBe(200)
  })

  it('honours a parent revoking platform.Avatar for one profile', async () => {
    // This is the lever the ADR promises: if a kid abuses self-serve, the existing
    // per-profile override system takes it away.
    await prisma.permissionOverride.create({
      data: {
        profileId: 'seed-child-1',
        action: 'update',
        subject: 'platform.Avatar',
        type: 'revocation',
        grantedBy: 'seed-parent-1',
      },
    })

    const cookie = await childCookie()
    const res = await upload('seed-child-1', cookie, WEBP)
    expect(res.statusCode).toBe(403)
  })
})

describe('GET /api/profiles/:id/avatar', () => {
  it('serves the bytes with a server-derived type and an immutable cache', async () => {
    const cookie = await tier4Cookie()
    await upload('seed-parent-1', cookie, PNG, 'image/webp')

    const res = await app.inject({ method: 'GET', url: '/api/profiles/seed-parent-1/avatar' })

    expect(res.statusCode).toBe(200)
    // PNG bytes were uploaded, so PNG is served — regardless of what was declared.
    expect(res.headers['content-type']).toBe('image/png')
    expect(res.headers['x-content-type-options']).toBe('nosniff')
    expect(res.headers['cache-control']).toBe('public, max-age=31536000, immutable')
    expect(res.rawPayload).toEqual(PNG)
  })

  it('404s when no photo is set', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/profiles/seed-child-1/avatar' })
    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /api/profiles/:id/avatar', () => {
  it('drops the photo and clears avatarUrl back to initials', async () => {
    const cookie = await tier4Cookie()
    await upload('seed-parent-1', cookie, WEBP)

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/profiles/seed-parent-1/avatar',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    const profile = await prisma.profile.findUnique({ where: { id: 'seed-parent-1' } })
    expect(profile?.avatarUrl).toBeNull()
    expect(
      await prisma.profileImage.findUnique({ where: { profileId: 'seed-parent-1' } })
    ).toBeNull()
  })

  it("forbids a child deleting someone else's photo", async () => {
    const parent = await tier4Cookie()
    await upload('seed-parent-1', parent, WEBP)

    const cookie = await childCookie()
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/profiles/seed-parent-1/avatar',
      headers: { cookie },
    })
    expect(res.statusCode).toBe(403)
  })
})

describe('avatarUrl reaches the read paths', () => {
  it('appears in GET /api/profiles', async () => {
    const cookie = await tier4Cookie()
    const { avatarUrl } = (await upload('seed-child-1', cookie, WEBP)).json<{ avatarUrl: string }>()

    const res = await app.inject({ method: 'GET', url: '/api/profiles', headers: { cookie } })
    const rows = res.json<{ id: string; avatarUrl: string | null }[]>()

    expect(rows.find((p) => p.id === 'seed-child-1')?.avatarUrl).toBe(avatarUrl)
    // Untouched profiles still read null rather than going missing.
    expect(rows.find((p) => p.id === 'seed-parent-1')?.avatarUrl).toBeNull()
  })

  it('appears in GET /api/auth/me for the active profile', async () => {
    const cookie = await tier4Cookie()
    const { avatarUrl } = (await upload('seed-parent-1', cookie, WEBP)).json<{
      avatarUrl: string
    }>()

    const res = await app.inject({ method: 'GET', url: '/api/auth/me', headers: { cookie } })
    expect(res.json<{ avatarUrl: string | null }>().avatarUrl).toBe(avatarUrl)
  })
})

describe('DELETE /api/profiles/:id', () => {
  it('cascades the stored image away with the profile', async () => {
    const cookie = await tier4Cookie()
    const created = await app.inject({
      method: 'POST',
      url: '/api/profiles',
      headers: { cookie },
      payload: { name: 'Temp', tier: 2 },
    })
    const { id } = created.json<{ id: string }>()
    await upload(id, cookie, WEBP)

    await app.inject({ method: 'DELETE', url: `/api/profiles/${id}`, headers: { cookie } })

    expect(await prisma.profileImage.findUnique({ where: { profileId: id } })).toBeNull()
  })
})
