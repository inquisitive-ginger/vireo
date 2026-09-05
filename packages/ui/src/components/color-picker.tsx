import { Check } from 'lucide-react'
import { IDENTITY_HUES, identityToken, type IdentityHue } from '../lib/identity'
import { cn } from '../lib/utils'

export interface ColorPickerProps {
  /** The hue this member currently holds. */
  value?: string | null
  onChange: (hue: IdentityHue) => void
  /** Who holds each hue, keyed by hue — used to show a taken swatch as taken, and by
      WHOM. The current member's own hue may appear here; it is not treated as taken. */
  takenBy?: Partial<Record<string, string>>
  disabled?: boolean
  className?: string
}

/* The member colour picker (ADR 044).
 *
 * A fixed palette, never a free colour input — that constraint is the whole reason a
 * family cannot end up with two near-identical greys, or neon green.
 *
 * A taken swatch shows the INITIAL OF ITS OWNER rather than just going dead, because
 * "unique across the family" means taking a colour is really a trade, and you cannot
 * trade with someone you can't see. The Settings member list is the app's legend (the
 * one surface pairing a face, a name and a hue — ADR 042), which makes it the natural
 * place for that trade to happen.
 *
 * Note the swatch is NOT an avatar: it is a pure colour sample, so it is the one place
 * in the app where a hue is legitimately the entire content of an element. It still
 * carries a text label for a screen reader, and the selected one carries a check — the
 * selection state never rides on colour alone. */
export function ColorPicker({
  value,
  onChange,
  takenBy = {},
  disabled = false,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group">
      {IDENTITY_HUES.map((hue) => {
        const owner = takenBy[hue]
        const isMine = value === hue
        const taken = Boolean(owner) && !isMine

        return (
          <button
            key={hue}
            type="button"
            disabled={disabled || taken}
            onClick={() => onChange(hue)}
            aria-pressed={isMine}
            aria-label={taken ? `${hue} — taken by ${owner}` : hue}
            title={taken ? `${owner} has ${hue}` : hue}
            className={cn(
              'relative grid size-11 shrink-0 place-items-center rounded-card',
              'transition-transform duration-[var(--duration-fast)]',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              isMine && 'ring-2 ring-foreground ring-offset-2 ring-offset-background',
              taken ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            style={{ background: identityToken(hue) }}
          >
            {/* The check sits on its own solid disc rather than directly on the hue:
                the palette spans L 0.50–0.71, so neither a white nor an ink glyph
                clears contrast on all eight. The disc makes it legible on every one. */}
            {isMine && (
              <span className="grid size-5 place-items-center rounded-full bg-card shadow-sm">
                <Check className="size-3.5 text-foreground" aria-hidden />
              </span>
            )}
            {taken && (
              <span
                aria-hidden
                className="absolute inset-0 grid place-items-center rounded-card bg-card/65 text-xs-token font-bold text-muted-foreground"
              >
                {[...(owner ?? '')][0]?.toUpperCase()}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Is every colour spoken for? A household cannot grow past the palette while hues stay
    unique, and a duplicate hue is worse than none — it points "colour = person" at two
    people at once. Callers must SAY the palette is full rather than double a colour. */
export function isPaletteFull(takenBy: Partial<Record<string, string>>): boolean {
  return IDENTITY_HUES.every((hue) => Boolean(takenBy[hue]))
}
