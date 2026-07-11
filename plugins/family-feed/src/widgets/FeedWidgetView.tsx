import type { ReactNode } from 'react'
import { MessagesSquare } from 'lucide-react'
import { WidgetHeader as UiWidgetHeader, WIDGET_CQ, WIDGET_INSET, cn } from '@family-os/ui'
import type { FeedPost } from '../types'
import { FeedPostCard } from '../components/FeedPostCard'
import { FeedEmptyState } from '../components/FeedEmptyState'

// CSS container queries pick the layout by the slot's height:
//   short → single latest post; tall → dense multi-post list. Body drops to
//   text-prose-sm in the multi list so a tall column doesn't crowd.
const WIDGET_STYLES = `
  .ffeed-single { display: flex;  height: 100%; flex-direction: column; }
  .ffeed-multi  { display: none;  height: 100%; flex-direction: column; }
  @container (min-height: ${WIDGET_CQ.tallMinHeight}) {
    .ffeed-single { display: none; }
    .ffeed-multi  { display: flex; }
  }
`

/* MessagesSquare + "Family Feed" widget identity — the shared `WidgetHeader`
   primitive supplied with this module's glyph + label. */
function WidgetHeader() {
  return <UiWidgetHeader icon={MessagesSquare} label="Family Feed" />
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

      {/* Short — latest post, centered */}
      <div className={cn('ffeed-single', WIDGET_INSET.standard)}>
        <WidgetHeader />
        {!latest ? (
          empty
        ) : (
          <div className="flex flex-1 flex-col justify-center">
            <FeedPostCard post={latest} lineClamp={2} variant="widget" />
          </div>
        )}
      </div>

      {/* Tall — up to 3 posts, denser body */}
      <div className={cn('ffeed-multi', WIDGET_INSET.large)}>
        <WidgetHeader />
        {posts.length === 0 ? (
          empty
        ) : (
          <div className="mt-7 min-h-0 overflow-hidden">
            {posts.slice(0, 3).map((post, i, arr) => (
              <div key={post.id}>
                <FeedPostCard post={post} lineClamp={2} variant="widget" dense />
                {i < arr.length - 1 && <div className="my-6 h-px bg-border" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
