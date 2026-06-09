import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { feedPrisma } from '@family-os/plugin-family-feed/db'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

const familyFeedPlugin: FastifyPluginAsync = async (fastify) => {
  // POST /family-feed/posts { body: string }
  fastify.post('/family-feed/posts', async (request, reply) => {
    if (!request.ability.can('create', 'family-feed.Post')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const raw = (request.body as { body?: unknown }).body
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      return reply.status(400).send({ error: 'body is required' })
    }
    const body = raw.trim()

    const post = await feedPrisma.post.create({
      data: { authorId: request.profile.id, body },
    })

    const author = await prisma.profile.findUnique({ where: { id: post.authorId } })

    return reply.status(201).send({
      id: post.id,
      body: post.body,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.authorId,
        name: author?.name ?? 'Unknown',
        avatarUrl: null,
      },
    })
  })

  // GET /family-feed/posts?cursor=<uuid>&limit=<number>
  fastify.get('/family-feed/posts', async (request, reply) => {
    const query = request.query as { cursor?: string; limit?: string }
    const limit = Math.min(parseInt(query.limit ?? String(DEFAULT_LIMIT), 10), MAX_LIMIT)
    const cursor = query.cursor ?? null

    if (isNaN(limit) || limit < 1) {
      return reply.status(400).send({ error: 'Invalid limit' })
    }

    const posts = await feedPrisma.post.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    })

    const hasMore = posts.length > limit
    const items = hasMore ? posts.slice(0, -1) : posts
    const nextCursor = hasMore ? (items[items.length - 1]?.id ?? null) : null

    const authorIds = [...new Set(items.map((p) => p.authorId))]
    const profiles = authorIds.length
      ? await prisma.profile.findMany({ where: { id: { in: authorIds } } })
      : []
    const profileMap = new Map(profiles.map((p) => [p.id, p]))

    return {
      posts: items.map((p) => ({
        id: p.id,
        body: p.body,
        createdAt: p.createdAt.toISOString(),
        author: {
          id: p.authorId,
          name: profileMap.get(p.authorId)?.name ?? 'Unknown',
          avatarUrl: null,
        },
      })),
      nextCursor,
    }
  })
}

export default fp(familyFeedPlugin, { name: 'family-feed' })
