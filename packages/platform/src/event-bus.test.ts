import { describe, it, expect, vi } from 'vitest'
import { createEventBus } from './event-bus'

describe('createEventBus', () => {
  describe('emit — name validation', () => {
    it('accepts a valid module.noun.verb name', () => {
      const bus = createEventBus()
      expect(() => bus.emit('platform.ping.sent', {})).not.toThrow()
    })

    it('rejects a name with too few segments', () => {
      const bus = createEventBus()
      expect(() => bus.emit('platform.ping' as `${string}.${string}.${string}`, {})).toThrow(
        /Invalid event name/
      )
    })

    it('rejects a name with uppercase letters', () => {
      const bus = createEventBus()
      expect(() => bus.emit('Platform.ping.sent' as `${string}.${string}.${string}`, {})).toThrow(
        /Invalid event name/
      )
    })

    it('rejects a name with empty segments', () => {
      const bus = createEventBus()
      expect(() => bus.emit('platform..sent' as `${string}.${string}.${string}`, {})).toThrow(
        /Invalid event name/
      )
    })
  })

  describe('on — named subscriptions', () => {
    it('delivers payload to a subscriber', () => {
      const bus = createEventBus()
      const handler = vi.fn()
      bus.on('platform.ping.sent', handler)
      bus.emit('platform.ping.sent', { timestamp: 1 })
      expect(handler).toHaveBeenCalledWith({ timestamp: 1 })
    })

    it('returned unsubscribe stops delivery', () => {
      const bus = createEventBus()
      const handler = vi.fn()
      const off = bus.on('platform.ping.sent', handler)
      off()
      bus.emit('platform.ping.sent', {})
      expect(handler).not.toHaveBeenCalled()
    })

    it('does not deliver to subscribers of a different event', () => {
      const bus = createEventBus()
      const handler = vi.fn()
      bus.on('chores.task.completed', handler)
      bus.emit('platform.ping.sent', {})
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('onAny — wildcard', () => {
    it('receives every emitted event', () => {
      const bus = createEventBus()
      const handler = vi.fn()
      bus.onAny(handler)
      bus.emit('platform.ping.sent', { a: 1 })
      bus.emit('chores.task.completed', { b: 2 })
      expect(handler).toHaveBeenCalledTimes(2)
      expect(handler).toHaveBeenNthCalledWith(1, { event: 'platform.ping.sent', payload: { a: 1 } })
      expect(handler).toHaveBeenNthCalledWith(2, {
        event: 'chores.task.completed',
        payload: { b: 2 },
      })
    })

    it('returned unsubscribe stops wildcard delivery', () => {
      const bus = createEventBus()
      const handler = vi.fn()
      const off = bus.onAny(handler)
      off()
      bus.emit('platform.ping.sent', {})
      expect(handler).not.toHaveBeenCalled()
    })
  })
})
