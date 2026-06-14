import type { ReactNode } from 'react'
import { MessagesSquare } from 'lucide-react'
import type { FeedPost } from '../types'
import { FeedPostCard } from '../components/FeedPostCard'
import { FeedEmptyState } from '../components/FeedEmptyState'

// CSS container queries gate single-post vs multi-post layout by height.
// standard (2×1) and banner (4×1) are 180px tall → single post.
// large (2×2) is 376px tall → multi post with dividers.
const WIDGET_STYLES = `
  .ffeed-single { display: flex; height: 100%; flex-direction: column; }
  .ffeed-multi  { display: none;  height: 100%; flex-direction: column; }
  @container (min-height: 300px) {
    .ffeed-single { display: none; }
    .ffeed-multi  { display: flex; }
  }
`

function WidgetHeader() {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <MessagesSquare size={13} style={{ color: 'var(--accent)' }} aria-hidden />
      <span className="text-section-label" style={{ color: 'var(--accent)' }}>
        Family Feed
      </span>
    </div>
  )
}

export interface FeedWidgetViewProps {
  posts: FeedPost[]
  /** Empty state action — already permission-gated by the container. */
  emptyAction?: ReactNode
}

export function FeedWidgetView({ posts, emptyAction }: FeedWidgetViewProps) {
  const latest = posts[0]

  const empty = (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FeedEmptyState compose={emptyAction} compact />
    </div>
  )

  return (
    <div style={{ height: '100%', containerType: 'size' } as React.CSSProperties}>
      <style href="family-feed-widget" precedence="default">
        {WIDGET_STYLES}
      </style>

      {/* Standard / banner — latest post, centered */}
      <div className="ffeed-single" style={{ padding: '14px 18px 16px' }}>
        <WidgetHeader />
        {!latest ? (
          empty
        ) : (
          <div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <FeedPostCard post={latest} lineClamp={2} variant="widget" />
          </div>
        )}
      </div>

      {/* Large (2×2) — up to 3 posts with dividers */}
      <div className="ffeed-multi" style={{ padding: '14px 18px 16px' }}>
        <WidgetHeader />
        {posts.length === 0 ? (
          empty
        ) : (
          <div style={{ marginTop: 14, minHeight: 0, overflow: 'hidden' }}>
            {posts.slice(0, 3).map((post, i, arr) => (
              <div key={post.id}>
                <FeedPostCard post={post} lineClamp={2} variant="widget" />
                {i < arr.length - 1 && (
                  <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
