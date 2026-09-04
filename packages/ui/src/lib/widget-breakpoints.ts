/* Container-query thresholds shared by the density-toggling home widgets (chores
   today-summary, calendar up-next, family-feed). Each widget ships every variant's
   markup and lets CSS reveal the one that fits its rendered box; the magic numbers
   live here so the widgets agree on where the breaks fall. */
export const WIDGET_CQ = {
  /** At/above this height a slot is "tall" → the large (multi / stacked) variant. */
  tallMinHeight: '300px',
  /** A "wide-and-short" slot (≥ this width and ≤ `shortMaxHeight`) → the two-column
   *  standard variant. */
  wideMinWidth: '440px',
  shortMaxHeight: '299px',
} as const

/* The widget inset, scaled to the slot (design-system.md §Spacing). `WidgetSlot`
   contributes no padding of its own — it is chrome (radius, fill, shadow) only —
   so each widget owns its inset, and they must agree or the home surface reads as
   ragged.

   One value cannot serve every slot: a 1×1 has ~148px of content height at 16px
   padding, so the 24px that gives the 2×2 feature tile room to breathe would eat
   an eighth of the small tile. The scale therefore tracks the size variant, on the
   base-4 rhythm.

   A full-bleed child (the calendar's "all week" groove) must negate the matching
   value — `-mx-6` under `large`. */
export const WIDGET_INSET = {
  compact: 'p-4', // 16px — the 1×1 cannot afford more
  standard: 'p-5', // 20px
  large: 'p-6', // 24px — the feature rung
} as const
