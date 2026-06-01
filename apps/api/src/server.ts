import Fastify from 'fastify'
import eventBusPlugin from './plugins/event-bus'
import authPlugin from './plugins/auth'

export async function buildServer() {
  const app = Fastify({ logger: true })

  // WebSocket event stream lives at root — no /api prefix (proxied separately by Vite)
  await app.register(eventBusPlugin)

  // All HTTP routes under /api
  await app.register(
    async (api) => {
      await api.register(authPlugin)

      api.get('/health', async () => ({ status: 'ok' }))

      api.post('/trigger-event', async () => {
        app.eventBus.emit('platform.ping.sent', { timestamp: Date.now() })
        return { ok: true }
      })
    },
    { prefix: '/api' },
  )

  return app
}
