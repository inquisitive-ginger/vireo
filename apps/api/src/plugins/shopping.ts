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
  ShoppingCheckSchema,
  ShoppingListCreateSchema,
  NeedsPushedPayloadSchema,
} from '@family-os/schemas'
import type { NeedsPushResult } from '@family-os/schemas'

type ItemRow = Awaited<ReturnType<typeof shoppingPrisma.item.create>>
type ListRow = Awaited<ReturnType<typeof shoppingPrisma.list.create>>

/** How long you can take back your own add (ADR 073). Fifteen minutes covers the
    typo caught at the fridge and the "wait, we have that" on the walk back, and
    excludes yesterday's list, which is what `manage` is for. Nothing restarts
    it — not a check, not a re-file, not an edit. */
const RETRACT_WINDOW_MS = 15 * 60 * 1000

/** Whether THIS reader may take this row back right now (ADR 073). Derived on the
    server and sent as a boolean rather than shipping `added_by` to the client:
    per-row attribution never goes on the wire (live review, 2026-09-03), and the
    window is a clock question, which the server's clock is the right one to
    answer — a phone with a skewed clock would otherwise draw an affordance the
    route refuses. It goes stale between fetches, which ADR 073 §2 accepts: the
    boundary lands on the next read, and a tap after it gets a 403 the surface
    shows. */
function canRetract(item: ItemRow, profileId: string): boolean {
  return item.addedBy === profileId && Date.now() - item.addedAt.getTime() <= RETRACT_WINDOW_MS
}

function serializeItem(item: ItemRow, profileId?: string) {
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
    canRetract: profileId === undefined ? false : canRetract(item, profileId),
  }
}

/** Walk order, then oldest first — but only where the list HAS a walk. A
    destination with no aisles of ours (a hardware run) sorts by when things were
    added, because sorting it by our grocery aisles would impose an order its
    shopper cannot see. */
