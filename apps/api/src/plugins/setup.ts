import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { FamilySetupSchema, CreateFamilyMembersSchema, SetPinSchema } from '@family-os/schemas'

const setupPlugin: FastifyPluginAsync = async (fastify) => {
  // GET /setup/status
  fastify.get('/setup/status', async () => {
    const profileCount = await prisma.profile.count({
      where: { id: { not: FAMILY_PROFILE_ID } },
    })

    if (profileCount === 0) {
      return { needsSetup: true, currentStep: 1 }
    }

    const stepConfig = await prisma.systemConfig.findUnique({
      where: { key: 'onboarding_step' },
    })
    if (stepConfig) {
      return { needsSetup: true, currentStep: stepConfig.value as 1 | 2 | 3 }
    }

    return { needsSetup: false, currentStep: null }
  })

  // POST /setup/family — Step 1: family name + first parent
  fastify.post('/setup/family', async (request, reply) => {
    const result = FamilySetupSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const existing = await prisma.profile.count({ where: { id: { not: FAMILY_PROFILE_ID } } })
    if (existing > 0) return reply.status(409).send({ error: 'Setup already started' })

    const { familyName, parentName } = result.data

    await prisma.systemConfig.upsert({
      where: { key: 'family_name' },
      update: { value: familyName },
      create: { key: 'family_name', value: familyName },
    })

    const profile = await prisma.profile.create({
      data: { name: parentName, tier: 4 },
    })

    await prisma.systemConfig.upsert({
      where: { key: 'onboarding_step' },
      update: { value: 2 },
      create: { key: 'onboarding_step', value: 2 },
    })

    return { id: profile.id, name: profile.name, tier: profile.tier }
  })

  // POST /setup/members — Step 2: additional family members (any tier, 0-N)
  fastify.post('/setup/members', async (request, reply) => {
    const result = CreateFamilyMembersSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const stepConfig = await prisma.systemConfig.findUnique({ where: { key: 'onboarding_step' } })
    if (!stepConfig || (stepConfig.value as number) !== 2) {
      return reply.status(409).send({ error: 'Not at members setup step' })
    }

    const created = []
    for (const { name, tier } of result.data.profiles) {
      const profile = await prisma.profile.create({ data: { name, tier } })
      created.push({ id: profile.id, name: profile.name, tier: profile.tier })
    }

    await prisma.systemConfig.update({
      where: { key: 'onboarding_step' },
      data: { value: 3 },
    })

    return { profiles: created }
  })

  // POST /setup/complete — Step 3: set PIN and finalize
  fastify.post('/setup/complete', async (request, reply) => {
    const result = SetPinSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const stepConfig = await prisma.systemConfig.findUnique({ where: { key: 'onboarding_step' } })
    if (!stepConfig || (stepConfig.value as number) !== 3) {
      return reply.status(409).send({ error: 'Not at PIN setup step' })
    }

    const pinHash = await bcrypt.hash(result.data.pin, 10)
    await prisma.systemConfig.upsert({
      where: { key: 'family_pin_hash' },
      update: { value: pinHash },
      create: { key: 'family_pin_hash', value: pinHash },
    })

    await prisma.systemConfig.delete({ where: { key: 'onboarding_step' } })

    const firstParent = await prisma.profile.findFirst({
      where: { id: { not: FAMILY_PROFILE_ID }, tier: 4 },
      orderBy: { createdAt: 'asc' },
    })
    if (!firstParent) return reply.status(500).send({ error: 'No parent profile found' })

    request.session.activeProfileId = firstParent.id

    return { ok: true, profileId: firstParent.id }
  })
}

export default fp(setupPlugin, { name: 'setup' })
