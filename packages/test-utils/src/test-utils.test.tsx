import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from './render'
import { createProfile, profileTier1, profileTier2, profileTier3, profileTier4 } from './factories'
import { createEventBusDouble } from './event-bus-double'

describe('profile factories', () => {
  it('creates a profile with the correct tier for each level', () => {
    const profiles = [profileTier1, profileTier2, profileTier3, profileTier4]
    profiles.forEach((p, i) => {
      expect(p.tier).toBe(i + 1)
    })
  })

  it('createProfile accepts overrides', () => {
    const profile = createProfile(2, { name: 'Alice', id: 'custom-id' })
    expect(profile.tier).toBe(2)
    expect(profile.name).toBe('Alice')
    expect(profile.id).toBe('custom-id')
  })
})

describe('renderWithProviders', () => {
  it('renders a component into the DOM', () => {
    renderWithProviders(<div>hello family os</div>)
    expect(screen.getByText('hello family os')).toBeInTheDocument()
  })
})

describe('event bus double', () => {
  const bus = createEventBusDouble()

  beforeEach(() => bus.reset())

  it('records emitted events', () => {
    bus.emit('test.event.fired', { value: 42 })
    expect(bus.emitted).toHaveLength(1)
    expect(bus.emitted[0].event).toBe('test.event.fired')
    expect(bus.emitted[0].payload).toEqual({ value: 42 })
  })

  it('calls registered handlers synchronously', () => {
    const received: unknown[] = []
    bus.on('test.event.fired', (payload) => received.push(payload))
    bus.emit('test.event.fired', { value: 1 })
    expect(received).toHaveLength(1)
  })

  it('reset clears emitted log and handlers', () => {
    bus.emit('test.event.fired', {})
    bus.reset()
    expect(bus.emitted).toHaveLength(0)
    const received: unknown[] = []
    bus.on('test.event.fired', (p) => received.push(p))
    bus.reset()
    bus.emit('test.event.fired', {})
    expect(received).toHaveLength(0)
  })
})
