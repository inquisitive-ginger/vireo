/**
 * db:reset — wipes all non-family data and returns the system to zero state.
 * Safe to run any time during development. Preserves default widget layouts.
 */

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos',
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Resetting platform to zero state...')

  await prisma.session.deleteMany()
  await prisma.widgetLayout.deleteMany()
  await prisma.permissionOverride.deleteMany()

  // Delete all non-family profiles
  await prisma.profile.deleteMany({ where: { id: { not: 'family' } } })

  // Remove PIN and onboarding progress; preserve default layout seeds
  await prisma.systemConfig.deleteMany({
    where: { key: { in: ['family_pin_hash', 'onboarding_step', 'family_name'] } },
  })

  // Re-seed family pseudo-profile (idempotent)
  await prisma.profile.upsert({
    where: { id: 'family' },
    update: {},
    create: { id: 'family', name: 'Family', tier: 1, avatarUrl: null },
  })

  console.log('Done. Navigate to / to start onboarding.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
