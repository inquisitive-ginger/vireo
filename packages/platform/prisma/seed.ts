import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'
import { DEFAULT_LAYOUTS } from '../src/home-layout'

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos',
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/* The widget layouts come from `src/home-layout.ts` — the one definition, shared with
   the API and the shell. This file used to keep its own hand-maintained copy, and it
   drifted: the composition was re-ranked (chores above feed) in the API's copy only,
   so a seeded database served the old geometry under the new elevation rungs. Never
   re-declare the layouts here. */

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

  // Geometry only — `prominence` is derived on read from the composition, never
  // stored, so it can't drift out of sync with the code (ADR 039).
  for (const [key, items] of Object.entries(DEFAULT_LAYOUTS)) {
    const value = items.map(({ widgetId, x, y, w, h }) => ({ widgetId, x, y, w, h }))
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