function serializeItems(items: ItemRow[], groupByAisle: boolean, profileId: string) {
  return items
    .slice()
    .sort((a, b) => {
      if (groupByAisle) {
        const byAisle = aisleSortIndex(a.category) - aisleSortIndex(b.category)
        if (byAisle !== 0) return byAisle
      }
      return a.addedAt.getTime() - b.addedAt.getTime()
    })
    .map((item) => serializeItem(item, profileId))
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

/** The client, or a transaction's view of it — a batch of writes runs inside
    `$transaction` and must not reach around it to the singleton. */
type ItemWriter = Pick<typeof shoppingPrisma, 'item' | 'aisleOverride'>

/** The one place a name becomes a row: override → dictionary → Other. A
    producer's push and a hand-typed add both come through here, so a pushed item
    cannot end up filed by a second, drifting copy of the rule — and a mis-filed
    push is correctable by the same `file` action that corrects a mis-filed
    manual add. */
async function createItem(db: ItemWriter, input: FileItemInput): Promise<ItemRow> {
  const normalizedName = normalizeItemName(input.name)
  const override = await db.aisleOverride.findUnique({ where: { normalizedName } })

  return db.item.create({
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
}

/** What happens once the row is COMMITTED, never before: a rolled-back batch
    that had already announced itself would leave every widget invalidating
    against rows that no longer exist, and would teach the entry table a spelling
    from a write that did not survive. */
async function announceItem(bus: EventBus, item: ItemRow) {
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
}

/** The open row this name would double, on this list. Matched on
    `normalizeItemName` — the key the dictionary and the overrides already use,
    so `Milk` and `milk,` are one thing and `mikk` is not. Read in JS rather than
    SQL because the normalization is ours and no column carries it; `fileNeeds`
    dedupes the same way. */
async function findDuplicate(listId: string, name: string) {
  const normalizedName = normalizeItemName(name)
  if (!normalizedName) return null

  const open = await shoppingPrisma.item.findMany({ where: { listId, status: 'needed' } })
  const match = open.find((item) => normalizeItemName(item.name) === normalizedName)
  return match ? { id: match.id, name: match.name } : null
}

async function fileItem(bus: EventBus, input: FileItemInput): Promise<ItemRow> {
  const item = await createItem(shoppingPrisma, input)
  await announceItem(bus, item)
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

  // All of it or none of it. A push is one gesture: filing three of five and
  // then failing would tell the person it did not land while two rows sat on
  // the list, and their retry would report "3 sent · 2 already on it" for a
  // push they were told had failed.
  const { created, filed, alreadyOn } = await shoppingPrisma.$transaction(async (tx) => {
    // Dedupe on the normalized name — the same key the dictionary and the
    // overrides use, so "Snap Peas" and "snap peas," are one thing. An OPEN row
    // beats a checked one when both normalize equal: the open row is what a
    // repeat push should skip against.
    const existing = await tx.item.findMany({ where: { listId: list.id } })
    const byName = new Map<string, ItemRow>()
    for (const item of existing) {
      const key = normalizeItemName(item.name)
      const current = byName.get(key)
      if (!current || (current.status === 'got' && item.status === 'needed')) byName.set(key, item)
    }

    const created: ItemRow[] = []
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
      let item: ItemRow
      if (match) {
        item = await tx.item.update({
          where: { id: match.id },
          data: { status: 'needed', gotBy: null, gotAt: null, sourceLabel: note },
        })
      } else {
        item = await createItem(tx, {
          listId: list.id,
          name,
          addedBy: requestedBy,
          sourceType,
          sourceId,
          sourceLabel: note,
        })
        created.push(item)
      }

      // A repeat of the same name inside one push dedupes against what it just
      // wrote, not just against what was already there.
      byName.set(key, item)
      filed += 1
    }

    return { created, filed, alreadyOn }
  })

  // After the commit, never inside it.
  for (const item of created) await announceItem(bus, item)

  return { listId: list.id, listName: list.name, filed, alreadyOn }
}

/** How far back the ambient surfaces remember. The wall shows the few that fit
    one row of chips; the widget shows as many whole rows as its slot has room
    for, which on the tallest slot is under a dozen. */
const RECENT_LIMIT = 12

/** Gone is gone (ADR 073 §5): one event for one transition, whichever verb did
    it, because a consumer drops the row identically either way and two names
    guarantee somebody subscribes to one only. `name` rides along because the row
    cannot be looked up after. */
function announceRemoval(
  bus: EventBus,
  item: ItemRow,
  by: string,
  reason: 'retracted' | 'managed'
) {
  bus.emit('shopping.item.removed', {
    itemId: item.id,
    listId: item.listId,
    name: item.name,
    by,
    reason,
  })
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

  // GET /shopping/recent — the two ambient surfaces' one read (design.md §W2,
  // §"Adding from anywhere"). The wall's "Just added" and the Home widget's rows
  // are both "what landed lately, anywhere" — the destination strip's counts sit
  // beside them on both, so they travel together rather than as two round trips
  // a fridge tablet on flaky wifi has to make. Newest first, `needed` only: the
  // wall is a short memory of what is still waiting, not an audit trail.
  fastify.get('/shopping/recent', async (request, reply) => {
    if (!request.ability.can('view', 'shopping.Item')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const lists = await shoppingPrisma.list.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    const items = await shoppingPrisma.item.findMany({
      where: { status: 'needed' },
      orderBy: { addedAt: 'desc' },
      take: RECENT_LIMIT,
    })
    const counts = await shoppingPrisma.item.groupBy({
      by: ['listId'],
      where: { status: 'needed' },
      _count: { _all: true },
    })
    const countByList = new Map(counts.map((c) => [c.listId, c._count._all]))
    const nameById = new Map(lists.map((l) => [l.id, l.name]))
    // The echo has to be true wherever the field lives, not only on the route,
    // so the corrections travel here for the same reason they travel with a list.
    const overrides = await shoppingPrisma.aisleOverride.findMany()

    const visible = lists.filter((l) => l.kind === 'permanent' || (countByList.get(l.id) ?? 0) > 0)
    return {
      lists: visible.map((l) => serializeList(l, countByList.get(l.id) ?? 0)),
      items: items.map((item) => ({
        ...serializeItem(item, request.profile.id),
        listName: nameById.get(item.listId) ?? '',
      })),
      overrides: Object.fromEntries(overrides.map((o) => [o.normalizedName, o.category])),
    }
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
      items: serializeItems(items, list.groupByAisle, request.profile.id),
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

    // Read the collision BEFORE the insert, so the row about to be created can
    // never be its own duplicate. `needed` only: something already in the cart
    // being asked for again is a real second-trip item, not a mistake. Same
    // list only — two destinations wanting milk is two shops.
    const duplicateOf = await findDuplicate(listId, name)

    const item = await fileItem(fastify.eventBus, {
      listId,
      name,
      quantity,
      addedBy: request.profile.id,
      sourceType: 'manual',
    })

    // The add always completes; the collision rides back with it so the surface
    // needs no second read to say `Already on Grocery.`
    return reply.status(201).send({ item: serializeItem(item, request.profile.id), duplicateOf })
  })

  // DELETE /shopping/items/:id — taking back something that should never have
  // been on the list, which is a different act from checking it off in a shop
  // (ADR 071 split `check` out of `manage` for the same reason). `manage` is the
  // remove verb, tier 4 — see the note in the surface: an add is tier 1, so the
  // person most likely to make the typo may not be the one who can undo it.
  fastify.delete('/shopping/items/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'shopping.Item')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await shoppingPrisma.item.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Item not found' })

    await shoppingPrisma.item.delete({ where: { id } })
    // This emitted nothing until ADR 073, which is a live staleness bug and not
    // a new feature: a parent deleting a row left every other shopper's screen
    // showing it, because invalidation is same-client and this is two clients.
    announceRemoval(fastify.eventBus, existing, request.profile.id, 'managed')
    return reply.status(204).send()
  })

  // POST /shopping/items/:id/retract — taking back YOUR OWN add, within fifteen
  // minutes (ADR 073). Tier 1, because the cheapest reversible action on the
  // surface must not sit behind the delete verb.
  //
  // Three checks, not one. The ability is the capability; `addedBy` is the row
  // condition, enforced here because `ability.ts` replays an override grant as
  // `can(action, subject)` with no conditions, so a revoke-then-regrant would
  // otherwise return this key unscoped (ADR 073 §6). The window is time, which
  // no ability can express.
  fastify.post('/shopping/items/:id/retract', async (request, reply) => {
    if (!request.ability.can('retract', 'shopping.Item')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const existing = await shoppingPrisma.item.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Item not found' })

    // On the wall this resolves to the house's own adds (ADR 072/073 §3):
    // everyone at W2 is `family`, so anyone there takes back what the wall added
    // in the window, and nothing a phone added. No special case — it falls out.
    if (existing.addedBy !== request.profile.id) {
      return reply.status(403).send({ error: 'Not yours to take back' })
    }

    if (Date.now() - existing.addedAt.getTime() > RETRACT_WINDOW_MS) {
      return reply.status(403).send({ error: 'Too old to take back' })
    }

    await shoppingPrisma.item.delete({ where: { id } })
    // Deliberately does NOT un-teach `Entry` (ADR 073 §4): `remember()`'s upsert
    // already overwrote the prior spelling, so the add destroyed what
    // un-teaching would restore. Accepted residue, not an oversight.
    announceRemoval(fastify.eventBus, existing, request.profile.id, 'retracted')
    return reply.status(204).send()
  })

  // POST /shopping/items/:id/check — whole-row check, and the same route
  // unchecks (ADR 071 §2: one key, a toggle, not a one-way door). Gated on
  // `check`, tier 2 — the person holding the cart is often not the tier-4 one,
  // and a read-only shop surface is the failure ADR 071 exists to prevent.
  // `ability.can`, never a tier read (ADR 018).
  fastify.post('/shopping/items/:id/check', async (request, reply) => {
    if (!request.ability.can('check', 'shopping.Item')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const parsed = ShoppingCheckSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }
    const { status } = parsed.data

    // The body names the TARGET STATE, so two phones tapping the same row settle
    // on one answer instead of toggling each other. The write is conditional on
    // the row still being in the OTHER state, which makes the transition atomic:
    // `status` is last-write-wins between two different targets, and `got_by` is
    // first-writer-wins between two identical ones — whoever actually reached
    // the shelf keeps the attribution, and the second tap is a true no-op rather
    // than a second row-version and a second event the other phone must absorb.
    const moved = await shoppingPrisma.item.updateMany({
      where: { id, status: status === 'got' ? 'needed' : 'got' },
      data:
        status === 'got'
          ? { status, gotBy: request.profile.id, gotAt: new Date() }
          : // Unchecking clears the attribution rather than leaving a stale "got"
            // on a row nobody has got. The needs-push re-add path clears the same
            // two columns; the two must not disagree.
            { status, gotBy: null, gotAt: null },
    })

    const item = await shoppingPrisma.item.findUnique({ where: { id } })
    if (!item) return reply.status(404).send({ error: 'Item not found' })

    // Only a real transition is announced. Re-announcing a no-op would make the
    // other shopper's list refetch for a change that did not happen.
    if (moved.count > 0) {
      fastify.eventBus.emit('shopping.item.checked', {
        itemId: item.id,
        listId: item.listId,
        name: item.name,
        // The TRANSITION this request made, not the row's state when it was read
        // back. `spec.md` promises a consumer can test this value, and two people
        // writing opposite targets in the same millisecond would otherwise send
        // two events both quoting whichever write landed second.
        // ONE event for both directions (ADR 072 §5's rule applied: a second name
        // makes every consumer subscribe twice and eventually forget one).
        status,
        gotBy: status === 'got' ? request.profile.id : null,
      })
    }

    return serializeItem(item)
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

    return serializeItem(item, request.profile.id)
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
