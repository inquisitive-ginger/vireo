import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TonightView } from './TonightView'
import type { MealMember, PlannedMeal } from '../types'

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

const NOON = new Date(2026, 7, 13, 12, 0)
const FIVE_PM = new Date(2026, 7, 13, 17, 0)

function renderView(props: Partial<Parameters<typeof TonightView>[0]> = {}) {
  return render(
    <MemoryRouter>
      <TonightView
        meals={[meal()]}
        membersById={membersById}
        now={NOON}
        viewerId={null}
        canClaim
        canPlan
        onClaim={vi.fn()}
        size="standard"
        {...props}
      />
    </MemoryRouter>
  )
}

describe('TonightView — the four states', () => {
  it('deep-links the whole tile to /meals', () => {
    renderView()
    expect(screen.getByRole('link', { name: 'Open the meals week' })).toHaveAttribute(
      'href',
      '/meals'
    )
  })

  it('claimed: headline, sides, owner verb, try-bite chip', () => {
    renderView()
    expect(screen.getByText('Rigatoni')).toBeInTheDocument()
    expect(screen.getByText('roasted veggies')).toBeInTheDocument()
    expect(screen.getByText('Dad is cooking')).toBeInTheDocument()
    expect(screen.getByText('Try bite · the veggies')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
  })

  it('unclaimed pre-escalation: quiet line + ghost claim, no badge', () => {
    renderView({ meals: [meal({ ownerId: null })] })
    expect(screen.getByText("planned — nobody's on it yet")).toBeInTheDocument()
    expect(screen.queryByText(/Still needs a cook/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: "I've got it" })).toBeInTheDocument()
  })

  it('unclaimed post-escalation: amber badge + solid claim', () => {
    renderView({ meals: [meal({ ownerId: null })], now: FIVE_PM })
    expect(screen.getByText(/Still needs a cook/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "I've got it" })).toBeInTheDocument()
  })

  it('nothing planned: muted headline + Plan it link', () => {
    renderView({ meals: [] })
    expect(screen.getByText('Nothing planned')).toBeInTheDocument()
    expect(screen.getByText("the week's still open")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Plan it' })).toBeInTheDocument()
  })

  it('hides the claim affordance when the viewer cannot claim', () => {
    renderView({ meals: [meal({ ownerId: null })], canClaim: false })
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
  })
})

describe('TonightView — the kind lives in the verb', () => {
  it.each([
    ['takeout', 'Dad is calling it in'],
    ['leftovers', 'Dad is reheating'],
    ['out', "we're going out"],
  ] as const)('%s renders as its verb', (kind, verb) => {
    renderView({ meals: [meal({ kind })] })
    expect(screen.getByText(verb)).toBeInTheDocument()
  })
})

describe('TonightView — going out needs no planner', () => {
  it('renders an ownerless out-meal as covered — no claim, no escalation, family voice', () => {
    renderView({ meals: [meal({ kind: 'out', ownerId: null, sides: null })], now: FIVE_PM })
    expect(screen.getByText("we're going out")).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
    expect(screen.queryByText(/Still needs a cook/)).not.toBeInTheDocument()
  })

  it('renders ownerless takeout as covered — "we\'re ordering in", no escalation', () => {
    renderView({ meals: [meal({ kind: 'takeout', ownerId: null, sides: null })], now: FIVE_PM })
    expect(screen.getByText("we're ordering in")).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: "I've got it" })).not.toBeInTheDocument()
    expect(screen.queryByText(/Still needs a cook/)).not.toBeInTheDocument()
  })
})

describe('TonightView — after dinner', () => {
  const NINE_PM = new Date(2026, 7, 13, 21, 0)

  it('flips the verb past and stands the badge down', () => {
    renderView({ meals: [meal()], now: NINE_PM })
    expect(screen.getByText('Dad cooked')).toBeInTheDocument()
  })

  it('an unclaimed dinner reads as history, not an alarm', () => {
    renderView({ meals: [meal({ ownerId: null })], now: NINE_PM })
    expect(screen.queryByText(/Still needs a cook/)).not.toBeInTheDocument()
    expect(screen.getByText(/nobody claimed it/)).toBeInTheDocument()
  })
})

describe('TonightView — second person for the owner', () => {
  it("reads You're cooking when the viewer owns tonight", () => {
    renderView({ viewerId: DAD_ID })
    expect(screen.getByText("You're cooking")).toBeInTheDocument()
  })
})

describe('TonightView — large NEXT UP lookahead', () => {
  it('shows the next three days with cook, meal, and the store flag from needs', () => {
    renderView({
      size: 'large',
      meals: [
        meal(),
        meal({
          id: 'meal-2',
          date: '2026-08-14',
          title: 'Chicken curry',
          needs: 'chicken thighs, coconut milk, rice',
        }),
      ],
    })
    expect(screen.getByText('Next up')).toBeInTheDocument()
    expect(screen.getByText(/Chicken curry/)).toBeInTheDocument()
    expect(screen.getByText('3 to buy')).toBeInTheDocument()
    // Aug 15 + 16 have no plan — the gaps are visible, never a false all-clear.
    expect(screen.getAllByText('nothing planned')).toHaveLength(2)
    expect(screen.queryByText(/in the house/)).not.toBeInTheDocument()
  })

  it('renders no store flag when needs is empty — blank is not an all-clear', () => {
    renderView({
      size: 'large',
      meals: [meal(), meal({ id: 'meal-2', date: '2026-08-14', title: 'Sheet-pan chicken' })],
    })
    expect(screen.queryByText(/to buy/)).not.toBeInTheDocument()
  })
})
