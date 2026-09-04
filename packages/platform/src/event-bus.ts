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
    async emitAndAwait(event, payload) {
      assertValidEventName(event)
      // `emitter.emit` discards return values, so the handlers are called
      // directly. They are invoked first and `anyHandlers` fired before the
      // await, so the /events broadcast still goes out at emit time rather than
      // waiting on however long the consumer's writes take.
      const handlers = emitter.listeners(event) as ((payload: unknown) => unknown)[]
      const pending = handlers.map((h) => h(payload))
      for (const h of anyHandlers) h({ event, payload })
      return Promise.all(pending)
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
