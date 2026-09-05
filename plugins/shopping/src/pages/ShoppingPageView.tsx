import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, ChevronDown, ChevronLeft, Loader2 } from 'lucide-react'
import type { ShoppingAisle } from '@family-os/schemas'
import { CaptureField, Chip, ListRow, PageContainer, PageHeader, RowSwipe, cn } from '@family-os/ui'
import type { CaptureReport, ShoppingItem, ShoppingList } from '../types'
import { ReportLine } from '../components/ReportLine'
import { ShoppingCaptureHero } from './ShoppingCaptureHero'
import { RowActionsPanel, RowActionsSheet } from './RowActionsSheet'

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
  /** The report slot's stack, already ranked (D4): one error line, then one
      notice per collision. Empty and the slot says what the surface itself has. */
  reports: CaptureReport[]
  /** `shopping.item.add` is revoked for this profile — the one lever that closes
      the field (ADR 072 §6). The house itself adds; the wide layout needs it. */
  canAdd: boolean
  /** Which arrangement of THIS surface to draw. Not a route and not something a
      reader switches — the viewport picks it, and both draw the same list from
      the same data. Wide DOES have capture/list modes inside it, which is what
      W2 always was; the no-mode rule is the narrow layout's (design.md
      §"One surface, two layouts"). */
  layout: 'capture' | 'list'
  /** Wide only — everything waiting across every destination, on the same "what's
      left" arithmetic as everywhere else (D6). */
  totalOpenCount: number
  /** `capture` only — swaps to the list at its own URL. */
  onShowLists: () => void
  /** The way back, offered ONLY on the wide list view. Undefined on a phone,
      which has no dedicated capture view to return to. */
  onBackToCapture?: () => void
  /** `shopping.item.check`, tier 2 (ADR 071) — the ring AND the whole-row tap,
      in both directions. Without it the rows are still readable, just inert. */
  canCheck: boolean
  /** `shopping.item.file`, tier 4 (ADR 071) — the aisle correction, which writes
      a family-wide override. Below tier 4 the verb is simply absent from the sheet. */
  canFile: boolean
  /** `shopping.item.manage`, tier 4 — rename and remove (D5). */
  canManage: boolean
  /** `shopping.item.retract`, tier 1 (ADR 073) — held by the profile; the row's
      own eligibility rides on the payload's `canRetract`. */
  canRetract: boolean
  /** Tablet and up: the row's verbs render INLINE, anchored to the row and
      pushing the rows below it down (E1 panel 3). A phone keeps the bottom
      sheet — a panel that pushes rows there moves the row being acted on off
      the screen. */
  inlineActions: boolean
  onToggle: (item: ShoppingItem) => void
  onRefile: (item: ShoppingItem, category: ShoppingAisle) => void
  onRename: (item: ShoppingItem, name: string) => void
  onRemove: (item: ShoppingItem) => void
  onRowRetract: (item: ShoppingItem) => void
  /** Row-scoped failures, keyed by item id. A check that did not reach the
      server is a person in an aisle believing a thing is in the cart, so it
      reports on the row they tapped, never in the page chrome (M5.5/3). A
      retract refused at the boundary lands here too — the row is still there to
      carry the message (ADR 073 §2). */
  rowErrors: Record<string, string>
}

/* The /shopping surface (design.md §Anatomy, artifact frames S1/S2). The capture
   field is the hero at rest and the aisle-ordered list is the page; neither is a
   mode, and the field simply scrolls away under the thumb in a shop. There is no
   index of lists and no drill-in — the destination strip both swaps the list in
   place and says where an add will land, which is one control, not two. No spine,
   no hue, no avatar (ADR 064): "who added the milk" is not a question this list
   answers, so provenance is a text fact.

   Row chrome is exactly leading ring, `card-title` name, optional `sm` note —
   nothing else, at any tier (SH-08). Every other verb is behind the row's own
   gesture. */
