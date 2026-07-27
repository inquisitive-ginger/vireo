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

  // Starter reward catalog (M4/5) — DEV SEED ONLY (spec §Seed catalog). A fresh family
  // gets these nine to edit or retire; prod is seeded separately. Written as raw SQL
  // against the `rewards` schema on purpose: the platform seed must not import the
  // rewards plugin, which already depends on @family-os/platform (that edge would cycle).
  // `id`/`created_by` are UUID with no DB default, so gen_random_uuid() supplies them
  // (created_by is unused on read — serializeReward omits it); `audience` is an EMPTY
  // array, never NULL, because the serializers call `.length` on it.
  const [{ count }] = await prisma.$queryRaw<
    { count: number }[]
  >`SELECT count(*)::int AS count FROM rewards.rewards`
  if (count === 0) {
    const catalog: [string, string, string, number, boolean][] = [
      ['Pick the car music', '🎧', 'Your tunes for the whole ride', 5, false],
      ['Extra 30 min screen', '🎮', 'A little more play time', 10, false],
      ['Stay up 30 min late', '🌙', 'Lights out, but later', 10, false],
      ['Bake something', '🍪', 'Pick a treat and make it', 10, false],
      ['Movie night', '🍿', 'You choose the film', 15, false],
      ["Pick Friday's dinner", '🍗', 'Friday night is yours', 15, false],
      ['Ice cream run', '🍦', 'A trip out for a cone', 25, true],
      ['Day out / adventure', '🎡', 'A day out, your idea', 40, true],
      ['Yes day', '👑', 'A day the answer is yes', 40, true],
    ]
    for (const [name, emoji, description, cost, approval] of catalog) {
      await prisma.$executeRaw`
        INSERT INTO rewards.rewards
          (id, name, emoji, description, cost, requires_approval, audience, active, created_by)
        VALUES
          (gen_random_uuid(), ${name}, ${emoji}, ${description}, ${cost}, ${approval},
           ARRAY[]::uuid[], true, gen_random_uuid())`
    }
    console.log(`Seeded: ${catalog.length} starter rewards`)
  } else {
    console.log('Rewards catalog already has rows — skipping starter seed')
  }

  console.log('Seeded: profiles, default widget layouts')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
