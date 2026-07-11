import { FAMILY_PROFILE_ID } from '@family-os/platform/types'

/** Elevation-ladder rung a slot renders at (design-system.md §Widget prominence).
    Exactly one `feature` per default layout. */
export type Prominence = 'feature' | 'card' | 'quiet'

export type LayoutDefault = {
  widgetId: string
  x: number
  y: number
  w: number
  h: number
  prominence: Prominence
}

/* The seeded default home layouts. Prominence expresses the ADR 028 tier-dominance
   that size alone used to carry — one widget features per profile, re-ranked by who's
   looking. The `prominence` field is the resolution of the widget-prominence owed ADR
   (ADR 039): it lives on the layout composition, not the widget manifest, because the
   same widget features for one profile and recedes for another. */
export const DEFAULT_LAYOUTS: Record<string, LayoutDefault[]> = {
  // Unattended family wall — the feed leads as a full-width banner (read across a
  // room); chores + calendar rest as equal peers beneath.
  default_layout_family: [
    { widgetId: 'family-feed.feed', x: 0, y: 0, w: 4, h: 1, prominence: 'feature' },
    { widgetId: 'chores.today-summary', x: 0, y: 1, w: 2, h: 1, prominence: 'card' },
    { widgetId: 'calendar.up-next', x: 2, y: 1, w: 2, h: 1, prominence: 'card' },
  ],
  // Kids — the day's chores are the primary action (feature); calendar rests, feed recedes.
  default_layout_tier_1_2: [
    { widgetId: 'chores.today-summary', x: 0, y: 0, w: 2, h: 2, prominence: 'feature' },
    { widgetId: 'calendar.up-next', x: 2, y: 0, w: 2, h: 1, prominence: 'card' },
    { widgetId: 'family-feed.feed', x: 2, y: 1, w: 2, h: 1, prominence: 'quiet' },
  ],
  // Parents / teens — scheduling leads (feature); chores rests, feed recedes.
  default_layout_tier_3_4: [
    { widgetId: 'calendar.up-next', x: 0, y: 0, w: 2, h: 2, prominence: 'feature' },
    { widgetId: 'chores.today-summary', x: 2, y: 0, w: 2, h: 1, prominence: 'card' },
    { widgetId: 'family-feed.feed', x: 2, y: 1, w: 2, h: 1, prominence: 'quiet' },
  ],
}

export function defaultLayoutKey(profileId: string, tier: number): string {
  if (profileId === FAMILY_PROFILE_ID) return 'default_layout_family'
  if (tier <= 2) return 'default_layout_tier_1_2'
  return 'default_layout_tier_3_4'
}

/** The rung for a widget in a given default layout; `card` if unmapped so an
    unknown/added widget never renders as a broken flat slot. */
export function prominenceFor(key: string, widgetId: string): Prominence {
  return DEFAULT_LAYOUTS[key]?.find((d) => d.widgetId === widgetId)?.prominence ?? 'card'
}
