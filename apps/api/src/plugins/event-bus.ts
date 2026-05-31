import fp from 'fastify-plugin'
import websocket from '@fastify/websocket'
import type { FastifyInstance } from 'fastify'
import { createEventBus } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'

declare module 'fastify' {
  interface FastifyInstance {
    eventBus: EventBus
  }
}

interface WsClient {
  send(data: string): void
  readyState: number
  on(event: 'close', handler: () => void): this
}

async function eventBusPlugin(app: FastifyInstance) {
  const bus = createEventBus()
  app.decorate('eventBus', bus)

  await app.register(websocket)

  const clients = new Set<WsClient>()

  app.get('/events', { websocket: true }, (socket) => {
    clients.add(socket)
    socket.on('close', () => clients.delete(socket))
  })

  bus.onAny(({ event, payload }) => {
    const message = JSON.stringify({ event, payload })
    for (const client of clients) {
      if (client.readyState === 1 /* WebSocket.OPEN */) {
        client.send(message)
      }
    }
  })
}

export default fp(eventBusPlugin, { name: 'event-bus' })
