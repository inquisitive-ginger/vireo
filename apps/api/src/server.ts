import Fastify from 'fastify'
import eventBusPlugin from './plugins/event-bus'
import authPlugin from './plugins/auth'
import pluginRegistryPlugin from './plugins/plugin-registry'
import homePlugin from './plugins/home'
import preferencesPlugin from './plugins/preferences'
import setupPlugin from './plugins/setup'
import profilesPlugin from './plugins/profiles'
import notificationsPlugin from './plugins/notifications'
import bugReportsPlugin from './plugins/bug-reports'
import pushPlugin, { initVapidKeys } from './plugins/push'
import familyFeedPlugin from './plugins/family-feed'
import choresPlugin from './plugins/chores'
import calendarPlugin from './plugins/calendar'
import rewardsPlugin from './plugins/rewards'
import mealsPlugin from './plugins/meals'
import shoppingPlugin from './plugins/shopping'
import devPlugin from './plugins/dev'

export async function buildServer() {
  await initVapidKeys()

  // One trusted hop: Caddy is the only ingress and appends the peer to
  // X-Forwarded-For, so the rightmost entry is the real client and a
  // client-supplied header cannot displace it. Without this every request
  // reports Caddy's container IP and the PIN limiter shares one bucket.
  const app = Fastify({ logger: true, trustProxy: 1 })

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
      await api.register(bugReportsPlugin)
      await api.register(pushPlugin)
      await api.register(familyFeedPlugin)
      await api.register(choresPlugin)
      await api.register(calendarPlugin)
      await api.register(rewardsPlugin)
      await api.register(mealsPlugin)
      await api.register(shoppingPlugin)

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
