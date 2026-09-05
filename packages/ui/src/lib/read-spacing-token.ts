/* Read a spacing token as a number, for the few places that have to measure a
   layout in JS rather than declare it in CSS.

   The stylesheet is authoritative. The fallback is not a second opinion about
   the value — it is what the caller gets where no stylesheet exists at all
   (jsdom, and the first frame before styles resolve), and it is only ever the
   size of a gap, never a correctness question. */
export function readSpacingToken(name: string, fallback: number): number {
  if (typeof window === 'undefined' || typeof getComputedStyle !== 'function') return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name)
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}
