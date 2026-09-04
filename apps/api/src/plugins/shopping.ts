import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { shoppingPrisma } from '@family-os/plugin-shopping/db'
import { fileAisle, normalizeItemName, aisleSortIndex } from '@family-os/plugin-shopping/lib/filing'
import {
  ShoppingItemCreateSchema,
  ShoppingAisleCorrectionSchema,
  ShoppingListCreateSchema,
} from '@family-os/schemas'

type ItemRow = Awaited<ReturnType<typeof shoppingPrisma.item.create>>
type ListRow = Awaited<ReturnType<typeof shoppingPrisma.list.create>>

/** The row's second line — a text fact, never a hue or a face (ADR 064). A
    producer-pushed item carries no meal lookup: `shopping` does not read
    `planned_meals` (ADR 069 §3), so whoever pushes owes the words.

    An add from the unattended wall is attributed to the house (ADR 072): it is a
    place, not a person, so it gets words and never a name, a hue or a face — a
    null `identityHue` here must not fall back to `resolveHue('Family')`, which
    would hash the house into a real member's colour (ADR 044). */
function noteFor(item: ItemRow, profileById: Map<string, { name: string }>): string | null {
  if (item.addedBy === FAMILY_PROFILE_ID) return 'Added by the house'
  const adder = profileById.get(item.addedBy)
  return adder ? `${adder.name} added` : null
}

function serializeItem(item: ItemRow, note: string | null) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    status: item.status,
    listId: item.listId,
    addedAt: item.addedAt.toISOString(),
    note,
  }
}

async function serializeItems(items: ItemRow[]) {
  const adderIds = [...new Set(items.map((i) => i.addedBy))]
  const adders = adderIds.length
    ? await prisma.profile.findMany({ where: { id: { in: adderIds } } })
    : []
  const profileById = new Map(adders.map((p) => [p.id, p]))

  return items
    .slice()
    .sort((a, b) => {
      const byAisle = aisleSortIndex(a.category) - aisleSortIndex(b.category)
      if (byAisle !== 0) return byAisle
      return a.addedAt.getTime() - b.addedAt.getTime()
    })
    .map((item) => serializeItem(item, noteFor(item, profileById)))
}

function serializeList(list: ListRow, itemCount: number) {
  return {
    id: list.id,
    name: list.name,
    kind: list.kind,
    groupByAisle: list.groupByAisle,
    itemCount,
  }
}

/** Teaches the entry table what was just added — newest spelling of a name wins.
    The item is already committed by the time this runs, so a failure here must
    not become the add's failure: two people adding the same brand-new name at
    once race the upsert, and a 500 would tell one of them to retry an add that
    already landed. Logged, never surfaced. */
async function remember(name: string) {
  const normalizedName = normalizeItemName(name)
  if (!normalizedName) return
  try {
    await shoppingPrisma.entry.upsert({
      where: { normalizedName },
      update: { name, lastAddedAt: new Date() },
      create: { normalizedName, name },
    })
  } catch (err) {
    console.error('[shopping] could not remember %s', normalizedName, err)
  }
}

