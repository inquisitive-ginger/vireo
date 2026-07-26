import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RewardDrawer } from './RewardDrawer'
import type { Reward } from '../types'

const reward: Reward = {
  id: 'r1',
  name: 'Movie night',
  emoji: '🍿',
  description: 'Friday night is yours — you pick the movie.',
  cost: 15,
  requiresApproval: true,
  audience: null,
  stock: null,
  active: true,
}

function renderDrawer(over: Partial<Parameters<typeof RewardDrawer>[0]> = {}) {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  render(
    <RewardDrawer
      open
      onClose={() => {}}
      editing={null}
      members={[]}
      onSubmit={onSubmit}
      submitting={false}
      {...over}
    />
  )
  return onSubmit
}

describe('RewardDrawer', () => {
  /* M4/5d — the column has existed since M4/1 and nothing captured it, so no
     reward could ever have a description, end to end. */
  it('captures "What they get" and submits it as the description', () => {
    const onSubmit = renderDrawer()

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Movie night' } })
    fireEvent.change(screen.getByLabelText('What they get'), {
      target: { value: '  Friday night is yours — you pick the movie.  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add reward' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Movie night',
        description: 'Friday night is yours — you pick the movie.',
      })
    )
  })

  it('submits null when the line is left empty — the field is optional', () => {
    const onSubmit = renderDrawer()

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Late bedtime' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add reward' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ description: null }))
  })

  it('seeds the field when editing a reward that has words', () => {
    renderDrawer({ editing: reward })
    expect(screen.getByLabelText('What they get')).toHaveValue(
      'Friday night is yours — you pick the movie.'
    )
  })

  /* ADR 055: approval gates USE, not purchase — the hint must say so. */
  it('explains the approval toggle in tear grammar, not register grammar', () => {
    renderDrawer()
    expect(
      screen.getByText("They'll ask before using it — buying is always allowed")
    ).toBeInTheDocument()
    expect(screen.queryByText(/Holds the reward in your queue/)).not.toBeInTheDocument()
  })
})
