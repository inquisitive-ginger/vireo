import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import {
  FamilySetupSchema,
  CreateFamilyMembersSchema,
  SetPinSchema,
  nextFreeHue,
  IDENTITY_HUES,
} from '@family-os/schemas'

/** The hues already spoken for. The `family` pseudo-profile is excluded everywhere and
    carries no hue of its own (Hearth is reserved, ADR 041), so it consumes nothing. */
async function takenHues(): Promise<string[]> {
  const rows = await prisma.profile.findMany({
    where: { id: { not: FAMILY_PROFILE_ID }, identityHue: { not: null } },
    select: { identityHue: true },
  })
  return rows.map((r) => r.identityHue as string)
}

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

    // First member in the house, so the whole palette is free.
    const profile = await prisma.profile.create({
      data: { name: parentName, tier: 4, identityHue: nextFreeHue([]) },
    })

    await prisma.systemConfig.upsert({
      where: { key: 'onboarding_step' },
      update: { value: 2 },
      create: { key: 'onboarding_step', value: 2 },
    })

    return {
      id: profile.id,
      name: profile.name,
      tier: profile.tier,
      identityHue: profile.identityHue,
    }
  })

  // POST /setup/members — Step 2: additional family members (any tier, 0-N)
  fastify.post('/setup/members', async (request, reply) => {
    const result = CreateFamilyMembersSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const stepConfig = await prisma.systemConfig.findUnique({ where: { key: 'onboarding_step' } })
    if (!stepConfig || (stepConfig.value as number) !== 2) {
      return reply.status(409).send({ error: 'Not at members setup step' })
    }

    // Every member gets a colour the moment they are created — auto-assigned, never
    // blocking (ADR 044). Checked BEFORE creating anyone: a family that overflows the
    // palette must fail whole, not leave the last two kids colourless.
    const taken = await takenHues()
    const free = IDENTITY_HUES.length - taken.length
    if (result.data.profiles.length > free) {
      return reply.status(409).send({
        error: `Only ${free} ${free === 1 ? 'colour is' : 'colours are'} left — a family can have at most ${IDENTITY_HUES.length} members.`,
      })
    }

    // A client-chosen hue is honoured, but never trusted: the client cannot see the
    // whole household, so uniqueness is settled here (and again by the DB's unique
    // index). A duplicate request falls back to the next free colour rather than
    // failing the whole family — the member still gets a colour, just not that one.
    const created = []
    for (const { name, tier, identityHue } of result.data.profiles) {
      const hue = identityHue && !taken.includes(identityHue) ? identityHue : nextFreeHue(taken)
      const profile = await prisma.profile.create({ data: { name, tier, identityHue: hue } })
      if (hue) taken.push(hue)
      created.push({
        id: profile.id,
        name: profile.name,
        tier: profile.tier,
        identityHue: profile.identityHue,
      })
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
