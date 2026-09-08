import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

/* `navigator.onLine` is the browser's opinion, not a fact: it reports a captive
   supermarket wifi and a cell radio with one bar as online, which is exactly the
   shop this feature exists for. So it seeds the state and it can turn the state
   OFF, and a request that failed to leave the device turns it ON — evidence
   outranks the flag, and the caller owns the setter for that reason.

   Local to `shopping` because it has one caller; it moves to the platform when a
   second surface needs it, not before. */
export function useOffline(): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [offline, setOffline] = useState(() => navigator.onLine === false)

  useEffect(() => {
    const up = () => setOffline(false)
    const down = () => setOffline(true)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  return [offline, setOffline]
}
