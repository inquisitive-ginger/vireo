import { describe, it, expect, vi } from 'vitest'
import { act, render, screen, fireEvent } from '@testing-library/react'
import type { ComponentProps } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { MealsPageView, type WeekDay } from './MealsPageView'
import type { MealMember, PlannedMeal } from '../types'
import { fromDateKey } from '../lib/dates'

// jsdom lays nothing out, so no sensor can carry a row onto another; the drop
// is driven through the real DndContext's own onDragEnd.
const dnd = vi.hoisted(() => ({ onDragEnd: undefined as ((e: DragEndEvent) => void) | undefined }))
vi.mock('@dnd-kit/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dnd-kit/core')>()
  return {
    ...actual,
    DndContext: (props: ComponentProps<typeof actual.DndContext>) => {
      dnd.onDragEnd = props.onDragEnd
      return <actual.DndContext {...props} />
    },
  }
})

const DAD_ID = '00000000-0000-0000-0000-000000000001'
const RECIPE = 'https://www.seriouseats.com/rigatoni-alla-vodka'

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
    recipeUrl: null,
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
      canPushNeeds
      rowNote={null}
      pushPendingMealId={null}
      onPrevWeek={vi.fn()}
      onPushNeeds={vi.fn()}
      onNextWeek={vi.fn()}
      onThisWeek={vi.fn()}
      onPlan={vi.fn()}
      onEdit={vi.fn()}
      onClaim={vi.fn()}
      onRemove={vi.fn()}
      onMove={vi.fn()}
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

  it('links the recipe from the meta line, opening in a new tab', () => {
    renderView({ days: weekOf({ '2026-08-13': meal({ recipeUrl: RECIPE }) }) })
    const link = screen.getByRole('link', { name: /Recipe for .Rigatoni./ })
    expect(link).toHaveAttribute('href', RECIPE)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders no recipe affordance when the meal has no link', () => {
    renderView()
    expect(screen.queryByRole('link', { name: /Recipe for/ })).not.toBeInTheDocument()
  })

  it('drops the recipe link on past days with the rest of the row\u2019s affordances', () => {
    renderView({
      days: weekOf({ '2026-08-09': meal({ date: '2026-08-09', recipeUrl: RECIPE }) }),
    })
    expect(screen.queryByRole('link', { name: /Recipe for/ })).not.toBeInTheDocument()
  })

  it('never claims for a viewer below tier 3', () => {
    renderView({
      days: weekOf({ '2026-08-13': meal({ ownerId: null }) }),
      canManage: false,
      canClaim: false,
    })
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
  })

  it('offers the needs push as a count, and fires it with the meal', () => {
    const onPushNeeds = vi.fn()
    const withNeeds = meal({ needs: 'chicken thighs, snap peas' })
    renderView({ days: weekOf({ '2026-08-13': withNeeds }), onPushNeeds })

    fireEvent.click(screen.getByRole('button', { name: '2 things needed' }))
    expect(onPushNeeds).toHaveBeenCalledWith(withNeeds)
  })

  it('offers nothing to push when the meal lists nothing', () => {
    renderView({ days: weekOf({ '2026-08-13': meal({ needs: '  ,  ' }) }) })
    expect(screen.queryByRole('button', { name: /needed/ })).not.toBeInTheDocument()
  })

  it('hides the push from a viewer without the shopping add key', () => {
    renderView({
      days: weekOf({ '2026-08-13': meal({ needs: 'chicken thighs' }) }),
      canPushNeeds: false,
    })
    expect(screen.queryByRole('button', { name: /needed/ })).not.toBeInTheDocument()
  })

  it('states what the push did, on the row that was pushed', () => {
    const pushed = meal({ id: 'meal-thu', needs: 'chicken thighs, snap peas' })
    const other = meal({ id: 'meal-tue', date: '2026-08-11', title: 'Tacos', needs: 'tortillas' })
    renderView({
      days: weekOf({ '2026-08-11': other, '2026-08-13': pushed }),
      rowNote: { mealId: 'meal-thu', text: '2 things sent to Grocery', failed: false },
    })

    // By text, not role: the drag context keeps its own live region on the page.
    const note = screen.getByText('2 things sent to Grocery')
    expect(note).toHaveAttribute('role', 'status')
    // The outcome belongs to the meal it changed, not to the page.
    expect(note.closest('[class*="rounded-card"]')).toHaveTextContent('Rigatoni')
    expect(note.closest('[class*="rounded-card"]')).not.toHaveTextContent('Tacos')
  })

  it('says a push failed on the row that was tapped, with the link still there to retry', () => {
    const pushed = meal({ needs: 'chicken thighs, snap peas' })
    renderView({
      days: weekOf({ '2026-08-13': pushed }),
      rowNote: { mealId: pushed.id, text: "Couldn't send that to the list", failed: true },
    })

    const note = screen.getByText("Couldn't send that to the list")
    expect(note).toHaveAttribute('role', 'status')
    expect(note).toHaveClass('text-destructive')
    expect(note.closest('[class*="rounded-card"]')).toHaveTextContent('Rigatoni')
    expect(screen.getByRole('button', { name: '2 things needed' })).toBeInTheDocument()
  })

  it('says nothing on a row whose meal was not the one pushed', () => {
    renderView({
      days: weekOf({ '2026-08-13': meal({ needs: 'chicken thighs' }) }),
      rowNote: { mealId: 'some-other-meal', text: '1 thing sent to Grocery', failed: false },
    })
    expect(screen.queryByText('1 thing sent to Grocery')).not.toBeInTheDocument()
  })

  it('goes inert while its own push is in flight — a second tap would file twice', () => {
    const onPushNeeds = vi.fn()
    const withNeeds = meal({ needs: 'chicken thighs' })
    renderView({
      days: weekOf({ '2026-08-13': withNeeds }),
      pushPendingMealId: withNeeds.id,
      onPushNeeds,
    })

    const link = screen.getByRole('button', { name: 'Sending…' })
    expect(link).toBeDisabled()
    fireEvent.click(link)
    expect(onPushNeeds).not.toHaveBeenCalled()
  })

  it('leaves every OTHER row tappable while one push is in flight', () => {
    const pushing = meal({ id: 'm-thu', needs: 'chicken thighs' })
    const other = meal({ id: 'm-tue', date: '2026-08-11', needs: 'tortillas' })
    renderView({
      days: weekOf({ '2026-08-13': pushing, '2026-08-11': other }),
      pushPendingMealId: pushing.id,
    })

    expect(screen.getByRole('button', { name: '1 thing needed' })).toBeEnabled()
  })
})

