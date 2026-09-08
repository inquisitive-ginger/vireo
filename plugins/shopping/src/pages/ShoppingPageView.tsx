import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, ChevronDown, ChevronLeft, ChevronUp, Loader2, ShoppingCart, X } from 'lucide-react'
import { ShoppingItemNameSchema, type ShoppingAisle } from '@family-os/schemas'
import {
  CaptureField,
  Chip,
  EmptyState,
  ListRow,
  PageContainer,
  PageHeader,
  RowSwipe,
  SectionLabel,
  cn,
  useReducedMotion,
} from '@family-os/ui'
import type { CaptureReport, ShoppingItem, ShoppingList } from '../types'
import { OfflinePill } from '../components/OfflinePill'
import { ReportLine } from '../components/ReportLine'
import { ShoppingCaptureHero } from './ShoppingCaptureHero'
import { RowActionsPanel, RowActionsSheet } from './RowActionsSheet'
import { ClearListMenu, type ClearScope } from './ClearListMenu'
import { removalVerb } from '../lib/removal-verb'

/** Long enough for the check's own motion to land before the aisle folds. Must
    track `--duration-fast`, which is what the ring's fill and its 1 → 1.08 → 1
    pop both run at; the extra is the eye catching up with it. */
const FOLD_AFTER_MS = 220

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
  /** No route to the server. It closes the field and raises the pill; it does
      NOT touch the rows, which is the whole point — checking is what still
      works. */
  offline: boolean
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
  /** Recycling the list or throwing it away — both `manage`, both hard deletes.
      A profile without the key sees no menu at all, rather than one that 403s. */
  onClear: (scope: ClearScope) => void
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
  offline,
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
  onClear,
  rowErrors,
}: ShoppingPageViewProps) {
  // Local to the view since SH-13: the echo says the field is live and Enter
  // commits, which is a fact about THIS field. Nothing above needs the draft, so
  // nothing above holds it.
  const [composing, setComposing] = useState(false)
  const [sheetItem, setSheetItem] = useState<ShoppingItem | null>(null)
  // Renaming happens on the ROW, at both widths (Zach, list pass). On a phone the
  // browser scrolls a focused input above the keyboard the way it does for every
  // other field on the page, which is the actual fix for the occlusion a sheet
  // field had; on a tablet it means the inline panel never has to host one.
  const [renamingId, setRenamingId] = useState<string | null>(null)
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
    /* The capture layout fills the shell's `main` and does not scroll —
       `design.md` §"One surface, two layouts" says the block fills the screen,
       and a screen that scrolls is not filled. `className`, never padding:
       `PageContainer`'s gutters are not a prop (CLAUDE.md). The LIST layout at
       either width keeps scrolling; it is a long list and always was. */
    <PageContainer width="list" className={capturing ? 'h-full' : undefined}>
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
          offline={offline}
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

          <OfflinePill offline={offline} />

          <CaptureField
            size="hero"
            className="mt-3.5"
            // Deliberately NOT autofocused (ADR 070): an unrequested keyboard on
            // a route you opened to read is hostile.
            placeholder={`Add to ${destination}`}
            label={`Add to ${destination}`}
            // An add needs the server: it resolves the aisle against the family's
            // overrides and it is what finds the duplicate. A queued one would
            // land in an aisle nobody chose and report a collision long after the
            // person who caused it walked away — so the field REFUSES rather than
            // promising something it cannot keep. Checking is unaffected, which is
            // what the line below says.
            disabled={!canAdd || offline}
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
                : offline
                  ? 'Adding needs a connection. Checking things off still works.'
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
              onRecycle={canManage ? () => onClear('checked') : undefined}
            />
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                {/* `{n} items left` — the figure at `heading`, the words at `sm`,
                    so what is LEFT reads first. It carries no list name: the
                    destination pills sit directly above and a line that repeats
                    its neighbour is a line people stop reading. This reverses
                    SH-11, which put the name here; the pills had not yet been
                    settled as the permanent thing above it.

                    The block paints from first paint rather than waiting for a
                    check, because the menu beside it needs an anchor — a `⋯`
                    hovering against nothing reads as a mis-render. ADR 043's
                    "no meter at zero" is amended for this surface in the same
                    PR; the general rule stands elsewhere. SH-12 is untouched:
                    the height was already reserved, and now it is also drawn. */}
                <span>
                  <span className="text-heading text-foreground">{needed}</span>
                  <span className="text-sm-token text-muted-foreground">
                    {' '}
                    item{needed === 1 ? '' : 's'} left
                  </span>
                </span>
                {/* On the sticky line rather than beside the destination pills
                    (Zach's correction): the moment you want to bin a list is the
                    moment you are at the bottom of a long one, and only this
                    block is still on screen there. */}
                {canManage && <ClearListMenu got={got} total={total} onClear={onClear} />}
              </div>
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
            </>
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
            /* The zero-items case, which is NOT the cleared state (SH-07) —
               that one is a finish, this one is a beginning. No `action`: the
               capture field is directly above and is the action, and a CTA that
               focuses it would be the autofocus ADR 070 withdrew. */
            <EmptyState
              icon={ShoppingCart}
              heading={`Nothing on ${destination} yet.`}
              body="Add something in the field above."
            />
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
              onDismissActions={() => setSheetItem(null)}
              onRemove={onRemove}
              onRowRetract={onRowRetract}
              sheetItemId={sheetItem?.id ?? null}
              renamingId={renamingId}
              onFinishRename={(item, name) => {
                setRenamingId(null)
                if (name && name !== item.name) onRename(item, name)
              }}
              rowErrors={rowErrors}
              actionsPanel={
                inlineActions
                  ? (item) => (
                      <RowActionsPanel
                        inline
                        item={item}
                        onClose={() => setSheetItem(null)}
                        canFile={canFile}
                        canManage={canManage}
                        canRetract={canRetract}
                        onRefile={onRefile}
                        onStartRename={() => {
                          setSheetItem(null)
                          setRenamingId(item.id)
                        }}
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
          onStartRename={(item: ShoppingItem) => {
            setSheetItem(null)
            setRenamingId(item.id)
          }}
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
  onRecycle,
}: {
  destination: string
  total: number
  aisles: number
  showAisles: boolean
  /** Undefined below `manage` — the button is absent rather than refused. */
  onRecycle?: () => void
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
      {/* Finishing a shop is exactly when you bin a paper list, so the recycle
          gets a real button here rather than staying behind the menu. Same
          two-step confirmation, naming the same count — there is no undo. */}
      {/* NO confirmation here, unlike the menu's two verbs. Everything on this
          list is already bought, so there is nothing to lose by removing it, and
          a confirm on the one action that is unambiguously good news is friction
          for its own sake. Mid-shop is the opposite case: unchecked rows are
          still on screen and the count is the warning. */}
      {onRecycle && (
        <button
          type="button"
          onClick={onRecycle}
          className="text-body min-h-touch mt-1 cursor-pointer rounded-panel border border-border px-4 font-medium text-foreground hover:bg-secondary"
        >
          Start a fresh list
        </button>
      )}
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
  /** A drag starting anywhere in the list closes whatever is standing open —
      reaching for another row is the moment the reader left the one they had. */
  onDismissActions: () => void
  onRemove: (item: ShoppingItem) => void
  onRowRetract: (item: ShoppingItem) => void
  sheetItemId: string | null
  /** The row currently being renamed in place, if any. */
  renamingId: string | null
  /** Empty or unchanged name means cancel — the caller decides, so Escape and a
      blur that changed nothing take the same path. */
  onFinishRename: (item: ShoppingItem, name: string | null) => void
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
  onDismissActions,
  onRemove,
  onRowRetract,
  sheetItemId,
  renamingId,
  onFinishRename,
  rowErrors,
  actionsPanel,
}: ItemListProps) {
  /* A complete aisle collapses, including the one you just completed. The fold IS
     the message — clearing an aisle is the one moment in a shop that says "done
     here, move on", and holding it open makes the shopper learn that by reading a
     summary that has not changed.

     It waits for the check's own motion first: the ring fills and pops, THEN the
     aisle closes, so the fold reads as a consequence of the tap rather than as
     the tap having done something else. Under `prefers-reduced-motion` there is
     nothing to wait for and it folds at once.

     ADR 071 §2 still binds and still holds: the uncheck is one tap on the
     summary away. "The aisle collapsed and took the row with it" is a bug report
     someone will file about correct behaviour — the reopen is the answer.

     Overrides are SESSION-ONLY, deliberately: nothing is stored and nothing
     syncs, so a fresh arrival always sees the shop in its truthful state. */
  const [openOverride, setOpenOverride] = useState<Record<string, boolean>>({})
  const [folding, setFolding] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()

  return (
    <>
      {groups.map((group, i) => {
        const complete = group.items.every((item) => item.status === 'got')
        // A flat list has no aisles of ours, so it has no cleared aisle either —
        // collapsing its single pseudo-group would hide the whole list behind a
        // summary of a grouping its shopper cannot see. The meter still works
        // there; only the collapse is aisle-coupled.
        const collapsed =
          showAisles && complete && openOverride[group.aisle] !== true && folding !== group.aisle

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
              onActivate={() => setOpenOverride((o) => ({ ...o, [group.aisle]: true }))}
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
            {showAisles &&
              // A complete aisle that is open was opened by hand (or by the check
              // that completed it), so its header is the way back to closed —
              // tapping reopens, tapping again closes. An incomplete aisle has
              // nothing to collapse and stays a label.
              //
              // Both are `SectionLabel`: the two states differ in what they DO,
              // never in where they sit, and they alternate down one list where
              // a step between them would read as a mistake. `px-4` is the edge
              // `ListRow` holds (F-10), which a collapsed aisle also sits on.
              (complete ? (
                <SectionLabel
                  as="button"
                  type="button"
                  leading={i === 0}
                  onClick={() => setOpenOverride((o) => ({ ...o, [group.aisle]: false }))}
                  aria-expanded
                  className="min-h-touch flex w-full cursor-pointer items-center gap-1.5 px-4 text-left text-muted-foreground"
                >
                  {group.aisle}
                  <ChevronUp size={14} aria-hidden />
                </SectionLabel>
              ) : (
                <SectionLabel leading={i === 0} className="px-4 text-muted-foreground">
                  {group.aisle}
                </SectionLabel>
              ))}
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
                    /* Any toggle drops a manual override: a check that completes
                       the aisle folds it, and an uncheck makes it incomplete so
                       it stays open on its own. Neither needs the override. */
                    setOpenOverride((o) => {
                      if (!(group.aisle in o)) return o
                      const next = { ...o }
                      delete next[group.aisle]
                      return next
                    })
                    // Held open just long enough for the ring to finish, so the
                    // fold reads as the consequence of a check that landed.
                    if (!reducedMotion) {
                      setFolding(group.aisle)
                      window.setTimeout(() => setFolding(null), FOLD_AFTER_MS)
                    }
                    onToggle(item)
                  }}
                  onOpenSheet={() => onOpenSheet(item)}
                  onDismissActions={onDismissActions}
                  onRemove={() => onRemove(item)}
                  onRetract={() => onRowRetract(item)}
                  renaming={renamingId === item.id}
                  onFinishRename={(name) => onFinishRename(item, name)}
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
  onDismissActions: () => void
  onRemove: () => void
  onRetract: () => void
  renaming: boolean
  onFinishRename: (name: string | null) => void
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
  onDismissActions,
  onRemove,
  onRetract,
  renaming,
  onFinishRename,
}: RowProps) {
  const got = item.status === 'got'
  /* ONE removal verb, never two: `manage` wins over `retract` because they are
     the same act to the person holding the phone. The decision lives in
     `removalVerb` and the row's SHEET reads it from the same place —
     deliberately, not by coincidence. It was stated twice before this, and the
     copy in the sheet was the one that was wrong. Labels stay local, because the
     two surfaces say it differently; only the decision is shared. The edge binds
     nothing when neither verb is permitted. */
  const verb = removalVerb(item, canManage, canRetract)
  const quick =
    verb === 'remove'
      ? { label: 'Remove', onFire: onRemove }
      : verb === 'retract'
        ? { label: 'Take it back', onFire: onRetract }
        : undefined

  /* While renaming, the row is a field and nothing else: no gesture, no check.
     A drag or a whole-row tap on a row you are editing is a mis-tap every time. */
  if (renaming) {
    return (
      <ListRow leading={<Ring checked={got} />}>
        <div className="min-w-0 flex-1 py-1.5">
          <RenameField name={item.name} onFinish={onFinishRename} />
        </div>
      </ListRow>
    )
  }

  return (
    <RowSwipe
      label={item.name}
      quick={quick}
      onOpenActions={hasSheetVerb ? onOpenSheet : undefined}
      actionsOpen={sheetOpen}
      onGestureStart={onDismissActions}
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

/* Renaming happens where the row already is, at BOTH widths (Zach, list pass).
   A field inside a bottom sheet on a phone sat under the keyboard; a field on the
   row is scrolled above it by the browser, the same as every other input on the
   page. Enter commits, blur commits — a rename is one word, and a person who
   taps away from it has finished, not abandoned it. Cancelling is Escape AND a
   × on the row: a fridge iPad has no Escape key, so the keyboard-only exit was
   no exit at all (auto-bug #141). The cap is the schema's own, never a copy of
   the number. */
function RenameField({
  name,
  onFinish,
}: {
  name: string
  onFinish: (name: string | null) => void
}) {
  const [draft, setDraft] = useState(name)
  const cancelled = useRef(false)

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <input
        autoFocus
        value={draft}
        maxLength={ShoppingItemNameSchema.maxLength ?? undefined}
        aria-label={`Rename “${name}”`}
        enterKeyHint="done"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onFinish(draft.trim() || null)
          } else if (e.key === 'Escape') {
            e.preventDefault()
            // Marked before blur so the blur that follows does not commit it.
            cancelled.current = true
            onFinish(null)
          }
        }}
        onBlur={() => {
          // The mark survives the blur the cancel button itself causes, and
          // turns that blur INTO the cancel: a pointer that goes down on × and
          // lifts somewhere else never fires a click, and a field left focusless
          // in rename mode is the same dead end being fixed here.
          if (cancelled.current) {
            onFinish(null)
            return
          }
          onFinish(draft.trim() || null)
        }}
        className="text-card-title min-h-touch w-full min-w-0 flex-1 rounded-card border border-input bg-card px-2 text-foreground outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
      />
      <button
        type="button"
        // Down, not click: the click arrives after the blur, and the blur is
        // what commits. Marking here is what tells that blur to cancel instead.
        onPointerDown={() => {
          cancelled.current = true
        }}
        onClick={() => onFinish(null)}
        aria-label={`Stop renaming “${name}”`}
        className="min-h-touch flex w-touch shrink-0 cursor-pointer items-center justify-center rounded-panel text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <X size={18} aria-hidden />
      </button>
    </div>
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
