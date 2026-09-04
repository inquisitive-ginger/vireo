import { useState } from 'react'
import { Check, ChevronDown, ChevronLeft, FolderInput, Loader2 } from 'lucide-react'
import { SHOPPING_AISLES, type ShoppingAisle } from '@family-os/schemas'
import {
  Button,
  CaptureField,
  Chip,
  ListRow,
  PageContainer,
  PageHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from '@family-os/ui'
import type { ShoppingItem, ShoppingList } from '../types'
import { ShoppingCaptureHero } from './ShoppingCaptureHero'

export interface AisleGroup {
  aisle: string
  items: ShoppingItem[]
}

export interface ShoppingPageViewProps {
  lists: ShoppingList[]
  selectedListId: string
  onSelectList: (id: string) => void
  /** Already in walk order, already grouped — the server sorts, the view draws. */
  groups: AisleGroup[]
  /** The rows are still coming. Distinct from "there are none" — the empty line
      is a claim about the house, and it must not be made before the answer is in. */
  loading: boolean
  onAdd: (name: string) => void
  onDraftChange: (draft: string) => void
  /** What the current draft would file under. Null while the field is empty —
      the echo only exists between typing and committing. */
  draftAisle: string | null
  /** The name that failed to land, so the word is not silently lost. */
  addError: string | null
  /** `shopping.item.add` is revoked for this profile — the one lever that closes
      the field (ADR 072 §6). The house itself adds; the wide layout needs it. */
  canAdd: boolean
  /** Which arrangement of THIS surface to draw. Not a route and not something a
      reader switches — the viewport picks it, and both draw the same list from
      the same data. Wide DOES have capture/list modes inside it, which is what
      W2 always was; the no-mode rule is the narrow layout's (design.md
      §"The no-mode principle is scoped to narrow"). */
  layout: 'capture' | 'list'
  /** Wide only — the hero's short memory of what landed, anywhere. */
  justAdded: { id: string; name: string; canRetract: boolean }[]
  /** Wide only — everything waiting across every destination. */
  totalOpenCount: number
  /** `capture` only — swaps to the list at its own URL. */
  onShowLists: () => void
  /** The way back, offered ONLY on the wide list view. Undefined on a phone,
      which has no dedicated capture view to return to. */
  onBackToCapture?: () => void
  /** Taking back your own recent add (ADR 073, tier 1). Undefined when the
      profile lacks the key; per-row eligibility is the server's `canRetract`. */
  onRetract?: (id: string, name: string) => void
  retractError: string | null
  /** `shopping.item.check`, tier 2 (ADR 071) — the ring AND the whole-row tap,
      in both directions. Without it the rows are still readable, just inert. */
  canCheck: boolean
  /** `shopping.item.file`, tier 4 (ADR 071) — the aisle correction, which writes
      a family-wide override. Below tier 4 the control is simply absent. */
  canFile: boolean
  onToggle: (item: ShoppingItem) => void
  onRefile: (item: ShoppingItem, category: ShoppingAisle) => void
  /** Row-scoped failures, keyed by item id. A check that did not reach the
      server is a person in an aisle believing a thing is in the cart, so it
      reports on the row they tapped, never in the page chrome (M5.5/3). */
  rowErrors: Record<string, string>
}

/* The /shopping surface (design.md §Anatomy, artifact frames S1/S2). The capture
   field is the hero at rest and the aisle-ordered list is the page; neither is a
   mode, and the field simply scrolls away under the thumb in a shop. There is no
   index of lists and no drill-in — the destination strip both swaps the list in
   place and says where an add will land, which is one control, not two. No spine, no hue, no avatar (ADR 064): "who added the milk"
   is not a question this list answers, so provenance is a text fact. */
export function ShoppingPageView({
  lists,
  selectedListId,
  onSelectList,
  groups,
  loading,
  onAdd,
  onDraftChange,
  draftAisle,
  addError,
  canAdd,
  layout,
  justAdded,
  totalOpenCount,
  onShowLists,
  onBackToCapture,
  onRetract,
  retractError,
  canCheck,
  canFile,
  onToggle,
  onRefile,
  rowErrors,
}: ShoppingPageViewProps) {
  const selected = lists.find((l) => l.id === selectedListId)
  const destination = selected?.name ?? 'the list'
  // Aisles belong to the LIST, not to the app — a hardware run has none of ours,
  // so it renders flat rather than filing every screw under Other.
  const showAisles = selected?.groupByAisle ?? true
  const composing = draftAisle !== null
  const capturing = layout === 'capture'

  // Derived from what is actually drawn, never from the index count — the two
  // disagree while a list read is in flight, and a meter is a claim about the
  // rows on screen.
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  const got = groups.reduce((n, g) => n + g.items.filter((i) => i.status === 'got').length, 0)

  /* ONE control, not two (Zach, 2026-09-04). The field used to carry a
     destination chip while this row filtered the list — two controls in similar
     clothes answering "which list?" differently. The selected pill is now both:
     what you are looking at, and where an add goes. That is also what makes
     Costco reachable from the capture screen, which had no way to it at all. */
  const destinations = (
    <div className="flex gap-2 overflow-hidden py-0.5">
      {lists.map((list) => (
        <Chip
          key={list.id}
          selected={list.id === selectedListId}
          onClick={() => onSelectList(list.id)}
          selectedClassName="border-primary bg-primary/13 text-primary"
          // `Chip` is 13px, which is right at arm's length and unreadable at six
          // feet — and on the capture layout these are load-bearing, since they
          // decide where an add lands. Sized up to the distance floor there, via
          // the sizing override the primitive documents.
          className={capturing ? 'text-body px-4 py-2' : undefined}
        >
          {list.name} {list.itemCount}
        </Chip>
      ))}
    </div>
  )

  return (
    // `list` at BOTH widths. A list is not prose, but it is not a billboard
    // either: unmeasured at 1280 the rows run 1232px, so a name at the left edge
    // and its aisle at the right are a head-turn apart. The wide layout earns its
    // presence with type size, not with span.
    <PageContainer width="list">
      {capturing ? (
        <ShoppingCaptureHero
          justAdded={justAdded}
          openCount={totalOpenCount}
          onRetract={onRetract}
          retractError={retractError}
          destinations={destinations}
          onShowLists={onShowLists}
          loading={loading}
          destination={selected?.name ?? null}
          onAdd={onAdd}
          onDraftChange={onDraftChange}
          draftAisle={draftAisle}
          addError={addError}
          canAdd={canAdd}
        />
      ) : (
        <>
          {onBackToCapture && (
            <button
              type="button"
              onClick={onBackToCapture}
              className="text-sm-token mb-3 flex cursor-pointer items-center gap-1 font-medium text-primary"
            >
              <ChevronLeft size={16} aria-hidden />
              Back to adding
            </button>
          )}

          {/* The count rides the title's own baseline and the field sits 14px
              under it (artifact S1), so the primitive's `items-start` / `mb-6`
              are the two things overridden — not the header. */}
          <PageHeader
            className="mb-0 items-baseline"
            title="Shopping"
            // Cumulative across every destination — the pills beside it already
            // give the per-list split, so the one number on the page that could
            // answer "how much is waiting in total" should not repeat a pill.
            action={
              <span className="text-sm-token text-muted-foreground">
                {totalOpenCount} thing{totalOpenCount === 1 ? '' : 's'} to get
              </span>
            }
          />

          <CaptureField
            size="hero"
            className="mt-3.5"
            // Deliberately NOT autofocused (ADR 070): an unrequested keyboard on
            // a route you opened to read is hostile. The wide layout is a screen
            // you walked up to in order to type, so it focuses; this is not.
            placeholder={`Add to ${destination}`}
            label={`Add to ${destination}`}
            disabled={!canAdd}
            onValueChange={onDraftChange}
            onSubmit={onAdd}
          />

          {/* Tight to the field, because it IS the field's destination control
              and proximity is the only thing that says so. The larger gap goes
              below the pair, separating the whole unit from the list. */}
          <div className="mt-3">{destinations}</div>

          {/* Everything that reports on the field sits under the pair, in a slot
              that reserves its height — mounted on the first keystroke it shoves
              the list down and back on Enter. */}
          <div className="min-h-7 pt-1.5">
            {addError ? (
              <p role="alert" className="text-sm-token px-1 text-error">
                Couldn&rsquo;t add &ldquo;{addError}&rdquo; — check your connection and try again.
              </p>
            ) : !canAdd ? (
              <p className="text-sm-token px-1 text-muted-foreground">
                Adding to the list is turned off for this profile.
              </p>
            ) : composing ? (
              <p className="text-sm-token px-1 text-muted-foreground">
                Enter to add · files under{' '}
                <span className="font-medium text-foreground">{draftAisle}</span>
              </p>
            ) : null}
          </div>
        </>
      )}

      {/* Artifact S3, the same screen scrolled. It sticks rather than switching —
          the hero goes under the thumb and this is what is left above the fold,
          so the shopper never scrolls up to ask how far along they are. It shows
          when there is progress to report and not before: S1 draws neither line
          nor meter, and a meter reading 0 of 14 is a third count of a number
          already on screen twice. Data, not a scroll threshold — mid-shop is
          when the page is SHORTEST, because every cleared aisle folds to one
          row, so the hero often never scrolls away at all. */}
      {!capturing && got > 0 && (
        <div className="sticky top-0 z-30 bg-background pt-2.5 pb-2">
          {/* The count is the reason the block exists, so it takes `heading` — a
              rung of its own between the page title and the row names. Drawn at
              `section-label` it was the same ink and size as the word DAIRY, and
              a status line that reads as an aisle header has no rank left when
              it is NOT at the top of a scrolled screen.

              It does NOT name the destination. The artifact pairs this line with
              a second `Grocery ▾` chip because in S3 the pill strip has scrolled
              away and that chip is the switcher standing in for it. The strip
              now stays put and carries the destination itself, so a label here
              repeats the control directly above it — and a region that repeats
              its neighbour is a region people stop reading. */}
          <span className="text-heading block text-foreground">
            {got} of {total}
          </span>
          <div
            className="h-meter mt-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label={`${got} of ${total} in the cart`}
            aria-valuenow={got}
            aria-valuemin={0}
            aria-valuemax={total}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-[var(--duration-slow)]"
              style={{ width: `${total === 0 ? 0 : Math.round((got / total) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {!capturing && (
        <div className={cn('mt-2', composing && 'opacity-50')}>
          {loading ? (
            <div className="flex justify-center pt-8">
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Loading" />
            </div>
          ) : groups.length === 0 ? (
            <p className="text-body px-1 pt-6 text-muted-foreground">
              Nothing on {destination} yet.
            </p>
          ) : (
            <ItemList
              key={selectedListId}
              groups={groups}
              showAisles={showAisles}
              canCheck={canCheck}
              canFile={canFile}
              onToggle={onToggle}
              onRefile={onRefile}
              rowErrors={rowErrors}
            />
          )}
        </div>
      )}
    </PageContainer>
  )
}

interface ItemListProps {
  groups: AisleGroup[]
  showAisles: boolean
  canCheck: boolean
  canFile: boolean
  onToggle: (item: ShoppingItem) => void
  onRefile: (item: ShoppingItem, category: ShoppingAisle) => void
  rowErrors: Record<string, string>
}

/* Keyed on the destination by its caller, so swapping lists resets which aisles
   are open rather than carrying Grocery's answer onto Costco. That key is honest
   only while selecting a pill also swaps the visible list — design.md §Anatomy 4
   names the coupling, because splitting the pill back into two controls later
   invalidates it. */
function ItemList({
  groups,
  showAisles,
  canCheck,
  canFile,
  onToggle,
  onRefile,
  rowErrors,
}: ItemListProps) {
  // An aisle you have touched stays open. That is what reconciles the two rules
  // that otherwise fight: a cleared aisle collapses so the walk keeps moving,
  // but the row you just tapped must not vanish from under your thumb. An aisle
  // cleared by someone else, or already cleared when the page loaded, arrives
  // collapsed; the one you are standing in does not close on you.
  const [opened, setOpened] = useState<string[]>([])

  return (
    <>
      {groups.map((group, i) => {
        const cleared = group.items.every((item) => item.status === 'got')
        // A flat list has no aisles of ours, so it has no cleared aisle either —
        // collapsing its single pseudo-group would hide the whole list behind a
        // summary of a grouping its shopper cannot see. The meter still works
        // there; only the collapse is aisle-coupled.
        const collapsed = showAisles && cleared && !opened.includes(group.aisle)

        if (collapsed) {
          return (
            // `ListRow`, not a hand-rolled button: this is a full-bleed
            // activation target sitting in the list's own hairline rhythm, so
            // ADR 068 governs it. Two aisles cleared back to back — routine
            // halfway round a shop — put two of these adjacent, and only the
            // primitive's derived inset leaves the 8px dead band between them.
            <ListRow
              key={group.aisle}
              className="text-muted-foreground"
              onActivate={() => setOpened((open) => [...open, group.aisle])}
              activateLabel={`Open ${group.aisle} — ${group.items.length} in the cart`}
            >
              {/* The chevron rides the label, not the far margin: it is the only
                  mark saying rows are folded up behind this, and at `list` width
                  the trailing edge is most of a screen away from the word it
                  modifies. Down, not right — this opens in place, and a `›`
                  promises the drill-in the whole surface refuses. */}
              <span className="text-section-label flex min-w-0 flex-1 items-center gap-1.5">
                {group.aisle}
                <ChevronDown size={14} aria-hidden />
              </span>
              <span className="text-sm-token shrink-0">{group.items.length} in the cart</span>
            </ListRow>
          )
        }

        return (
          <div key={group.aisle}>
            {showAisles && (
              <div
                className={cn(
                  // A section label binds to what is BELOW it, so the gap above
                  // stays the larger of the two (live review, 2026-09-04).
                  'text-section-label pb-2 text-muted-foreground',
                  i === 0 ? 'pt-4' : 'pt-7'
                )}
              >
                {group.aisle}
              </div>
            )}
            {group.items.map((item) => (
              <Row
                key={item.id}
                item={item}
                canCheck={canCheck}
                canFile={canFile}
                error={rowErrors[item.id]}
                onToggle={() => {
                  setOpened((open) => (open.includes(group.aisle) ? open : [...open, group.aisle]))
                  onToggle(item)
                }}
                onRefile={(category) => onRefile(item, category)}
              />
            ))}
          </div>
        )
      })}
    </>
  )
}

interface RowProps {
  item: ShoppingItem
  canCheck: boolean
  canFile: boolean
  error?: string
  onToggle: () => void
  onRefile: (category: ShoppingAisle) => void
}

function Row({ item, canCheck, canFile, error, onToggle, onRefile }: RowProps) {
  const got = item.status === 'got'
  return (
    <ListRow
      leading={<Ring checked={got} />}
      dimmed={got}
      onActivate={canCheck ? onToggle : undefined}
      activateLabel={got ? `Put “${item.name}” back on the list` : `Mark “${item.name}” as got`}
      trailing={canFile ? <AisleCorrection item={item} onRefile={onRefile} /> : undefined}
    >
      <div className="min-w-0 flex-1">
        <span
          className={cn('text-card-title block truncate text-foreground', got && 'line-through')}
        >
          {item.name}
        </span>
        {/* Producer words only ("for Thursday"). Per-row attribution is not
            rendered here in either direction — not who added (ADR 072 §3/§4) and
            not who checked (ADR 064, amended 2026-09-04). A shared list does not
            answer whose milk it is, and thirty rows of it sit between the
            shopper and the next word they have to read. `added_by` and `got_by`
            are stored for permissions and audit; neither reaches the wire.

            Two shoppers converge on the row's STATE — dimmed, struck through, in
            place — which is the thing either of them acts on. */}
        {item.note && (
          <span className="text-sm-token block truncate text-muted-foreground">{item.note}</span>
        )}
        {/* The tap failed, so the answer lands where the tap did. A page-scoped
            line names no row when thirty of them look alike. */}
        {error && (
          <span role="alert" className="text-sm-token block text-error">
            {error}
          </span>
        )}
      </div>
    </ListRow>
  )
}

/* The leading slot ListRow renders but does not define (ADR 063). It is
   deliberately NOT a button: the whole row is the target, and a control sitting
   above the activation overlay would carve a hole in it exactly where the eye
   aims. `ListRow` makes the slot inert on an activatable row for that reason. */
function Ring({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-full border-2',
        checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
      )}
    >
      {checked && <Check size={14} strokeWidth={3} />}
    </span>
  )
}

/* AC9. `POST /items/:id/aisle` shipped in M5.5/2 with nothing reaching it, so a
   mis-filed item sat in Other forever and the override table was dead code. The
   correction is not a per-row preference: it teaches a family-wide override that
   refiles the NEXT add of that name for everyone, which is why it is `file`
   (tier 4) and why the sentence over the aisles says so out loud. */
function AisleCorrection({
  item,
  onRefile,
}: {
  item: ShoppingItem
  onRefile: (category: ShoppingAisle) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Move “${item.name}” to another aisle`}
          title="Move to another aisle"
          className="h-11 w-11 text-muted-foreground"
        >
          <FolderInput className="size-3.5" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1.5">
        <p className="text-sm-token mb-1.5 border-b border-border px-2 pt-1 pb-2 text-muted-foreground">
          Files every future <span className="font-medium text-foreground">{item.name}</span> here.
        </p>
        {SHOPPING_AISLES.map((aisle) => (
          <button
            key={aisle}
            type="button"
            onClick={() => {
              setOpen(false)
              if (aisle !== item.category) onRefile(aisle)
            }}
            aria-current={aisle === item.category}
            className={cn(
              'min-h-touch text-body flex w-full items-center justify-between rounded-lg px-2 text-left hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              aisle === item.category && 'font-semibold text-primary'
            )}
          >
            {aisle}
            {aisle === item.category && <Check size={14} aria-hidden />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
