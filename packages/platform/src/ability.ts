import { AbilityBuilder } from '@casl/ability'
import { createPrismaAbility, type PrismaAbility } from '@casl/prisma'
import type { Profile, PermissionOverride } from './types'

// Subjects are namespaced strings per ADR 018.
// 'all' is CASL's wildcard subject, used by the manage rule for tier-4.
type Actions = 'view' | 'switch' | 'create' | 'complete' | 'manage'
type Subjects = 'platform.Profile' | 'platform.Plugin' | 'family-feed.Post' | 'chores.Task' | 'all'

export type AppAbility = PrismaAbility<[Actions, Subjects]>

export function createAbility(profile: Profile, overrides: PermissionOverride[]): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility)

  if (profile.tier >= 4) {
    can('manage', 'all')
  } else if (profile.tier >= 3) {
    can('view', 'platform.Plugin')
    can('switch', 'platform.Profile')
    can('create', 'family-feed.Post')
    can('view', 'chores.Task')
  } else if (profile.tier >= 2) {
    can('view', 'platform.Plugin')
    can('create', 'family-feed.Post')
    can('view', 'chores.Task')
  } else {
    can('view', 'platform.Plugin')
    can('view', 'chores.Task')
  }

  for (const override of overrides) {
    if (override.type === 'grant') {
      can(override.action as Actions, override.subject as Subjects)
    } else {
      cannot(override.action as Actions, override.subject as Subjects)
    }
  }

  return build()
}
