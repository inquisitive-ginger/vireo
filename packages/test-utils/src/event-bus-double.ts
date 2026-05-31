import type { EventBus } from '@family-os/platform/server'
import type { EventName } from '@family-os/platform'

type Handler = (payload: unknown) => void

type EventBusDouble = EventBus & {
  emitted: { event: EventName; payload: unknown }[]
  reset(): void
}

export function createEventBusDouble(): EventBusDouble {
  const handlers = new Map<string, Handler[]>()
  const emitted: { event: EventName; payload: unknown }[] = []

  return {
    emitted,
    emit(event: EventName, payload: unknown) {
      emitted.push({ event, payload })
      handlers.get(event)?.forEach((h) => h(payload))
    },
    on(event: EventName, handler: Handler) {
      handlers.set(event, [...(handlers.get(event) ?? []), handler])
    },
    reset() {
      handlers.clear()
      emitted.length = 0
    },
  }
}
