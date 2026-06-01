import fp from 'fastify-plugin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import type { FastifyPluginAsync } from 'fastify'
import type { RegistryEntry } from '@family-os/platform/types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const REGISTRY_PATH = resolve(__dirname, '../../../../plugins.json')

const pluginRegistryPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get('/plugins', async (): Promise<RegistryEntry[]> => {
    const raw = readFileSync(REGISTRY_PATH, 'utf-8')
    return JSON.parse(raw) as RegistryEntry[]
  })
}

export default fp(pluginRegistryPlugin, { name: 'plugin-registry' })