export function ShoppingPageView({
  lists,
  selectedListId,
  onSelectList,
  groups,
  loading,
  onAdd,
  reports,
  canAdd,
  layout,
  totalOpenCount,
  onShowLists,
  onBackToCapture,
  canCheck,
  canFile,
  canManage,
  canRetract,
  inlineActions,
  onToggle,
  onRefile,
  onRename,
  onRemove,
  onRowRetract,
  rowErrors,
}: ShoppingPageViewProps) {
  // Local to the view since SH-13: the echo says the field is live and Enter
  // commits, which is a fact about THIS field. Nothing above needs the draft, so
  // nothing above holds it.
  const [composing, setComposing] = useState(false)
  const [sheetItem, setSheetItem] = useState<ShoppingItem | null>(null)
  const selected = lists.find((l) => l.id === selectedListId)
  const destination = selected?.name ?? 'the list'
  // Aisles belong to the LIST, not to the app — a hardware run has none of ours,
  // so it renders flat rather than filing every screw under Other.
  const showAisles = selected?.groupByAisle ?? true
  const capturing = layout === 'capture'

  // Derived from what is actually drawn, never from the index count — the two
  // disagree while a list read is in flight, and a meter is a claim about the
  // rows on screen.
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  const got = groups.reduce((n, g) => n + g.items.filter((i) => i.status === 'got').length, 0)
  const needed = total - got
  const cleared = total > 0 && needed === 0

  /* ONE control, not two (Zach, 2026-09-04). The field used to carry a
     destination chip while this row filtered the list — two controls in similar
     clothes answering "which list?" differently. The selected pill is now both:
     what you are looking at, and where an add goes. That is also what makes
     Costco reachable from the capture screen, which had no way to it at all.

     Its count is what is LEFT on that list, which is the same arithmetic the
     sticky line below reports (SH-10) — the two cannot disagree. */
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
          openCount={totalOpenCount}
          destinations={destinations}
          onShowLists={onShowLists}
          loading={loading}
          destination={selected?.name ?? null}
          onAdd={onAdd}
          reports={reports}
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

          {/* Nothing on the trailing edge (design.md §Anatomy 1, amended
              2026-09-04). The cumulative cross-list count that lived here is
              deleted, not relabelled: you shop one destination, so a figure
              spanning all of them names no trip — and it put a third arithmetic
              on a screen that already had two. */}
          <PageHeader className="mb-0 items-baseline" title="Shopping" />

          <CaptureField
            size="hero"
            className="mt-3.5"
            // Deliberately NOT autofocused (ADR 070): an unrequested keyboard on
            // a route you opened to read is hostile.
            placeholder={`Add to ${destination}`}
            label={`Add to ${destination}`}
            disabled={!canAdd}
            onValueChange={(value) => setComposing(value.trim().length > 0)}
            onSubmit={onAdd}
          />

          {/* Tight to the field, because it IS the field's destination control
              and proximity is the only thing that says so. The larger gap goes
              below the pair, separating the whole unit from the list. */}
          <div className="mt-3">{destinations}</div>

          {/* Everything that reports on the field sits under the pair, in a slot
              that reserves its height — mounted on the first keystroke it shoves
              the list down and back on Enter. */}
          <ReportLine
            reports={reports}
            idle={
              !canAdd
                ? 'Adding to the list is turned off for this profile.'
                : composing
                  ? 'Enter to add'
                  : undefined
            }
          />
        </>
      )}

      {/* Artifact S3, the same screen scrolled. It sticks rather than switching —
          the hero goes under the thumb and this is what is left above the fold,
          so the shopper never scrolls up to ask how far along they are.

          Its height is reserved from the first paint (SH-12). It used to mount on
          the first check, which shoved the row the thumb was still over down ~58px
          mid-interaction. ADR 043's rule — no comparison until there is progress
          to compare — is about what the block SAYS, so the block goes quiet
          rather than absent. */}
      {!capturing && total > 0 && (
        // Sticky while there is a walk left to follow. The finish is not: it is
        // read once, and a block this tall following the scroll would take the
        // aisles the shopper is unchecking from with it.
        <div className={cn('bg-background pt-2.5 pb-2', !cleared && 'sticky top-0 z-30')}>
          {cleared ? (
            <ClearedList
              destination={destination}
              total={total}
              aisles={groups.length}
              showAisles={showAisles}
            />
          ) : (
            <div className={cn(got === 0 && 'invisible')} aria-hidden={got === 0}>
              {/* `{list} · {n} left` — the figure at `heading`, the name and the
                  word at `sm`, so what is LEFT reads first and the list it
                  belongs to reads second. Same number as the pill above, counted
                  over the same rows (SH-10/11). */}
              <span className="block">
                <span className="text-sm-token text-muted-foreground">{destination} · </span>
                <span className="text-heading text-foreground">{needed}</span>
                <span className="text-sm-token text-muted-foreground"> left</span>
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
              canManage={canManage}
              canRetract={canRetract}
              hasSheetVerb={canFile || canManage || canRetract}
              onToggle={onToggle}
              onOpenSheet={setSheetItem}
              onRemove={onRemove}
              onRowRetract={onRowRetract}
              sheetItemId={sheetItem?.id ?? null}
              rowErrors={rowErrors}
              actionsPanel={
                inlineActions
                  ? (item) => (
                      <RowActionsPanel
                        item={item}
                        onClose={() => setSheetItem(null)}
                        canFile={canFile}
                        canManage={canManage}
                        canRetract={canRetract}
                        onRefile={onRefile}
                        onRename={onRename}
                        onRemove={onRemove}
                        onRetract={onRowRetract}
                      />
                    )
                  : undefined
              }
            />
          )}
        </div>
      )}

      {/* Narrow only — the wide layout renders the same body inline, in the row's
          own place in the list. */}
      {!inlineActions && (
        <RowActionsSheet
          item={sheetItem}
          onClose={() => setSheetItem(null)}
          canFile={canFile}
          canManage={canManage}
          canRetract={canRetract}
          onRefile={onRefile}
          onRename={onRename}
          onRemove={onRemove}
          onRetract={onRowRetract}
        />
      )}
    </PageContainer>
  )
}

