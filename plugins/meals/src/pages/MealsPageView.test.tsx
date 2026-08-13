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
    coinReward: null,
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
      weekTitle="This week"
      weekLabel="Aug 9–15"
      needCount={2}
      canManage
      canClaim
      onPrevWeek={vi.fn()}
      onNextWeek={vi.fn()}
      onPlan={vi.fn()}
      onEdit={vi.fn()}
      onClaim={vi.fn()}
      onRemove={vi.fn()}
      {...props}
    />
  )
}

describe('MealsPageView', () => {
  it('renders the header with the range and the stated count', () => {
    renderView()
    expect(screen.getByRole('heading', { name: 'This week' })).toBeInTheDocument()
    expect(screen.getByText(/Aug 9–15/)).toBeInTheDocument()
    expect(screen.getByText('2 days need a cook')).toBeInTheDocument()
  })

  it('renders seven rows — planned day with title · sides and the verb, empty days as Nothing planned', () => {
    renderView()
    expect(screen.getByText('Rigatoni')).toBeInTheDocument()
    expect(screen.getByText('· roasted veggies')).toBeInTheDocument()
    expect(screen.getByText(/Dad is cooking/)).toBeInTheDocument()
    expect(screen.getAllByText('Nothing planned')).toHaveLength(6)
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

  it('never claims for a viewer below tier 3', () => {
    renderView({
      days: weekOf({ '2026-08-13': meal({ ownerId: null }) }),
      canManage: false,
      canClaim: false,
    })
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
  })
})