describe('MealsPageView — moving a dinner', () => {
  const chicken = meal({ id: 'm-tue', date: '2026-08-11', title: 'Chicken' })
  const tacos = meal({ id: 'm-wed', date: '2026-08-12', title: 'Tacos' })
  const old = meal({ id: 'm-mon', date: '2026-08-10', title: 'Old' })

  function drop(activeId: string, overId: string | null) {
    act(() =>
      dnd.onDragEnd?.({
        active: { id: activeId },
        over: overId ? { id: overId } : null,
      } as DragEndEvent)
    )
  }

  it('drops a dinner onto another day and hands over the target date', () => {
    const onMove = vi.fn()
    renderView({ days: weekOf({ '2026-08-11': chicken, '2026-08-12': tacos }), onMove })

    drop('m-wed', '2026-08-11')
    expect(onMove).toHaveBeenCalledWith(tacos, '2026-08-11')
  })

  it('does nothing when dropped back on its own day or outside the week', () => {
    const onMove = vi.fn()
    renderView({ days: weekOf({ '2026-08-12': tacos }), onMove })

    drop('m-wed', '2026-08-12')
    drop('m-wed', null)
    expect(onMove).not.toHaveBeenCalled()
  })

  it('offers a handle on planned upcoming days only — never on the past', () => {
    renderView({ days: weekOf({ '2026-08-10': old, '2026-08-12': tacos }) })

    expect(screen.getByRole('button', { name: 'Move “Tacos” to another day' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Move “Old”/ })).not.toBeInTheDocument()
  })

  it('offers no handle to a viewer who cannot plan', () => {
    renderView({ days: weekOf({ '2026-08-12': tacos }), canManage: false })
    expect(screen.queryByRole('button', { name: /Move “Tacos”/ })).not.toBeInTheDocument()
  })
})
