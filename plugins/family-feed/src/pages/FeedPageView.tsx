import type { ReactNode } from 'react'
import { Button, PageContainer, PageHeader, SectionLabel, relativeDayLabel } from '@family-os/ui'
import type { FeedPost } from '../types'
import { FeedPostCard } from '../components/FeedPostCard'
import { FeedEmptyState } from '../components/FeedEmptyState'

/* Feed groups look backward: near-past days earn a weekday name, older posts a full
   "Month D". */
function dayLabel(isoString: string): string {
  return relativeDayLabel(new Date(isoString), new Date(), {
    direction: 'backward',
    month: 'long',
  }).lead
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
    <PageContainer width="prose">
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
              <SectionLabel
                leading
                className="flex items-center gap-3 text-accent after:h-px after:flex-1 after:bg-border"
              >
                {group.label}
              </SectionLabel>
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
    </PageContainer>
  )
}
