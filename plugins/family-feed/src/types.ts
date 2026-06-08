export interface PostAuthor {
  id: string
  name: string
  avatarUrl: string | null
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
