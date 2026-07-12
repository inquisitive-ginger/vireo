import { FAMILY_HUE, identityToken, resolveHue, type OwnerHue } from '@family-os/ui'
import type { CalendarMember } from '../types'

/** Fill + ink resolution for an event by attendee count — the locked "color =
 *  person" language from M3 Design: Calendar (`design.md` §0):
 *    · 0 attendees → **the household**: the reserved `family` identity hue.
 *    · 1 attendee  → solo: that member's identity tint fill + ink.
 *    · 2+          → shared: a SPLIT fill (hard-stop tint segments, one per
 *                    person — reads as two highlighters, not a blended hue).
 *
 *  A no-owner event used to fall through to the neutral `--secondary` — which was
 *  ALSO the structural-chrome token. That double meaning collided three separate
 *  times in one session (ADR 040 → **ADR 041**). Family now has its own reserved
 *  entry in the identity namespace, so the household resolves down exactly the same
 *  path a member does, and no caller special-cases "no owner" any more. */

interface Fill {
  background: string
  color: string
}

/** Resolve an event's attendees to owner hues. An event with no (known) attendees
 *  belongs to the **household**, so this returns `[family]` — never an empty array.
 *  Unknown ids (e.g. a removed member) are dropped, and an event left with none
 *  reads as the family's, the right default on a shared calendar. */
export function huesForEvent(
  attendeeIds: string[],
  membersById: Map<string, CalendarMember>
): OwnerHue[] {
  const hues = ownersForEvent(attendeeIds, membersById).map((m) =>
    resolveHue(m.name, m.identityHue)
  )
  return hues.length > 0 ? hues : [FAMILY_HUE]
}

/** The people an event actually belongs to — known attendees, in order. Empty means the
 *  household's (see `huesForEvent`). */
export function ownersForEvent(
  attendeeIds: string[],
  membersById: Map<string, CalendarMember>
): CalendarMember[] {
  return attendeeIds.map((id) => membersById.get(id)).filter((m): m is CalendarMember => Boolean(m))
}

/** The event's SECOND CHANNEL (ADR 044).
 *
 *  A month-grid chip used to be a coloured pill and nothing else, which made colour the
 *  only thing telling two people apart — and eight nameable hues do not survive
 *  red-green colour-blindness, which about 1 in 12 men have. Terracotta and marigold
 *  land 0.013 ΔEok apart for a deuteranope: the same pill.
 *
 *  So the chip carries its owner's initial. Returns:
 *    · a solo event  → that member's initial ("Z")
 *    · a shared one  → one initial per attendee ("ZH"), capped so the chip stays a chip
 *    · the family's  → null; Hearth is not a person and has no initial to carry, and
 *                      the household fill is the one hue that never collides with a
 *                      member's (ADR 041 keeps it near-achromatic). */
const MAX_INITIALS = 3
export function initialsForEvent(
  attendeeIds: string[],
  membersById: Map<string, CalendarMember>
): string | null {
  const owners = ownersForEvent(attendeeIds, membersById)
  if (owners.length === 0) return null
  return owners
    .slice(0, MAX_INITIALS)
    .map((m) => [...m.name][0]?.toUpperCase() ?? '')
    .join('')
}

/** Is this the household's event rather than a person's? The one thing callers
 *  still branch on — a Family event wears a `Users` glyph where a member's would
 *  carry initials. */
export function isFamilyHues(hues: OwnerHue[]): boolean {
  return hues.length === 1 && hues[0] === FAMILY_HUE
}

/** Per-owner spine colors for an event row — one identity hue per person (or the
 *  household's), so `<Spine>`/`<ItemCard spine>` paints a vertical split for shared
 *  events and a solid bar for solo ones. Uses the **base** identity layer
 *  (`--identity-{hue}`, the documented spine/marker layer — see design-system.md),
 *  not the soft `tint` the wide pills use, so the bar reads at full strength. */
export function spineColorsForEvent(hues: OwnerHue[]): string[] {
  return hues.map((h) => identityToken(h, 'base'))
}

export function fillForHues(hues: OwnerHue[]): Fill {
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
