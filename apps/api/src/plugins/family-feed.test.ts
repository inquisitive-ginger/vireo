import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { feedPrisma } from '@family-os/plugin-family-feed/db'

let app: FastifyInstance

// Fixed UUIDs for test profiles — author_id in posts is @db.Uuid
const AUTHOR_ID = '00000000-feed-0001-0000-000000000001'
const AUTHOR_ID_2 = '00000000-feed-0001-0000-000000000002'

beforeAll(async () => {
  app = await buildServer()

  await prisma.profile.upsert({
    where: { id: AUTHOR_ID },
    update: { name: 'Alice' },
    create: { id: AUTHOR_ID, name: 'Alice', tier: 3 },
  })
  await prisma.profile.upsert({
    where: { id: AUTHOR_ID_2 },
    update: { name: 'Bob' },
    create: { id: AUTHOR_ID_2, name: 'Bob', tier: 2 },
  })
})

afterAll(async () => {
  await feedPrisma.post.deleteMany({ where: { authorId: { in: [AUTHOR_ID, AUTHOR_ID_2] } } })
  await prisma.profile.deleteMany({ where: { id: { in: [AUTHOR_ID, AUTHOR_ID_2] } } })
  await app.close()
  await prisma.$disconnect()
  await feedPrisma.$disconnect()
})

beforeEach(async () => {
  await feedPrisma.post.deleteMany({ where: { authorId: { in: [AUTHOR_ID, AUTHOR_ID_2] } } })
})

// ─── GET /api/family-feed/posts ───────────────────────────────────────────────

describe('GET /api/family-feed/posts', () => {
  it('returns empty array when no posts exist', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/family-feed/posts' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.posts).toEqual([])
    expect(body.nextCursor).toBeNull()
  })

  it('returns posts with author info joined from platform profiles', async () => {
    await feedPrisma.post.create({ data: { authorId: AUTHOR_ID, body: 'Hello world' } })

    const res = await app.inject({ method: 'GET', url: '/api/family-feed/posts' })
    expect(res.statusCode).toBe(200)

    const body = res.json()
    expect(body.posts).toHaveLength(1)
    expect(body.posts[0].body).toBe('Hello world')
    expect(body.posts[0].author.id).toBe(AUTHOR_ID)
    expect(body.posts[0].author.name).toBe('Alice')
    expect(body.posts[0].createdAt).toBeDefined()
    expect(body.nextCursor).toBeNull()
  })

  it('returns posts ordered newest first', async () => {
    await feedPrisma.post.create({ data: { authorId: AUTHOR_ID, body: 'First post' } })
    await feedPrisma.post.create({ data: { authorId: AUTHOR_ID_2, body: 'Second post' } })

    const res = await app.inject({ method: 'GET', url: '/api/family-feed/posts' })
    const body = res.json()

    expect(body.posts[0].body).toBe('Second post')
    expect(body.posts[1].body).toBe('First post')
  })

  it('respects the limit param and returns nextCursor when more exist', async () => {
    for (let i = 0; i < 5; i++) {
      await feedPrisma.post.create({ data: { authorId: AUTHOR_ID, body: `Post ${i}` } })
    }

    const res = await app.inject({ method: 'GET', url: '/api/family-feed/posts?limit=3' })
    const body = res.json()

    expect(body.posts).toHaveLength(3)
    expect(typeof body.nextCursor).toBe('string')
  })

  it('returns nextCursor=null when all posts fit within the limit', async () => {
    await feedPrisma.post.create({ data: { authorId: AUTHOR_ID, body: 'Only post' } })

    const res = await app.inject({ method: 'GET', url: '/api/family-feed/posts?limit=5' })
    const body = res.json()

    expect(body.posts).toHaveLength(1)
    expect(body.nextCursor).toBeNull()
  })

  it('fetches the next page using the cursor', async () => {
    for (let i = 0; i < 4; i++) {
      await feedPrisma.post.create({ data: { authorId: AUTHOR_ID, body: `Post ${i}` } })
    }

    const page1 = await app.inject({ method: 'GET', url: '/api/family-feed/posts?limit=2' })
    const { posts: firstPage, nextCursor } = page1.json()
    expect(firstPage).toHaveLength(2)
    expect(nextCursor).toBeTruthy()

    const page2 = await app.inject({
      method: 'GET',
      url: `/api/family-feed/posts?limit=2&cursor=${nextCursor}`,
    })
    const { posts: secondPage, nextCursor: endCursor } = page2.json()
    expect(secondPage).toHaveLength(2)
    expect(endCursor).toBeNull()

    const allIds = [...firstPage, ...secondPage].map((p: { id: string }) => p.id)
    expect(new Set(allIds).size).toBe(4)
  })

  it('caps limit at 50', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/family-feed/posts?limit=999' })
    expect(res.statusCode).toBe(200)
  })

  it('returns 400 for a non-numeric limit', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/family-feed/posts?limit=abc' })
    expect(res.statusCode).toBe(400)
  })
})
