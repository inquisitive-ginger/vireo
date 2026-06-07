import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import webpush from 'web-push'
import { prisma } from '@family-os/platform/server'

export async function initVapidKeys(): Promise<void> {
  const [pubRow, privRow] = await Promise.all([
    prisma.systemConfig.findUnique({ where: { key: 'vapid_public_key' } }),
    prisma.systemConfig.findUnique({ where: { key: 'vapid_private_key' } }),
  ])

  if (pubRow && privRow) {
    webpush.setVapidDetails(
      'mailto:admin@family-os.local',
      pubRow.value as string,
      privRow.value as string
    )
    return
  }

  const { publicKey, privateKey } = webpush.generateVAPIDKeys()
  await prisma.systemConfig.createMany({
    data: [
      { key: 'vapid_public_key', value: publicKey },
      { key: 'vapid_private_key', value: privateKey },
    ],
    skipDuplicates: true,
  })
  webpush.setVapidDetails('mailto:admin@family-os.local', publicKey, privateKey)
}

export async function sendPushToProfile(profileId: string, payload: object): Promise<void> {
  const subscriptions = await prisma.pushSubscription.findMany({ where: { profileId } })
  const gone: string[] = []

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dhKey, auth: sub.authKey } },
          JSON.stringify(payload)
        )
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number }).statusCode
        if (statusCode === 410) gone.push(sub.endpoint)
      }
    })
  )

  if (gone.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { endpoint: { in: gone } } })
  }
}

const pushPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get('/push/vapid-public-key', async () => {
    const row = await prisma.systemConfig.findUnique({ where: { key: 'vapid_public_key' } })
    return { publicKey: (row?.value as string | null) ?? null }
  })

  fastify.post('/push/subscribe', async (request, reply) => {
    const profile = request.profile
    if (profile.tier < 3) return reply.status(403).send({ error: 'Requires tier 3 or above' })

    const body = request.body as {
      endpoint?: string
      keys?: { p256dh?: string; auth?: string }
    }

    if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
      return reply.status(400).send({ error: 'endpoint, keys.p256dh, and keys.auth are required' })
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint: body.endpoint },
      update: { profileId: profile.id, p256dhKey: body.keys.p256dh, authKey: body.keys.auth },
      create: {
        profileId: profile.id,
        endpoint: body.endpoint,
        p256dhKey: body.keys.p256dh,
        authKey: body.keys.auth,
      },
    })

    if (profile.tier === 3) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { pushEnabled: true },
      })
    }

    return { ok: true }
  })

  fastify.post('/push/unsubscribe', async (request, reply) => {
    const profile = request.profile
    if (profile.tier < 3) return reply.status(403).send({ error: 'Requires tier 3 or above' })

    const body = request.body as { endpoint?: string }
    if (!body?.endpoint) return reply.status(400).send({ error: 'endpoint is required' })

    await prisma.pushSubscription.deleteMany({
      where: { profileId: profile.id, endpoint: body.endpoint },
    })

    if (profile.tier === 3) {
      const remaining = await prisma.pushSubscription.count({ where: { profileId: profile.id } })
      if (remaining === 0) {
        await prisma.profile.update({ where: { id: profile.id }, data: { pushEnabled: false } })
      }
    }

    return { ok: true }
  })
}

export default fp(pushPlugin, { name: 'push' })
