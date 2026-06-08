import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@family-os/ui'
import type { FeedPost, PostsResponse } from '../types'
import { FeedPostCard } from '../components/FeedPostCard'
import { FeedEmptyState } from '../components/FeedEmptyState'

export function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetch('/api/family-feed/posts?limit=20')
      .then((r) => r.json())
      .then((data: PostsResponse) => {
        setPosts(data.posts)
        setCursor(data.nextCursor)
      })
      .finally(() => setLoading(false))
  }, [])

  function loadMore() {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    fetch(`/api/family-feed/posts?cursor=${cursor}&limit=20`)
      .then((r) => r.json())
      .then((data: PostsResponse) => {
        setPosts((prev) => [...prev, ...data.posts])
        setCursor(data.nextCursor)
      })
      .finally(() => setLoadingMore(false))
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin" style={{ color: 'var(--muted-foreground)' }} />
      </div>
    )
  }

  return (
    <div className="p-6" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 className="text-page-title" style={{ color: 'var(--foreground)', marginBottom: 28 }}>
        Family Feed
      </h1>

      {posts.length === 0 ? (
        <div style={{ paddingTop: 48 }}>
          <FeedEmptyState />
        </div>
      ) : (
        <div>
          {posts.map((post, i) => (
            <div key={post.id}>
              <FeedPostCard post={post} />
              {i < posts.length - 1 && (
                <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
              )}
            </div>
          ))}

          {cursor && (
            <div style={{ marginTop: 28 }}>
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full"
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
