import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { mealPrisma } from '@family-os/plugin-meals/db'
import {
  fileAisle,
  normalizeItemName,
  aisleSortIndex,
} from '@family-os/plugin-meals/lib/grocery-filing'
import {
  GroceryItemCreateSchema,
  GroceryAisleCorrectionSchema,
  GroceryPushNeedsSchema,
} from '@family-os/schemas'

// Own file, not appended to meals.ts (kickoff constraint) — M5/3 is touching
// meals.ts's planned-meal routes in the same wave.

type GroceryItemRow = Awaited<ReturnType<typeof mealPrisma.groceryItem.create>>

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
}

/** Provenance is the note line, one grammar (design.md §M5/6): "for Sunday's
    rigatoni" (needs push) or "Emma added these" (manual or staple-tap) — never
    a chip in the name line, never identity chrome (ADR 064). Computed at
    serialize time from `sourceType`/`sourceId`/`addedBy` — nothing is stored
    beyond spec.md's own columns. */
function noteFor(
  item: GroceryItemRow,
  mealsById: Map<string, { title: string; date: Date }>,
  profileById: Map<string, { name: string }>
): string | null {
  if (item.sourceType === 'meal' && item.sourceId) {
    const meal = mealsById.get(item.sourceId)
    if (meal) return `for ${weekdayLabel(meal.date)}'s ${meal.title}`
  }
  const adder = profileById.get(item.addedBy)
  return adder ? `${adder.name} added these` : null
}

function serializeItem(item: GroceryItemRow, note: string | null, hasOverride: boolean) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    status: item.status,
    sourceType: item.sourceType,
    sourceId: item.sourceId,
    addedBy: item.addedBy,
    note,
    // A family-wide override already exists for this name — the "Which
    // aisle?" prompt is genuinely one-time (AC4): it must not resurface for
    // an item that was already triaged, including "Leave it" (which teaches
    // an override of `Other` — see the aisle route). Client-visible so the
    // prompt's one-time-ness survives a reload, not just component state.
    hasOverride,
  }
}

async function serializeItems(items: GroceryItemRow[]) {
  const mealIds = [
    ...new Set(
      items.filter((i) => i.sourceType === 'meal' && i.sourceId).map((i) => i.sourceId as string)
    ),
  ]
  const meals = mealIds.length
    ? await mealPrisma.plannedMeal.findMany({ where: { id: { in: mealIds } } })
    : []
  const mealsById = new Map(meals.map((m) => [m.id, { title: m.title, date: m.date }]))

  const adderIds = [...new Set(items.map((i) => i.addedBy))]
  const adders = adderIds.length
    ? await prisma.profile.findMany({ where: { id: { in: adderIds } } })
    : []
  const profileById = new Map(adders.map((p) => [p.id, p]))

  const normalizedNames = [...new Set(items.map((i) => normalizeItemName(i.name)))]
  const overrides = normalizedNames.length
    ? await mealPrisma.groceryAisleOverride.findMany({
        where: { normalizedName: { in: normalizedNames } },
      })
    : []
  const overriddenNames = new Set(overrides.map((o) => o.normalizedName))

  return items
    .slice()
    .sort((a, b) => {
      const byAisle = aisleSortIndex(a.category) - aisleSortIndex(b.category)
      if (byAisle !== 0) return byAisle
      return a.addedAt.getTime() - b.addedAt.getTime()
    })
    .map((item) =>
      serializeItem(
        item,
        noteFor(item, mealsById, profileById),
        overriddenNames.has(normalizeItemName(item.name))
      )
    )
}

const groceriesPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get('/groceries', async (request, reply) => {
    if (!request.ability.can('view', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const items = await mealPrisma.groceryItem.findMany()
    return { items: await serializeItems(items) }
  })

  fastify.get('/groceries/staples', async (request, reply) => {
    if (!request.ability.can('view', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const staples = await mealPrisma.staple.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    })
    return { staples }
  })

  // POST /groceries — items file themselves (design.md §M5/6): the shipped
  // dictionary assigns `category`, a per-family override (from a prior
  // correction) wins over it. One source of truth — the needs push below
  // uses the exact same filing.
  fastify.post('/groceries', async (request, reply) => {
    if (!request.ability.can('create', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    // The unattended family dashboard has no person to attribute the add to —
    // its id is not a UUID and must never reach the @db.Uuid added_by column.
    if (request.profile.id === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'Switch to your own profile to add to the list' })
    }

    const parsed = GroceryItemCreateSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const { name, quantity } = parsed.data

    const normalizedName = normalizeItemName(name)
    const override = await mealPrisma.groceryAisleOverride.findUnique({ where: { normalizedName } })
    const category = fileAisle(name, override?.category ?? null)

    const item = await mealPrisma.groceryItem.create({
      data: {
        name,
        quantity,
        category,
        status: 'needed',
        sourceType: 'manual',
        addedBy: request.profile.id,
      },
    })

    fastify.eventBus.emit('meals.grocery.added', {
      itemId: item.id,
      name: item.name,
      addedBy: item.addedBy,
      sourceType: item.sourceType,
    })

    const [serialized] = await serializeItems([item])
    return reply.status(201).send(serialized)
  })

  // POST /groceries/:id/aisle — the "Which aisle?" correction (AC4/AC5):
  // re-files this item AND teaches a per-family override, keyed by the same
  // normalized name, so the next add of "snap peas" files itself correctly.
  // Gated on `manage`, not `create` — this doesn't just fix one row, it
  // rewrites how every future add of the name files itself for the whole
  // household (spec.md §Permissions: "tier 4 manages").
  fastify.post('/groceries/:id/aisle', async (request, reply) => {
    if (!request.ability.can('manage', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await mealPrisma.groceryItem.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Item not found' })

    const parsed = GroceryAisleCorrectionSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const { category } = parsed.data
    const normalizedName = normalizeItemName(existing.name)

    const [item] = await mealPrisma.$transaction([
      mealPrisma.groceryItem.update({ where: { id }, data: { category } }),
      mealPrisma.groceryAisleOverride.upsert({
        where: { normalizedName },
        update: { category },
        create: { normalizedName, category },
      }),
    ])

    const [serialized] = await serializeItems([item])
    return serialized
  })

  // POST /groceries/push-needs — the week page's "N things needed" text link
  // (AC7): comma-splits the meal's `needs` free text into items, each noted
  // with its meal. Dedupe by normalized name against OPEN items (skip);
  // re-adding an existing CHECKED item unchecks it rather than duplicating.
  fastify.post('/groceries/push-needs', async (request, reply) => {
    if (!request.ability.can('create', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    if (request.profile.id === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'Switch to your own profile to push to the list' })
    }

    const parsed = GroceryPushNeedsSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const meal = await mealPrisma.plannedMeal.findUnique({ where: { id: parsed.data.mealId } })
    if (!meal) return reply.status(404).send({ error: 'Meal not found' })

    const names = (meal.needs ?? '')
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0)
    if (names.length === 0) {
      return { items: [] }
    }

    const existing = await mealPrisma.groceryItem.findMany()
    const existingByName = new Map<string, GroceryItemRow>()
    // Prefer an OPEN match over a checked one when both normalize equal — an
    // open item is the one dedupe should skip against.
    for (const item of existing) {
      const key = normalizeItemName(item.name)
      const current = existingByName.get(key)
      if (!current || (current.status === 'got' && item.status === 'needed')) {
        existingByName.set(key, item)
      }
    }

    const overrides = await mealPrisma.groceryAisleOverride.findMany({
      where: { normalizedName: { in: names.map(normalizeItemName) } },
    })
    const overrideByName = new Map(overrides.map((o) => [o.normalizedName, o.category]))

    const touched: GroceryItemRow[] = []
    for (const name of names) {
      const key = normalizeItemName(name)
      const match = existingByName.get(key)
      if (match?.status === 'needed') continue // already on the list, open — skip
      if (match?.status === 'got') {
        // Re-adding a checked item unchecks it (AC7).
        const reopened = await mealPrisma.groceryItem.update({
          where: { id: match.id },
          data: { status: 'needed', gotBy: null, gotAt: null },
        })
        touched.push(reopened)
        existingByName.set(key, reopened) // a same-batch repeat of this name dedupes against it too
        continue
      }
      const category = fileAisle(name, overrideByName.get(key) ?? null)
      const created = await mealPrisma.groceryItem.create({
        data: {
          name,
          category,
          status: 'needed',
          sourceType: 'meal',
          sourceId: meal.id,
          addedBy: request.profile.id,
        },
      })
      touched.push(created)
      existingByName.set(key, created) // a same-batch repeat of this name dedupes against it too
      fastify.eventBus.emit('meals.grocery.added', {
        itemId: created.id,
        name: created.name,
        addedBy: created.addedBy,
        sourceType: created.sourceType,
      })
    }

    return { items: await serializeItems(touched) }
  })
}

export default fp(groceriesPlugin, { name: 'groceries' })
