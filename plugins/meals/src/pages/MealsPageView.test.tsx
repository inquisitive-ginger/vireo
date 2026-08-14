import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MealsPageView, type WeekDay } from './MealsPageView'
import type { MealMember, PlannedMeal } from '../types'
import { fromDateKey } from '../lib/dates'

const DAD_ID = '00000000-0000-0000-0000-000000000001'

const membersById = new Map<string, MealMember>([
  [DAD_ID, { name: 'Dad', identityHue: 'terracotta' }],
])

function meal(overrides: Partial<PlannedMeal> = {}): PlannedMeal {
  return {
    id: 'meal-1',
    date: '2026-08-13',
    slot: 'dinner',
    title: 'Rigatoni',
    sides: 'roasted veggies',
    kind: 'cooked',
    ownerId: DAD_ID,
    notes: null,
    tryBite: 'the veggies',
    needs: null,
    createdBy: DAD_ID,
    createdAt: '',
    updatedAt: '',
    ...overrides,
  }
}

const WEEK_KEYS = [
  '2026-08-09',
  '2026-08-10',
  '2026-08-11',
  '2026-08-12',
  '2026-08-13',
  '2026-08-14',
  '2026-08-15',
]

function weekOf(mealsByDate: Record<string, PlannedMeal>): WeekDay[] {
  return WEEK_KEYS.map((key) => ({ key, date: fromDateKey(key), meal: mealsByDate[key] ?? null }))
}

function renderView(props: Partial<Parameters<typeof MealsPageView>[0]> = {}) {
  return render(
    <MealsPageView
      days={weekOf({ '2026-08-13': meal() })}
      membersById={membersById}
      todayKey="2026-08-11"
      dinnerDone={false}
      weekTitle="August 9 – 15"
      needCount={2}
      canManage
      canClaim
      onPrevWeek={vi.fn()}
      onNextWeek={vi.fn()}
      onThisWeek={vi.fn()}
      onPlan={vi.fn()}
      onEdit={vi.fn()}
      onClaim={vi.fn()}
      onRemove={vi.fn()}
      {...props}
    />
  )
}

describe('MealsPageView', () => {
  it('renders the range title and the stated count', () => {
    renderView()
    expect(screen.getByRole('heading', { name: 'August 9 – 15' })).toBeInTheDocument()
    expect(screen.getByText('2 days need a cook')).toBeInTheDocument()
  })

  it('renders seven rows — planned day with title · sides and the verb, empty days as Nothing planned', () => {
    renderView()
    expect(screen.getByText('Rigatoni')).toBeInTheDocument()
    expect(screen.getByText('· roasted veggies')).toBeInTheDocument()
    expect(screen.getByText(/Dad is cooking/)).toBeInTheDocument()
    expect(screen.getAllByText('Nothing planned')).toHaveLength(4)
    expect(screen.getAllByText('No dinner was planned')).toHaveLength(2)
  })

  it('recedes past days — past tense, no claim, no planning the past', () => {
    renderView({
      days: weekOf({
        '2026-08-09': meal({ date: '2026-08-09' }),
        '2026-08-10': meal({ date: '2026-08-10', ownerId: null }),
      }),
    })
    expect(screen.getByText(/Dad cooked/)).toBeInTheDocument()
    expect(screen.getByText(/nobody claimed it/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
    // No actions at all behind today — no edit, no remove, no tap-to-edit.
    expect(screen.queryByRole('button', { name: /Edit|Remove/ })).not.toBeInTheDocument()
    // Plan it only on today + the four future empty days, never behind today.
    expect(screen.getAllByRole('button', { name: 'Plan it' })).toHaveLength(5)
  })

  it('hides the cook count for a past week; This week resets', () => {
    const onThisWeek = vi.fn()
    renderView({ needCount: null, onThisWeek })
    expect(screen.queryByText(/need(s)? a cook/)).not.toBeInTheDocument()
    screen.getByRole('button', { name: 'This week' }).click()
    expect(onThisWeek).toHaveBeenCalled()
  })

  it('offers a single ghost claim on an unclaimed day', () => {
    const onClaim = vi.fn()
    const unclaimed = meal({ ownerId: null })
    renderView({ days: weekOf({ '2026-08-13': unclaimed }), canManage: false, onClaim })
    screen.getByRole('button', { name: "I've got it" }).click()
    expect(onClaim).toHaveBeenCalledWith(unclaimed)
    expect(screen.getByText(/nobody's on it yet/)).toBeInTheDocument()
  })

  it('offers Plan it on empty days only to managers', () => {
    renderView({ canManage: false, days: weekOf({}) })
    expect(screen.queryByRole('button', { name: 'Plan it' })).not.toBeInTheDocument()
  })

  it('treats an ownerless going-out day as covered — no claim offered', () => {
    renderView({
      days: weekOf({ '2026-08-13': meal({ kind: 'out', ownerId: null }) }),
      canManage: false,
    })
    expect(screen.getByText(/we're going out/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
  })

  it('treats ownerless takeout as covered too — the family voice, no claim', () => {
    renderView({
      days: weekOf({ '2026-08-13': meal({ kind: 'takeout', ownerId: null }) }),
      canManage: false,
    })
    expect(screen.getByText(/we're ordering in/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
  })

  it("flips today's verb past once dinner is done", () => {
    renderView({
      days: weekOf({ '2026-08-11': meal({ date: '2026-08-11' }) }),
      dinnerDone: true,
      canManage: false,
    })
    expect(screen.getByText(/Dad cooked/)).toBeInTheDocument()
  })

  it('never claims for a viewer below tier 3', () => {
    renderView({
      days: weekOf({ '2026-08-13': meal({ ownerId: null }) }),
      canManage: false,
      canClaim: false,
    })
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
  })
})
