export type TierLevel = 1 | 2 | 3 | 4

/** The reserved id of the "family" pseudo-profile — the unattended family
    dashboard (tier 1, read-only; ADR 021). It's not an assignable person, so
    rosters filter it out. Centralized here (React-free, imported by both the
    plugins/shell and the API) — was previously redefined per file. */
export const FAMILY_PROFILE_ID = 'family'

export type EventName = `${string}.${string}.${string}`

export type BusMessage = { event: EventName; payload: unknown }

export type EventBus = {
  emit(event: EventName, payload: unknown): void
  on(event: EventName, handler: (payload: unknown) => void): () => void
  onAny(handler: (message: BusMessage) => void): () => void
}

export type Profile = {
  id: string
  name: string
  tier: TierLevel
  avatarUrl?: string
  /** The member's assigned identity colour (ADR 044). Null only while unassigned —
      callers fall back to the name hash via `resolveHue`. */
  identityHue?: string | null
  darkMode?: boolean | null
  /** Taskee surface variant. null = derive from tier; true/false = parent override. */
  focusMode?: boolean | null
  pushEnabled?: boolean
}

/** Resolve the effective Focus-mode setting for a profile. The stored value is a
    nullable override: null defers to the tier default (tiers 1–2 → Focus on;
    decided in M2 Dev: Focus Mode, 2026-06-20), true/false is a parent override. */
export function resolveFocusMode(focusMode: boolean | null | undefined, tier: number): boolean {
  return focusMode ?? tier <= 2
}

export type PermissionOverride = {
  id: string
  profileId: string
  action: string
  subject: string
  type: 'grant' | 'revocation'
  grantedBy?: string
}

export type NotifyVariant = 'success' | 'info' | 'warning' | 'error'

export type NotifyPayload = {
  title: string
  body?: string
  variant: NotifyVariant
  priority?: 'info' | 'alert'
  actions?: Array<{ label: string; href: string }>
}

export type NotificationRecord = {
  id: string
  title: string
  body?: string | null
  variant: NotifyVariant
  priority: string
  isRead: boolean
  createdAt: string
}

export const PERMISSION_REGISTRY = {
  'platform.profile.view': {
    label: 'View profiles',
    module: 'platform',
    action: 'view',
    subject: 'platform.Profile',
  },
  'platform.profile.switch': {
    label: 'Switch active profile',
    module: 'platform',
    action: 'switch',
    subject: 'platform.Profile',
  },
  'platform.plugin.view': {
    label: 'Use plugins',
    module: 'platform',
    action: 'view',
    subject: 'platform.Plugin',
  },
  // Baseline for every tier (ADR 042). Surfaced here so a parent can revoke it for
  // one profile through the existing override UI.
  'platform.profile.avatar': {
    label: 'Change own profile photo',
    module: 'platform',
    action: 'update',
    subject: 'platform.Avatar',
  },
  // Baseline for every tier (ADR 044), on the same argument as the photo above:
  // choosing your own colour is not administration. Tier 4 may change anyone's.
  'platform.profile.color': {
    label: 'Change own colour',
    module: 'platform',
    action: 'update',
    subject: 'platform.Color',
  },
  // Baseline for every tier (ADR 046). Surfaced here so a parent can revoke it for one
  // profile through the existing override UI — the escape hatch for a kid who discovers
  // that the report button is fun to press.
  'platform.bug-report.create': {
    label: 'Report a problem',
    module: 'platform',
    action: 'create',
    subject: 'platform.BugReport',
  },
  'family-feed.post.create': {
    label: 'Post to family feed',
    module: 'family-feed',
    action: 'create',
    subject: 'family-feed.Post',
  },
  'chores.task.view': {
    label: 'View chores',
    module: 'chores',
    action: 'view',
    subject: 'chores.Task',
  },
  'chores.task.create': {
    label: 'Create and assign chores',
    module: 'chores',
    action: 'create',
    subject: 'chores.Task',
  },
  'chores.task.complete': {
    label: 'Complete chores',
    module: 'chores',
    action: 'complete',
    subject: 'chores.Task',
  },
  // Tier 1 included (ADR 053) — the youngest kid is who the module exists for, and
  // "no financial data" at tier 1 means the household's money (M8), not a kid's own P-Bucks.
  'rewards.wallet.view': {
    label: 'See your own P-Bucks balance',
    module: 'rewards',
    action: 'view',
    subject: 'rewards.Wallet',
  },
  'rewards.redemption.create': {
    label: 'Redeem your P-Bucks in the store',
    module: 'rewards',
    action: 'create',
    subject: 'rewards.Redemption',
  },
  'rewards.card.punch': {
    label: 'Punch your own punch cards',
    module: 'rewards',
    action: 'punch',
    subject: 'rewards.PunchCard',
  },
  'calendar.event.view': {
    label: 'View the calendar',
    module: 'calendar',
    action: 'view',
    subject: 'calendar.Event',
  },
  'calendar.event.create': {
    label: 'Create and edit events',
    module: 'calendar',
    action: 'create',
    subject: 'calendar.Event',
  },
  'meals.plan.view': {
    label: 'View the meal plan',
    module: 'meals',
    action: 'view',
    subject: 'meals.PlannedMeal',
  },
  'meals.dinner.claim': {
    label: "Claim tonight's dinner",
    module: 'meals',
    action: 'update',
    subject: 'meals.PlannedMeal',
  },
  // A list is its own subject (ADR 067, renamespaced by 069) — creating one
  // commits the household to a trip, unlike adding an item to one already
  // planned. Baseline tier 4 via `manage all`.
  'shopping.list.create': {
    label: 'Create a shopping list',
    module: 'shopping',
    action: 'create',
    subject: 'shopping.List',
  },
  'shopping.item.view': {
    label: 'See the shopping lists',
    module: 'shopping',
    action: 'view',
    subject: 'shopping.Item',
  },
  'shopping.item.add': {
    label: 'Add to a shopping list',
    module: 'shopping',
    action: 'create',
    subject: 'shopping.Item',
  },
  // A toggle, not a one-way door (ADR 071) — unchecking is the same key,
  // because the person who mis-taps is in an aisle, one-handed, maybe offline.
  'shopping.item.check': {
    label: 'Check things off the shopping list',
    module: 'shopping',
    action: 'check',
    subject: 'shopping.Item',
  },
  // The aisle correction: it does not fix one row, it rewrites how every
  // future add of that name files itself for the whole household. Its own
  // action rather than `manage` (ADR 071) so granting it to a shopping teen
  // does not also grant delete and rename.
  'shopping.item.file': {
    label: 'Correct which aisle an item files under',
    module: 'shopping',
    action: 'file',
    subject: 'shopping.Item',
  },
  'shopping.item.manage': {
    label: 'Edit and remove items on a shopping list',
    module: 'shopping',
    action: 'manage',
    subject: 'shopping.Item',
  },
} as const

