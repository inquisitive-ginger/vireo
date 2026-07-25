import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import bcrypt from 'bcryptjs'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { rewardsPrisma } from '@family-os/plugin-rewards/db'
import { chorePrisma } from '@family-os/plugin-chores/db'
import { postEntry, getBalance, recomputeBalance, LedgerError } from '../lib/ledger'
import { findPayout } from '../lib/payouts'

let app: FastifyInstance

const PARENT_ID = '00000000-4ee5-0001-0000-000000000001' // tier 4
const TWEEN_ID = '00000000-4ee5-0001-0000-000000000002' // tier 2
const KID_ID = '00000000-4ee5-0001-0000-000000000003' // tier 1
const MISSING_ID = '00000000-4ee5-0001-0000-0000000000ff'

function getCookie(res: LightMyRequestResponse): string {
  const raw = res.headers['set-cookie']
  const header = Array.isArray(raw) ? raw[0] : (raw ?? '')
  return header.split(';')[0] ?? ''
}

async function getCookieForProfile(profileId: string): Promise<string> {
  const hash = await bcrypt.hash('1234', 10)
  await prisma.systemConfig.upsert({
    where: { key: 'family_pin_hash' },
    update: { value: hash },
    create: { key: 'family_pin_hash', value: hash, updatedBy: null },
  })
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/verify-pin',
    payload: { pin: '1234', targetProfileId: profileId },
  })
  return getCookie(res)
}

function credit(profileId: string, delta: number, sourceId: string | null = null) {
  return postEntry(app.eventBus, {
    profileId,
    delta,
    reason: 'test',
    sourceType: 'test.source',
    sourceId,
  })
}

beforeAll(async () => {
  app = await buildServer()

  for (const [id, name, tier] of [
    [PARENT_ID, 'Dad', 4],
    [TWEEN_ID, 'Tween', 2],
    [KID_ID, 'Kid', 1],
  ] as const) {
    await prisma.profile.upsert({
      where: { id },
      update: { name, tier },
      create: { id, name, tier },
    })
  }
  await prisma.profile.upsert({
    where: { id: 'family' },
    update: {},
    create: { id: 'family', name: 'Family', tier: 1 },
  })
})

afterAll(async () => {
  await app.close()
})

beforeEach(async () => {
  await rewardsPrisma.redemption.deleteMany({})
  await rewardsPrisma.reward.deleteMany({})
  await rewardsPrisma.ledgerEntry.deleteMany({})
  await rewardsPrisma.balance.deleteMany({})
  await rewardsPrisma.pendingPayout.deleteMany({})
  await chorePrisma.task.deleteMany({})
})

// The earn subscribers run off the event bus and are not awaited by the route
// (a failed credit must never fail the completion), so poll the balance until it
// settles rather than assuming it moved by the time inject() returns.
async function waitForBalance(profileId: string, expected: number): Promise<number> {
  for (let i = 0; i < 50; i++) {
    const balance = await getBalance(profileId)
    if (balance === expected) return balance
    await new Promise((r) => setTimeout(r, 10))
  }
  return getBalance(profileId)
}

