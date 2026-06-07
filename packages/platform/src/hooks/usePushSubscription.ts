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

export type PushSubscriptionState =
  | 'unknown'
  | 'unsupported'
  | 'denied'
  | 'subscribed'
  | 'unsubscribed'

export function usePushSubscription() {
  const [state, setState] = useState<PushSubscriptionState>('unknown')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setState('denied')
      return
    }

    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setState(sub ? 'subscribed' : 'unsubscribed')
      })
    })
  }, [])

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return
    setIsLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setState('denied')
        return
      }

      const vapidKey = await getVapidKey()
      if (!vapidKey) throw new Error('VAPID key unavailable')

      const reg = await navigator.serviceWorker.ready
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
    } catch {
      setState('unsubscribed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const unsubscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return
    setIsLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
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
    } catch {
      // subscription state unchanged on failure
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { state, isLoading, subscribe, unsubscribe }
}
