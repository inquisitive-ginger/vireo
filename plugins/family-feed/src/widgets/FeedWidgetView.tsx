import type { ReactNode } from 'react'
import { MessagesSquare } from 'lucide-react'
import {
  WidgetHeader as UiWidgetHeader,
  WIDGET_CQ,
  WIDGET_INSET,
  cn,
  useFitRows,
} from '@family-os/ui'
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

/* Reserve for the "+N more" line when the list is clamped. */
const MORE_RESERVE = 24

/* The tall slot's height comes from the viewport, not the author, so a fixed
   post count crops mid-post at whatever height the grid happens to deal
   (auto-bug #116 — the h=1 slot crossed the tall threshold at ~305px and this
   variant sliced three posts into it). Whole posts only, remainder stated —
   `useFitRows` owns the measure/clamp, same as chores and the calendar. */
function FitPostList({ posts }: { posts: FeedPost[] }) {
  const { boxRef, listRef, shown, hiddenCount, measuring } = useFitRows(posts, MORE_RESERVE)
  return (
    <div ref={boxRef} className="mt-7 min-h-0 flex-1 overflow-hidden">
      <div ref={listRef} className="flex flex-col">
        {shown.map((post, i) => (
          <div key={post.id} className={cn(i > 0 && 'mt-6 border-t border-border pt-6')}>
            <FeedPostCard post={post} lineClamp={2} variant="widget" dense />
          </div>
        ))}
        {!measuring && hiddenCount > 0 && (
          <div className="text-sm-token mt-3 text-muted-foreground">+{hiddenCount} more</div>
        )}
      </div>
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

      {/* Tall — as many whole posts as fit, denser body */}
      <div className={cn('ffeed-multi', WIDGET_INSET.large)}>
        <WidgetHeader />
        {posts.length === 0 ? empty : <FitPostList posts={posts} />}
      </div>
    </div>
  )
}
