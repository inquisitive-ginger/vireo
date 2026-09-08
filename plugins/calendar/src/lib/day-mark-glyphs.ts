import { Utensils } from 'lucide-react'
import type { ComponentType } from 'react'

/** A day-mark provider's `glyph` (ADR 050 payload) names an icon; this is the only
 *  place that name resolves to a component. Keeping the map here — not in the
 *  provider — is what lets `plugins/calendar` never import a provider package
 *  (AC2): meals sends the string `'utensils'`, not a `<Utensils/>`. M7 School adds
 *  its own entry here, not an import there. */
export const DAY_MARK_GLYPHS: Record<
  string,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean; strokeWidth?: number }>
> = {
  utensils: Utensils,
}