const shoppingPlugin: FastifyPluginAsync = async (fastify) => {
  // GET /shopping/lists — the destination strip, not an index you land on
  // (design.md): permanent lists always show and dim at zero; a runtime list
  // shows only while it holds items — it disappears by emptying, never by a
  // delete action (ADR 067).
  fastify.get('/shopping/lists', async (request, reply) => {
    if (!request.ability.can('view', 'shopping.Item')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const lists = await shoppingPrisma.list.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    const counts = await shoppingPrisma.item.groupBy({
      by: ['listId'],
      where: { status: 'needed' },
      _count: { _all: true },
    })
    const countByList = new Map(counts.map((c) => [c.listId, c._count._all]))

    const visible = lists.filter((l) => l.kind === 'permanent' || (countByList.get(l.id) ?? 0) > 0)
    return { lists: visible.map((l) => serializeList(l, countByList.get(l.id) ?? 0)) }
  })

  // POST /shopping/lists — creating a list is tier 4 (ADR 067/069): it commits
  // the household to a trip, unlike adding an item to one already planned.
  fastify.post('/shopping/lists', async (request, reply) => {
    if (!request.ability.can('create', 'shopping.List')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = ShoppingListCreateSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const maxSortOrder = await shoppingPrisma.list.aggregate({ _max: { sortOrder: true } })
    const list = await shoppingPrisma.list.create({
      data: {
        name: parsed.data.name,
        kind: 'runtime',
        createdBy: request.profile.id,
        sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
      },
    })

    fastify.eventBus.emit('shopping.list.created', {
      listId: list.id,
      name: list.name,
      createdBy: request.profile.id,
    })

    return reply.status(201).send(serializeList(list, 0))
  })

  // GET /shopping/lists/:id — the surface's read. Selecting a destination swaps
  // the list IN PLACE; this is not a drill-in and there is no index above it.
  fastify.get('/shopping/lists/:id', async (request, reply) => {
    if (!request.ability.can('view', 'shopping.Item')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const list = await shoppingPrisma.list.findUnique({ where: { id } })
    if (!list) return reply.status(404).send({ error: 'List not found' })

    const items = await shoppingPrisma.item.findMany({ where: { listId: id } })
    const open = items.filter((i) => i.status === 'needed')
    // The family's corrections travel with the list so the surface's filing echo
    // states the aisle the SERVER will pick. Echoing the bare dictionary would
    // quietly lie about every name the household has already corrected, on the
    // one line whose whole job is to be checked before the commit.
    const overrides = await shoppingPrisma.aisleOverride.findMany()
    return {
      list: serializeList(list, open.length),
      items: await serializeItems(items),
      overrides: Object.fromEntries(overrides.map((o) => [o.normalizedName, o.category])),
    }
  })

  // POST /shopping/lists/:id/items — items file themselves: the shipped
  // dictionary assigns `category`, a family-wide override (from a prior
  // correction) wins over it. The id in the URL IS the destination.
  fastify.post('/shopping/lists/:id/items', async (request, reply) => {
    if (!request.ability.can('create', 'shopping.Item')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id: listId } = request.params as { id: string }
    const list = await shoppingPrisma.list.findUnique({ where: { id: listId } })
    if (!list) return reply.status(404).send({ error: 'List not found' })

    const parsed = ShoppingItemCreateSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const { name, quantity } = parsed.data

    const normalizedName = normalizeItemName(name)
    const override = await shoppingPrisma.aisleOverride.findUnique({ where: { normalizedName } })
    const category = fileAisle(name, override?.category ?? null)

    const item = await shoppingPrisma.item.create({
      data: {
        name,
        quantity,
        category,
        status: 'needed',
        sourceType: 'manual',
        addedBy: request.profile.id,
        listId,
      },
    })

    await remember(item.name)

    fastify.eventBus.emit('shopping.item.added', {
      itemId: item.id,
      listId: item.listId,
      name: item.name,
      addedBy: item.addedBy,
    })

    const [serialized] = await serializeItems([item])
    return reply.status(201).send(serialized)
  })

  // POST /shopping/items/:id/aisle — a correction re-files this item AND
  // teaches a family-wide override, keyed by the same normalized name, so the
  // next add of "snap peas" files itself correctly. Gated on `file` — its own
  // action, not `manage` (ADR 071), so handing the correction to a shopping
  // teen does not also hand them delete and rename. Tier 4 baseline, unchanged
  // from ADR 067/069: the blast radius is the family, forever. `ability.can`,
  // never a tier read — the grant is exactly what overrides are for.
  fastify.post('/shopping/items/:id/aisle', async (request, reply) => {
    if (!request.ability.can('file', 'shopping.Item')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await shoppingPrisma.item.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Item not found' })

    const parsed = ShoppingAisleCorrectionSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const { category } = parsed.data
    const normalizedName = normalizeItemName(existing.name)

    const [item] = await shoppingPrisma.$transaction([
      shoppingPrisma.item.update({ where: { id }, data: { category } }),
      shoppingPrisma.aisleOverride.upsert({
        where: { normalizedName },
        update: { category },
        create: { normalizedName, category },
      }),
    ])

    const [serialized] = await serializeItems([item])
    return serialized
  })
}

export default fp(shoppingPlugin, { name: 'shopping' })
