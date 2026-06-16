import { useEffect, useCallback } from 'react'
import type { EventName, BusMessage } from '../types'

type EventBusHook = {
  publish: (event: EventName, payload: unknown) => void
  subscribe: (event: EventName, handler: (payload: unknown) => void) => () => void
}

type SocketRef = {
  socket: WebSocket | null
  closed: boolean
  delay: number
  timer: ReturnType<typeof setTimeout> | null
}

let sharedSocket: SocketRef | null = null
const subscribers = new Map<EventName | '__any__', Set<(payload: unknown) => void>>()

function ensureSocket() {
  if (sharedSocket && sharedSocket.socket && sharedSocket.socket.readyState <= WebSocket.OPEN)
    return

  if (!sharedSocket) sharedSocket = { socket: null, closed: false, delay: 1000, timer: null }

  function connect() {
    if (sharedSocket!.closed) return
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/events`)
    sharedSocket!.socket = ws

    ws.onopen = () => {
      sharedSocket!.delay = 1000
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as BusMessage
        subscribers.get(msg.event)?.forEach((h) => h(msg.payload))
        subscribers.get('__any__')?.forEach((h) => h(msg.payload))
      } catch {
        // ignore malformed messages
      }
    }

    ws.onclose = () => {
      if (!sharedSocket!.closed) {
        sharedSocket!.timer = setTimeout(() => {
          sharedSocket!.delay = Math.min(sharedSocket!.delay * 2, 30_000)
          connect()
        }, sharedSocket!.delay)
      }
    }
  }

  connect()
}

export function useEventBus(): EventBusHook {
  useEffect(() => {
    ensureSocket()
  }, [])

  const publish = useCallback((event: EventName, payload: unknown) => {
    fetch('/api/trigger-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, payload }),
    }).catch(() => {})
  }, [])

  const subscribe = useCallback((event: EventName, handler: (payload: unknown) => void) => {
    if (!subscribers.has(event)) subscribers.set(event, new Set())
    subscribers.get(event)!.add(handler)
    return () => {
      subscribers.get(event)?.delete(handler)
    }
  }, [])

  return { publish, subscribe }
}
