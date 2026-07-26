import { FAMILY_PROFILE_ID } from './types'

/* THE HOME DASHBOARD COMPOSITION — the one definition.

   This lived in `apps/api/src/lib/default-layouts.ts` while the seed
   (`prisma/seed.ts`) kept a second, hand-maintained copy. The two drifted: the
   elevation-ladder session re-ranked the tier-3/4 and tier-1/2 right column
   (chores above feed) in the API's copy and not the seed's, so a freshly seeded
   database served the OLD geometry with the NEW prominence — a `quiet` widget
   sitting above a `card` one. React-free, so the seed, the API and the shell can
   all import it. Do not re-declare these anywhere. */

/** Elevation-ladder rung a slot renders at (design-system.md §Widget prominence).
    **At most one** `feature` per default layout — a surface may have none (ADR 039,
    amended 2026-07-11). */
export type Prominence = 'feature' | 'card' | 'quiet'

export type LayoutDefault = {
  widgetId: string
  x: number
  y: number
  w: number
  h: number
  prominence: Prominence
}

/* Prominence expresses the ADR 028 tier-dominance that size alone used to carry —
   one widget features per profile, re-ranked by who's looking (ADR 039). It lives
   on the layout composition, not the widget manifest, because the same widget
   features for one profile and recedes for another.

   READING ORDER IS PART OF THE RANK. Within a column, the higher-rung widget sits
   above the lower one — a `quiet` widget above a `card` one reads as a mistake,
   because elevation and position are both saying "how much does this matter" and
   they must not disagree. */
export const DEFAULT_LAYOUTS: Record<string, LayoutDefault[]> = {
  // Unattended family wall — the feed leads as a full-width banner (read across a
  // room); chores + calendar rest as equal peers beneath.
  default_layout_family: [
    { widgetId: 'family-feed.feed', x: 0, y: 0, w: 4, h: 1, prominence: 'feature' },
    { widgetId: 'chores.today-summary', x: 0, y: 1, w: 2, h: 1, prominence: 'card' },
    { widgetId: 'calendar.up-next', x: 2, y: 1, w: 2, h: 1, prominence: 'card' },
  ],
  /* Kids (and teens below) rank by what a kid actually opens the app for:
     wallet > chores > feed = calendar. The wallet is the payoff and features;
     chores stand tall beside it as the way to fill it; calendar and feed rest
     as equal quiet peers on the bottom row. */
  default_layout_tier_1_2: [
    { widgetId: 'rewards.wallet', x: 0, y: 0, w: 2, h: 2, prominence: 'feature' },
    { widgetId: 'chores.today-summary', x: 2, y: 0, w: 2, h: 2, prominence: 'card' },
    { widgetId: 'calendar.up-next', x: 0, y: 2, w: 2, h: 1, prominence: 'quiet' },
    { widgetId: 'family-feed.feed', x: 2, y: 2, w: 2, h: 1, prominence: 'quiet' },
  ],
  /* Teens — the same kid ranking, one register down: no feature (a teen's surface
     declines to shout, same as the parent's), so the wallet leads by size and
     position alone. */
  default_layout_tier_3: [
    { widgetId: 'rewards.wallet', x: 0, y: 0, w: 2, h: 2, prominence: 'card' },
    { widgetId: 'chores.today-summary', x: 2, y: 0, w: 2, h: 2, prominence: 'card' },
    { widgetId: 'calendar.up-next', x: 0, y: 2, w: 2, h: 1, prominence: 'quiet' },
    { widgetId: 'family-feed.feed', x: 2, y: 2, w: 2, h: 1, prominence: 'quiet' },
  ],
  /* Parents — NO feature (ADR 039, amended). A parent opens this surface to
     triage, and the calendar, the chores and the feed are all live answers to "what
     needs me" — there is no one thing they came for. The calendar still leads by size
     and position (the 2×2, the first column); elevation just declines to overstate a
     dominance this surface doesn't have. (The key name predates the tier-3 split —
     it stays because deployed `system_config` overrides are looked up by it.) */
  default_layout_tier_3_4: [
    { widgetId: 'calendar.up-next', x: 0, y: 0, w: 2, h: 2, prominence: 'card' },
    { widgetId: 'chores.today-summary', x: 2, y: 0, w: 2, h: 1, prominence: 'card' },
    { widgetId: 'family-feed.feed', x: 2, y: 1, w: 2, h: 1, prominence: 'quiet' },
  ],
}

export function defaultLayoutKey(profileId: string, tier: number): string {
  if (profileId === FAMILY_PROFILE_ID) return 'default_layout_family'
  if (tier <= 2) return 'default_layout_tier_1_2'
  if (tier === 3) return 'default_layout_tier_3'
  return 'default_layout_tier_3_4'
}

/** The rung for a widget in a given default layout; `card` if unmapped so an
    unknown/added widget never renders as a broken flat slot. */
export function prominenceFor(key: string, widgetId: string): Prominence {
  return DEFAULT_LAYOUTS[key]?.find((d) => d.widgetId === widgetId)?.prominence ?? 'card'
}
