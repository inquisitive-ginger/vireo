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

export type IdentityLayer = 'base' | 'tint' | 'ink'

function hashName(name: string): number {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export function getIdentityHue(name: string): IdentityHue {
  return IDENTITY_HUES[hashName(name) % IDENTITY_HUES.length]
}

/** Returns a `var(--identity-…)` reference for an explicit hue and layer. */
export function identityToken(hue: IdentityHue, layer: IdentityLayer = 'base'): string {
  return layer === 'base' ? `var(--identity-${hue})` : `var(--identity-${hue}-${layer})`
}

/** Returns a `var(--identity-…)` reference for the given name and layer.
    Name hashing can collide; prefer an explicitly assigned hue when the
    profile carries one. */
export function identityColor(name: string, layer: IdentityLayer = 'base'): string {
  return identityToken(getIdentityHue(name), layer)
}
