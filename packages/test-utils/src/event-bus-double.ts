import type { EventBus, BusMessage } from '@family-os/platform/server'
import type { EventName } from '@family-os/platform'

type Handler = (payload: unknown) => unknown

type EventBusDouble = EventBus & {
  emitted: { event: EventName; payload: unknown }[]
  reset(): void
}

export function createEventBusDouble(): EventBusDouble {
  const handlers = new Map<string, Handler[]>()
  const anyHandlers = new Set<(message: BusMessage) => void>()
  const emitted: { event: EventName; payload: unknown }[] = []

  return {
    emitted,
    emit(event: EventName, payload: unknown) {
      emitted.push({ event, payload })
      handlers.get(event)?.forEach((h) => h(payload))
      for (const h of anyHandlers) h({ event, payload })
    },
    async emitAndAwait(event: EventName, payload: unknown) {
      emitted.push({ event, payload })
      const pending = (handlers.get(event) ?? []).map((h) => h(payload))
      for (const h of anyHandlers) h({ event, payload })
      return Promise.all(pending)
    },
    on(event: EventName, handler: Handler) {
      handlers.set(event, [...(handlers.get(event) ?? []), handler])
      return () => {
        const list = handlers.get(event) ?? []
        handlers.set(
          event,
          list.filter((h) => h !== handler)
        )
      }
    },
    onAny(handler) {
      anyHandlers.add(handler)
      return () => anyHandlers.delete(handler)
    },
    reset() {
      handlers.clear()
      anyHandlers.clear()
      emitted.length = 0
    },
  }
}
