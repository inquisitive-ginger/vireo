import { AskSeal } from '@family-os/ui'

/* "Ask first" — the gold "?" seal (our settled needs-a-parent's-yes mark, ADR/M4/4)
   PAIRED with a text label. The seal alone faces parents on the queue/catalog, where the
   rule is already known; a kid store is the seal's first kid-facing home, so the label
   carries the meaning a young reader can't be asked to infer from a glyph. */
export function AskPill() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs-token"
      style={{
        color: 'var(--coin-ink)',
        background: 'var(--coin-tint)',
        border: '1px solid color-mix(in oklch, var(--coin) 50%, var(--border))',
      }}
    >
      <AskSeal size={13} ring={false} />
      Ask first
    </span>
  )
}
