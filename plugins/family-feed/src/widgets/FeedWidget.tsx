import { Link } from 'react-router-dom'
import { Button } from '@family-os/ui'
import { PermissionGate, useQuery } from '@family-os/platform'
import type { PostsResponse, FeedPost } from '../types'
import { FeedWidgetView } from './FeedWidgetView'

export default function FeedWidget() {
  const { data } = useQuery<FeedPost[]>({
    // Shares the ['family-feed/posts'] prefix with the page so a post created
    // anywhere invalidates both (prefix match) and the widget refetches on its
    // next mount. A disjoint key would leave the widget stale until staleTime.
    queryKey: ['family-feed/posts', 'widget'],
    queryFn: () =>
      fetch('/api/family-feed/posts?limit=5')
        .then((r) => r.json())
        .then((d: PostsResponse) => d.posts),
    staleTime: 60_000,
    retry: 3,
  })

  const posts: FeedPost[] = data ?? []

  if (posts.length === 0) {
    return (
      <FeedWidgetView
        posts={posts}
        emptyAction={
          <PermissionGate action="create" subject="family-feed.Post">
            <Link to="/family-feed">
              <Button size="sm" variant="outline">
                New Post
              </Button>
            </Link>
          </PermissionGate>
        }
      />
    )
  }

  return (
    <Link to="/family-feed" className="block h-full no-underline">
      <FeedWidgetView posts={posts} />
    </Link>
  )
}
