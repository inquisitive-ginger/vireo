import { describe, it, expect } from 'vitest'
import { buildServer } from './server'

describe('API server', () => {
  it('GET /health returns ok', async () => {
    const app = await buildServer()
    const res = await app.inject({ method: 'GET', url: '/api/health' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ status: 'ok' })
  })

  it('POST /trigger-event emits an event and returns ok', async () => {
    const app = await buildServer()
    const received: unknown[] = []
    app.eventBus.onAny((msg) => received.push(msg))

    const res = await app.inject({ method: 'POST', url: '/api/trigger-event' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ ok: true })
    expect(received).toHaveLength(1)
    expect((received[0] as { event: string }).event).toBe('platform.ping.sent')
  })
})
