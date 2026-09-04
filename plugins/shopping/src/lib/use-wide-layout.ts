import { useEffect, useState } from 'react'

/* `md:` (768px) is the shell's settled tablet/mobile split — the same threshold
   that hides the sidebar and raises the tab bar (design-system.md §Mobile
   Surface). `/shopping` is ONE surface with two layouts, and this picks which,
   so only one mounts: rendering both and hiding one with CSS would put two
   capture fields in the DOM, which is two elements answering to the same
   accessible name and a draft that survives in whichever is hidden.

   Local to `shopping` because it has one caller. If a second surface needs it,
   it moves to `@family-os/ui` then — not now. */
const WIDE = '(min-width: 768px)'

export function useWideLayout(): boolean {
  const [wide, setWide] = useState(() => window.matchMedia?.(WIDE).matches ?? true)

  useEffect(() => {
    const mq = window.matchMedia?.(WIDE)
    if (!mq) return
    const onChange = (e: MediaQueryListEvent) => setWide(e.matches)
    setWide(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return wide
}