export type PermissionString = keyof typeof PERMISSION_REGISTRY

export type RegistryEntry = {
  name: string
  baseUrl: string
}

/** A read-time day mark (ADR 050) — a date-scoped fact a plugin contributes to the
 *  calendar without writing `calendar.Event`. No start time, no duration, no span:
 *  anything needing one of those is an event. `ownerId` is optional at the type
 *  level (a fact can belong to no one — "no school Monday"), but an owner-bearing
 *  mark is never hue-only (ADR 044) — the month cell pairs it with the owner's
 *  initial, so a provider that has an owner must send one. */
export type DayMark = {
  /** `YYYY-MM-DD`, local to the household. */
  date: string
  ownerId?: string | null
  /** An icon name the calendar resolves to a component — never a React node, so
   *  the payload stays JSON over the wire. `plugins/calendar` owns the name→icon
   *  map; a provider names a glyph, it never reaches into the calendar's render. */
  glyph: string
  /** The agenda day header's copy, in the provider's own voice (e.g. "Zach's got
   *  dinner"). The month cell never renders it — that surface carries only the
   *  disc + glyph (ADR 050). */
  label: string
}

export type NavItemManifest = {
  label: string
  route: string
  icon: string // lucide-react icon name, e.g. "rss" — resolved to a component by the shell
  minTier?: TierLevel
}

export type PluginManifest = {
  name: string
  version: string
  remoteEntry: string
  exposes: string[]
  routes: string[]
  schema: string
  events: {
    publishes: EventName[]
    subscribes: EventName[]
  }
  widgets?: unknown[] // typed WidgetManifest added by M1 widget system story (ADR 022)
  navItem?: NavItemManifest // ADR 032 — one sidebar nav entry per plugin
}

/* The home dashboard's default composition (geometry + elevation rung). Re-exported
   here so the API, the shell and the Prisma seed all reach ONE definition — a second
   hand-maintained copy in the seed is what let the two drift apart. */
export {
  DEFAULT_LAYOUTS,
  defaultLayoutKey,
  prominenceFor,
  type LayoutDefault,
  type Prominence,
} from './home-layout'
