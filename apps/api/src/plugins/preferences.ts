import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'

const preferencesPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.put<{ Body: { darkMode: boolean | null } }>(
    '/preferences/dark-mode',
    async (request, reply) => {
      const profileId = request.profile.id

      if (profileId === FAMILY_PROFILE_ID) {
        return reply.status(403).send({ error: 'Family pseudo-profile follows system preference' })
      }

      const { darkMode } = request.body

      await prisma.profile.update({
        where: { id: profileId },
        data: { darkMode },
      })

      return { darkMode }
    }
  )
}

export default fp(preferencesPlugin, { name: 'preferences' })
