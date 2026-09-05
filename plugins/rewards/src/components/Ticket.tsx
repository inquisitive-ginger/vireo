import { AskLine, CostStub, TicketFrame, TICKET_PERF } from '@family-os/ui'

/* The ticket (ADR 055) — the module's one physical metaphor. The die-cut anatomy
   (TicketFrame, the stubs, the ask line) lives in @family-os/ui since the punch-card
   prize picker became its second cross-plugin caller (M4/6); what stays here is the
   store's own composition — the shelf ticket with its roll, the stub-shelf chip, and
   the loading skeleton. */

export { EmojiStub, TicketFrame } from '@family-os/ui'

function StoreTicketBody({
  emoji,
  name,
  description,
  askFirst,
}: {
  emoji: string
  name: string
  description: string | null
  askFirst: boolean
}) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-3.5 px-4 py-4">
      <span className="flex-none text-[34px] leading-none">{emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="text-base-token block font-bold leading-tight">{name}</span>
        {description && (
          <span className="mt-0.5 block text-xs-body leading-snug text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {askFirst && (
        <span className="flex-none self-end pb-0.5">
          <AskLine />
        </span>
      )}
    </span>
  )
}

/** A ticket on the store shelf — the live unit is the tap target; the roll is scenery. */
export function StoreTicket({
  emoji,
  name,
  description,
  cost,
  askFirst,
  onPick,
}: {
  emoji: string
  name: string
  description: string | null
  cost: number
  askFirst: boolean
  onPick: () => void
}) {
  const unit = (
    <>
      <CostStub cost={cost} />
      <StoreTicketBody emoji={emoji} name={name} description={description} askFirst={askFirst} />
    </>
  )
  return (
    <TicketFrame lit roll echoes={unit}>
      <button
        type="button"
        onClick={onPick}
        aria-label={
          `${name}, ${cost} P-Bucks. You can get this now. ` +
          (askFirst ? 'You will ask a parent when you use it.' : '')
        }
        className="flex min-w-0 flex-1 cursor-pointer items-stretch text-left transition-opacity active:opacity-80"
      >
        <span aria-hidden className="flex min-w-0 flex-1 items-stretch">
          {unit}
        </span>
      </button>
    </TicketFrame>
  )
}

/** A torn stub on the memory shelf — the reward, remembered, with a count. */
export function StubChip({ emoji, name, count }: { emoji: string; name: string; count: number }) {
  return (
    <span
      className="text-sm-token inline-flex items-center gap-1.5 py-1.5 pl-2.5 pr-3 font-semibold text-muted-foreground"
      style={{
        background: 'var(--surface-sunken)',
        boxShadow: 'var(--shadow-inset)',
        borderRadius: '8px 3px 3px 8px',
        clipPath:
          'polygon(0 0, 96% 0, 100% 14%, 96% 28%, 100% 42%, 96% 56%, 100% 70%, 96% 84%, 100% 100%, 0 100%)',
      }}
    >
      <span className="text-base-token" aria-hidden>
        {emoji}
      </span>
      <span className="text-foreground">{name}</span>
      {count > 1 && <span>×{count}</span>}
    </span>
  )
}

/** Loading placeholder — the page keeps its ticket shape while it fetches. */
export function TicketSkeleton() {
  return (
    <TicketFrame className="mb-2.5">
      <span
        className="grid w-[80px] flex-none place-items-center py-4"
        style={{ borderRight: `2px dashed ${TICKET_PERF}` }}
      >
        <span className="size-6 animate-pulse rounded-full bg-muted" />
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-3.5 px-4 py-4">
        <span className="size-9 flex-none animate-pulse rounded-card bg-muted" />
        <span className="min-w-0 flex-1">
          <span className="block h-4 w-2/5 animate-pulse rounded bg-muted" />
          <span className="mt-1.5 block h-3 w-3/5 animate-pulse rounded bg-muted" />
        </span>
      </div>
    </TicketFrame>
  )
}
