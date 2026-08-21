import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react'

/* A home-widget list renders into a slot whose height is a function of the
   viewport (`WidgetGrid` derives the row height from its container), so no
   variant can know at author time how many rows it has room for. Left to CSS,
   `overflow: hidden` cuts the last row through the middle — which reads as a
   broken tile, not as "there is more", and the reader has no way to tell the
   difference. This measures instead: render every row once, cache each row's
   bottom offset, then show only the whole rows that fit and let the caller state
   the remainder.

   Calendar's up-next widget shipped this first; chores' today-summary was
   clipping mid-tile with a fourth family member on the fridge iPad (auto-bug
   #70). It lives here so the two can't drift. */

export interface FitRows<T> {
  /** The measured box — the flex child that owns the available height. */
  boxRef: RefObject<HTMLDivElement | null>
  /** The list inside the box; its direct children are the rows, in order. */
  listRef: RefObject<HTMLDivElement | null>
  /** The rows that fit — every row during the measuring pass. */
  shown: T[]
  /** How many rows the clamp dropped. Always 0 while measuring. */
  hiddenCount: number
  /** True on the pass that renders every row to measure it. The caller must not
      render its "+N more" line while this is true or it flashes on every reflow. */
  measuring: boolean
}

export function useFitRows<T>(rows: T[], reserve: number): FitRows<T> {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const bottomsRef = useRef<number[]>([])
  const [cut, setCut] = useState(rows.length)
  const [measured, setMeasured] = useState<T[] | null>(null)
  const measuring = measured !== rows

  const clamp = useCallback(
    (avail: number) => {
      const bottoms = bottomsRef.current
      // +1: rects are subpixel and clientHeight rounds — a list that fills its
      // box exactly must never lose its last row to a 0.4px overhang.
      if (avail <= 0 || bottoms.length !== rows.length || bottoms[rows.length - 1] <= avail + 1) {
        setCut(rows.length)
        return
      }
      const limit = avail - reserve
      let c = rows.length
      for (let i = 0; i < rows.length; i++) {
        if (bottoms[i] > limit) {
          c = i
          break
        }
      }
      setCut(c)
    },
    [rows, reserve]
  )

  useLayoutEffect(() => {
    if (!measuring) return
    const box = boxRef.current
    const list = listRef.current
    if (!box || !list) return
    const kids = Array.from(list.children) as HTMLElement[]
    // Rect math, anchored to the list — NOT offsetTop, which measures from the
    // nearest positioned ancestor. Two consumers shipped without `relative` on
    // the box (chores' summary, meals' lookahead under its overlay-link root),
    // so rows measured from the widget root — or the page — and the clamp cut
    // rows that plainly fit. The list anchor makes the call site unable to get
    // this wrong.
    const top = list.getBoundingClientRect().top
    bottomsRef.current = kids
      .slice(0, rows.length)
      .map((el) => el.getBoundingClientRect().bottom - top)
    setMeasured(rows)
    clamp(box.clientHeight)
  }, [measuring, rows, clamp])

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const ro = new ResizeObserver(() => {
      if (measuring) return
      // A consumer hidden at measure time (a `display: none` variant under a
      // container-query toggle) records all-zero rects, and a clamp fed those
      // shows every row forever — the tile crops instead of fitting (auto-bug
      // #116). When the box turns out to have height after all, the cached
      // measurement is garbage: throw it away and measure for real.
      const bottoms = bottomsRef.current
      if (box.clientHeight > 0 && bottoms.length > 0 && bottoms[bottoms.length - 1] === 0) {
        setMeasured(null)
        return
      }
      clamp(box.clientHeight)
    })
    ro.observe(box)
    return () => ro.disconnect()
  }, [measuring, clamp])

  return {
    boxRef,
    listRef,
    shown: measuring ? rows : rows.slice(0, cut),
    hiddenCount: measuring ? 0 : rows.length - cut,
    measuring,
  }
}
