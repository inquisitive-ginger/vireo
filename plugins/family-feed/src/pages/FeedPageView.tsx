import type { ReactNode } from 'react'
import { Button, PageHeader } from '@family-os/ui'
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
    <div className="mx-auto max-w-[680px] px-6 pt-7 pb-12">
      {/* When the feed is empty the empty-state owns the primary CTA, so the header
          action is suppressed (avoids a duplicate compose action — mirrors chores). */}
      <PageHeader
        title="Family Feed"
        eyebrow="The family bulletin"
        action={posts.length > 0 ? composeButton : undefined}
      />

      {composeForm && <div className="mb-7">{composeForm}</div>}

      {posts.length === 0 ? (
        <div className="pt-12">
          <FeedEmptyState compose={emptyAction} />
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          {groupByDay(posts).map((group) => (
            <section key={group.label} aria-label={group.label}>
              <div className="mb-3 flex items-center gap-3">
                <span className="text-section-label text-accent">{group.label}</span>
                <span aria-hidden className="h-px flex-1 bg-border" />
              </div>
              <div className="flex flex-col gap-3">
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
