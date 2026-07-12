export interface PostAuthor {
  id: string
  name: string
  avatarUrl: string | null
  /** The author's assigned identity hue (ADR 044) — the post card's spine. Null falls
      back to the name hash via `resolveHue`. */
  identityHue: string | null
}

export interface FeedPost {
  id: string
  body: string
  createdAt: string
  author: PostAuthor
}

export interface PostsResponse {
  posts: FeedPost[]
  nextCursor: string | null
}
