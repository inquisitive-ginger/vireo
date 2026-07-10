import { forwardRef, useEffect, useRef, useState } from 'react'
import { Coins } from 'lucide-react'
import { GOLD, GOLD_HI, GOLD_DEEP, GOLD_INK, GOLD_TINT } from '../lib/gold'
import { usePrefersReducedMotion } from '../lib/use-reduced-motion'

export interface ScorePlateProps {
  /** Lifetime XP. When it grows, the plate pops and counts up to the new total. */
  value: number
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/* The lifetime XP "coin score" (design §1 header / §2 flight target). Gold =
   treasure semantic; the numeral is DM Sans (`text-metric`). When `value` rises
   the plate grows to 1.09 then settles (~860ms) while the number counts up
   (easeInOutCubic ~640ms) — the landing beat of the XP flight. The forwarded ref
   is the flight's measured endpoint.

   Local/optimistic in M2 Completion Flow (seeded from completed tasks). The XP
   Award story swaps the seed for the persisted balance via GET /api/chores/xp. */
export const ScorePlate = forwardRef<HTMLDivElement, ScorePlateProps>(function ScorePlate(
  { value },
  ref
) {
  const reduced = usePrefersReducedMotion()
  const [displayed, setDisplayed] = useState(value)
  const prev = useRef(value)
  const innerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const from = prev.current
    const to = value
    prev.current = to
    if (from === to) return

    if (reduced) {
      setDisplayed(to)
      return
    }

    // Pop: grow then settle (held high through the mid of the count-up).
    innerRef.current?.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.09)', offset: 0.22 },
        { transform: 'scale(1.09)', offset: 0.7 },
        { transform: 'scale(1)' },
      ],
      { duration: 660, easing: 'ease-out' }
    )

    const start = performance.now()
    const dur = 500
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      setDisplayed(Math.round(from + (to - from) * easeInOutCubic(t)))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, reduced])

  return (
    <div ref={ref}>
      <div
        ref={innerRef}
        className="flex items-center gap-2 rounded-full"
        style={{
          padding: '7px 13px 7px 10px',
          background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD_TINT})`,
          border: `1px solid ${GOLD}`,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <span
          className="grid size-6 shrink-0 place-items-center rounded-full"
          style={{
            background: `radial-gradient(circle at 32% 30%, ${GOLD_HI}, ${GOLD} 70%, ${GOLD_DEEP})`,
            color: GOLD_DEEP,
          }}
        >
          <Coins size={13} strokeWidth={2.5} />
        </span>
        <span className="text-metric leading-none" style={{ color: GOLD_INK }}>
          {displayed.toLocaleString()}
        </span>
        <span
          className="text-xs-token font-bold tracking-[0.04em] opacity-70"
          style={{ color: GOLD_INK }}
        >
          XP
        </span>
      </div>
    </div>
  )
})
