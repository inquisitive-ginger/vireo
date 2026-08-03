import type { EmojiGroup } from '@family-os/ui'

/* The punch-card emoji set — a card's glyph names the HABIT being punched, not the prize
   at the end of it ("try bites" is 🥦, never 🍦), so it is a different set from
   REWARD_EMOJI_GROUPS even though both stock the same tab. Same rule as that file: one
   emoji per thing a family would actually punch, no look-alike padding. */
export const PUNCH_EMOJI_GROUPS: EmojiGroup[] = [
  {
    // 🪥 teeth, twice a day · 🛏️ bed made · 👕 dressed and ready on time ·
    // 🚿 bath without the fight · 😴 lights out on time · 💧 finished the water bottle
    label: 'Routine',
    emojis: ['🪥', '🛏️', '👕', '🚿', '😴', '💧'],
  },
  {
    // 🥦 try bites (one taste of the new thing) · 🍎 a fruit or veg with lunch ·
    // 🥣 breakfast without a fuss · 🍽️ plate cleared to the sink
    label: 'Food',
    emojis: ['🥦', '🍎', '🥣', '🍽️'],
  },
  {
    // 📖 reading log (a chapter, or 20 minutes) · ✏️ homework done before dinner ·
    // 🎻 instrument practice · 🔤 sight words / flash cards · 🧮 math minutes
    label: 'Learning',
    emojis: ['📖', '✏️', '🎻', '🔤', '🧮'],
  },
  {
    // 🧹 room tidy at bedtime · 🧺 laundry put away · 🗑️ bins out ·
    // 🐕 fed and walked the dog · 🪴 watered the plants · 🙋 helped without being asked
    label: 'House & help',
    emojis: ['🧹', '🧺', '🗑️', '🐕', '🪴', '🙋'],
  },
  {
    // 🫶 caught being kind to your brother/sister · 😮‍💨 big feeling handled without a blow-up ·
    // 🗣️ told the truth when it was hard · 🤗 said sorry and meant it
    label: 'Getting along',
    emojis: ['🫶', '😮‍💨', '🗣️', '🤗'],
  },
  {
    // 🌳 an hour outside · 🚲 rode the bike · ⚽ practice or a game · 🏃 moved your body
    label: 'Outside',
    emojis: ['🌳', '🚲', '⚽', '🏃'],
  },
  {
    // ⭐ a good day, all round (the catch-all card) · 🏅 the hard one nobody had to nag about
    label: 'Anything',
    emojis: ['⭐', '🏅'],
  },
]
