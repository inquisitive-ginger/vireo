import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { FeedPageView } from './FeedPageView'
import { post, daysAgo } from '../test-posts'

describe('FeedPageView', () => {
  it('F-011 groups posts under one label per day, newest first', () => {
    render(
      <FeedPageView
        posts={[
          post({ id: 'a', body: 'Soccer moved to 5', createdAt: daysAgo(0) }),
          post({ id: 'b', body: 'Library books due', createdAt: daysAgo(0) }),
          post({ id: 'c', body: 'Grandma visits Sunday', createdAt: daysAgo(1) }),
        ]}
      />
    )

    const groups = screen.getAllByRole('region')
    expect(groups.map((g) => g.getAttribute('aria-label'))).toEqual(['Today', 'Yesterday'])
    expect(within(groups[0]).getByText('Soccer moved to 5')).toBeInTheDocument()
    expect(within(groups[0]).getByText('Library books due')).toBeInTheDocument()
    expect(within(groups[1]).getByText('Grandma visits Sunday')).toBeInTheDocument()
  })

  it('F-011 an empty feed lets the empty state own the compose action', () => {
    render(
      <FeedPageView
        posts={[]}
        composeButton={<button>Add post</button>}
        emptyAction={<button>Write first post</button>}
      />
    )

    expect(screen.getByText('Nothing on the board yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Write first post' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add post' })).not.toBeInTheDocument()
  })

  it('F-011 offers Load more only while older posts remain', () => {
    const onLoadMore = vi.fn()
    const { rerender } = render(<FeedPageView posts={[post()]} hasMore onLoadMore={onLoadMore} />)

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }))
    expect(onLoadMore).toHaveBeenCalledOnce()

    rerender(<FeedPageView posts={[post()]} hasMore={false} />)
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
  })
})
