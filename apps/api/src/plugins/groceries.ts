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
  GroceryListCreateSchema,
  GroceryCheckSchema,
} from '@family-os/schemas'

// Own file, not appended to meals.ts (kickoff constraint) — M5/3 is touching
// meals.ts's planned-meal routes in the same wave.

// The completion field only ever matches a prefix against this; a house is
// nowhere near it, and it keeps an unbounded table off the wire.
const ENTRY_LIMIT = 500

type GroceryItemRow = Awaited<ReturnType<typeof mealPrisma.groceryItem.create>>
type GroceryListRow = Awaited<ReturnType<typeof mealPrisma.groceryList.create>>

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
}

/** `note` is computed server-side, never stored raw — "for Sunday's rigatoni"
    (needs push) or "Emma added these" (manual/staple). Nothing in the client
    renders it since the M5/6 gate cut the note line, but the computation
    stays: M5/7's partner sync ("Sam got it") is expected to want it back. */
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
    listId: item.listId,
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

function serializeList(list: GroceryListRow, itemCount: number) {
  return {
    id: list.id,
    name: list.name,
    kind: list.kind,
    groupByAisle: list.groupByAisle,
    itemCount,
  }
}

/** The list a server-driven push (a meal's needs) lands on when no person is
    choosing a destination — the first permanent list by
    `sortOrder` ("Grocery Store"), the same list the M5/6 migration backfilled
    every pre-existing item onto. */
async function defaultListId(): Promise<string> {
  const list = await mealPrisma.groceryList.findFirst({
    where: { kind: 'permanent' },
    orderBy: { sortOrder: 'asc' },
  })
  if (!list) throw new Error('No permanent grocery list seeded')
  return list.id
}

/** Teaches the completion dictionary what was just added. Newest spelling of a
    name wins, so a family that starts writing "Chicken thighs" stops being
    offered "chicken thighs" a year later.

    The item is already committed by the time this runs, so a failure here must
    not become the add's failure — two people adding the same brand-new name at
    once race the upsert, and a 500 would tell one of them to retry an add that
    already landed. Logged, never surfaced: the cost is one missed completion. */
async function remember(name: string) {
  const normalizedName = normalizeItemName(name)
  if (!normalizedName) return
  try {
    await mealPrisma.groceryEntry.upsert({
      where: { normalizedName },
      update: { name, lastAddedAt: new Date() },
      create: { normalizedName, name },
    })
  } catch (err) {
    console.error('[groceries] could not remember %s', normalizedName, err)
  }
}

