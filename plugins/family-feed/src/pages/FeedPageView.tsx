import type { ReactNode } from 'react'
import { Button } from '@family-os/ui'
import type { FeedPost } from '../types'
import { FeedPostCard } from '../components/FeedPostCard'
import { FeedEmptyState } from '../components/FeedEmptyState'

const DAY_MS = 86_400_000

function dayLabel(isoString: string): string {
  const date = new Date(isoString)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const daysAgo = Math.round((startOfToday.getTime() - startOfDay.getTime()) / DAY_MS)
  if (daysAgo <= 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo < 7) return date.toLocaleDateString(undefined, { weekday: 'long' })
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
}

function groupByDay(posts: FeedPost[]): Array<{ label: string; posts: FeedPost[] }> {
  const groups: Array<{ label: string; posts: FeedPost[] }> = []
  for (const post of posts) {
    const label = dayLabel(post.createdAt)
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.posts.push(post)
    else groups.push({ label, posts: [post] })
  }
  return groups
}

export interface FeedPageViewProps {
  posts: FeedPost[]
  /** Header action — already permission-gated by the container. */
  composeButton?: ReactNode
  /** Open compose form — rendered above the feed when composing. */
  composeForm?: ReactNode
  /** Empty state action — already permission-gated by the container. */
  emptyAction?: ReactNode
  hasMore?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void
}

export function FeedPageView({
  posts,
  composeButton,
  composeForm,
  emptyAction,
  hasMore,
  loadingMore,
  onLoadMore,
}: FeedPageViewProps) {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px 48px' }}>
      <header className="flex items-end justify-between gap-4" style={{ marginBottom: 24 }}>
        <div className="min-w-0">
          <div className="text-section-label" style={{ color: 'var(--accent)', marginBottom: 6 }}>
            The family bulletin
          </div>
          <h1 className="text-page-title" style={{ color: 'var(--foreground)', margin: 0 }}>
            Family Feed
          </h1>
        </div>
        {composeButton}
      </header>

      {composeForm && <div style={{ marginBottom: 28 }}>{composeForm}</div>}

      {posts.length === 0 ? (
        <div style={{ paddingTop: 48 }}>
          <FeedEmptyState compose={emptyAction} />
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: 28 }}>
          {groupByDay(posts).map((group) => (
            <section key={group.label} aria-label={group.label}>
              <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                <span className="text-section-label" style={{ color: 'var(--accent)' }}>
                  {group.label}
                </span>
                <span
                  aria-hidden
                  className="flex-1"
                  style={{ height: 1, background: 'var(--border)' }}
                />
              </div>
              <div className="flex flex-col" style={{ gap: 12 }}>
                {group.posts.map((post) => (
                  <FeedPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ))}

          {hasMore && (
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={loadingMore}
              className="w-full"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
