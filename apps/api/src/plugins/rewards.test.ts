import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import bcrypt from 'bcryptjs'
import { buildServer } from '../server'
import { prisma } from '@family-os/platform/server'
import { rewardsPrisma } from '@family-os/plugin-rewards/db'
import { postEntry, getBalance, recomputeBalance, LedgerError } from '../lib/ledger'

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
  await rewardsPrisma.ledgerEntry.deleteMany({})
  await rewardsPrisma.balance.deleteMany({})
})

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

  it('403s when a kid asks for someone else’s wallet — F$ is not a leaderboard', async () => {
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