describe('ledger service', () => {
  it('appends an entry and moves the cached balance', async () => {
    const { entry, balance, replayed } = await credit(KID_ID, 5, 'task-1')

    expect(entry.delta).toBe(5)
    expect(balance).toBe(5)
    expect(replayed).toBe(false)
    expect(await getBalance(KID_ID)).toBe(5)
  })

  it('keeps the balance equal to the sum of the deltas', async () => {
    await credit(KID_ID, 10, 'a')
    await credit(KID_ID, 5, 'b')
    await credit(KID_ID, -3, 'c')

    expect(await getBalance(KID_ID)).toBe(12)
    expect(await recomputeBalance(KID_ID)).toBe(12)
  })

  it('treats a replayed (sourceType, sourceId) as a no-op', async () => {
    await credit(KID_ID, 5, 'task-1')
    const second = await credit(KID_ID, 5, 'task-1')

    expect(second.replayed).toBe(true)
    expect(second.balance).toBe(5)
    expect(await rewardsPrisma.ledgerEntry.count({ where: { profileId: KID_ID } })).toBe(1)
  })

  it('lets entries with no provenance coexist', async () => {
    await credit(KID_ID, 2)
    await credit(KID_ID, 3)

    expect(await getBalance(KID_ID)).toBe(5)
  })

  it('rejects a zero or fractional delta', async () => {
    await expect(credit(KID_ID, 0)).rejects.toThrow(LedgerError)
    await expect(credit(KID_ID, 1.5)).rejects.toThrow(LedgerError)
  })

  it('allows an overdraft — a reversal after the coins were spent is legitimate', async () => {
    await credit(KID_ID, 5, 'earned')
    await credit(KID_ID, -5, 'spent')
    await credit(KID_ID, -5, 'reopened')

    expect(await getBalance(KID_ID)).toBe(-5)
  })

  // The service throws before the query; `profile_id` being a uuid column is the
  // second line of defence, so 'family' could not be stored even if it got past.
  it('refuses to give the family pseudo-profile a balance', async () => {
    await expect(credit('family', 5)).rejects.toThrow(LedgerError)
    expect(await rewardsPrisma.ledgerEntry.count()).toBe(0)
  })

  it('emits credited / debited with the resulting balance', async () => {
    const seen: Array<{ event: string; payload: Record<string, unknown> }> = []
    const offCredit = app.eventBus.on('rewards.balance.credited', (p) =>
      seen.push({ event: 'credited', payload: p as Record<string, unknown> })
    )
    const offDebit = app.eventBus.on('rewards.balance.debited', (p) =>
      seen.push({ event: 'debited', payload: p as Record<string, unknown> })
    )

    await credit(KID_ID, 10, 'earned')
    await credit(KID_ID, -4, 'spent')
    offCredit()
    offDebit()

    expect(seen.map((s) => s.event)).toEqual(['credited', 'debited'])
    expect(seen[1]?.payload).toMatchObject({
      profileId: KID_ID,
      delta: -4,
      balance: 6,
      sourceType: 'test.source',
      sourceId: 'spent',
    })
  })

  it('rebuilds a drifted cache from the entries', async () => {
    await credit(KID_ID, 7, 'a')
    await rewardsPrisma.balance.update({ where: { profileId: KID_ID }, data: { balance: 999 } })

    expect(await recomputeBalance(KID_ID)).toBe(7)
    expect(await getBalance(KID_ID)).toBe(7)
  })
})

