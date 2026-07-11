import { prisma } from '@family-os/platform/server'
import { DEFAULT_LAYOUTS, defaultLayoutKey, type LayoutDefault } from './default-layouts'

export async function seedWidgetLayout(profileId: string, tier: number): Promise<void> {
  const key = defaultLayoutKey(profileId, tier)
  // Prefer the stored config (tunable without a deploy); fall back to the in-code
  // defaults so a profile is never seeded empty if the config wasn't written.
  const config = await prisma.systemConfig.findUnique({ where: { key } })
  const items = ((config?.value as LayoutDefault[] | undefined) ?? DEFAULT_LAYOUTS[key]) as
    | LayoutDefault[]
    | undefined
  if (!items?.length) return
  // `prominence` is derived on read (not a widget_layouts column); persist only geometry.
  await prisma.widgetLayout.createMany({
    data: items.map(({ widgetId, x, y, w, h }) => ({ profileId, widgetId, x, y, w, h })),
  })
}
