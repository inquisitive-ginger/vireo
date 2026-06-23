import { getIdentityHue, identityToken, type IdentityHue } from '@family-os/ui'

/** Fill + ink resolution for an event by attendee count — the locked "color =
 *  person" language from M3 Design: Calendar (`design.md` §0):
 *    · 0 attendees → Family: neutral `--secondary` pill.
 *    · 1 attendee  → solo: that member's identity tint fill + ink.
 *    · 2+          → shared: a SPLIT fill (hard-stop tint segments, one per
 *                    person — reads as two highlighters, not a blended hue).
 *  Ported verbatim from `calendar-month.stories.tsx` (the locked reference). */

export interface Fill {
  background: string
  color: string
}

/** Resolve each attendee id to its member's identity hue (deterministic by name,
 *  the same path chores uses). Unknown ids (e.g. a removed member) are dropped. */
export function huesForEvent(
  attendeeIds: string[],
  membersById: Map<string, string>
): IdentityHue[] {
  return attendeeIds
    .map((id) => membersById.get(id))
    .filter((name): name is string => Boolean(name))
    .map((name) => getIdentityHue(name))
}

export function fillForHues(hues: IdentityHue[]): Fill {
  if (hues.length === 0) {
    return { background: 'var(--secondary)', color: 'var(--secondary-foreground)' }
  }
  if (hues.length === 1) {
    return { background: identityToken(hues[0], 'tint'), color: identityToken(hues[0], 'ink') }
  }
  const tints = hues.map((h) => identityToken(h, 'tint'))
  const n = tints.length
  const background = `linear-gradient(90deg, ${tints
    .map((t, i) => `${t} ${Math.round((i / n) * 100)}% ${Math.round(((i + 1) / n) * 100)}%`)
    .join(', ')})`
  return { background, color: 'var(--foreground)' }
}
