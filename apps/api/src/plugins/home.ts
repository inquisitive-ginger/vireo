import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { DEFAULT_LAYOUTS, defaultLayoutKey, prominenceFor } from '../lib/default-layouts'

type LayoutRow = { widgetId: string; x: number; y: number; w: number; h: number }

const homePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get('/home/layout', async (request) => {
    const profileId = request.profile.id
    const tier = request.profile.tier
    const key = defaultLayoutKey(profileId, tier)

    // Prominence is derived on read from the layout composition (not a stored
    // column) — one feature per surface, re-ranked per profile.
    const withProminence = (rows: LayoutRow[]) =>
      rows.map((r) => ({ ...r, prominence: prominenceFor(key, r.widgetId) }))

    const existing = await prisma.widgetLayout.findMany({ where: { profileId } })
    if (existing.length > 0) {
      return withProminence(
        existing.map((r) => ({ widgetId: r.widgetId, x: r.x, y: r.y, w: r.w, h: r.h }))
      )
    }

    // No layout yet — seed geometry from platform config (fallback to in-code defaults).
    const config = await prisma.systemConfig.findUnique({ where: { key } })
    const defaults = ((config?.value as LayoutRow[] | undefined) ?? DEFAULT_LAYOUTS[key] ?? []).map(
      ({ widgetId, x, y, w, h }) => ({ widgetId, x, y, w, h })
    )
    if (defaults.length === 0) return []

    await prisma.widgetLayout.createMany({
      data: defaults.map((item) => ({ profileId, ...item })),
    })

    return withProminence(defaults)
  })
}

export default fp(homePlugin, { name: 'home' })
