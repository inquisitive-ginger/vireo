import type { FeedPost } from './types'

// Storybook fixture data — a believable few days of family posts.
const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

function post(
  id: string,
  name: string,
  body: string,
  agoMs: number,
  identityHue: string | null = null
): FeedPost {
  return {
    id,
    body,
    createdAt: new Date(Date.now() - agoMs).toISOString(),
    author: { id: `author-${name.toLowerCase()}`, name, avatarUrl: null, identityHue },
  }
}

export const SAMPLE_POSTS: FeedPost[] = [
  post(
    '1',
    'Emma',
    'Finished my science fair project!! The bioluminescent fungi diorama LIGHTS UP. Come see it before Friday 🍄',
    38 * MIN
  ),
  post(
    '2',
    'Sarah',
    'Reminder: Grandma lands at 4:30 tomorrow. Whoever wants to come to the airport, be ready by 3:45.',
    3 * HOUR
  ),
  post('3', 'Jake', 'caught a fish today. released it. his name was gerald', 7 * HOUR),
  post(
    '4',
    'Marcus',
    "Pizza night moved to Saturday — Thursday is Emma's rehearsal. Vote for toppings in person, the kitchen whiteboard is the ballot box.",
    DAY + 2 * HOUR
  ),
  post(
    '5',
    'Sarah',
    'We had the most incredible day at the ridge trail. Wild strawberries along the path, three chapters read under a pine tree, and wildflowers now on the kitchen table. Days like this are why we do this.',
    DAY + 6 * HOUR
  ),
  post(
    '6',
    'Emma',
    'Does anyone know where my blue cleats went. Asking for me. I am the interested party.',
    3 * DAY + 4 * HOUR
  ),
  post(
    '7',
    'Marcus',
    'New house rule, effective immediately: whoever finishes the milk writes it on the list. This message brought to you by dry cereal.',
    3 * DAY + 9 * HOUR
  ),
  post('8', 'Jake', 'i love this family', 12 * DAY),
]
