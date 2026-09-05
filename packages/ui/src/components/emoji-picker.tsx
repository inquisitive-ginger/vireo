import { EmojiPicker as Frimousse, type Emoji } from 'frimousse'
import { cn } from '../lib/utils'

export interface EmojiGroup {
  label: string
  emojis: string[]
}

export interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  /** The currently-chosen emoji, highlighted in scoped mode. */
  selected?: string
  /** SCOPED mode: render only these emojis, grouped, from a local list — no network,
      no data fetch. Pass a domain set (e.g. reward-shaped emojis). Omit for the full
      searchable picker. */
  groups?: EmojiGroup[]
  className?: string
}

/* One emoji picker, two modes.
   · SCOPED (`groups`): a small curated set rendered locally — offline-safe, and it
     keeps a surface on-tone (a reward is 🍦, never 🦠). Used by the rewards catalog.
   · FULL (no `groups`): the whole searchable set via frimousse, for a surface that
     genuinely needs any emoji (family-feed composing, later).
   Both call `onSelect(emoji)` with the chosen character. */
export function EmojiPicker({ onSelect, selected, groups, className }: EmojiPickerProps) {
  if (groups) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {groups.map((group) => (
          <div key={group.label}>
            <div className="text-section-label mb-1.5 px-0.5 text-muted-foreground">
              {group.label}
            </div>
            <div className="grid grid-cols-8 gap-1">
              {group.emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  aria-label={`Use ${e}`}
                  aria-pressed={selected === e}
                  onClick={() => onSelect(e)}
                  className={cn(
                    'grid aspect-square place-items-center rounded-card text-heading transition-colors',
                    selected === e ? 'bg-primary/15 ring-2 ring-primary' : 'hover:bg-muted'
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Frimousse.Root
      className={cn('flex h-[352px] w-full flex-col', className)}
      onEmojiSelect={({ emoji }: Emoji) => onSelect(emoji)}
      columns={9}
    >
      <Frimousse.Search
        className="text-sm-token mx-2 mt-2 rounded-card border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        placeholder="Search emoji"
      />
      <Frimousse.Viewport className="relative flex-1 outline-none">
        <Frimousse.Loading className="text-sm-token absolute inset-0 grid place-items-center text-muted-foreground">
          Loading…
        </Frimousse.Loading>
        <Frimousse.Empty className="text-sm-token absolute inset-0 grid place-items-center text-muted-foreground">
          No emoji found.
        </Frimousse.Empty>
        <Frimousse.List
          className="select-none pb-2"
          components={{
            CategoryHeader: ({ category, ...props }) => (
              <div
                className="text-section-label bg-card px-3 pt-3 pb-1 text-muted-foreground"
                {...props}
              >
                {category.label}
              </div>
            ),
            Row: ({ children, ...props }) => (
              <div className="scroll-my-1 px-1.5" {...props}>
                {children}
              </div>
            ),
            Emoji: ({ emoji, ...props }) => (
              <button
                className="grid size-9 place-items-center rounded-card text-heading hover:bg-muted data-[active]:bg-primary/15"
                {...props}
              >
                {emoji.emoji}
              </button>
            ),
          }}
        />
      </Frimousse.Viewport>
    </Frimousse.Root>
  )
}
