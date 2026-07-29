import type { EmojiGroup } from '@family-os/ui'

/* The reward emoji set — grounded in the rewards a family ACTUALLY gives, one emoji per
   real reward (not a generic emoji keyboard). Each entry below has a reward behind it, so
   the shelves read like a menu. Rendered locally by the scoped EmojiPicker — no network.
   Add a real reward's emoji to a shelf to widen it; don't pad it with look-alikes. */
export const REWARD_EMOJI_GROUPS: EmojiGroup[] = [
  {
    // 🎮 extra screen time · 📺 pick the show · 🍿 movie night · 🎧 aux (pick the music)
    label: 'Screen & media',
    emojis: ['🎮', '📺', '🍿', '🎧'],
  },
  {
    // 🍦 ice cream run · 🍗 pick Friday's dinner · 🍪 bake / dessert of choice ·
    // 🎁 a toy (small/medium/big — the price tier says the size)
    label: 'Treats',
    emojis: ['🍦', '🍗', '🍪', '🎁'],
  },
  {
    // 🌙 stay up late · 😴 sleep in · 🎟️ skip-a-chore pass · 🎲 pick the family game ·
    // 💺 front seat in the car · 🔄 assign one chore to a parent (swap it back)
    label: 'Time & freedom',
    emojis: ['🌙', '😴', '🎟️', '🎲', '💺', '🔄'],
  },
  {
    // 🎡 day out / adventure · 🛹 skate park trip · 🧸 trip to the shop ·
    // ❤️ one-on-one time · 👫 friend over · 🤸 rough-and-tumble play with a parent
    // (bed jumping, chase games — physical, not a screen)
    label: 'Together',
    emojis: ['🎡', '🛹', '🧸', '❤️', '👫', '🤸'],
  },
  {
    // 🎨 art / craft session · 📚 new book / extra story · ⚽ park or sport outing ·
    // 🏕️ sleepover · 🤼 wrestling match · 🔍 scavenger hunt
    label: 'Make & do',
    emojis: ['🎨', '📚', '⚽', '🏕️', '🤼', '🔍'],
  },
  {
    // 👑 yes day (you're in charge) · 💰 cash out (trade P-Bucks for real money)
    label: 'Big ones',
    emojis: ['👑', '💰'],
  },
]
