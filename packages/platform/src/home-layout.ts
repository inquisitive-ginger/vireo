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
  /* Kids (and teens below) rank by what a kid actually opens the app for:
     wallet > chores > feed = calendar = meals. The wallet leads by position and
     its feature elevation, chores beside it as the way to fill it; the calendar
     takes the 2×2 under the wallet and the quiet peers stack the right column
     (auto-bug #118, gated 2026-08-20 — the old paired grid left an empty slot
     beside meals on any desktop-width screen). Chores stays atop the right
     column, not meals as reported: the kid ranking and the column's elevation
     order both put the card above the quiet rungs. */
  default_layout_tier_1_2: [
    { widgetId: 'rewards.wallet', x: 0, y: 0, w: 2, h: 1, prominence: 'feature' },
    { widgetId: 'calendar.up-next', x: 0, y: 1, w: 2, h: 2, prominence: 'quiet' },
    { widgetId: 'chores.today-summary', x: 2, y: 0, w: 2, h: 1, prominence: 'card' },
    { widgetId: 'meals.tonight', x: 2, y: 1, w: 2, h: 1, prominence: 'quiet' },
    { widgetId: 'family-feed.feed', x: 2, y: 2, w: 2, h: 1, prominence: 'quiet' },
  ],
  /* Teens — the same kid grid, one register down: no feature (a teen's surface
     declines to shout, same as the parent's), so the wallet leads by position, not
     elevation. */
  default_layout_tier_3: [
    { widgetId: 'rewards.wallet', x: 0, y: 0, w: 2, h: 1, prominence: 'card' },
    { widgetId: 'calendar.up-next', x: 0, y: 1, w: 2, h: 2, prominence: 'quiet' },
    { widgetId: 'chores.today-summary', x: 2, y: 0, w: 2, h: 1, prominence: 'card' },
    { widgetId: 'meals.tonight', x: 2, y: 1, w: 2, h: 1, prominence: 'quiet' },
    { widgetId: 'family-feed.feed', x: 2, y: 2, w: 2, h: 1, prominence: 'quiet' },
  ],
  /* Parents / the family pseudo-profile — NO feature (ADR 039, amended). A parent
     (or the unattended fridge tablet, sitting on the family profile) triages, and
     the calendar, the chores and the feed are all live answers to "what needs me" —
     there is no one thing they came for. The calendar still leads by size and
     position (the 2×2, the first column); elevation just declines to overstate a
     dominance this surface doesn't have. (The key name predates the tier-3 split —
     it stays because deployed `system_config` overrides are looked up by it.) */
  default_layout_tier_3_4: [
    { widgetId: 'calendar.up-next', x: 0, y: 0, w: 2, h: 4, prominence: 'card' },
    /* Tonight's dinner (M5/2) — card, leading the right column at 2×2 (live
       review, 2026-08-12; reaffirmed 2026-08-20, auto-bug #116). h=2 is the
       geometry that GUARANTEES the NEXT UP lookahead: rows floor at 180px, so
       this slot is never shorter than 376px, which always fits the headline
       plus at least one lookahead row — an h=1 slot can land at heights where
       the large variant fits none. The #116 crop itself was the widgets not
       clamping (fixed in the views), not this split; chores and feed render
       whole rows and state the remainder at any height a 2×1 deals them. */
    { widgetId: 'meals.tonight', x: 2, y: 0, w: 2, h: 2, prominence: 'card' },
    { widgetId: 'chores.today-summary', x: 2, y: 2, w: 2, h: 1, prominence: 'card' },
    { widgetId: 'family-feed.feed', x: 2, y: 3, w: 2, h: 1, prominence: 'quiet' },
  ],
}

export function defaultLayoutKey(profileId: string, tier: number): string {
  if (profileId === FAMILY_PROFILE_ID) return 'default_layout_tier_3_4'
  if (tier <= 2) return 'default_layout_tier_1_2'
  if (tier === 3) return 'default_layout_tier_3'
  return 'default_layout_tier_3_4'
}

/** The rung for a widget in a given default layout; `card` if unmapped so an
    unknown/added widget never renders as a broken flat slot. */
export function prominenceFor(key: string, widgetId: string): Prominence {
  return DEFAULT_LAYOUTS[key]?.find((d) => d.widgetId === widgetId)?.prominence ?? 'card'
}
