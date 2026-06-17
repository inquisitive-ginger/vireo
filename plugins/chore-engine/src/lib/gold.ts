/* Gold = the "treasure" XP semantic (design-system.md). Built on the system's
   marigold hue, kept clear of error-red so XP never reads as alarm. These are
   local to chore-engine for M2; the XP Award story is expected to promote them
   to shared `--gold-*` tokens in styles.css. Gold is used ONLY for XP — never
   for status (status is neutral / red=overdue / green=done). */

export const GOLD = 'oklch(0.74 0.13 80)' // minted coin gold
export const GOLD_HI = 'oklch(0.88 0.09 86)' // highlight (top-left of coin)
export const GOLD_DEEP = 'oklch(0.55 0.12 66)' // deep edge + gold text
export const GOLD_TINT = 'oklch(0.95 0.045 86)' // soft gold wash
export const GOLD_INK = 'oklch(0.45 0.1 70)' // gold text on tint
