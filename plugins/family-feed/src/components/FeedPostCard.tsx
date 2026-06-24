import { ItemCard, ProfileAvatar, identityColor } from '@family-os/ui'
import type { FeedPost } from '../types'

function relativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

export interface FeedPostCardProps {
  post: FeedPost
  lineClamp?: number
  /** `note` — elevated card with inset identity spine (feed page).
      `widget` — inset identity spine without card chrome (dense widget slots).
      `plain` — bare layout, no spine, for surfaces that handle their own card chrome. */
  variant?: 'note' | 'widget' | 'plain'
}

export function FeedPostCard({ post, lineClamp, variant = 'note' }: FeedPostCardProps) {
  const inner = (
    <div className="flex gap-3">
      <ProfileAvatar name={post.author.name} size="base" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-card-title text-card-foreground truncate flex-1 overflow-hidden">
            {post.author.name}
          </span>
          <span className="text-sm-token text-muted-foreground shrink-0">
            {relativeTime(post.createdAt)}
          </span>
        </div>
        <p
          className="text-prose text-card-foreground mt-1"
          style={
            lineClamp
              ? {
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: lineClamp,
                  WebkitBoxOrient: 'vertical',
                }
              : undefined
          }
        >
          {post.body}
        </p>
      </div>
    </div>
  )

  if (variant === 'plain') return inner

  if (variant === 'widget') {
    return (
      <ItemCard chrome="bare" spine={identityColor(post.author.name)}>
        {inner}
      </ItemCard>
    )
  }

  return (
    <ItemCard as="article" spine={identityColor(post.author.name)}>
      {inner}
    </ItemCard>
  )
}