describe('GET /rewards/wallet', () => {
  it('returns a tier-1 kid their own balance and history', async () => {
    await credit(KID_ID, 5, 'a')
    await credit(KID_ID, -2, 'b')
    const cookie = await getCookieForProfile(KID_ID)

    const res = await app.inject({ method: 'GET', url: '/api/rewards/wallet', headers: { cookie } })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.profileId).toBe(KID_ID)
    expect(body.balance).toBe(3)
    expect(body.entries).toHaveLength(2)
    expect(body.entries[0].delta).toBe(-2) // newest first
  })

  it('returns an empty wallet before anything is earned', async () => {
    const cookie = await getCookieForProfile(KID_ID)
    const res = await app.inject({ method: 'GET', url: '/api/rewards/wallet', headers: { cookie } })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({ balance: 0, entries: [], nextCursor: null })
  })

  it('lets tier 4 read another member’s wallet', async () => {
    await credit(KID_ID, 8, 'a')
    const cookie = await getCookieForProfile(PARENT_ID)

    const res = await app.inject({
      method: 'GET',
      url: `/api/rewards/wallet?profileId=${KID_ID}`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({ profileId: KID_ID, balance: 8 })
  })

  it('403s when a kid asks for someone else’s wallet — a wallet is not a leaderboard', async () => {
    const cookie = await getCookieForProfile(TWEEN_ID)

    const res = await app.inject({
      method: 'GET',
      url: `/api/rewards/wallet?profileId=${KID_ID}`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(403)
  })

  it('403s for the family pseudo-profile, even for tier 4', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)

    const res = await app.inject({
      method: 'GET',
      url: '/api/rewards/wallet?profileId=family',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(403)
  })

  it('404s for a profile that does not exist', async () => {
    const cookie = await getCookieForProfile(PARENT_ID)

    const res = await app.inject({
      method: 'GET',
      url: `/api/rewards/wallet?profileId=${MISSING_ID}`,
      headers: { cookie },
    })

    expect(res.statusCode).toBe(404)
  })

  it('pages the history with a cursor', async () => {
    for (let i = 0; i < 3; i++) await credit(KID_ID, 1, `e${i}`)
    const cookie = await getCookieForProfile(KID_ID)

    const first = await app.inject({
      method: 'GET',
      url: '/api/rewards/wallet?limit=2',
      headers: { cookie },
    })
    const firstBody = first.json()
    expect(firstBody.entries).toHaveLength(2)
    expect(firstBody.nextCursor).toBeTruthy()

    const second = await app.inject({
      method: 'GET',
      url: `/api/rewards/wallet?limit=2&cursor=${firstBody.nextCursor}`,
      headers: { cookie },
    })
    const secondBody = second.json()
    expect(secondBody.entries).toHaveLength(1)
    expect(secondBody.nextCursor).toBeNull()
    expect(secondBody.entries[0].id).not.toBe(firstBody.entries[0].id)
  })

  it('400s on an invalid limit', async () => {
    const cookie = await getCookieForProfile(KID_ID)

    const res = await app.inject({
      method: 'GET',
      url: '/api/rewards/wallet?limit=0',
      headers: { cookie },
    })

    expect(res.statusCode).toBe(400)
  })
})

// ─── Chores earn (ADR 048) ────────────────────────────────────────────────────

describe('chores earn subscriber', () => {
  async function payingTask(coinReward: number, assigneeId = KID_ID) {
    return chorePrisma.task.create({
      data: { title: 'Mow the lawn', assigneeId, createdBy: PARENT_ID, coinReward },
    })
  }

  async function complete(taskId: string, cookie: string) {
    return app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${taskId}/complete`,
      headers: { cookie },
    })
  }

  async function reopen(taskId: string, cookie: string) {
    return app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${taskId}/reopen`,
      headers: { cookie },
    })
  }

  it('credits coinReward to the assignee when a paying chore is completed', async () => {
    const task = await payingTask(5)
    const cookie = await getCookieForProfile(KID_ID)

    await complete(task.id, cookie)

    expect(await waitForBalance(KID_ID, 5)).toBe(5)
    const entries = await rewardsPrisma.ledgerEntry.findMany({ where: { profileId: KID_ID } })
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({
      delta: 5,
      sourceType: 'chores.task',
      reason: 'Mow the lawn',
    })
  })

  it('moves nothing for a chore that pays 0 P-Bucks (the default)', async () => {
    const task = await payingTask(0)
    const cookie = await getCookieForProfile(KID_ID)

    await complete(task.id, cookie)
    // Give the (no-op) subscriber a chance to have run.
    await new Promise((r) => setTimeout(r, 40))

    expect(await getBalance(KID_ID)).toBe(0)
    expect(await rewardsPrisma.ledgerEntry.count()).toBe(0)
  })

  it('debits by the same amount when the completion is reopened', async () => {
    const task = await payingTask(5)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    await complete(task.id, kid)
    await waitForBalance(KID_ID, 5)
    await reopen(task.id, parent)

    expect(await waitForBalance(KID_ID, 0)).toBe(0)
    // The debit is a distinct entry, not a deletion — the ledger is append-only.
    expect(await rewardsPrisma.ledgerEntry.count({ where: { profileId: KID_ID } })).toBe(2)
  })

  it('re-earns on a reopen→re-complete cycle (keyed by the completion instance)', async () => {
    const task = await payingTask(5)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    await complete(task.id, kid)
    await waitForBalance(KID_ID, 5)
    await reopen(task.id, parent)
    await waitForBalance(KID_ID, 0)
    await complete(task.id, kid)

    // A taskId-only key would swallow this as a replay and leave the balance at 0.
    expect(await waitForBalance(KID_ID, 5)).toBe(5)
  })

  it('nets to a single credit across repeated reopen/complete cycles — no P-Bucks farming', async () => {
    const task = await payingTask(5)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    // Credit on complete, symmetric debit on reopen — each cycle cancels, so hammering
    // the loop can never accumulate. Three completions end at exactly one credit.
    await complete(task.id, kid)
    await waitForBalance(KID_ID, 5)
    await reopen(task.id, parent)
    await waitForBalance(KID_ID, 0)
    await complete(task.id, kid)
    await waitForBalance(KID_ID, 5)
    await reopen(task.id, parent)
    await waitForBalance(KID_ID, 0)
    await complete(task.id, kid)

    expect(await waitForBalance(KID_ID, 5)).toBe(5)
  })

  it('is idempotent — a redelivered completed event does not double-credit', async () => {
    const task = await payingTask(5)
    const completedAt = new Date().toISOString()
    const payload = {
      taskId: task.id,
      assigneeId: KID_ID,
      coinReward: 5,
      completedAt,
      title: 'Mow the lawn',
    }

    app.eventBus.emit('chores.task.completed', payload)
    app.eventBus.emit('chores.task.completed', payload)

    expect(await waitForBalance(KID_ID, 5)).toBe(5)
    expect(await rewardsPrisma.ledgerEntry.count({ where: { profileId: KID_ID } })).toBe(1)
  })
})

// ─── Payout approval (M4/3b) ──────────────────────────────────────────────────

describe('payout approval', () => {
  async function heldTask(coinReward = 10, assigneeId = KID_ID) {
    return chorePrisma.task.create({
      data: {
        title: 'Mow the lawn',
        assigneeId,
        createdBy: PARENT_ID,
        coinReward,
        requiresApproval: true,
      },
    })
  }

  const complete = (taskId: string, cookie: string) =>
    app.inject({
      method: 'PATCH',
      url: `/api/chores/tasks/${taskId}/complete`,
      headers: { cookie },
    })
  const reopen = (taskId: string, cookie: string) =>
    app.inject({ method: 'PATCH', url: `/api/chores/tasks/${taskId}/reopen`, headers: { cookie } })

  // The held payout is written by the async earn subscriber; poll for it.
  async function waitForPayout(taskId: string) {
    for (let i = 0; i < 50; i++) {
      const rows = await rewardsPrisma.pendingPayout.findMany({
        where: { sourceType: 'chores.task' },
      })
      const found = rows.find((r) => r.sourceId.startsWith(`${taskId}@`))
      if (found) return found
      await new Promise((r) => setTimeout(r, 10))
    }
    return null
  }

  it('holds the payout instead of crediting when a chore requires approval', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)

    await complete(task.id, kid)
    const payout = await waitForPayout(task.id)

    expect(payout).not.toBeNull()
    expect(payout).toMatchObject({
      profileId: KID_ID,
      amount: 10,
      status: 'pending',
      reason: 'Mow the lawn',
    })
    // No ledger movement — the balance is untouched until a parent approves.
    await new Promise((r) => setTimeout(r, 20))
    expect(await getBalance(KID_ID)).toBe(0)
    expect(await rewardsPrisma.ledgerEntry.count()).toBe(0)
  })

  it('approve releases the held amount as the normal ledger credit', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    await complete(task.id, kid)
    const payout = await waitForPayout(task.id)

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/rewards/payouts/${payout!.id}`,
      headers: { cookie: parent },
      payload: { decision: 'approve' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().balance).toBe(10)
    expect(await getBalance(KID_ID)).toBe(10)
    const entries = await rewardsPrisma.ledgerEntry.findMany({ where: { profileId: KID_ID } })
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ delta: 10, sourceType: 'chores.task', createdBy: PARENT_ID })
    expect(
      (await rewardsPrisma.pendingPayout.findUnique({ where: { id: payout!.id } }))?.status
    ).toBe('approved')
  })

  it('re-approving does not double-credit (409, balance unchanged)', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    await complete(task.id, kid)
    const payout = await waitForPayout(task.id)
    const decide = () =>
      app.inject({
        method: 'PATCH',
        url: `/api/rewards/payouts/${payout!.id}`,
        headers: { cookie: parent },
        payload: { decision: 'approve' },
      })

    expect((await decide()).statusCode).toBe(200)
    expect((await decide()).statusCode).toBe(409)
    expect(await getBalance(KID_ID)).toBe(10)
    expect(await rewardsPrisma.ledgerEntry.count({ where: { profileId: KID_ID } })).toBe(1)
  })

  it('decline stores the note verbatim and moves nothing', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    await complete(task.id, kid)
    const payout = await waitForPayout(task.id)

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/rewards/payouts/${payout!.id}`,
      headers: { cookie: parent },
      payload: { decision: 'decline', note: 'The corners are still full of leaves' },
    })

    expect(res.statusCode).toBe(200)
    const decided = await rewardsPrisma.pendingPayout.findUnique({ where: { id: payout!.id } })
    expect(decided).toMatchObject({
      status: 'declined',
      decidedNote: 'The corners are still full of leaves',
      decidedBy: PARENT_ID,
    })
    expect(await getBalance(KID_ID)).toBe(0)
    expect(await rewardsPrisma.ledgerEntry.count()).toBe(0)
  })

  it('reopening a still-pending payout voids it with no ledger movement', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    await complete(task.id, kid)
    const payout = await waitForPayout(task.id)
    await reopen(task.id, parent)

    // Give the reversal subscriber time to run.
    for (let i = 0; i < 50; i++) {
      const row = await rewardsPrisma.pendingPayout.findUnique({ where: { id: payout!.id } })
      if (row?.status === 'voided') break
      await new Promise((r) => setTimeout(r, 10))
    }

    expect(
      (await rewardsPrisma.pendingPayout.findUnique({ where: { id: payout!.id } }))?.status
    ).toBe('voided')
    expect(await getBalance(KID_ID)).toBe(0)
    expect(await rewardsPrisma.ledgerEntry.count()).toBe(0)
  })

  it('reopening an already-approved payout debits the released amount', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    await complete(task.id, kid)
    const payout = await waitForPayout(task.id)
    await app.inject({
      method: 'PATCH',
      url: `/api/rewards/payouts/${payout!.id}`,
      headers: { cookie: parent },
      payload: { decision: 'approve' },
    })
    await waitForBalance(KID_ID, 10)

    await reopen(task.id, parent)

    // The reversal is the symmetric debit against the same instance (M4/3 behaviour).
    expect(await waitForBalance(KID_ID, 0)).toBe(0)
    expect(await rewardsPrisma.ledgerEntry.count({ where: { profileId: KID_ID } })).toBe(2)
  })

  it('auto-credits (no hold) when the chore does not require approval', async () => {
    const task = await chorePrisma.task.create({
      data: { title: 'Dishes', assigneeId: KID_ID, createdBy: PARENT_ID, coinReward: 5 },
    })
    const kid = await getCookieForProfile(KID_ID)

    await complete(task.id, kid)

    expect(await waitForBalance(KID_ID, 5)).toBe(5)
    expect(await rewardsPrisma.pendingPayout.count()).toBe(0)
  })

  it('a redelivered completed event holds only once', async () => {
    const task = await heldTask(10)
    const completedAt = new Date().toISOString()
    const payload = {
      taskId: task.id,
      assigneeId: KID_ID,
      coinReward: 10,
      completedAt,
      title: 'Mow the lawn',
      requiresApproval: true,
    }
    app.eventBus.emit('chores.task.completed', payload)
    app.eventBus.emit('chores.task.completed', payload)

    await waitForPayout(task.id)
    await new Promise((r) => setTimeout(r, 20))
    expect(await rewardsPrisma.pendingPayout.count()).toBe(1)
  })

  it('GET /rewards/payouts returns a kid their own held payout', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)

    await complete(task.id, kid)
    await waitForPayout(task.id)

    const res = await app.inject({
      method: 'GET',
      url: '/api/rewards/payouts?status=pending',
      headers: { cookie: kid },
    })
    expect(res.statusCode).toBe(200)
    const payouts = res.json().payouts
    expect(payouts).toHaveLength(1)
    expect(payouts[0]).toMatchObject({ profileId: KID_ID, amount: 10, status: 'pending' })
  })

  it('voids a still-pending payout when its chore is deleted', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    await complete(task.id, kid)
    const payout = await waitForPayout(task.id)

    await app.inject({
      method: 'DELETE',
      url: `/api/chores/tasks/${task.id}`,
      headers: { cookie: parent },
    })

    for (let i = 0; i < 50; i++) {
      const row = await rewardsPrisma.pendingPayout.findUnique({ where: { id: payout!.id } })
      if (row?.status === 'voided') break
      await new Promise((r) => setTimeout(r, 10))
    }
    expect(
      (await rewardsPrisma.pendingPayout.findUnique({ where: { id: payout!.id } }))?.status
    ).toBe('voided')
    expect(await getBalance(KID_ID)).toBe(0)
    expect(await rewardsPrisma.ledgerEntry.count()).toBe(0)
  })

  it('leaves an approved payout paid when its chore is later deleted', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)

    await complete(task.id, kid)
    const payout = await waitForPayout(task.id)
    await app.inject({
      method: 'PATCH',
      url: `/api/rewards/payouts/${payout!.id}`,
      headers: { cookie: parent },
      payload: { decision: 'approve' },
    })
    await waitForBalance(KID_ID, 10)

    await app.inject({
      method: 'DELETE',
      url: `/api/chores/tasks/${task.id}`,
      headers: { cookie: parent },
    })
    await new Promise((r) => setTimeout(r, 40))

    // Deleting the chore record does not claw back money already paid.
    expect(await getBalance(KID_ID)).toBe(10)
    expect(
      (await rewardsPrisma.pendingPayout.findUnique({ where: { id: payout!.id } }))?.status
    ).toBe('approved')
  })

  it('a kid cannot decide a payout (tier < 4 → 403)', async () => {
    const task = await heldTask(10)
    const kid = await getCookieForProfile(KID_ID)

    await complete(task.id, kid)
    const payout = await waitForPayout(task.id)

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/rewards/payouts/${payout!.id}`,
      headers: { cookie: kid },
      payload: { decision: 'approve' },
    })
    expect(res.statusCode).toBe(403)
    expect(await findPayout('chores.task', payout!.sourceId).then((p) => p?.status)).toBe('pending')
  })
})

// ─── Catalog (M4/4) ───────────────────────────────────────────────────────────

describe('reward catalog', () => {
  const create = (cookie: string, payload: Record<string, unknown>) =>
    app.inject({ method: 'POST', url: '/api/rewards/rewards', headers: { cookie }, payload })

  it('lets a parent create a reward', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const res = await create(parent, { name: 'Pick the movie', emoji: '🍿', cost: 15 })

    expect(res.statusCode).toBe(201)
    expect(res.json().reward).toMatchObject({
      name: 'Pick the movie',
      emoji: '🍿',
      cost: 15,
      requiresApproval: false,
      audience: null,
      stock: null,
      active: true,
    })
  })

  it('400s on an invalid reward (missing name)', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const res = await create(parent, { emoji: '🍿', cost: 15 })
    expect(res.statusCode).toBe(400)
  })

  it('403s a non-parent creating a reward', async () => {
    const kid = await getCookieForProfile(KID_ID)
    const res = await create(kid, { name: 'Sneaky', emoji: '😈', cost: 1 })
    expect(res.statusCode).toBe(403)
    expect(await rewardsPrisma.reward.count()).toBe(0)
  })

  it('lists active rewards, and includes retired ones on demand', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const a = (await create(parent, { name: 'Ice cream', emoji: '🍦', cost: 25 })).json().reward
    await create(parent, { name: 'Car music', emoji: '🎧', cost: 5 })
    await app.inject({
      method: 'PATCH',
      url: `/api/rewards/rewards/${a.id}`,
      headers: { cookie: parent },
      payload: { active: false },
    })

    const active = await app.inject({
      method: 'GET',
      url: '/api/rewards/rewards',
      headers: { cookie: parent },
    })
    expect(active.json().rewards.map((r: { name: string }) => r.name)).toEqual(['Car music'])

    const all = await app.inject({
      method: 'GET',
      url: '/api/rewards/rewards?includeRetired=true',
      headers: { cookie: parent },
    })
    expect(all.json().rewards).toHaveLength(2)
  })

  it('updates a reward', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const reward = (await create(parent, { name: 'Screen time', emoji: '🎮', cost: 10 })).json()
      .reward

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/rewards/rewards/${reward.id}`,
      headers: { cookie: parent },
      payload: { cost: 12, requiresApproval: true },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().reward).toMatchObject({ cost: 12, requiresApproval: true })
  })

  it('hard-deletes an unused reward', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const reward = (await create(parent, { name: 'Oops', emoji: '❌', cost: 5 })).json().reward

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/rewards/${reward.id}`,
      headers: { cookie: parent },
    })
    expect(res.json()).toMatchObject({ deleted: true })
    expect(await rewardsPrisma.reward.count()).toBe(0)
  })

  it('retires (does not delete) a reward that redemptions reference', async () => {
    const parent = await getCookieForProfile(PARENT_ID)
    const kid = await getCookieForProfile(KID_ID)
    const reward = (await create(parent, { name: 'Music', emoji: '🎧', cost: 5 })).json().reward
    await credit(KID_ID, 5, 'seed')
    await app.inject({
      method: 'POST',
      url: '/api/rewards/redemptions',
      headers: { cookie: kid },
      payload: { rewardId: reward.id },
    })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/rewards/rewards/${reward.id}`,
      headers: { cookie: parent },
    })
    expect(res.json()).toMatchObject({ retired: true })
    // The row survives so the redemption keeps its cost snapshot.
    expect((await rewardsPrisma.reward.findUnique({ where: { id: reward.id } }))?.active).toBe(
      false
    )
  })
})

