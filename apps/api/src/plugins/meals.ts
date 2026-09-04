import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { mealPrisma } from '@family-os/plugin-meals/db'
import { MealInputSchema, NeedsPushSchema } from '@family-os/schemas'
import type { NeedsPushResult } from '@family-os/schemas'
import { startMealsNudgeScheduler } from '../lib/meals-nudge'

type PlannedMealRow = Awaited<ReturnType<typeof mealPrisma.plannedMeal.create>>

// `date` is @db.Date — Prisma hands back a UTC-midnight Date; the key is its
// date part verbatim, no timezone math.
function serializeMeal(meal: PlannedMealRow) {
  return { ...meal, date: meal.date.toISOString().slice(0, 10) }
}

function plannedPayload(meal: PlannedMealRow) {
  return {
    mealId: meal.id,
    date: meal.date.toISOString().slice(0, 10),
    title: meal.title,
    kind: meal.kind,
    ownerId: meal.ownerId,
    tryBite: meal.tryBite,
  }
}

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

/** `needs` is comma-separated free text — meals' storage format, and meals'
    problem. The contract speaks in items. */
function parseNeeds(needs: string | null): string[] {
  return (needs ?? '')
    .split(',')
    .map((n) => n.trim())
    .filter((n) => n.length > 0)
}

/** The words the pushed row's note line will carry (design.md §Anatomy 5:
    "for Thursday"). The producer owes them — `shopping` never reads
    `planned_meals` (ADR 069 §3), so this is the only moment they exist.
    `date` is @db.Date, i.e. UTC midnight, so the weekday is read in UTC. */
function needsNote(date: Date): string {
  return `for ${date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })}`
}

