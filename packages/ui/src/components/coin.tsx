import { CURRENCY } from '../lib/currency'

/* The Pritchett Buck (ADR 051, ADR 054). The currency owns gold, the coin disc and the
   struck mark; XP is a quiet star and wears no metal. The colour is brass (hue ~90),
   moved off --identity-marigold (78) so the coin is not a member's identity hue doing a
   second job — and the rest of the separation is FORM, which a flat 4px identity spine
   can never have (ADR 044's second channel):

   ONE struck disc, never a disc nested in a ring (the pale step reads as a washer).
   The rim is the outer sliver of the same circle, masked. Milling was rejected on sight
   — hard radial notches read as a gear, which is machinery, not money.

   SOFTENED 2026-07-26 (refines ADR 051/054): the earlier face carried a bright specular
   sweep and a raised inner-highlight ring, which together read as glossy plastic — "fake
   pirate coin" — at store scale, where a whole grid of them appears at once. Both are
   gone; the rim conic sits at 0.85 opacity and the top highlight at 0.45. What's left is
   a matte struck disc: a radial body, a masked rim, the mark. Nothing announces metal —
   the metal is just there.

   The metal is theme-invariant (struck metal looks the same on light and dark);
   only --coin-tint / --coin-ink take dark overrides. */

/* The mark: a P whose stem is crossed by a bar, the standard way a letter becomes a
   currency (₽, ₱, ₦, ₴ all do it). Deliberately NOT exported — it renders only here, as
   the coin's device, so there is one object to recognise rather than two.

   Struck at 0.66 of the face (a real coin's device runs 0.6–0.7) and stroke 2.5. The
   weight is load-bearing: the bowl's arms run y=4→12 and the bar crosses at y=8, so each
   counter is (4 − stroke) units tall — below ~26px they close and the mark reads as a
   silhouette, which is what a struck coin looks like from across a kitchen. 2.5 is the
   heaviest weight that still holds an open counter at 44px and up.

   It needs no centring transform: the bar caps at x=5 and `a4 4 0 0 1 0 8` from (14,4)
   is a semicircle bulging right, reaching x=18 — extents 5→19, centre exactly 12. */
function Mark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative"
      aria-hidden
    >
      <path d="M9 20V4h5a4 4 0 0 1 0 8H9" />
      <path d="M6 8h6" />
    </svg>
  )
}

export interface CoinProps {
  /** Diameter in px. */
  size?: number
}

export function Coin({ size = 18 }: CoinProps) {
  const rimWidth = Math.max(1.4, size * 0.085)
  const ringMask = `radial-gradient(closest-side, transparent calc(100% - ${rimWidth}px), #000 calc(100% - ${rimWidth}px))`
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 34% 28%, var(--coin-hi), var(--coin) 60%, var(--coin-deep) 106%)`,
        color: 'var(--coin-deep)',
        boxShadow: `inset 0 ${Math.max(1, size / 22)}px 0 rgba(255,255,255,0.45), 0 1px 1.5px rgba(0,0,0,0.18)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          opacity: 0.85,
          background: `conic-gradient(from 210deg, var(--coin-deep), var(--coin-hi) 26%, var(--coin) 50%, var(--coin-deep) 74%, var(--coin-hi) 92%, var(--coin-deep))`,
          maskImage: ringMask,
          WebkitMaskImage: ringMask,
        }}
      />
      {/* Rounded to an EVEN size: an odd glyph box inside an even disc centres on a half
          pixel, which the browser resolves by smearing the mark half a pixel off-centre. */}
      <Mark size={Math.round((size * 0.66) / 2) * 2} />
    </span>
  )
}

export interface CoinValueProps {
  /** The amount, in whole Pritchett Bucks. */
  value: number
  /** Coin diameter in px. */
  size?: number
  className?: string
}

/* Coin + amount as a brass pill — the standard way to render a value on a row, a store
   tile, or a confirm. The coin already states the unit, so the text is the amount alone
   (ADR 054); a screen reader gets no coin, so it gets the spoken unit instead. Balances
   stay in tens (ADR 052), so no formatting. */
export function CoinValue({ value, size = 18, className }: CoinValueProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-1${
        className ? ` ${className}` : ''
      }`}
      style={{ background: 'var(--coin-tint)', border: `1px solid var(--coin)` }}
    >
      <Coin size={size} />
      {/* `leading-none` is load-bearing, not tidying: `items-center` centres the text's
          LINE BOX, and a line box reserves descender space that a digit never uses — so
          at the default leading the numeral rides visibly high against the coin. */}
      <span className="text-sm-token font-bold leading-none" style={{ color: 'var(--coin-ink)' }}>
        {value}
        <span className="sr-only"> {CURRENCY.short}</span>
      </span>
    </span>
  )
}
