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
      <MessagesSquare size={13} className="text-muted-foreground" aria-hidden />
      <span className="text-section-label">Family Feed</span>
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
    <div className="flex flex-1 items-center justify-center">
      <FeedEmptyState compose={emptyAction} compact />
    </div>
  )

  return (
    // containerType: size stays inline — Tailwind's @container utility only sets
    // inline-size, but these widgets gate layout on height.
    <div className="h-full" style={{ containerType: 'size' }}>
      <style href="family-feed-widget" precedence="default">
        {WIDGET_STYLES}
      </style>

      {/* Standard / banner — latest post, centered */}
      <div className="ffeed-single" style={{ padding: '14px 18px 16px' }}>
        <WidgetHeader />
        {!latest ? (
          empty
        ) : (
          <div className="flex flex-1 flex-col justify-center">
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
          <div className="mt-7 min-h-0 overflow-hidden">
            {posts.slice(0, 3).map((post, i, arr) => (
              <div key={post.id}>
                <FeedPostCard post={post} lineClamp={2} variant="widget" />
                {i < arr.length - 1 && <div className="my-[22px] h-px bg-border" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
