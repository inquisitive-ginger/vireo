import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import type { ComponentProps } from 'react'
import type { WeekRun } from '../lib/runs'
import { RidesWeek, type RidesMember } from './RidesWeek'

const HALLIE: RidesMember = { id: 'h', name: 'Hallie', tier: 4 }
const ZACH: RidesMember = { id: 'z', name: 'Zach', tier: 4 }
const TEDDY: RidesMember = { id: 't', name: 'Teddy', tier: 2 }
const ZOE: RidesMember = { id: 'o', name: 'Zoë', tier: 3 }

const base = { startsOn: '2026-11-17', endsOn: null }
const RUNS: WeekRun[] = [
  {
    ...base,
    id: 'r1',
    kidId: 't',
    weekday: 2,
    kind: 'dropoff',
    place: null,
    minutes: 495,
    driverId: 'h',
  },
  {
    ...base,
    id: 'r2',
    kidId: 't',
    weekday: 2,
    kind: 'pickup',
    place: null,
    minutes: 990,
    driverId: 'h',
  },
  {
    ...base,
    id: 'r3',
    kidId: 'o',
    weekday: 2,
    kind: 'pickup',
    place: 'yarn club',
    minutes: 1050,
    driverId: 'z',
  },
]

function renderWeek(props: Partial<ComponentProps<typeof RidesWeek>> = {}) {
  const handlers = { onDriver: vi.fn(), onAdd: vi.fn(), onRemove: vi.fn() }
  render(
    <RidesWeek
      runs={RUNS}
      kids={[TEDDY, ZOE]}
      drivers={[HALLIE, ZACH]}
      canEdit
      {...handlers}
      {...props}
    />
  )
  return handlers
}

describe('the seeded week, one kid at a time (D-092, D-097)', () => {
  it('D-092 shows a tab per kid and each school day lists only that kid’s runs [F-041]', () => {
    renderWeek()
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['Teddy', 'Zoë'])
    const tuesday = screen.getByRole('region', { name: 'Tuesday' })
    expect(within(tuesday).getByText('Drop-off')).toBeInTheDocument()
    expect(within(tuesday).getByText('Pickup')).toBeInTheDocument()
    expect(within(tuesday).queryByText('Pickup at yarn club')).toBeNull()
    expect(screen.getAllByRole('region')).toHaveLength(5)

    fireEvent.click(screen.getByRole('tab', { name: 'Zoë' }))
    expect(
      within(screen.getByRole('region', { name: 'Tuesday' })).getByText('Pickup at yarn club')
    ).toBeInTheDocument()
  })

  it('D-098 tapping a driver changes who drives that run, and there is no Open choice [F-041]', () => {
    const { onDriver } = renderWeek()
    const group = screen.getByRole('radiogroup', { name: 'Who drives Tuesday pickup' })
    fireEvent.click(within(group).getByRole('radio', { name: 'Zach' }))
    expect(onDriver).toHaveBeenCalledWith(RUNS[1], 'z')
    expect(within(group).queryByRole('radio', { name: 'Open' })).toBeNull()
  })

  it('D-098 a run is added to a day with its kind, place, driver and time [F-041]', () => {
    const { onAdd } = renderWeek()
    fireEvent.click(screen.getByRole('button', { name: 'Add a run on Wednesday' }))
    const form = screen.getByRole('form', { name: 'New run on Wednesday' })
    fireEvent.click(within(form).getByRole('radio', { name: 'Pickup' }))
    fireEvent.change(within(form).getByLabelText('Where'), { target: { value: 'gymnastics' } })
    fireEvent.click(within(form).getByRole('radio', { name: 'Zach' }))
    fireEvent.change(within(form).getByLabelText('Time'), { target: { value: '15:05' } })
    fireEvent.click(within(form).getByRole('button', { name: 'Add' }))
    expect(onAdd).toHaveBeenCalledWith('t', {
      weekday: 3,
      kind: 'pickup',
      place: 'gymnastics',
      minutes: 905,
      driverId: 'z',
    })
  })

  it('D-097 a run is removed from the week [F-041]', () => {
    const { onRemove } = renderWeek()
    fireEvent.click(screen.getByRole('button', { name: 'Remove Tuesday drop-off' }))
    expect(onRemove).toHaveBeenCalledWith(RUNS[0])
  })

  it('D-086 below tier 4 the week reads, with no controls [F-041]', () => {
    renderWeek({ canEdit: false })
    expect(
      within(screen.getByRole('region', { name: 'Tuesday' })).getAllByText('Hallie')
    ).toHaveLength(2)
    expect(screen.queryByRole('radiogroup')).toBeNull()
    expect(screen.queryByRole('button', { name: /Add a run|Remove/ })).toBeNull()
  })
})
