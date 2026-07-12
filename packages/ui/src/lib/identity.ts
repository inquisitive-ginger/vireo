/* Member identity colors — six fixed hues harmonized with the
   Terracotta & Teal palette. A profile's name hashes to a stable hue;
   modules use the same mapping everywhere so a person's color is
   consistent across avatars, feed posts, calendar chips, etc.

   Layers per hue (CSS custom properties, light + dark aware):
     --identity-{hue}        base — spines, rings, markers
     --identity-{hue}-tint   tint — avatar fill, soft backgrounds
     --identity-{hue}-ink    ink  — text on tint (initials)            */

export const IDENTITY_HUES = ['terracotta', 'marigold', 'sage', 'teal', 'sky', 'plum'] as const

export type IdentityHue = (typeof IDENTITY_HUES)[number]

/* The household itself — the owner of a no-owner event (ADR 041). A seventh
   RESERVED entry: it lives in the identity namespace and carries the same three
   layers, but it is deliberately NOT in `IDENTITY_HUES`, so the name hash can
   never assign it to a person. "Family" is a who, not the absence of one.

   Two properties are load-bearing, not taste:
     · It is CHROMATIC (chroma 0.035). ADR 040 guarantees that a desaturated plane
       (`--surface-sunken`, chroma 0.006) can never be mistaken for an identity
       fill — which holds only because every identity fill is chromatic. An
       achromatic Family would quietly break that.
     · It is QUIET. A family event is the week's ground state; it must never draw
       the eye harder than a person's. That is why this is a warm stone and not the
       seventh hue the colour wheel had room for.

   It also ends `--secondary`'s double life: that token meant both "structural
   chrome" and "belongs to everyone", and the ambiguity collided three separate
   times in one session (see ADR 040 → ADR 041). */
export const FAMILY_HUE = 'family' as const

/** Any owner a surface can be painted for: a member's hue, or the household. */
export type OwnerHue = IdentityHue | typeof FAMILY_HUE

export type IdentityLayer = 'base' | 'tint' | 'ink'

function hashName(name: string): number {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

/** A person's hue. Never returns `family` — that entry is reserved for the
    household and is not in the assignable rotation. */
export function getIdentityHue(name: string): IdentityHue {
  return IDENTITY_HUES[hashName(name) % IDENTITY_HUES.length]
}

/** Returns a `var(--identity-…)` reference for an explicit owner and layer.
    Accepts `family` — the household resolves through exactly the same path a
    member does, so callers stop special-casing "no owner". */
export function identityToken(hue: OwnerHue, layer: IdentityLayer = 'base'): string {
  return layer === 'base' ? `var(--identity-${hue})` : `var(--identity-${hue}-${layer})`
}

/** Returns a `var(--identity-…)` reference for the given name and layer.
    Name hashing can collide; prefer an explicitly assigned hue when the
    profile carries one. */
export function identityColor(name: string, layer: IdentityLayer = 'base'): string {
  return identityToken(getIdentityHue(name), layer)
}
