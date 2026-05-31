import Fastify from 'fastify'
import eventBusPlugin from './plugins/event-bus'

export async function buildServer() {
  const app = Fastify({ logger: true })

  await app.register(eventBusPlugin)

  app.get('/health', async () => ({ status: 'ok' }))

  app.post('/trigger-event', async () => {
    app.eventBus.emit('platform.ping.sent', { timestamp: Date.now() })
    return { ok: true }
  })

  return app
}