const groceriesPlugin: FastifyPluginAsync = async (fastify) => {
  // GET /groceries/lists — the index (design gate 2026-08-23): permanent
  // lists always show, dim at zero; a runtime list shows only while it holds
  // items — it disappears by emptying, never by a delete action (ADR 067).
  fastify.get('/groceries/lists', async (request, reply) => {
    if (!request.ability.can('view', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const lists = await mealPrisma.groceryList.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    const counts = await mealPrisma.groceryItem.groupBy({
      by: ['listId'],
      _count: { _all: true },
    })
    const countByList = new Map(counts.map((c) => [c.listId, c._count._all]))

    const visible = lists.filter((l) => l.kind === 'permanent' || (countByList.get(l.id) ?? 0) > 0)
    return { lists: visible.map((l) => serializeList(l, countByList.get(l.id) ?? 0)) }
  })

  // POST /groceries/lists — creating a list is tier 4 (ADR 067): it commits
  // the household to a trip, unlike adding an item to one already planned.
  fastify.post('/groceries/lists', async (request, reply) => {
    if (!request.ability.can('create', 'meals.GroceryList')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    if (request.profile.id === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'Switch to your own profile to create a list' })
    }

    const parsed = GroceryListCreateSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const maxSortOrder = await mealPrisma.groceryList.aggregate({ _max: { sortOrder: true } })
    const list = await mealPrisma.groceryList.create({
      data: {
        name: parsed.data.name,
        kind: 'runtime',
        createdBy: request.profile.id,
        sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
      },
    })
    return reply.status(201).send(serializeList(list, 0))
  })

  // GET /groceries/lists/:id — the per-list view (drill-in).
  fastify.get('/groceries/lists/:id', async (request, reply) => {
    if (!request.ability.can('view', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const list = await mealPrisma.groceryList.findUnique({ where: { id } })
    if (!list) return reply.status(404).send({ error: 'List not found' })

    const items = await mealPrisma.groceryItem.findMany({ where: { listId: id } })
    return { list: serializeList(list, items.length), items: await serializeItems(items) }
  })

  // GET /groceries/entries — the ghost completion's dictionary (design gate
  // amendment 2026-08-23): what this family has added before, across every
  // list, most recent first. Not a fixed staple list — the seeded starter set
  // is just this table's initial contents.
  fastify.get('/groceries/entries', async (request, reply) => {
    if (!request.ability.can('view', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const entries = await mealPrisma.groceryEntry.findMany({
      orderBy: { lastAddedAt: 'desc' },
      take: ENTRY_LIMIT,
    })
    return { entries: entries.map((e) => ({ normalizedName: e.normalizedName, name: e.name })) }
  })

  // POST /groceries/lists/:id/items — items file themselves (design.md
  // §M5/6): the shipped dictionary assigns `category`, a per-family override
  // (from a prior correction) wins over it. Inside a list the destination is
  // implied (handoff spec "Adding") — the id in the URL IS the destination.
  // One filing source of truth — the needs push below uses the exact same call.
  fastify.post('/groceries/lists/:id/items', async (request, reply) => {
    if (!request.ability.can('create', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    // The unattended family dashboard has no person to attribute the add to —
    // its id is not a UUID and must never reach the @db.Uuid added_by column.
    if (request.profile.id === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'Switch to your own profile to add to the list' })
    }

    const { id: listId } = request.params as { id: string }
    const list = await mealPrisma.groceryList.findUnique({ where: { id: listId } })
    if (!list) return reply.status(404).send({ error: 'List not found' })

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
        listId,
      },
    })

    await remember(item.name)

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
  // Gated on `manage`, not `create` (ADR 067) — this doesn't just fix one
  // row, it rewrites how every future add of the name files itself for the
  // whole household.
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

  // POST /groceries/:id/check — whole-row check, pulled into M5/6 (design.md
  // gives it to M5/7; a list you cannot tick off reads as broken to the person
  // holding the phone). Gated on `check`, its own action: adding is tier 1+ so
  // a kid can ask for cereal, but marking the aisle walked is tier 2+. The gate
  // is `ability.can`, never a tier read (ADR 067) — `meals.grocery.check` is a
  // grantable key and a raw comparison is a ceiling an override can't reach.
  fastify.post('/groceries/:id/check', async (request, reply) => {
    if (!request.ability.can('check', 'meals.GroceryItem')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    // `got_by` is @db.Uuid and the household dashboard's id is not a uuid —
    // the same trap `added_by` sets on the add route, and the same answer.
    if (request.profile.id === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'Switch to your own profile to check things off' })
    }

    const { id } = request.params as { id: string }
    const existing = await mealPrisma.groceryItem.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Item not found' })

    const parsed = GroceryCheckSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const { status } = parsed.data

    // Unchecking clears the attribution rather than keeping a stale "Sam got
    // it" on a row nobody has got — the push-needs re-add path (below) clears
    // the same two columns, and the two must not disagree.
    const item = await mealPrisma.groceryItem.update({
      where: { id },
      data:
        status === 'got'
          ? { status, gotBy: request.profile.id, gotAt: new Date() }
          : { status, gotBy: null, gotAt: null },
    })

    const [serialized] = await serializeItems([item])
    return serialized
  })

  // POST /groceries/push-needs — the week page's "N things needed" text link:
  // comma-splits the meal's `needs` free text into plain items on the default
  // list (handoff spec: needs-pushed items arrive as plain items — AC6/AC7's
  // "noted with its meal" is superseded, the note line is gone). Dedupe by
  // normalized name against OPEN items on THAT list (skip); re-adding an
  // existing CHECKED item on that list unchecks it rather than duplicating.
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

    const listId = await defaultListId()

    const names = (meal.needs ?? '')
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0)
    if (names.length === 0) {
      return { items: [], listId }
    }

    const existing = await mealPrisma.groceryItem.findMany({ where: { listId } })
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
          listId,
        },
      })
      touched.push(created)
      existingByName.set(key, created) // a same-batch repeat of this name dedupes against it too
      await remember(created.name)
      fastify.eventBus.emit('meals.grocery.added', {
        itemId: created.id,
        name: created.name,
        addedBy: created.addedBy,
        sourceType: created.sourceType,
      })
    }

    return { items: await serializeItems(touched), listId }
  })
}

export default fp(groceriesPlugin, { name: 'groceries' })
