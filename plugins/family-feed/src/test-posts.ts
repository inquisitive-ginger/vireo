import type { FeedPost } from './types'

export function post(
  over: Partial<Omit<FeedPost, 'author'>> & { author?: Partial<FeedPost['author']> } = {}
): FeedPost {
  const { author, ...rest } = over
  return {
    id: 'p1',
    body: 'Pizza night is moved to Friday',
    createdAt: new Date().toISOString(),
    ...rest,
    author: { id: 'm-maya', name: 'Maya', avatarUrl: null, identityHue: null, ...author },
  }
}

export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()
