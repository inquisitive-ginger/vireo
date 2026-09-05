import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useDrag } from '@use-gesture/react'
import { cn } from '../lib/utils'

/* Geometry and timings are the polish critique's E1 spec block, lifted whole.
   They are component-internal, which is the exemption the spacing rules grant
   (ADR 068 §3) — nothing outside this file reads them. */
const QUICK_REVEAL = 112
const QUICK_THRESHOLD = 56
const MORE_REVEAL = 96
const MORE_THRESHOLD = 96
const MORE_THRESHOLD_FRACTION = 0.4
const AXIS_LOCK = 8
const LONG_PRESS_MS = 500

/* One row is open at a time, across every instance — a second reveal closes the
   first. A module-level handle rather than a context: the rows that need this are
   siblings in one list, and a provider a consumer can forget to mount is a rule
   that silently stops holding. */
let openRow: (() => void) | null = null

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const listen = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', listen)
    return () => query.removeEventListener('change', listen)
  }, [])
  return reduced
}

export interface RowSwipeProps {
  /** What the row is about — builds the revealed control's accessible name. */
  label: string
  /** The left edge (drag right): the one verb that earns a shortcut. Omitted and
      the left edge binds NOTHING — it must never reveal a button that will 403,
      so the caller passes this only when the verb is permitted on this row. */
  quick?: { label: string; onFire: () => void }
  /** The right edge (drag left): opens the caller's permission-filtered sheet.
      Omitted and the right edge binds nothing, by the same rule. */
  onOpenActions?: () => void
  /** Whether that sheet is open, so focus returns to the row when it closes.
      The sheet itself belongs to the caller — it is the permission filter. */
  actionsOpen?: boolean
  /** A drag has STARTED on this row — past the axis lock, so a tap never fires
      it. It reports the reach, not the outcome: the caller uses it to dismiss
      whatever another row has standing open, because someone dragging here has
      already moved on from there. */
  onGestureStart?: () => void
  /** Word on the right edge's revealed strip. */
  actionsLabel?: string
  children: ReactNode
}

/* The two-edge row affordance (SH-09), beside `ListRow` rather than inside it:
   the row primitive owns height, hairline and activation, and a gesture layer
   that also owned those would be a second row primitive wearing the first one's
   name.

   Drag right and the left edge reveals one verb, which fires on TAP — revealed,
   not fired, because removal is a hard delete both ways (ADR 073 §4) and an undo
   would re-create the row with a new id and a reset retract clock. Drag left and
   the right edge opens the caller's sheet on release, where the rest of the verbs
   live. Zero permitted verbs binds no gesture on either edge.

   It wraps the row, it does not reach into it: `ListRow`'s activation overlay
   keeps its full width and stays live at any offset, so nothing carves a hole in
   the target the thumb aims for (ADR 068 §3 — the check ring shipped exactly that
   bug in M5.5/4). A drag never fires the check. */
