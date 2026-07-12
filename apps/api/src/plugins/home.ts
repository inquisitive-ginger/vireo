import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { DEFAULT_LAYOUTS, defaultLayoutKey, prominenceFor } from '@family-os/platform/types'

type LayoutRow = { widgetId: string; x: number; y: number; w: number; h: number }

/* GET /home/layout — the profile's widget composition.

   THE DEFAULT IS SERVED, NOT FROZEN. This used to persist the default into
   `widget_layouts` on a profile's FIRST page load, and those rows then won every
   later read. Since no layout-editing UI exists yet, they recorded no user intent —
   they were a cache of a default that had since changed. The effect: when the
   elevation ladder re-ranked the home dashboard, existing profiles kept the old
   geometry forever and rendered the new rungs on it (a `quiet` widget above a `card`
   one), and the only cure was deleting rows by hand.

   So: a persisted layout still WINS if one exists — that's the hook a future
   customization UI writes through (an explicit PUT, ADR 022) — but nothing writes one
   until the user actually customizes. Until then every profile tracks the current
   default. */
const homePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get('/home/layout', async (request) => {
    const profileId = request.profile.id
    const tier = request.profile.tier
    const key = defaultLayoutKey(profileId, tier)

    // Prominence is derived on read from the layout composition (not a stored
    // column) — one feature per surface, re-ranked per profile.
    const withProminence = (rows: LayoutRow[]) =>
      rows.map((r) => ({ ...r, prominence: prominenceFor(key, r.widgetId) }))

    // A customized layout, once the customization UI exists. Nothing writes these today.
    const existing = await prisma.widgetLayout.findMany({ where: { profileId } })
    if (existing.length > 0) {
      return withProminence(
        existing.map((r) => ({ widgetId: r.widgetId, x: r.x, y: r.y, w: r.w, h: r.h }))
      )
    }

    // Geometry from platform config (tunable without a deploy), else the in-code
    // composition. Both trace back to one definition — @family-os/platform's
    // DEFAULT_LAYOUTS — because a second copy is exactly what drifted before.
    const config = await prisma.systemConfig.findUnique({ where: { key } })
    const defaults = ((config?.value as LayoutRow[] | undefined) ?? DEFAULT_LAYOUTS[key] ?? []).map(
      ({ widgetId, x, y, w, h }) => ({ widgetId, x, y, w, h })
    )

    return withProminence(defaults)
  })
}

export default fp(homePlugin, { name: 'home' })
