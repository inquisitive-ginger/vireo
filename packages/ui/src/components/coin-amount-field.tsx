import { Chip } from './chip'
import { Coin } from './coin'
import { Input } from './input'

export interface CoinAmountFieldProps {
  /** Reaches the numeric input, so a FieldLabel can point at the typed value. */
  id?: string
  /** The amount as entered — digits only; '' while the caller allows it. */
  value: string
  onChange: (value: string) => void
  presets: number[]
  placeholder?: string
}

/* One P$ amount field for both registers of pricing — a chore's Pays and a
   reward's Cost. The presets are the taught ladder (ADR 052); the input is the
   amount as typed, so a price is never caged by the ladder that teaches it.
   Brass belongs to the currency (ADR 051). */
export function CoinAmountField({
  id,
  value,
  onChange,
  presets,
  placeholder,
}: CoinAmountFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        id={id}
        className="w-14 px-2 text-center"
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
      />
      <span className="text-muted-foreground">·</span>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((v) => (
          <Chip
            key={v}
            selected={value === String(v)}
            onClick={() => onChange(String(v))}
            leading={value === String(v) ? <Coin size={14} /> : undefined}
            selectedStyle={{
              borderColor: 'var(--coin)',
              background: 'var(--coin-tint)',
              color: 'var(--coin-ink)',
            }}
            selectedClassName="font-bold"
            idleClassName="font-medium text-muted-foreground"
            className="min-w-touch justify-center gap-1 px-3"
          >
            {v}
          </Chip>
        ))}
      </div>
    </div>
  )
}
