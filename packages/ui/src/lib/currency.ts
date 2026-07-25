/* The currency's registers (ADR 054). Each one exists because a medium ruled the others
   out, so a call site picks a register by NAMING it — never by typing two characters,
   which is how a symbol leaks into a sentence it does not belong in.

   The mark itself is not here. It renders only struck on the `Coin` face, never as
   inline ink, so it lives inside coin.tsx as that component's device. */
export const CURRENCY = {
  /** Taught once, where there is room — the wallet hero, settings, first use. */
  name: 'Pritchett Bucks',
  /** Any sentence a person reads or HEARS. A screen reader handed the code says
      "P dollar sign", so this is what every `aria-label` gets. */
  short: 'P-Bucks',
  /** Compact text beside a number — chips, buttons, prose, the ledger. */
  code: 'P$',
} as const

/** A value in compact text: `10 P$`. Balances stay in tens (ADR 052) — no formatting. */
export const bucks = (value: number) => `${value} ${CURRENCY.code}`

/** The same value for a screen reader: `10 P-Bucks`. */
export const bucksSpoken = (value: number) => `${value} ${CURRENCY.short}`
