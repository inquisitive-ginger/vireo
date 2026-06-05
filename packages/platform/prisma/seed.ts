import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos',
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Default widget layouts per ADR 028
const DEFAULT_LAYOUTS = {
  default_layout_family: [
    { widgetId: 'family-feed.feed',     x: 0, y: 0, w: 4, h: 1 },
    { widgetId: 'chores.today-summary', x: 0, y: 1, w: 2, h: 1 },
    { widgetId: 'calendar.today',       x: 2, y: 1, w: 2, h: 1 },
  ],
  default_layout_tier_1_2: [
    { widgetId: 'chores.today-summary', x: 0, y: 0, w: 2, h: 2 },
    { widgetId: 'family-feed.feed',     x: 2, y: 0, w: 2, h: 1 },
    { widgetId: 'calendar.today',       x: 2, y: 1, w: 2, h: 1 },
  ],
  default_layout_tier_3_4: [
    { widgetId: 'calendar.today',       x: 0, y: 0, w: 2, h: 2 },
    { widgetId: 'family-feed.feed',     x: 2, y: 0, w: 2, h: 1 },
    { widgetId: 'chores.today-summary', x: 2, y: 1, w: 2, h: 1 },
  ],
} as const

async function main() {
  await prisma.profile.upsert({
    where: { id: 'family' },
    update: {},
    create: { id: 'family', name: 'Family', tier: 1, avatarUrl: null },
  })

  await prisma.profile.upsert({
    where: { id: 'seed-parent-1' },
    update: {},
    create: { id: 'seed-parent-1', name: 'Parent', tier: 4, avatarUrl: null },
  })

  await prisma.profile.upsert({
    where: { id: 'seed-child-1' },
    update: {},
    create: { id: 'seed-child-1', name: 'Child', tier: 1, avatarUrl: null },
  })

  for (const [key, value] of Object.entries(DEFAULT_LAYOUTS)) {
    await prisma.systemConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  console.log('Seeded: profiles, default widget layouts')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