/* The walk gets an ending (SH-07, artifact E6). It replaces the meter and
   NOTHING else: the field, the destination pills and every aisle summary stay
   mounted and interactive, because ADR 071 §2 requires the uncheck to be
   reachable by the person standing in the aisle. Adding an item or unchecking a
   row returns the list to its normal shape in the same render — there is no
   dismissal and no state to get stuck in.

   Per-list: clearing Grocery says nothing about Costco, and the pills keep their
   own counts. */
function ClearedList({
  destination,
  total,
  aisles,
  showAisles,
}: {
  destination: string
  total: number
  aisles: number
  showAisles: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2 pt-2 pb-1">
      {/* The ring is the product's own mark — the thing you pressed seventeen
          times, once at size. No new iconography. */}
      <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-primary bg-primary text-primary-foreground">
        <Check size={20} strokeWidth={3} aria-hidden />
      </span>
      <p className="text-heading text-foreground">That&rsquo;s everything.</p>
      <p className="text-sm-token text-center text-muted-foreground">
        {total} thing{total === 1 ? '' : 's'}
        {showAisles && `, ${aisles} aisle${aisles === 1 ? '' : 's'}`}, {destination} is clear.
      </p>
    </div>
  )
}

interface ItemListProps {
  groups: AisleGroup[]
  showAisles: boolean
  canCheck: boolean
  canManage: boolean
  canRetract: boolean
  hasSheetVerb: boolean
  onToggle: (item: ShoppingItem) => void
  onOpenSheet: (item: ShoppingItem) => void
  onRemove: (item: ShoppingItem) => void
  onRowRetract: (item: ShoppingItem) => void
  sheetItemId: string | null
  rowErrors: Record<string, string>
  /** Tablet and up — renders the open row's verbs directly under it. Undefined
      on a phone, where the bottom sheet carries them instead. */
  actionsPanel?: (item: ShoppingItem) => ReactNode
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
  canManage,
  canRetract,
  hasSheetVerb,
  onToggle,
  onOpenSheet,
  onRemove,
  onRowRetract,
  sheetItemId,
  rowErrors,
  actionsPanel,
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
              <Fragment key={item.id}>
                <Row
                  item={item}
                  canCheck={canCheck}
                  canManage={canManage}
                  canRetract={canRetract}
                  hasSheetVerb={hasSheetVerb}
                  sheetOpen={sheetItemId === item.id}
                  error={rowErrors[item.id]}
                  onToggle={() => {
                    setOpened((open) =>
                      open.includes(group.aisle) ? open : [...open, group.aisle]
                    )
                    onToggle(item)
                  }}
                  onOpenSheet={() => onOpenSheet(item)}
                  onRemove={() => onRemove(item)}
                  onRetract={() => onRowRetract(item)}
                />
                {sheetItemId === item.id && actionsPanel?.(item)}
              </Fragment>
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
  canManage: boolean
  canRetract: boolean
  hasSheetVerb: boolean
  sheetOpen: boolean
  error?: string
  onToggle: () => void
  onOpenSheet: () => void
  onRemove: () => void
  onRetract: () => void
}

