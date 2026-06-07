import Fastify from 'fastify'
import eventBusPlugin from './plugins/event-bus'
import authPlugin from './plugins/auth'
import pluginRegistryPlugin from './plugins/plugin-registry'
import homePlugin from './plugins/home'
import preferencesPlugin from './plugins/preferences'
import setupPlugin from './plugins/setup'
import profilesPlugin from './plugins/profiles'
import notificationsPlugin from './plugins/notifications'
import devPlugin from './plugins/dev'

export async function buildServer() {
  const app = Fastify({ logger: true })

  // WebSocket event stream lives at root — no /api prefix (proxied separately by Vite)
  await app.register(eventBusPlugin)

  // All HTTP routes under /api
  await app.register(
    async (api) => {
      await api.register(setupPlugin)
      await api.register(authPlugin)
      if (process.env.NODE_ENV !== 'production') await api.register(devPlugin)
      await api.register(pluginRegistryPlugin)
      await api.register(homePlugin)
      await api.register(preferencesPlugin)
      await api.register(profilesPlugin)
      await api.register(notificationsPlugin)

      api.get('/health', async () => ({ status: 'ok' }))

      api.post('/trigger-event', async (req) => {
        const body = req.body as { event?: string; payload?: unknown } | null
        const event = body?.event ?? 'platform.ping.sent'
        const payload = body?.payload ?? { timestamp: Date.now() }
        if (!/^[a-zA-Z][a-zA-Z0-9-]*\.[a-zA-Z][a-zA-Z0-9-]*\.[a-zA-Z][a-zA-Z0-9-]*$/.test(event)) {
          return { ok: false, error: 'invalid event name' }
        }
        app.eventBus.emit(event as `${string}.${string}.${string}`, payload)
        return { ok: true }
      })
    },
    { prefix: '/api' }
  )

  return app
}
