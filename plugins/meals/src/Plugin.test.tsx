import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Plugin } from './Plugin'

vi.mock('./pages/MealsPage', () => ({ MealsPage: () => <div>meals page</div> }))
vi.mock('./pages/GroceriesIndexPage', () => ({
  GroceriesIndexPage: () => <div>groceries index</div>,
}))
vi.mock('./pages/GroceryListPage', () => ({
  GroceryListPage: ({ listId }: { listId: string }) => <div>grocery list {listId}</div>,
}))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Plugin />
    </MemoryRouter>
  )
}

// The manifest declares `/groceries/*` (a wildcard, not the exact-path
// registration main.tsx:125 gives every other route) precisely so this
// drill-in URL is real — the id lives in the location, not component state.
describe('Plugin routing', () => {
  it('renders the meals page at /meals', () => {
    renderAt('/meals')
    expect(screen.getByText('meals page')).toBeInTheDocument()
  })

  it('renders the groceries index at /groceries', () => {
    renderAt('/groceries')
    expect(screen.getByText('groceries index')).toBeInTheDocument()
  })

  it('renders the per-list drill-in at /groceries/:id, reading the id off the URL', () => {
    renderAt('/groceries/list-abc')
    expect(screen.getByText('grocery list list-abc')).toBeInTheDocument()
  })
})