export function RowSwipe({
  label,
  quick,
  onOpenActions,
  actionsOpen = false,
  actionsLabel = 'Edit',
  onGestureStart,
  children,
}: RowSwipeProps) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<(() => void) | null>(null)
  // A horizontal drag ends in a click on whatever was under the finger, which on
  // an activatable row is the check. Swallowed in the capture phase, before it
  // reaches the overlay.
  const draggedRef = useRef(false)
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  const bound = quick !== undefined || onOpenActions !== undefined

  const close = useCallback(() => {
    setOffset(0)
    if (openRow === closeRef.current) openRow = null
  }, [])
  closeRef.current = close

  const openQuick = useCallback(() => {
    if (openRow && openRow !== closeRef.current) openRow()
    openRow = closeRef.current
    setOffset(QUICK_REVEAL)
  }, [])

  const openActions = useCallback(() => {
    if (!onOpenActions) return
    returnFocusRef.current = document.activeElement as HTMLElement | null
    close()
    onOpenActions()
  }, [close, onOpenActions])

  // Radix declines to restore focus on close (the sheet suppresses its own
  // auto-focus so a dismissed sheet does not yank the page), so the row that
  // opened it puts focus back where the reader left it.
  const wasOpen = useRef(actionsOpen)
  useEffect(() => {
    if (wasOpen.current && !actionsOpen) returnFocusRef.current?.focus()
    wasOpen.current = actionsOpen
  }, [actionsOpen])

  // A scroll closes the open row: the reader has moved on, and a revealed
  // `Remove` left under a thumb travelling down a list is the one thing this
  // affordance exists not to be.
  useEffect(() => {
    if (offset === 0) return
    const onScroll = () => close()
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => window.removeEventListener('scroll', onScroll, { capture: true })
  }, [offset, close])

  useEffect(
    () => () => {
      if (openRow === closeRef.current) openRow = null
      if (longPressRef.current) clearTimeout(longPressRef.current)
    },
    []
  )

  const bind = useDrag(
    ({ movement: [mx], last, first }) => {
      if (first) {
        draggedRef.current = true
        setDragging(true)
        if (longPressRef.current) clearTimeout(longPressRef.current)
        if (openRow && openRow !== closeRef.current) openRow()
        // Fired at the START, not at the threshold: reaching for another row is
        // the moment the reader left the one they had open, whether or not this
        // drag goes anywhere.
        onGestureStart?.()
      }
      const width = boxRef.current?.offsetWidth ?? MORE_THRESHOLD
      const moreThreshold = Math.min(MORE_THRESHOLD, width * MORE_THRESHOLD_FRACTION)

      if (!last) {
        // Rubber-banded to the reveal width on the edge that has a verb, and
        // pinned at 0 on the edge that does not: an edge with nothing behind it
        // does not move at all, so it never promises a control.
        const clamped =
          mx > 0
            ? quick
              ? Math.min(mx, QUICK_REVEAL)
              : 0
            : onOpenActions
              ? Math.max(mx, -MORE_REVEAL)
              : 0
        setOffset(clamped)
        return
      }

      setDragging(false)
      if (quick && mx >= QUICK_THRESHOLD) openQuick()
      else if (onOpenActions && -mx >= moreThreshold) openActions()
      else close()
    },
    {
      enabled: bound,
      axis: 'x',
      threshold: AXIS_LOCK,
      filterTaps: true,
      pointer: { touch: true },
    }
  )

  function cancelLongPress() {
    if (longPressRef.current) clearTimeout(longPressRef.current)
  }

  if (!bound) return <>{children}</>

  return (
    <div
      ref={boxRef}
      className="relative overflow-hidden"
      onKeyDown={(e) => {
        // The sheet's keyboard route, and only the sheet's: the left edge is a
        // shortcut, not a second API, so it has none (E1).
        if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
          e.preventDefault()
          openActions()
        } else if (e.key === 'Escape' && offset !== 0) {
          e.preventDefault()
          close()
        }
      }}
      onContextMenu={(e) => {
        if (!onOpenActions) return
        e.preventDefault()
        openActions()
      }}
      onPointerDown={(e) => {
        // Cleared here rather than in the click handler: a drag that ends without
        // one — a touch released off the row — would otherwise leave the flag set
        // and swallow the next honest tap.
        draggedRef.current = false
        // Anything that is NOT a mouse arms the long press — touch, pen, and a
        // pointer that declines to say. A mouse is the only one excluded, and
        // only because it has `contextmenu`, which is the better route when it
        // exists. Written as an exclusion on purpose: on a wall tablet this is
        // the ONLY way to a row's verbs — no keyboard, no right-click — so a
        // pointer type nobody anticipated must fall on the side that still works.
        if (e.pointerType === 'mouse' || !onOpenActions) return
        longPressRef.current = setTimeout(openActions, LONG_PRESS_MS)
      }}
      onPointerUp={cancelLongPress}
      onPointerCancel={cancelLongPress}
      onPointerLeave={cancelLongPress}
      onClickCapture={(e) => {
        // The revealed control is the one thing a tap must always reach — it IS
        // the affordance the drag opened.
        if ((e.target as HTMLElement).closest('[data-row-swipe-quick]')) return
        // The drag's trailing click, or a tap on a row that is standing open —
        // neither is a check. The second closes instead, which is the cheapest
        // way out of a reveal nobody meant to open.
        if (draggedRef.current) {
          draggedRef.current = false
          e.preventDefault()
          e.stopPropagation()
        } else if (offset !== 0) {
          e.preventDefault()
          e.stopPropagation()
          close()
        }
      }}
    >
      {/* A strip is visible ONLY while its own row is offset. The container clips
          and the moving layer is opaque, so at rest they were already covered —
          but both of those are guesses about what is painted around the row, and
          a strip bleeding onto a row nobody is touching is the worst kind of
          wrong: it advertises a destructive verb on the wrong item. `invisible`
          makes it an invariant rather than a consequence.

          Both are `aria-hidden` and neither is reachable by keyboard: they are
          pointer shortcuts for verbs the sheet already offers, and a verb in the
          tab order twice is the second API E1 declines to build. */}
      {quick && (
        <div
          // The gap is INSIDE the reveal, not a change to it: the strip still
          // travels 112px and still fires at 56px, but the block stops short of
          // the row's own content. Flush, the check ring read as part of the
          // button rather than part of the row.
          className={cn('absolute inset-y-0 left-0 flex pr-3', offset === 0 && 'invisible')}
          style={{ width: QUICK_REVEAL }}
          aria-hidden
        >
          <button
            type="button"
            // Revealed, not fired — one drag plus one tap, no dialog.
            tabIndex={-1}
            data-row-swipe-quick
            title={`${quick.label} “${label}”`}
            onClick={() => {
              close()
              quick.onFire()
            }}
            className="text-sm-token flex w-full cursor-pointer items-center justify-center rounded-r-panel bg-error px-2 text-center font-medium text-error-foreground"
          >
            {quick.label}
          </button>
        </div>
      )}
      {onOpenActions && (
        <div
          className={cn('absolute inset-y-0 right-0 flex pl-3', offset === 0 && 'invisible')}
          style={{ width: MORE_REVEAL }}
          aria-hidden
        >
          <span className="text-sm-token flex w-full items-center justify-center rounded-l-panel bg-secondary font-medium text-secondary-foreground">
            {actionsLabel}
          </span>
        </div>
      )}
      <div
        {...bind()}
        className={cn('relative touch-pan-y bg-background', dragging && 'select-none')}
        style={{
          transform: `translateX(${offset}px)`,
          transition:
            dragging || reduced ? 'none' : 'transform var(--duration-fast) var(--ease-out)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
