import { useEffect, useRef } from 'react'
import type { BusMessage } from '@family-os/platform'

export function useEventBus(onMessage: (msg: BusMessage) => void) {
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    let closed = false
    let delay = 1000
    let socket: WebSocket
    let timer: ReturnType<typeof setTimeout>

    function connect() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      socket = new WebSocket(`${protocol}//${window.location.host}/events`)

      socket.onopen = () => {
        delay = 1000
      }

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as BusMessage
          onMessageRef.current(msg)
        } catch {
          // malformed message — ignore
        }
      }

      socket.onclose = () => {
        if (!closed) {
          timer = setTimeout(() => {
            delay = Math.min(delay * 2, 30_000)
            connect()
          }, delay)
        }
      }
    }

    connect()

    return () => {
      closed = true
      clearTimeout(timer)
      socket?.close()
    }
  }, [])
}
