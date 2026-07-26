import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { notify, isNotifyVariant, MAX_NOTIFICATIONS } from '../lib/notify'

const notificationsPlugin: FastifyPluginAsync = async (fastify) => {
  // POST /notifications — persist a notification for tier 2+ profiles
  fastify.post('/notifications', async (request) => {
    const { profile } = request
    if (profile.tier < 2) return { ok: true }

    const body = request.body as {
      title?: string
      body?: string
      variant?: string
      priority?: string
    }

    if (!body?.title || !body?.variant) return { ok: false, error: 'title and variant required' }
    if (!isNotifyVariant(body.variant)) return { ok: false, error: `unknown variant` }

    // Persist + prune + Web Push all live in the shared server notify() path.
    const result = await notify(fastify.eventBus, profile.id, {
      title: body.title,
      body: body.body,
      variant: body.variant,
      priority: body.priority,
    })

    return { ok: true, id: result?.id }
  })

  // GET /notifications — list for active profile, newest first
  fastify.get('/notifications', async (request, reply) => {
    if (request.profile.tier < 2) return reply.status(403).send({ error: 'Requires tier 2' })

    const notifications = await prisma.notification.findMany({
      where: { profileId: request.profile.id },
      orderBy: { createdAt: 'desc' },
      take: MAX_NOTIFICATIONS,
    })

    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      variant: n.variant,
      priority: n.priority,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    }))
  })

  // GET /notifications/unread — unread count + max severity for the badge
  fastify.get('/notifications/unread', async (request, reply) => {
    if (request.profile.tier < 2) return reply.status(403).send({ error: 'Requires tier 2' })

    const unread = await prisma.notification.findMany({
      where: { profileId: request.profile.id, isRead: false },
      select: { variant: true },
    })

    const SEVERITY_ORDER = ['error', 'warning', 'info', 'success']
    let maxSeverity: string | null = null
    for (const sev of SEVERITY_ORDER) {
      if (unread.some((n) => n.variant === sev)) {
        maxSeverity = sev
        break
      }
    }

    return { unreadCount: unread.length, maxSeverity }
  })

  // POST /notifications/read — mark all as read for active profile
  fastify.post('/notifications/read', async (request, reply) => {
    if (request.profile.tier < 2) return reply.status(403).send({ error: 'Requires tier 2' })

    await prisma.notification.updateMany({
      where: { profileId: request.profile.id, isRead: false },
      data: { isRead: true },
    })

    return { ok: true }
  })

  // DELETE /notifications/:id — delete a single notification for active profile
  fastify.delete('/notifications/:id', async (request, reply) => {
    if (request.profile.tier < 2) return reply.status(403).send({ error: 'Requires tier 2' })

    const { id } = request.params as { id: string }
    const notification = await prisma.notification.findUnique({
      where: { id },
      select: { profileId: true },
    })

    if (!notification) return reply.status(404).send({ error: 'Not found' })
    if (notification.profileId !== request.profile.id)
      return reply.status(403).send({ error: 'Forbidden' })

    await prisma.notification.delete({ where: { id } })
    return { ok: true }
  })

  // DELETE /notifications — clear all notifications for active profile
  fastify.delete('/notifications', async (request, reply) => {
    if (request.profile.tier < 2) return reply.status(403).send({ error: 'Requires tier 2' })

    await prisma.notification.deleteMany({ where: { profileId: request.profile.id } })
    return { ok: true }
  })
}

export default fp(notificationsPlugin, { name: 'notifications' })
