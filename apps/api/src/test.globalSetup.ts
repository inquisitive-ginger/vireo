// Fixture provisioning for the API suite (ADR 026/027).
//
// `seed-parent-1` / `seed-child-1` are persistent: every `beforeEach` deletes profiles
// `notIn ['family', 'seed-parent-1', 'seed-child-1']` but nothing recreates them. They
// used to come from `pnpm db:seed`, which made the suite depend on a manual step that
// another suite is free to undo — E2E's `POST /api/dev/reset` deletes every profile but
// `family`, so an E2E run left ~80 API tests failing until someone re-seeded. The suite
// owns its own fixtures instead.

const FALLBACK = 'postgresql://familyos:familyos@localhost:5432/familyos_test'

export async function setup() {
  process.env.DATABASE_URL ??= FALLBACK

  // Same refusal as test.setup.ts — this writes, and it runs before any test file has
  // had the chance to check. See that file for the incident behind it.
  const dbName = process.env.DATABASE_URL.split('/').pop()?.split('?')[0] ?? ''
  if (!/(^|_)test$/.test(dbName)) {
    throw new Error(
      `Refusing to provision test fixtures in non-test database "${dbName}". ` +
        `DATABASE_URL must point at a *_test database (got: ${process.env.DATABASE_URL}).`
    )
  }

  // Imported here, not at module scope: the Prisma singleton reads DATABASE_URL when it
  // is constructed, so the fallback above has to be in place first.
  const { prisma } = await import('@family-os/platform/server')

  const fixtures = [
    { id: 'family', name: 'Family', tier: 1 },
    { id: 'seed-parent-1', name: 'Parent', tier: 4 },
    { id: 'seed-child-1', name: 'Child', tier: 1 },
  ]
  for (const { id, name, tier } of fixtures) {
    await prisma.profile.upsert({
      where: { id },
      update: {},
      create: { id, name, tier, avatarUrl: null },
    })
  }
  await prisma.$disconnect()
}
