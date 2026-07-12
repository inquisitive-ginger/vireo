/* The member identity palette — the canonical list (ADR 044).
 *
 * It lives HERE, not in `@family-os/ui`, because it is a shared contract rather than
 * a styling detail: the API allocates and validates hues, and the UI paints them. Both
 * `@family-os/ui` (which re-exports it) and `apps/api` depend on this package, and it
 * is the only leaf they share. Two copies of this list would drift, and this is the one
 * list that must not — a hue the API can hand out but the UI cannot paint is a member
 * with no colour.
 *
 * Deliberately free of any `zod` import so `@family-os/ui` can take it without pulling
 * the validation graph into the design system.
 *
 * Order is meaningful: `nextFreeHue` walks it, so it is the auto-assignment order. */

export const IDENTITY_HUES = [
  'terracotta',
  'marigold',
  'moss',
  'sage',
  'teal',
  'sky',
  'indigo',
  'plum',
] as const

export type IdentityHue = (typeof IDENTITY_HUES)[number]

/** The household's own hue — Hearth (ADR 041). RESERVED: it carries the same three
    layers as a member hue but is deliberately NOT in `IDENTITY_HUES`, so it can never
    be assigned to a person. "Family" is a who, not the absence of one. */
export const FAMILY_HUE = 'family' as const

/** Any owner a surface can be painted for: a member's hue, or the household. */
export type OwnerHue = IdentityHue | typeof FAMILY_HUE

export function isIdentityHue(value: unknown): value is IdentityHue {
  return typeof value === 'string' && (IDENTITY_HUES as readonly string[]).includes(value)
}

/** The next hue nobody holds, in palette order — the auto-assignment rule.
 *
 * Returns `null` when the palette is exhausted. A household cannot grow past
 * `IDENTITY_HUES.length` while hues stay unique, and handing out a duplicate is worse
 * than handing out nothing: a shared hue does not degrade "colour = person", it points
 * the mapping at two people at once. Callers must SAY the palette is full. */
export function nextFreeHue(taken: Iterable<string | null | undefined>): IdentityHue | null {
  const used = new Set(taken)
  return IDENTITY_HUES.find((hue) => !used.has(hue)) ?? null
}
