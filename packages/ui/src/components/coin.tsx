import { Coins } from 'lucide-react'

/* The F$ currency mark (ADR 051). F$ owns gold, the coin disc and the Coins glyph;
   XP demotes to a quiet star and wears no metal. The colour is brass (hue ~90),
   moved off --identity-marigold (78) so the coin is not a member's identity hue
   doing a second job — and the rest of the separation is FORM, which a flat 4px
   identity spine can never have (ADR 044's second channel):

   ONE struck disc, never a disc nested in a ring (the pale step reads as a washer).
   The rim is the outer sliver of the same circle, masked; a specular sweep crosses
   the face; a raised inner ring gives relief. Milling was rejected on sight — hard
   radial notches read as a gear, which is machinery, not money.

   The metal is theme-invariant (struck metal looks the same on light and dark);
   only --coin-tint / --coin-ink take dark overrides. */

export interface CoinProps {
  /** Diameter in px. */
  size?: number
}

export function Coin({ size = 18 }: CoinProps) {
  const rimWidth = Math.max(1.5, size * 0.09)
  const ringMask = `radial-gradient(closest-side, transparent calc(100% - ${rimWidth}px), #000 calc(100% - ${rimWidth}px))`
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 34% 28%, var(--coin-hi), var(--coin) 58%, var(--coin-deep) 104%)`,
        color: 'var(--coin-deep)',
        boxShadow: [
          `inset 0 ${Math.max(1, size / 20)}px 0 rgba(255,255,255,0.55)`,
          `inset 0 -${Math.max(1, size / 16)}px ${size / 8}px rgba(0,0,0,0.2)`,
          `0 1px 2px rgba(0,0,0,0.2)`,
        ].join(', '),
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 200deg, var(--coin-deep), var(--coin-hi) 22%, var(--coin) 46%, var(--coin-deep) 66%, var(--coin-hi) 88%, var(--coin-deep))`,
          maskImage: ringMask,
          WebkitMaskImage: ringMask,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: rimWidth,
          boxShadow: `inset 0 0 0 ${Math.max(1, size / 26)}px rgba(255,255,255,0.3), inset 0 ${Math.max(1, size / 30)}px ${size / 12}px rgba(255,255,255,0.25)`,
        }}
      />
      <Coins size={Math.round(size * 0.48)} strokeWidth={2.5} className="relative" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(122deg, rgba(255,255,255,0.75) 0 14%, rgba(255,255,255,0.1) 32%, rgba(255,255,255,0) 50%)`,
        }}
      />
    </span>
  )
}

export interface CoinValueProps {
  /** The F$ amount. */
  value: number
  /** Coin diameter in px. */
  size?: number
  className?: string
}

/* Coin + amount as a brass pill — the standard way to render an F$ value on a row,
   a store tile, or a confirm. Balances stay in tens (ADR 052), so no formatting. */
export function CoinValue({ value, size = 18, className }: CoinValueProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-1${
        className ? ` ${className}` : ''
      }`}
      style={{ background: 'var(--coin-tint)', border: `1px solid var(--coin)` }}
    >
      <Coin size={size} />
      <span className="text-sm-token font-bold" style={{ color: 'var(--coin-ink)' }}>
        {value} F$
      </span>
    </span>
  )
}
