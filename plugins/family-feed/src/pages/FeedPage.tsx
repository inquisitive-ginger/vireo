import { useState, useEffect, useRef } from 'react'
import { z } from 'zod'
import { Loader2, PenLine } from 'lucide-react'
import { Button, ComposeForm } from '@family-os/ui'
import { PermissionGate, useAuth } from '@family-os/platform'
import type { FeedPost, PostsResponse } from '../types'
import { FeedPageView } from './FeedPageView'

const postSchema = z.object({ body: z.string().min(1) })

export function FeedPage() {
  const { name: authorName } = useAuth()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [composing, setComposing] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  function loadInitial() {
    setLoading(true)
    setError(false)
    fetch('/api/family-feed/posts?limit=20')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((data: PostsResponse) => {
        setPosts(data.posts)
        setCursor(data.nextCursor)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadInitial()
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

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>Could not load posts.</p>
        <Button variant="outline" size="sm" onClick={loadInitial}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div ref={feedRef} tabIndex={-1} style={{ outline: 'none' }}>
      <FeedPageView
        posts={posts}
        composeButton={
          !composing ? (
            <PermissionGate action="create" subject="family-feed.Post">
              <Button onClick={() => setComposing(true)}>
                <PenLine size={16} />
                New Post
              </Button>
            </PermissionGate>
          ) : null
        }
        composeForm={
          composing ? (
            <ComposeForm
              authorName={authorName}
              onSubmit={handlePost}
              onCancel={() => setComposing(false)}
            />
          ) : null
        }
        emptyAction={
          !composing ? (
            <PermissionGate action="create" subject="family-feed.Post">
              <Button size="sm" onClick={() => setComposing(true)}>
                Write first post
              </Button>
            </PermissionGate>
          ) : null
        }
        hasMore={Boolean(cursor)}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
      />
    </div>
  )
}
