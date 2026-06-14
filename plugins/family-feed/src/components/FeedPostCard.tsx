import { ProfileAvatar, identityColor } from '@family-os/ui'
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
  /** `note` — elevated card with identity spine (feed page).
      `widget` — identity spine without card chrome (dense widget slots).
      `plain` — bare layout, no spine, for surfaces that handle their own card chrome. */
  variant?: 'note' | 'widget' | 'plain'
}

export function FeedPostCard({ post, lineClamp, variant = 'note' }: FeedPostCardProps) {
  const inner = (
    <div className="flex gap-3">
      <ProfileAvatar name={post.author.name} size="base" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className="text-card-title truncate flex-1 overflow-hidden"
            style={{ color: 'var(--card-foreground)' }}
          >
            {post.author.name}
          </span>
          <span className="text-sm-token shrink-0" style={{ color: 'var(--muted-foreground)' }}>
            {relativeTime(post.createdAt)}
          </span>
        </div>
        <p
          className="text-prose mt-1"
          style={{
            color: 'var(--card-foreground)',
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

  if (variant === 'plain') return inner

  if (variant === 'widget') {
    return (
      <div style={{ position: 'relative', paddingLeft: 10 }}>
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            borderRadius: 2,
            background: identityColor(post.author.name),
          }}
        />
        {inner}
      </div>
    )
  }

  return (
    <article
      style={{
        position: 'relative',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-card)',
        padding: '16px 20px',
        // clips the identity edge so its curve follows the card corner
        overflow: 'hidden',
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: identityColor(post.author.name),
        }}
      />
      {inner}
    </article>
  )
}
