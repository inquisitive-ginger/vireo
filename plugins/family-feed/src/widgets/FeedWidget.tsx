import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@family-os/ui'
import { PermissionGate } from '@family-os/platform'
import type { PostsResponse } from '../types'
import type { FeedPost } from '../types'
import { FeedPostCard } from '../components/FeedPostCard'
import { FeedEmptyState } from '../components/FeedEmptyState'

// CSS container queries gate single-post vs multi-post layout by height.
// standard (2×1) and banner (4×1) are 180px tall → single post.
// large (2×2) is 376px tall → multi post with Frame A dividers.
const WIDGET_STYLES = `
  .ffeed-single { display: flex; height: 100%; flex-direction: column; align-items: stretch; }
  .ffeed-multi   { display: none;  height: 100%; flex-direction: column; }
  @container (min-height: 300px) {
    .ffeed-single { display: none; }
    .ffeed-multi  { display: flex; }
  }
`

export default function FeedWidget() {
  const [posts, setPosts] = useState<FeedPost[]>([])

  useEffect(() => {
    fetch('/api/family-feed/posts?limit=5')
      .then((r) => r.json())
      .then((data: PostsResponse) => setPosts(data.posts))
      .catch(() => {})
  }, [])

  const latest = posts[0]

  return (
    <div
      style={
        {
          height: '100%',
          background: 'var(--background)',
          containerType: 'size',
        } as React.CSSProperties
      }
    >
      <style href="family-feed-widget" precedence="default">
        {WIDGET_STYLES}
      </style>

      {/* Standard / banner — single post, centered */}
      <div className="ffeed-single" style={{ justifyContent: 'center', padding: '16px 18px' }}>
        {!latest ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FeedEmptyState
              compose={
                <PermissionGate action="create" subject="family-feed.Post">
                  <Link to="/family-feed">
                    <Button size="sm" variant="outline">
                      New Post
                    </Button>
                  </Link>
                </PermissionGate>
              }
            />
          </div>
        ) : (
          <Link
            to="/family-feed"
            style={{
              textDecoration: 'none',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <FeedPostCard post={latest} lineClamp={3} />
          </Link>
        )}
      </div>

      {/* Large (2×2) — up to 3 posts with Frame A dividers */}
      <div className="ffeed-multi" style={{ justifyContent: 'space-evenly', padding: '12px 18px' }}>
        {posts.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FeedEmptyState
              compose={
                <PermissionGate action="create" subject="family-feed.Post">
                  <Link to="/family-feed">
                    <Button size="sm" variant="outline">
                      New Post
                    </Button>
                  </Link>
                </PermissionGate>
              }
            />
          </div>
        ) : (
          <Link
            to="/family-feed"
            style={{
              textDecoration: 'none',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}
          >
            {posts.slice(0, 3).map((post, i, arr) => (
              <div key={post.id}>
                <FeedPostCard post={post} lineClamp={2} />
                {i < arr.length - 1 && (
                  <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
                )}
              </div>
            ))}
          </Link>
        )}
      </div>
    </div>
  )
}
