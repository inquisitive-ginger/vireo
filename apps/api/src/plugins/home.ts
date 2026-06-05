import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'

type DefaultLayoutRow = { widgetId: string; x: number; y: number; w: number; h: number }

function defaultLayoutKey(profileId: string, tier: number): string {
  if (profileId === 'family') return 'default_layout_family'
  if (tier <= 2) return 'default_layout_tier_1_2'
  return 'default_layout_tier_3_4'
}

const homePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get('/home/layout', async (request) => {
    const profileId = request.profile.id
    const tier = request.profile.tier

    const existing = await prisma.widgetLayout.findMany({ where: { profileId } })

    if (existing.length > 0) {
      return existing.map((r) => ({ widgetId: r.widgetId, x: r.x, y: r.y, w: r.w, h: r.h }))
    }

    // No layout yet — seed from platform config
    const key = defaultLayoutKey(profileId, tier)
    const config = await prisma.systemConfig.findUnique({ where: { key } })
    if (!config) return []

    const defaults = config.value as DefaultLayoutRow[]

    await prisma.widgetLayout.createMany({
      data: defaults.map((item) => ({ profileId, ...item })),
    })

    return defaults
  })
}

export default fp(homePlugin, { name: 'home' })
