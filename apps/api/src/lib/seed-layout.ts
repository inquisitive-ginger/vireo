import { prisma } from '@family-os/platform/server'

const DEFAULT_LAYOUT_KEYS: Record<number, string> = {
  1: 'default_layout_tier_1_2',
  2: 'default_layout_tier_1_2',
  3: 'default_layout_tier_3_4',
  4: 'default_layout_tier_3_4',
}

type LayoutItem = { widgetId: string; x: number; y: number; w: number; h: number }

export async function seedWidgetLayout(profileId: string, tier: number): Promise<void> {
  const key = DEFAULT_LAYOUT_KEYS[tier] ?? 'default_layout_tier_3_4'
  const config = await prisma.systemConfig.findUnique({ where: { key } })
  if (!config?.value) return
  const items = config.value as LayoutItem[]
  await prisma.widgetLayout.createMany({
    data: items.map((item) => ({ ...item, profileId })),
  })
}