const mealsPlugin: FastifyPluginAsync = async (fastify) => {
  // The afternoon nudge poll (ADR 045 precedent, spec.md §"Day-level nudge"). Not
  // in tests — they drive `runMealsNudgeTick` directly with a mocked clock; a live
  // 60s interval would leak and fire on fixtures.
  if (process.env.NODE_ENV !== 'test') {
    const stop = startMealsNudgeScheduler(fastify.eventBus)
    fastify.addHook('onClose', async () => stop())
  }

  fastify.get('/meals/plan', async (request, reply) => {
    if (!request.ability.can('view', 'meals.PlannedMeal')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { from, to } = request.query as { from?: string; to?: string }
    if (!from || !to || !DATE_KEY.test(from) || !DATE_KEY.test(to)) {
      return reply.status(400).send({ error: 'from and to are required as YYYY-MM-DD' })
    }

    const meals = await mealPrisma.plannedMeal.findMany({
      where: { date: { gte: new Date(from), lte: new Date(to) } },
      orderBy: { date: 'asc' },
    })

    return { meals: meals.map(serializeMeal) }
  })

  fastify.post('/meals/plan', async (request, reply) => {
    if (!request.ability.can('manage', 'meals.PlannedMeal')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = MealInputSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const input = parsed.data

    let meal: PlannedMealRow
    try {
      meal = await mealPrisma.plannedMeal.create({
        data: {
          date: new Date(input.date),
          title: input.title,
          sides: input.sides,
          kind: input.kind,
          ownerId: input.ownerId,
          tryBite: input.tryBite,
          needs: input.needs,
          recipeUrl: input.recipeUrl,
          notes: input.notes,
          createdBy: request.profile.id,
        },
      })
    } catch (err) {
      // UNIQUE (date, slot) — one dinner per day.
      if ((err as { code?: string }).code === 'P2002') {
        return reply.status(409).send({ error: 'That day already has a dinner planned' })
      }
      throw err
    }

    fastify.eventBus.emit('meals.dinner.planned', plannedPayload(meal))

    return reply.status(201).send(serializeMeal(meal))
  })

  fastify.patch('/meals/plan/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'meals.PlannedMeal')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await mealPrisma.plannedMeal.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Meal not found' })

    const parsed = MealInputSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const input = parsed.data

    let meal: PlannedMealRow
    try {
      meal = await mealPrisma.plannedMeal.update({
        where: { id },
        data: {
          date: new Date(input.date),
          title: input.title,
          sides: input.sides,
          kind: input.kind,
          ownerId: input.ownerId,
          tryBite: input.tryBite,
          needs: input.needs,
          recipeUrl: input.recipeUrl,
          notes: input.notes,
        },
      })
    } catch (err) {
      if ((err as { code?: string }).code === 'P2002') {
        return reply.status(409).send({ error: 'That day already has a dinner planned' })
      }
      throw err
    }

    fastify.eventBus.emit('meals.dinner.planned', plannedPayload(meal))

    return serializeMeal(meal)
  })

  // One-tap claim (design.md §M5/2/3: claim = set owner_id, no drawer). `update`
  // is the tier-3+ capability; the route narrows it to claim-only — the claimer
  // becomes the owner of an UNCLAIMED meal, and full edits stay behind `manage`.
  fastify.post('/meals/plan/:id/claim', async (request, reply) => {
    if (!request.ability.can('update', 'meals.PlannedMeal')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    // The unattended family dashboard has no person to claim AS — its id is not
    // a UUID and must never reach the @db.Uuid owner column.
    if (request.profile.id === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'Switch to your own profile to claim dinner' })
    }

    const { id } = request.params as { id: string }
    const existing = await mealPrisma.plannedMeal.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Meal not found' })
    if (existing.ownerId) {
      return reply.status(409).send({ error: 'Somebody already has it' })
    }

    const meal = await mealPrisma.plannedMeal.update({
      where: { id },
      data: { ownerId: request.profile.id },
    })

    fastify.eventBus.emit('meals.dinner.claimed', {
      mealId: meal.id,
      date: meal.date.toISOString().slice(0, 10),
      ownerId: meal.ownerId,
    })

    return serializeMeal(meal)
  })

  fastify.delete('/meals/plan/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'meals.PlannedMeal')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await mealPrisma.plannedMeal.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Meal not found' })

    await mealPrisma.plannedMeal.delete({ where: { id } })

    return reply.status(204).send()
  })

  // POST /meals/push-needs — the week page's "N things needed" link. Meals
  // PUBLISHES; it does not write a shopping row and does not import shopping's
  // Prisma client (ADR 069 §3/§4). The gate is still shopping's own key, asked
  // through `ability.can` (ADR 018): pushing IS an add, so it asks exactly what
  // an add asks, and a house that revokes `shopping.item.add` for someone closes
  // this path for them too.
  //
  // `emitAndAwait`, not `emit`: someone tapped this and is waiting to be told
  // what happened, so the consumer's counts come back here and a consumer that
  // throws surfaces as a failure instead of a silent success.
  fastify.post('/meals/push-needs', async (request, reply) => {
    if (!request.ability.can('create', 'shopping.Item')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = NeedsPushSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const meal = await mealPrisma.plannedMeal.findUnique({ where: { id: parsed.data.mealId } })
    if (!meal) return reply.status(404).send({ error: 'Meal not found' })

    const names = parseNeeds(meal.needs)
    if (names.length === 0) {
      return reply.status(400).send({ error: 'That meal has nothing listed to buy' })
    }

    const results = await fastify.eventBus.emitAndAwait('meals.needs.pushed', {
      sourceType: 'meal',
      sourceId: meal.id,
      note: needsNote(meal.date),
      requestedBy: request.profile.id,
      names,
    })

    // Nothing filed them. Saying "sent" here would be the exact lie the contract
    // exists to prevent, so it reads as the failure it is.
    const result = results.find((r): r is NeedsPushResult => r != null)
    if (!result) {
      request.log.error('[meals] nothing consumed meals.needs.pushed')
      return reply.status(503).send({ error: 'The shopping list is not listening right now' })
    }

    return result
  })

  // Day-mark provider (ADR 050/066) — meals never writes calendar.events; the
  // calendar reads this at render time. A day marks ONLY when it has an owner:
  // an unclaimed day makes no mark, and neither does a covered-but-ownerless
  // takeout/out day (`isCovered()`'s other true case) — the who is the whole
  // payload, so no owner means no mark, not a special "ownerless" one.
  fastify.dayMarks.register({
    name: 'meals',
    action: 'view',
    subject: 'meals.PlannedMeal',
    async fetch(from, to) {
      const meals = await mealPrisma.plannedMeal.findMany({
        where: { date: { gte: new Date(from), lte: new Date(to) }, ownerId: { not: null } },
        orderBy: { date: 'asc' },
      })
      if (meals.length === 0) return []

      const ownerIds = [...new Set(meals.map((m) => m.ownerId as string))]
      const owners = await prisma.profile.findMany({
        where: { id: { in: ownerIds } },
        select: { id: true, name: true },
      })
      const nameById = new Map(owners.map((o) => [o.id, o.name]))

      return meals
        .filter((m) => nameById.has(m.ownerId as string))
        .map((meal) => ({
          date: meal.date.toISOString().slice(0, 10),
          ownerId: meal.ownerId as string,
          glyph: 'utensils',
          label: `${nameById.get(meal.ownerId as string)}'s got dinner`,
        }))
    },
  })
}

// `dependencies: ['calendar']` — this plugin calls `fastify.dayMarks.register()`,
// a decorator only `calendar.ts` adds. `server.ts`'s registration order already
// puts calendar first, but that ordering is easy to disturb (M7 School will be
// editing that same list); fastify-plugin turns a wrong order into a named boot
// error instead of "Cannot read properties of undefined (reading 'register')".
export default fp(mealsPlugin, { name: 'meals', dependencies: ['calendar'] })
