import { useEffect, useState } from 'react'

/* Tracks whether the viewport is tablet-width or wider (`md:`, 768px — the same
   breakpoint the shell chrome flips on). The calendar serves the glanceable month
   grid here and the forward-looking agenda below it, so the page picks its surface
   (and its query range) from this rather than rendering both and hiding one with
   CSS. SSR/test-safe: defaults to tablet when `matchMedia` is unavailable, so the
   month surface stays the default. */

const TABLET_QUERY = '(min-width: 768px)'

function read(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true
  return window.matchMedia(TABLET_QUERY).matches
}

export function useIsTabletUp(): boolean {
  const [isTabletUp, setIsTabletUp] = useState(read)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(TABLET_QUERY)
    const onChange = () => setIsTabletUp(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isTabletUp
}
