import { useState, useRef } from 'react'
import { z } from 'zod'
import { Loader2, PenLine } from 'lucide-react'
import { Button, ComposeForm } from '@family-os/ui'
import {
  PermissionGate,
  useAuth,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@family-os/platform'
import type { FeedPost, PostsResponse } from '../types'
import { FeedPageView } from './FeedPageView'

const postSchema = z.object({ body: z.string().min(1) })
const FEED_KEY = ['family-feed/posts']

export function FeedPage() {
  const { name: authorName, identityHue } = useAuth()
  const queryClient = useQueryClient()
  const [composing, setComposing] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  // Cursor-paginated feed as an infinite query (ADR 013).
  const feed = useInfiniteQuery({
    queryKey: FEED_KEY,
    queryFn: ({ pageParam }) =>
      fetch(`/api/family-feed/posts?limit=20${pageParam ? `&cursor=${pageParam}` : ''}`).then(
        (r) => {
          if (!r.ok) throw new Error(String(r.status))
          return r.json() as Promise<PostsResponse>
        }
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  const createPost = useMutation({
    mutationFn: (body: string) =>
      fetch('/api/family-feed/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<FeedPost>
      }),
    onSuccess: () => {
      // Refetch from the top — the new post is newest-first.
      queryClient.invalidateQueries({ queryKey: FEED_KEY })
      setComposing(false)
      feedRef.current?.focus()
    },
  })

  async function handlePost(body: string) {
    const result = postSchema.safeParse({ body })
    if (!result.success) return
    // Swallow the rejection: onSuccess handles the happy path; the form stays open on failure.
    await createPost.mutateAsync(body).catch(() => {})
  }

  if (feed.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (feed.isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground" style={{ fontSize: 14 }}>
          Could not load posts.
        </p>
        <Button variant="outline" size="sm" onClick={() => feed.refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const posts: FeedPost[] = feed.data?.pages.flatMap((p) => p.posts) ?? []

  return (
    <div ref={feedRef} tabIndex={-1} className="outline-none">
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
              authorHue={identityHue}
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
        hasMore={feed.hasNextPage}
        loadingMore={feed.isFetchingNextPage}
        onLoadMore={() => feed.fetchNextPage()}
      />
    </div>
  )
}
