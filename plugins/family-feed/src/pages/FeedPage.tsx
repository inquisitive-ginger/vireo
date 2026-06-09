import { useState, useEffect, useRef } from 'react'
import { z } from 'zod'
import { Loader2, PenLine } from 'lucide-react'
import { Button, ComposeForm } from '@family-os/ui'
import { PermissionGate, useAuth } from '@family-os/platform'
import type { FeedPost, PostsResponse } from '../types'
import { FeedPostCard } from '../components/FeedPostCard'
import { FeedEmptyState } from '../components/FeedEmptyState'

const postSchema = z.object({ body: z.string().min(1) })

export function FeedPage() {
  const { name: authorName } = useAuth()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [composing, setComposing] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

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

  async function handlePost(body: string) {
    const result = postSchema.safeParse({ body })
    if (!result.success) return

    const res = await fetch('/api/family-feed/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    if (!res.ok) return

    const newPost: FeedPost = await res.json()
    setPosts((prev) => [newPost, ...prev])
    setComposing(false)
    feedRef.current?.focus()
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin" style={{ color: 'var(--muted-foreground)' }} />
      </div>
    )
  }

  const composeButton = (
    <PermissionGate action="create" subject="family-feed.Post">
      <Button
        size="sm"
        onClick={() => setComposing(true)}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <PenLine size={14} />
        New Post
      </Button>
    </PermissionGate>
  )

  return (
    <div
      ref={feedRef}
      tabIndex={-1}
      style={{ outline: 'none', maxWidth: 640, margin: '0 auto', padding: '24px' }}
    >
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: composing ? 20 : 28 }}
      >
        <h1 className="text-page-title" style={{ color: 'var(--foreground)', margin: 0 }}>
          Family Feed
        </h1>
        {!composing && composeButton}
      </div>

      {composing && (
        <div style={{ marginBottom: 28 }}>
          <ComposeForm
            authorName={authorName}
            onSubmit={handlePost}
            onCancel={() => setComposing(false)}
          />
        </div>
      )}

      {posts.length === 0 ? (
        <div style={{ paddingTop: 48 }}>
          <FeedEmptyState
            compose={
              !composing ? (
                <PermissionGate action="create" subject="family-feed.Post">
                  <Button size="sm" onClick={() => setComposing(true)}>
                    Write first post
                  </Button>
                </PermissionGate>
              ) : null
            }
          />
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
