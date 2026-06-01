import { describe, it, expect } from 'vitest'
import { buildServer } from '../server'

describe('GET /api/plugins', () => {
  it('returns an array (empty registry in test environment)', async () => {
    const app = await buildServer()
    const res = await app.inject({ method: 'GET', url: '/api/plugins' })
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.json())).toBe(true)
  })

  it('returns RegistryEntry shape for each entry', async () => {
    const app = await buildServer()
    const res = await app.inject({ method: 'GET', url: '/api/plugins' })
    const entries = res.json<Array<{ name: string; baseUrl: string }>>()
    for (const entry of entries) {
      expect(typeof entry.name).toBe('string')
      expect(typeof entry.baseUrl).toBe('string')
    }
  })
})
