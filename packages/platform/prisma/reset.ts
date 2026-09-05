/**
 * db:reset — wipes all non-family data and returns the system to zero state.
 * Safe to run any time during development. Preserves default widget layouts.
 *
 * DATABASE_URL is required — there is no default. See the note above `connectionString`.
 *
 * Usage (DATABASE_URL=... omitted below for width):
 *   pnpm db:reset                             # platform core only
 *   pnpm db:reset --module family-feed        # platform + named plugin
 *   pnpm db:reset --module chores       # platform + named plugin
 *   pnpm db:reset --all                       # platform + all known plugins
 *   pnpm db:reset --only --module family-feed # named plugin only, skip platform
 *   pnpm db:reset --only --all                # all plugins only, skip platform
 *   pnpm db:reset --all --keep-profiles       # clear content, keep the household
 */

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'

const KNOWN_MODULES = ['family-feed', 'chores', 'calendar', 'rewards', 'meals'] as const
type Module = (typeof KNOWN_MODULES)[number]

type Options = { modules: Set<Module>; platformOnly: boolean; keepProfiles: boolean }

function parseArgs(): Options {
  const args = process.argv.slice(2)
  const only = args.includes('--only')
  const keepProfiles = args.includes('--keep-profiles')
  if (args.includes('--all'))
    return { modules: new Set(KNOWN_MODULES), platformOnly: only, keepProfiles }
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
  return { modules, platformOnly: only, keepProfiles }
}

/* No `?? <dev url>` fallback on purpose. This script deletes every profile, and the
   accident it has to survive is meaning `familyos_test` and forgetting the variable —
   a default would silently substitute the dev database and wipe real member profiles,
   avatars, the PIN and the layouts (it did, 2026-07-13; there are no dumps). Unlike
   apps/api/src/test.setup.ts this cannot demand a *_test name — resetting dev is the
   job — so the target has to be stated instead of validated. */
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error(
    'DATABASE_URL is required — db:reset has no default target and deletes every profile.\n' +
      '  dev:  DATABASE_URL=postgresql://familyos:familyos@localhost:5432/familyos pnpm db:reset\n' +
      '  test: DATABASE_URL=postgresql://familyos:familyos@localhost:5432/familyos_test pnpm db:reset'
  )
  process.exit(1)
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Content the household generated, as opposed to who the household *is*.
async function resetPlatformContent() {
  await prisma.notification.deleteMany()
}

async function resetPlatform() {
  await prisma.session.deleteMany()
  await prisma.pushSubscription.deleteMany()
  await resetPlatformContent()
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
  await pool.query('DELETE FROM chores.tasks')
  await pool.query('DELETE FROM chores.xp_balances')
}

// event_attendees and event_exceptions cascade from events.
async function resetCalendar() {
  await pool.query('DELETE FROM calendar.events')
}

// Balances go with the entries — the cache is meaningless without them.
async function resetRewards() {
  await pool.query('DELETE FROM rewards.ledger_entries')
  await pool.query('DELETE FROM rewards.balances')
}

async function resetMeals() {
  await pool.query('DELETE FROM meals.planned_meals')
}

async function main() {
  const { modules, platformOnly, keepProfiles } = parseArgs()

  const platformLabel = keepProfiles ? 'platform (content only)' : 'platform'
  const parts = [...(!platformOnly ? [platformLabel] : []), ...[...modules]]
  const target = connectionString.split('/').pop()?.split('?')[0]
  console.log(`Resetting ${parts.join(', ')} in "${target}"...`)

  if (!platformOnly) {
    if (keepProfiles) {
      await resetPlatformContent()
      console.log('  platform: notifications cleared (profiles preserved)')
    } else {
      await resetPlatform()
    }
  }

  if (modules.has('family-feed')) {
    await resetFamilyFeed()
    console.log('  family-feed: posts cleared')
  }

  if (modules.has('chores')) {
    await resetChoreEngine()
    console.log('  chores: tasks + XP balances cleared')
  }

  if (modules.has('calendar')) {
    await resetCalendar()
    console.log('  calendar: events cleared')
  }

  if (modules.has('rewards')) {
    await resetRewards()
    console.log('  rewards: ledger + balances cleared')
  }

  if (modules.has('meals')) {
    await resetMeals()
    console.log('  meals: planned meals cleared')
  }

  console.log(keepProfiles ? 'Done.' : 'Done. Navigate to / to start onboarding.')
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
