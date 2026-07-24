import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Star } from 'lucide-react'

export interface FlightChipProps {
  /** Live rect of the source XP badge (flight start). */
  from: DOMRect
  /** Live rect of the score plate (flight end). */
  to: DOMRect
  value: number
  onDone: () => void
}

/* The XP chip in flight — design §2. Rendered in a portal at `position: fixed`
   so no ancestor `overflow` clips it. Lifts off the badge's exact spot, arcs
   (~36px lift) toward the plate, scaling 1→0.5 and fading near the landing.
   Animates exactly once (mount-only); `onDone` fires on arrival so the plate
   banks + counts up. ~980ms ease-in-out. */
export function FlightChip({ from, to, value, onDone }: FlightChipProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const startCx = from.left + from.width / 2
    const startCy = from.top + from.height / 2
    const endCx = to.left + to.width / 2
    const endCy = to.top + to.height / 2
    const dx = endCx - startCx
    const dy = endCy - startCy
    const lift = 36

    const anim = el.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        {
          transform: `translate(${dx / 2}px, ${dy / 2 - lift}px) scale(0.82)`,
          opacity: 1,
          offset: 0.5,
        },
        { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 0 },
      ],
      { duration: 760, easing: 'ease-in-out', fill: 'forwards' }
    )

    const finish = () => {
      if (fired.current) return
      fired.current = true
      onDone()
    }
    anim.addEventListener('finish', finish)
    return () => {
      anim.removeEventListener('finish', finish)
      anim.cancel()
    }
    // Mount-only: the flight runs once for the lifetime of this chip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed z-[9999] grid origin-center place-items-center"
      // left/top/size track the badge's live rect — centre the chip on its centre.
      style={{ left: from.left, top: from.top, minWidth: from.width, height: from.height }}
    >
      {/* Plain quiet star — matches the resting XpPill, which no longer wears a pill
          (ADR 051), so the chip that lifts off looks like the badge it left. */}
      <span className="text-sm-token inline-flex items-center gap-1 font-semibold whitespace-nowrap text-muted-foreground">
        <Star size={12} strokeWidth={2.5} />
        {value} XP
      </span>
    </div>,
    document.body
  )
}
