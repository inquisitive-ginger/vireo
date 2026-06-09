import { ProfileAvatar } from '@family-os/ui'
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
}

export function FeedPostCard({ post, lineClamp }: FeedPostCardProps) {
  return (
    <div className="flex gap-3">
      <ProfileAvatar name={post.author.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className="text-card-title truncate flex-1 overflow-hidden"
            style={{ color: 'var(--foreground)' }}
          >
            {post.author.name}
          </span>
          <span className="text-sm-token shrink-0" style={{ color: 'var(--muted-foreground)' }}>
            {relativeTime(post.createdAt)}
          </span>
        </div>
        <p
          className="text-body mt-1"
          style={{
            color: 'var(--foreground)',
            ...(lineClamp
              ? {
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: lineClamp,
                  WebkitBoxOrient: 'vertical',
                }
              : {}),
          }}
        >
          {post.body}
        </p>
      </div>
    </div>
  )
}
