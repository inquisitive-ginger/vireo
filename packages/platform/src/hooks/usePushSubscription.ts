import { useCallback, useEffect, useState } from 'react'

async function getVapidKey(): Promise<string | null> {
  const res = await fetch('/api/push/vapid-public-key')
  const data = (await res.json()) as { publicKey: string | null }
  return data.publicKey
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const buffer = new ArrayBuffer(rawData.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < rawData.length; i++) view[i] = rawData.charCodeAt(i)
  return view
}

const ACTIVATION_TIMEOUT_MS = 10_000

/** The registration a push subscription has to hang off, activated.
 *
 * Registers the worker if boot did not manage to — boot's registration is fire-and-forget
 * on `load`, so a subscription must not assume it succeeded. Doing it here also means a
 * genuine `register()` rejection reaches the caller as itself, rather than as this hook's
 * guess about why there was nothing to find.
 */
async function activeRegistration(): Promise<ServiceWorkerRegistration> {
  const reg =
    (await navigator.serviceWorker.getRegistration()) ??
    (await navigator.serviceWorker.register('/sw.js'))
  if (reg.active) return reg

  // `.ready` waits for activation but never settles if install fails, and a hang here
  // leaves the toggle disabled with no reason given — the failure this whole thread was.
  return await Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('service worker never activated')), ACTIVATION_TIMEOUT_MS)
    ),
  ])
}

function describe(err: unknown): string {
  return err instanceof Error ? `${err.name}: ${err.message}` : String(err)
}

export type PushSubscriptionState =
  | 'unknown'
  | 'unsupported'
  | 'denied'
  | 'subscribed'
  | 'unsubscribed'

export function usePushSubscription() {
  const [state, setState] = useState<PushSubscriptionState>('unknown')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Read the *actual* subscription state off the active service worker. The
  // toggle must reflect the live push subscription, not a value captured once at
  // mount — in an installed PWA the component can mount before the SW is ready,
  // or while a stale/torn-down SW is being replaced, leaving the toggle showing
  // OFF for a user who is in fact subscribed. We re-run this whenever the app is
  // brought back to the foreground so it self-heals.
  const sync = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }
    // Read outside the try below, so a missing `Notification` would throw past it
    // and pin the toggle at 'unknown' (disabled, looks OFF) rather than saying so.
    if (!('Notification' in window)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setState('denied')
      return
    }
    try {
      // Use getRegistration(), NOT serviceWorker.ready: `.ready` never resolves
      // when no SW is registered (e.g. dev, where the shell tears the SW down),
      // which would pin the toggle at 'unknown' (disabled, looks OFF) forever.
      // getRegistration() resolves immediately to undefined → an accurate,
      // interactable 'unsubscribed'.
      const reg = await navigator.serviceWorker.getRegistration()
      if (!reg) {
        setState('unsubscribed')
        return
      }
      const sub = await reg.pushManager.getSubscription()
      setState(sub ? 'subscribed' : 'unsubscribed')
    } catch {
      // Leave the prior state untouched on a transient failure rather than
      // flipping the toggle to a wrong value.
    }
  }, [])

  useEffect(() => {
    void sync()

    // An installed PWA is long-lived: re-check when it regains visibility/focus
    // so a subscription created (or lost) in another tab/session reconciles.
    const onVisible = () => {
      if (document.visibilityState === 'visible') void sync()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [sync])

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return
    setIsLoading(true)
    setError(null)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        // 'default' means the prompt was dismissed, not refused — the common outcome
        // under Chrome's quiet notification UI, where the request is a bell chip that
        // is easy to miss. Only 'denied' disables the toggle; treating a dismissal as
        // a denial locks the user out of ever asking again without a reload.
        setState(permission === 'denied' ? 'denied' : 'unsubscribed')
        return
      }

      const vapidKey = await getVapidKey()
      if (!vapidKey) throw new Error('VAPID key unavailable')

      const reg = await activeRegistration()
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      const json = sub.toJSON()
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
        }),
      })

      setState('subscribed')
    } catch (err) {
      // Swallowing this is what made the original report undiagnosable: the toggle
      // flipped back with no reason recorded anywhere. console.error both reaches
      // devtools and lands in the bug-report ring buffer, so the next report carries
      // the reason the browser refused.
      console.error('Push subscribe failed:', err)
      setError(describe(err))
      setState('unsubscribed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const unsubscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return
    setIsLoading(true)
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      if (!reg) {
        setState('unsubscribed')
        return
      }
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        const endpoint = sub.endpoint
        await sub.unsubscribe()
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ endpoint }),
        })
      }
      setState('unsubscribed')
    } catch (err) {
      console.error('Push unsubscribe failed:', err)
      setError(describe(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { state, isLoading, error, subscribe, unsubscribe }
}
