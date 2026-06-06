import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { seedWidgetLayout } from '../lib/seed-layout'

const DEFAULT_LAYOUTS = {
  default_layout_tier_1_2: [
    { widgetId: 'chores.today-summary', x: 0, y: 0, w: 2, h: 2 },
    { widgetId: 'family-feed.feed', x: 2, y: 0, w: 2, h: 1 },
    { widgetId: 'calendar.today', x: 2, y: 1, w: 2, h: 1 },
  ],
  default_layout_tier_3_4: [
    { widgetId: 'calendar.today', x: 0, y: 0, w: 2, h: 2 },
    { widgetId: 'family-feed.feed', x: 2, y: 0, w: 2, h: 1 },
    { widgetId: 'chores.today-summary', x: 2, y: 1, w: 2, h: 1 },
  ],
}

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
    for (const [key, value] of Object.entries(DEFAULT_LAYOUTS)) {
      await prisma.systemConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    await seedWidgetLayout('family', 1)
    return { ok: true }
  })
}

export default fp(devPlugin, { name: 'dev' })
