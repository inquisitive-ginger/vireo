import { EventEmitter } from 'node:events'
import type { BusMessage, EventBus, EventName } from './types'

// Enforces lowercase kebab-case segments at runtime (TS type handles compile-time shape)
const SEGMENT = '[a-z][a-z0-9-]*'
const EVENT_NAME_RE = new RegExp(`^${SEGMENT}\\.${SEGMENT}\\.${SEGMENT}$`)

function assertValidEventName(event: string): asserts event is EventName {
  if (!EVENT_NAME_RE.test(event)) {
    throw new Error(
      `Invalid event name "${event}". Must be lowercase kebab-case segments: module.noun.verb`
    )
  }
}

export function createEventBus(): EventBus {
  const emitter = new EventEmitter()
  const anyHandlers = new Set<(message: BusMessage) => void>()

  return {
    emit(event, payload) {
      assertValidEventName(event)
      emitter.emit(event, payload)
      for (const h of anyHandlers) h({ event, payload })
    },
    on(event, handler) {
      assertValidEventName(event)
      emitter.on(event, handler)
      return () => emitter.off(event, handler)
    },
    onAny(handler) {
      anyHandlers.add(handler)
      return () => anyHandlers.delete(handler)
    },
  }
}
