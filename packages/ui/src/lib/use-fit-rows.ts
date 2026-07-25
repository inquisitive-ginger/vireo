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
      if (avail <= 0 || bottoms.length !== rows.length || bottoms[rows.length - 1] <= avail) {
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
    bottomsRef.current = kids.slice(0, rows.length).map((el) => el.offsetTop + el.offsetHeight)
    setMeasured(rows)
    clamp(box.clientHeight)
  }, [measuring, rows, clamp])

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const ro = new ResizeObserver(() => {
      if (!measuring) clamp(box.clientHeight)
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
