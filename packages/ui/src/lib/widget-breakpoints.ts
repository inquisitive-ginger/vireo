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
