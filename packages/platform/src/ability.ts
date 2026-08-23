import { AbilityBuilder } from '@casl/ability'
import { createPrismaAbility, type PrismaAbility } from '@casl/prisma'
import type { Profile, PermissionOverride } from './types'

// Subjects are namespaced strings per ADR 018.
// 'all' is CASL's wildcard subject, used by the manage rule for tier-4.
type Actions =
  | 'view'
  | 'switch'
  | 'create'
  | 'update'
  | 'delete'
  | 'complete'
  | 'reopen'
  | 'decide'
  | 'punch'
  | 'check'
  | 'manage'
type Subjects =
  | 'platform.Profile'
  | 'platform.Plugin'
  | 'platform.Avatar'
  | 'platform.Color'
  | 'platform.BugReport'
  | 'family-feed.Post'
  | 'chores.Task'
  | 'calendar.Event'
  | 'rewards.Wallet'
  | 'rewards.Payout'
  | 'rewards.Reward'
  | 'rewards.Redemption'
  | 'rewards.PunchCard'
  | 'rewards.Grant'
  | 'meals.PlannedMeal'
  | 'meals.GroceryItem'
  | 'all'

export type AppAbility = PrismaAbility<[Actions, Subjects]>

export function createAbility(profile: Profile, overrides: PermissionOverride[]): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility)

  // Every profile can complete its OWN assigned task (row-level). Reopening
  // (un-completing) is a tier-4 power, granted via `manage all` below — a kid
  // cannot reverse their own completion.
  can('complete', 'chores.Task', { assigneeId: profile.id })

  // Every profile can change its OWN photo (ADR 042) — choosing your own face is
  // not administration. Tier 4 changes anyone's via `manage all`. A parent revokes
  // this per-profile through the existing override system if a kid abuses it.
  // The row condition is enforced explicitly in the route (see chores.Task below).
  can('update', 'platform.Avatar', { id: profile.id })

  // ...and its OWN colour (ADR 044), on exactly the same argument. Note that unlike a
  // photo, a colour is UNIQUE across the family, so this grant lets a kid take a hue
  // nobody else holds — never one already spoken for (the route 409s).
  can('update', 'platform.Color', { id: profile.id })

  // Reporting a problem is granted to EVERY tier, tier 1 included (ADR 046) — the
  // youngest user is the likeliest to hit a rough edge and the least able to route
  // around it, so gating this at tier 2 would silence exactly the reports worth having.
  // Triage (viewing everyone's, moving a status) is tier-4, via `manage all` below.
  can('create', 'platform.BugReport')

  // Every profile reaches its OWN wallet, tier 1 included (ADR 053) — the module
  // exists for the youngest kid, and granting the capability while withholding the
  // surface is ADR 044's failure repeated. Tier 4 reads anyone's via `manage all`;
  // a wallet is not a leaderboard, so nobody else does. Row condition enforced in the route.
  can('view', 'rewards.Wallet', { profileId: profile.id })

  // Every profile redeems from the store for ITSELF (ADR 053) — spending your own P-Bucks
  // is the point of the module, not administration. Tier 4 decides (grant/decline) and
  // manages the catalog via `manage all`; a kid never approves its own request. Row
  // condition enforced in the route.
  can('create', 'rewards.Redemption', { profileId: profile.id })

  // The kid punches their OWN card (ADR 049) — the joy of the paper sheet is drawing
  // the check, so taking the punch and handing it to an adult would gut the feature.
  // Tier 4 undoes (and can punch anyone's) via `manage all`. Row condition enforced
  // in the route.
  can('punch', 'rewards.PunchCard', { profileId: profile.id })

  // Calendar is one shared family surface — every tier reads it (tier-4 creates/
  // edits/deletes via `manage all`). The view grant is duplicated across the
  // lower-tier branches below, like chores.
  if (profile.tier >= 4) {
    can('manage', 'all')
  } else if (profile.tier >= 3) {
    can('view', 'platform.Plugin')
    can('switch', 'platform.Profile')
    can('create', 'family-feed.Post')
    can('view', 'chores.Task')
    can('view', 'calendar.Event')
    can('view', 'meals.PlannedMeal')
    // Claiming an unclaimed dinner (spec.md: tier 3+). `update` is the capability;
    // the route narrows it to claim-only — full edits stay behind `manage`.
    can('update', 'meals.PlannedMeal')
    can('view', 'meals.GroceryItem')
    can('create', 'meals.GroceryItem')
    can('check', 'meals.GroceryItem')
  } else if (profile.tier >= 2) {
    can('view', 'platform.Plugin')
    can('create', 'family-feed.Post')
    can('view', 'chores.Task')
    can('view', 'calendar.Event')
    can('view', 'meals.PlannedMeal')
    can('view', 'meals.GroceryItem')
    can('create', 'meals.GroceryItem')
    can('check', 'meals.GroceryItem')
  } else {
    can('view', 'platform.Plugin')
    can('view', 'chores.Task')
    can('view', 'calendar.Event')
    can('view', 'meals.PlannedMeal')
    // Tier 1+ adds to the grocery list (spec.md §Permissions) — deliberate,
    // low-stakes participation; checking items off stays tier 2+.
    can('view', 'meals.GroceryItem')
    can('create', 'meals.GroceryItem')
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
