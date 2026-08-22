/* Member identity colors — EIGHT fixed hues harmonized with the Olive & Teal
   palette (ADR 044, primary re-cut in ADR 065). A member's hue is ASSIGNED and persisted (`Profile.identityHue`),
   unique across the family; the name hash below survives only as a FALLBACK, for a
   profile that has not been assigned one yet.

   The palette itself lives in `@family-os/schemas` — the API allocates and validates
   hues, this package paints them, and that is the only leaf both can import. Keeping a
   second copy here would let the two drift, and a hue the API can hand out but the UI
   cannot paint is a member with no colour. Everything below is the PAINTING half.

   Layers per hue (CSS custom properties, light + dark aware):
     --identity-{hue}        base — spines, rings, markers
     --identity-{hue}-tint   tint — fills, avatar fill, soft backgrounds
     --identity-{hue}-ink    ink  — text on tint (initials)

   Judge a colour on the layer that renders it (ADR 041). Hues are quoted at `base`,
   but the calendar's month grid — the surface where colour does the most work —
   renders at `tint`, where everything is already desaturated.

   Colour is the PRIMARY identity channel, not the ONLY one (ADR 044 amends ADR 030).
   Eight nameable hues do not fit in the ~305° left once red is reserved for --error,
   so two pairs collide under red-green colour-blindness — which roughly 1 in 12 men
   have. Any surface where the hue is the only thing telling two people apart owes a
   second channel: the calendar chip carries its owner's initial. */

import {
  FAMILY_HUE,
  IDENTITY_HUES,
  isIdentityHue,
  nextFreeHue,
  type IdentityHue,
  type OwnerHue,
} from '@family-os/schemas/identity'

export { FAMILY_HUE, IDENTITY_HUES, isIdentityHue, nextFreeHue }
export type { IdentityHue, OwnerHue }

export type IdentityLayer = 'base' | 'tint' | 'ink'

function hashName(name: string): number {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

/** FALLBACK ONLY — prefer a profile's assigned `identityHue`, via `resolveHue`.
 *
 * This hashes a name into the palette for a profile that has none yet. It cannot be
 * the source of truth, for two reasons (ADR 044, and both were live bugs):
 *   · It COLLIDES. Eight buckets, so two members can hash to the same hue — "Zach" and
 *     "Emma" both landed on terracotta. A shared hue does not degrade "colour = person",
 *     it points the mapping at two people at once.
 *   · A RENAME silently re-colours somebody everywhere, because the hue is derived from
 *     the name.
 * Never returns `family` — that entry is reserved for the household. */
export function getIdentityHue(name: string): IdentityHue {
  return IDENTITY_HUES[hashName(name) % IDENTITY_HUES.length]
}

/** The hue a member is painted in: the one they were assigned, or the name hash while
    they have none. The single place a caller resolves "which hue is this person". */
export function resolveHue(name: string, assigned?: string | null): IdentityHue {
  return isIdentityHue(assigned) ? assigned : getIdentityHue(name)
}

/** Returns a `var(--identity-…)` reference for an explicit owner and layer.
    Accepts `family` — the household resolves through exactly the same path a
    member does, so callers stop special-casing "no owner". */
export function identityToken(hue: OwnerHue, layer: IdentityLayer = 'base'): string {
  return layer === 'base' ? `var(--identity-${hue})` : `var(--identity-${hue}-${layer})`
}

/** Returns a `var(--identity-…)` reference for a NAME. Hashes, so it collides and
    moves on rename — prefer `identityToken(resolveHue(name, profile.identityHue))`
    wherever the profile is in hand. */
export function identityColor(name: string, layer: IdentityLayer = 'base'): string {
  return identityToken(getIdentityHue(name), layer)
}
