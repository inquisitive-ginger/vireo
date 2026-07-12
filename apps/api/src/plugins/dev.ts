import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { DEFAULT_LAYOUTS, FAMILY_PROFILE_ID } from '@family-os/platform/types'

const devPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post('/dev/reset', async () => {
    await prisma.session.deleteMany()
    await prisma.widgetLayout.deleteMany()
    await prisma.permissionOverride.deleteMany()
    await prisma.profile.deleteMany({ where: { id: { not: FAMILY_PROFILE_ID } } })
    await prisma.systemConfig.deleteMany({
      where: { key: { in: ['family_pin_hash', 'onboarding_step', 'family_name'] } },
    })
    await prisma.profile.upsert({
      where: { id: FAMILY_PROFILE_ID },
      update: {},
      create: { id: FAMILY_PROFILE_ID, name: 'Family', tier: 1, avatarUrl: null },
    })
    // Geometry only — `prominence` is derived on read, never stored (ADR 039).
    for (const [key, items] of Object.entries(DEFAULT_LAYOUTS)) {
      const value = items.map(({ widgetId, x, y, w, h }) => ({ widgetId, x, y, w, h }))
      await prisma.systemConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    return { ok: true }
  })
}

export default fp(devPlugin, { name: 'dev' })
