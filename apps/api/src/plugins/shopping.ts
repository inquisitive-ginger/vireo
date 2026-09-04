import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
// The only platform import this file needs: a TYPE, for the consumer's signature.
// The value imports went with rendered attribution (live review, 2026-09-03).
import type { EventBus } from '@family-os/platform/server'
import { shoppingPrisma } from '@family-os/plugin-shopping/db'
import { fileAisle, normalizeItemName, aisleSortIndex } from '@family-os/plugin-shopping/lib/filing'
import {
  ShoppingItemCreateSchema,
  ShoppingAisleCorrectionSchema,
  ShoppingListCreateSchema,
  NeedsPushedPayloadSchema,
} from '@family-os/schemas'
import type { NeedsPushResult } from '@family-os/schemas'

type ItemRow = Awaited<ReturnType<typeof shoppingPrisma.item.create>>
type ListRow = Awaited<ReturnType<typeof shoppingPrisma.list.create>>

function serializeItem(item: ItemRow) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    status: item.status,
    listId: item.listId,
    addedAt: item.addedAt.toISOString(),
    // Who added a thing is noise on a shared list (live review, 2026-09-03) —
    // `added_by` is still stored for permissions and audit, it just never
    // renders. What the line carries is WHY the row exists: the producer's own
    // words, carried across the needs-push contract because `shopping` cannot
    // read `planned_meals` to derive them (ADR 069 §3). A hand-typed row has no
    // producer and no note, which is the correct resting state — nothing is
    // invented to fill the line.
    note: item.sourceLabel,
  }
}

/** Walk order, then oldest first — but only where the list HAS a walk. A
    destination with no aisles of ours (a hardware run) sorts by when things were
    added, because sorting it by our grocery aisles would impose an order its
    shopper cannot see. */
function serializeItems(items: ItemRow[], groupByAisle: boolean) {
  return items
    .slice()
    .sort((a, b) => {
      if (groupByAisle) {
        const byAisle = aisleSortIndex(a.category) - aisleSortIndex(b.category)
        if (byAisle !== 0) return byAisle
      }
      return a.addedAt.getTime() - b.addedAt.getTime()
    })
    .map(serializeItem)
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

type FileItemInput = {
  listId: string
  name: string
  quantity?: string | null
  addedBy: string
  sourceType: string
  sourceId?: string | null
  sourceLabel?: string | null
}

/** The one place a name becomes a row. Override → dictionary → Other, remember
    the spelling, announce it. A producer's push and a hand-typed add both come
    through here, so a pushed item cannot end up filed by a second, drifting copy
    of the rule — and a mis-filed push is correctable by the same `file` action
    that corrects a mis-filed manual add. */
async function fileItem(bus: EventBus, input: FileItemInput): Promise<ItemRow> {
  const normalizedName = normalizeItemName(input.name)
  const override = await shoppingPrisma.aisleOverride.findUnique({ where: { normalizedName } })

  const item = await shoppingPrisma.item.create({
    data: {
      name: input.name,
      quantity: input.quantity ?? null,
      category: fileAisle(input.name, override?.category ?? null),
      status: 'needed',
      sourceType: input.sourceType,
      sourceId: input.sourceId ?? null,
      sourceLabel: input.sourceLabel ?? null,
      addedBy: input.addedBy,
      listId: input.listId,
    },
  })

  await remember(item.name)

  // One event name for every add, whoever caused it — a wall add is told apart
  // by `addedBy` (ADR 072) and a pushed one by `sourceType`, not by a second
  // name on the bus.
  bus.emit('shopping.item.added', {
    itemId: item.id,
    listId: item.listId,
    name: item.name,
    addedBy: item.addedBy,
    sourceType: item.sourceType,
  })

  return item
}

/** The consumer half of the needs-push contract (ADR 069 §4). It takes the
    meal's identity from the payload and never reads `planned_meals`.

    It RETURNS rather than logging: a person tapped "3 things needed" and is
    standing there waiting to be told what happened, so the counts — and any
    throw — travel back to the producer's route through `emitAndAwait`. That is
    the opposite of the fire-and-forget subscribers in `chores`/`rewards`, and
    deliberately so: a failed XP award must not fail a chore, but a needs push
    that did not land must not report success. */
async function fileNeeds(bus: EventBus, payload: unknown): Promise<NeedsPushResult> {
  const parsed = NeedsPushedPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    throw new Error(`malformed meals.needs.pushed payload: ${parsed.error.message}`)
  }
  const { names, sourceType, sourceId, note, requestedBy } = parsed.data

  const list = await shoppingPrisma.list.findFirst({
    where: { kind: 'permanent' },
    orderBy: { sortOrder: 'asc' },
  })
  if (!list) throw new Error('no permanent list to file needs onto')

  // Dedupe on the normalized name — the same key the dictionary and the
  // overrides use, so "Snap Peas" and "snap peas," are one thing. An OPEN row
  // beats a checked one when both normalize equal: the open row is what a
  // repeat push should skip against.
  const existing = await shoppingPrisma.item.findMany({ where: { listId: list.id } })
  const byName = new Map<string, ItemRow>()
  for (const item of existing) {
    const key = normalizeItemName(item.name)
    const current = byName.get(key)
    if (!current || (current.status === 'got' && item.status === 'needed')) byName.set(key, item)
  }

  let filed = 0
  let alreadyOn = 0
  for (const name of names) {
    const key = normalizeItemName(name)
    const match = byName.get(key)

    if (match?.status === 'needed') {
      alreadyOn += 1
      continue
    }

    // Pushing a meal that needs something already bought puts the row back
    // rather than duplicating it (salvaged from PR #127). Nothing can reach
    // 'got' until M5.5/4 ships checking; the branch is here so dedupe does not
    // have to change shape when it does.
    const item = match
      ? await shoppingPrisma.item.update({
          where: { id: match.id },
          data: { status: 'needed', gotBy: null, gotAt: null, sourceLabel: note },
        })
      : await fileItem(bus, {
          listId: list.id,
          name,
          addedBy: requestedBy,
          sourceType,
          sourceId,
          sourceLabel: note,
        })

    // A repeat of the same name inside one push dedupes against what it just
    // wrote, not just against what was already there.
    byName.set(key, item)
    filed += 1
  }

  return { listId: list.id, listName: list.name, filed, alreadyOn }
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
      items: serializeItems(items, list.groupByAisle),
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

    const item = await fileItem(fastify.eventBus, {
      listId,
      name,
      quantity,
      addedBy: request.profile.id,
      sourceType: 'manual',
    })

    return reply.status(201).send(serializeItem(item))
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

    return serializeItem(item)
  })

  // ─── Event subscribers ─────────────────────────────────────────────────────

  // `meals.needs.pushed` (ADR 069 §4) — the boundary in one line: meals says
  // what it needs, shopping decides where it goes and what it is called. No
  // `dependencies` entry is needed the way the day-mark provider needs one:
  // the bus is looked up at request time, not at boot, so registration order
  // cannot break this.
  fastify.eventBus.on('meals.needs.pushed', (payload) => fileNeeds(fastify.eventBus, payload))
}

export default fp(shoppingPlugin, { name: 'shopping' })
