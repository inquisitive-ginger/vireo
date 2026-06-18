import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { GOLD, GOLD_HI, GOLD_INK, GOLD_TINT } from '../lib/gold'

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
      style={{
        position: 'fixed',
        left: from.left,
        top: from.top,
        // Centre the chip on the badge's centre regardless of its own size.
        minWidth: from.width,
        height: from.height,
        display: 'grid',
        placeItems: 'center',
        transformOrigin: 'center',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <span
        className="text-sm-token"
        style={{
          padding: '2px 9px',
          borderRadius: 999,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD_TINT})`,
          border: `1px solid ${GOLD}`,
          color: GOLD_INK,
          boxShadow: '0 2px 8px oklch(0.74 0.13 80 / 0.4)',
        }}
      >
        +{value} XP
      </span>
    </div>,
    document.body
  )
}
