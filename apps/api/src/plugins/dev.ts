import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { seedWidgetLayout } from '../lib/seed-layout'
import { DEFAULT_LAYOUTS } from '../lib/default-layouts'

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
    for (const [key, value] of Object.entries(DEFAULT_LAYOUTS)) {
      await prisma.systemConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    await seedWidgetLayout(FAMILY_PROFILE_ID, 1)
    return { ok: true }
  })
}

export default fp(devPlugin, { name: 'dev' })
