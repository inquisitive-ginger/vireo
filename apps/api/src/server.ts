import Fastify from 'fastify'
import eventBusPlugin from './plugins/event-bus'
import authPlugin from './plugins/auth'

export async function buildServer() {
  const app = Fastify({ logger: true })

  await app.register(authPlugin)
  await app.register(eventBusPlugin)

  app.get('/health', async () => ({ status: 'ok' }))

  app.post('/trigger-event', async () => {
    app.eventBus.emit('platform.ping.sent', { timestamp: Date.now() })
    return { ok: true }
  })

  return app
}