function Row({
  item,
  canCheck,
  canManage,
  canRetract,
  hasSheetVerb,
  sheetOpen,
  error,
  onToggle,
  onOpenSheet,
  onRemove,
  onRetract,
}: RowProps) {
  const got = item.status === 'got'
  /* Two verbs, two endpoints, and they read differently to the person holding
     the phone: `manage` REMOVES anyone's row and is tier 4, while `retract` takes
     back your own recent add and is tier 1 (ADR 073). Eligibility for the second
     is the payload's `canRetract` — the server owns the clock and `added_by`
     never reaches the client — never a client clock and never a position in a
     strip (ADR 073 §2). The left edge binds nothing when neither is permitted. */
  const quick = canManage
    ? { label: 'Remove', onFire: onRemove }
    : canRetract && item.canRetract
      ? { label: 'Take it back', onFire: onRetract }
      : undefined

  return (
    <RowSwipe
      label={item.name}
      quick={quick}
      onOpenActions={hasSheetVerb ? onOpenSheet : undefined}
      actionsOpen={sheetOpen}
    >
      <ListRow
        leading={<Ring checked={got} />}
        dimmed={got}
        onActivate={canCheck ? onToggle : undefined}
        activateLabel={got ? `Put “${item.name}” back on the list` : `Mark “${item.name}” as got`}
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
    </RowSwipe>
  )
}

/* The leading slot ListRow renders but does not define (ADR 063). It is
   deliberately NOT a button: the whole row is the target, and a control sitting
   above the activation overlay would carve a hole in it exactly where the eye
   aims. `ListRow` makes the slot inert on an activatable row for that reason.

   SH-14 is motion and nothing else (D7): the fill takes `--duration-fast` and the
   ring goes 1 → 1.08 → 1, once, on the transition into checked. No bounce, and
   nothing at all under `prefers-reduced-motion`. A page arriving with rows
   already checked does not pop them — the animation is a receipt for an act, so
   it runs on the act. */
function Ring({ checked }: { checked: boolean }) {
  const [popping, setPopping] = useState(false)
  const was = useRef(checked)

  useEffect(() => {
    if (checked && !was.current) setPopping(true)
    was.current = checked
  }, [checked])

  return (
    <>
      <style href="shopping-ring" precedence="default">{`
        @keyframes shoppingRingPop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        [data-shopping-ring='popping'] {
          animation: shoppingRingPop var(--duration-fast) var(--ease-out);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-shopping-ring='popping'] { animation: none; }
        }
      `}</style>
      <span
        aria-hidden
        data-shopping-ring={popping ? 'popping' : 'idle'}
        onAnimationEnd={() => setPopping(false)}
        className={cn(
          'grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-[var(--duration-fast)]',
          checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
        )}
      >
        {checked && <Check size={14} strokeWidth={3} />}
      </span>
    </>
  )
}
