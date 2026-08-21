import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'

const devPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post('/dev/reset', async () => {
    // Every RESTRICT FK into profiles must be cleared before the profile delete
    // below, or it throws P2003. (profile_images is CASCADE — no entry needed.)
    await prisma.notification.deleteMany()
    await prisma.pushSubscription.deleteMany()
    await prisma.session.deleteMany()
    await prisma.widgetLayout.deleteMany()
    await prisma.permissionOverride.deleteMany()
    await prisma.profile.deleteMany({ where: { id: { not: FAMILY_PROFILE_ID } } })
    // default_layout_* rows are deliberately NOT re-created: a reset leaves no
    // config rows, so /home/layout serves the in-code DEFAULT_LAYOUTS (auto-bug
    // #116 — a pre-populated row is a cache that outlives a corrected default).
    await prisma.systemConfig.deleteMany({
      where: {
        key: {
          in: [
            'family_pin_hash',
            'onboarding_step',
            'family_name',
            'default_layout_tier_1_2',
            'default_layout_tier_3',
            'default_layout_tier_3_4',
          ],
        },
      },
    })
    await prisma.profile.upsert({
      where: { id: FAMILY_PROFILE_ID },
      update: {},
      create: { id: FAMILY_PROFILE_ID, name: 'Family', tier: 1, avatarUrl: null },
    })
    return { ok: true }
  })
}

export default fp(devPlugin, { name: 'dev' })
