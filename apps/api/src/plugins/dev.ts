import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'

const devPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post('/dev/reset', async () => {
    await prisma.session.deleteMany()
    await prisma.widgetLayout.deleteMany()
    await prisma.permissionOverride.deleteMany()
    await prisma.profile.deleteMany({ where: { id: { not: 'family' } } })
    await prisma.systemConfig.deleteMany({
      where: { key: { in: ['family_pin_hash', 'onboarding_step', 'family_name'] } },
    })
    await prisma.profile.upsert({
      where: { id: 'family' },
      update: {},
      create: { id: 'family', name: 'Family', tier: 1, avatarUrl: null },
    })
    return { ok: true }
  })
}

export default fp(devPlugin, { name: 'dev' })