// ─── Redemptions (M4/4) ─────────────────────────────────────────────────────────

describe('redemptions', () => {
  async function reward(overrides: Record<string, unknown> = {}) {
    const parent = await getCookieForProfile(PARENT_ID)
    const res = await app.inject({
      method: 'POST',
      url: '/api/rewards/rewards',
      headers: { cookie: parent },
      payload: { name: 'Pick the movie', emoji: '🍿', cost: 15, ...overrides },
    })
    return res.json().reward as { id: string; cost: number }
  }

  const request = (cookie: string, rewardId: string) =>
    app.inject({
      method: 'POST',
      url: '/api/rewards/redemptions',
      headers: { cookie },
      payload: { rewardId },
    })

  const decide = (cookie: string, id: string, action: string, note?: string) =>
    app.inject({
      method: 'PATCH',
      url: `/api/rewards/redemptions/${id}`,
      headers: { cookie },
      payload: { action, note },
    })

  it('debits on request and grants immediately for a no-approval reward', async () => {
    const kid = await getCookieForProfile(KID_ID)
    await credit(KID_ID, 20, 'seed')
    const r = await reward()

    const res = await request(kid, r.id)
    expect(res.statusCode).toBe(201)
    expect(res.json().redemption).toMatchObject({ status: 'granted', cost: 15 })
    expect(res.json().balance).toBe(5)
    expect(await getBalance(KID_ID)).toBe(5)
  })

  it('holds an approval reward as pending, debited', async () => {
    const kid = await getCookieForProfile(KID_ID)
    await credit(KID_ID, 40, 'seed')
    const r = await reward({ cost: 40, requiresApproval: true })

    const res = await request(kid, r.id)
    expect(res.json().redemption.status).toBe('pending')
    // The F$ leaves on request, not on approval — debit now, refund only if declined.
    expect(await getBalance(KID_ID)).toBe(0)
  })

  it('refuses a request the kid cannot afford — nothing moves', async () => {
    const kid = await getCookieForProfile(KID_ID)
    await credit(KID_ID, 5, 'seed')
    const r = await reward({ cost: 15 })

    const res = await request(kid, r.id)
    expect(res.statusCode).toBe(400)
    expect(await getBalance(KID_ID)).toBe(5)
    expect(await rewardsPrisma.redemption.count()).toBe(0)
  })

  it('grant moves nothing further; fulfil then records the hand-off', async () => {
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)
    await credit(KID_ID, 15, 'seed')
    const r = await reward({ requiresApproval: true })
    const redemption = (await request(kid, r.id)).json().redemption

    const granted = await decide(parent, redemption.id, 'grant')
    expect(granted.json().redemption.status).toBe('granted')
    expect(await getBalance(KID_ID)).toBe(0) // still debited, nothing refunded

    const fulfilled = await decide(parent, redemption.id, 'fulfil')
    expect(fulfilled.json().redemption.status).toBe('fulfilled')
  })

  it('decline refunds the snapshot cost and quotes the note back', async () => {
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)
    await credit(KID_ID, 15, 'seed')
    const r = await reward({ requiresApproval: true })
    const redemption = (await request(kid, r.id)).json().redemption
    expect(await getBalance(KID_ID)).toBe(0)

    const res = await decide(parent, redemption.id, 'decline', 'Not before your homework')
    expect(res.statusCode).toBe(200)
    expect(res.json().redemption).toMatchObject({
      status: 'declined',
      decidedNote: 'Not before your homework',
    })
    // Refunded — a distinct ledger entry, not a reversal of the debit row.
    expect(await getBalance(KID_ID)).toBe(15)
  })

  it('a second decision is a 409 — the decision is final', async () => {
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)
    await credit(KID_ID, 15, 'seed')
    const r = await reward({ requiresApproval: true })
    const redemption = (await request(kid, r.id)).json().redemption

    expect((await decide(parent, redemption.id, 'grant')).statusCode).toBe(200)
    expect((await decide(parent, redemption.id, 'decline')).statusCode).toBe(409)
    // The refund never ran, so the balance stays where the grant left it.
    expect(await getBalance(KID_ID)).toBe(0)
  })

  it('snapshots the cost — repricing the reward does not move a pending request', async () => {
    const kid = await getCookieForProfile(KID_ID)
    const parent = await getCookieForProfile(PARENT_ID)
    await credit(KID_ID, 15, 'seed')
    const r = await reward({ cost: 15, requiresApproval: true })
    const redemption = (await request(kid, r.id)).json().redemption

    await app.inject({
      method: 'PATCH',
      url: `/api/rewards/rewards/${r.id}`,
      headers: { cookie: parent },
      payload: { cost: 5 },
    })

    // Declining refunds the SNAPSHOT (15), not the new price (5).
    await decide(parent, redemption.id, 'decline')
    expect(await getBalance(KID_ID)).toBe(15)
  })

  it('refuses a request outside the reward’s audience', async () => {
    const kid = await getCookieForProfile(KID_ID)
    await credit(KID_ID, 20, 'seed')
    const r = await reward({ audience: [TWEEN_ID] })

    const res = await request(kid, r.id)
    expect(res.statusCode).toBe(400)
    expect(await getBalance(KID_ID)).toBe(20)
  })

  it('refuses a request once stock is exhausted', async () => {
    const kid = await getCookieForProfile(KID_ID)
    await credit(KID_ID, 30, 'seed')
    const r = await reward({ cost: 10, stock: 1 })

    expect((await request(kid, r.id)).statusCode).toBe(201)
    const second = await request(kid, r.id)
    expect(second.statusCode).toBe(400)
    expect(await getBalance(KID_ID)).toBe(20) // only the first debited
  })

  it('a kid cannot decide a redemption (tier < 4 → 403)', async () => {
    const kid = await getCookieForProfile(KID_ID)
    await credit(KID_ID, 15, 'seed')
    const r = await reward({ requiresApproval: true })
    const redemption = (await request(kid, r.id)).json().redemption

    const res = await decide(kid, redemption.id, 'grant')
    expect(res.statusCode).toBe(403)
    expect(
      (await rewardsPrisma.redemption.findUnique({ where: { id: redemption.id } }))?.status
    ).toBe('pending')
  })

  it('the queue shows a parent every pending request; a kid only its own history', async () => {
    const kid = await getCookieForProfile(KID_ID)
    const tween = await getCookieForProfile(TWEEN_ID)
    const parent = await getCookieForProfile(PARENT_ID)
    await credit(KID_ID, 15, 'seed-kid')
    await credit(TWEEN_ID, 15, 'seed-tween')
    const r = await reward({ requiresApproval: true })
    await request(kid, r.id)
    await request(tween, r.id)

    const queue = await app.inject({
      method: 'GET',
      url: '/api/rewards/redemptions?status=pending',
      headers: { cookie: parent },
    })
    expect(queue.json().redemptions).toHaveLength(2)
    // The queue carries the reward for rendering without a second fetch.
    expect(queue.json().redemptions[0].reward).toMatchObject({ emoji: '🍿' })

    const own = await app.inject({
      method: 'GET',
      url: '/api/rewards/redemptions?status=pending',
      headers: { cookie: kid },
    })
    expect(own.json().redemptions).toHaveLength(1)
    expect(own.json().redemptions[0].profileId).toBe(KID_ID)
  })
})
