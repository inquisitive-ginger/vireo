/**
 * db:reset — wipes all non-family data and returns the system to zero state.
 * Safe to run any time during development. Preserves default widget layouts.
 *
 * Usage:
 *   pnpm db:reset                             # platform core only
 *   pnpm db:reset --module family-feed        # platform + named plugin
 *   pnpm db:reset --module chore-engine       # platform + named plugin
 *   pnpm db:reset --all                       # platform + all known plugins
 *   pnpm db:reset --only --module family-feed # named plugin only, skip platform
 *   pnpm db:reset --only --all                # all plugins only, skip platform
 */

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'

const KNOWN_MODULES = ['family-feed', 'chore-engine'] as const
type Module = (typeof KNOWN_MODULES)[number]

function parseArgs(): { modules: Set<Module>; platformOnly: boolean } {
  const args = process.argv.slice(2)
  const only = args.includes('--only')
  if (args.includes('--all')) return { modules: new Set(KNOWN_MODULES), platformOnly: false }
  const modules = new Set<Module>()
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--module' && args[i + 1]) {
      const name = args[i + 1] as Module
      if (!KNOWN_MODULES.includes(name)) {
        console.error(`Unknown module: "${name}". Known modules: ${KNOWN_MODULES.join(', ')}`)
        process.exit(1)
      }
      modules.add(name)
      i++
    }
  }
  if (only && modules.size === 0) {
    console.error('--only requires --module <name> or --all')
    process.exit(1)
  }
  return { modules, platformOnly: only }
}

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos',
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function resetPlatform() {
  await prisma.session.deleteMany()
  await prisma.pushSubscription.deleteMany()
  await prisma.notification.deleteMany()
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
}

async function resetFamilyFeed() {
  await pool.query('DELETE FROM family_feed.posts')
}

async function resetChoreEngine() {
  await pool.query('DELETE FROM chore_engine.tasks')
}

async function main() {
  const { modules, platformOnly } = parseArgs()

  const parts = [...(!platformOnly ? ['platform'] : []), ...[...modules]]
  console.log(`Resetting ${parts.join(', ')} to zero state...`)

  if (!platformOnly) await resetPlatform()

  if (modules.has('family-feed')) {
    await resetFamilyFeed()
    console.log('  family-feed: posts cleared')
  }

  if (modules.has('chore-engine')) {
    await resetChoreEngine()
    console.log('  chore-engine: tasks cleared')
  }

  console.log('Done. Navigate to / to start onboarding.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
