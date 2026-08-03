# 2026-08-02 — dev: punch-card glyphs get their own emoji set (PR #99)

Ad-hoc follow-on to M4/6; no kickoff existed, none written (one-file change,
this log is the artifact).

## What was wrong

`PunchTemplateDrawer` rendered its emoji picker from `REWARD_EMOJI_GROUPS` —
the set built for the catalog, where every emoji stands for a prize a family
actually gives. But a punch card's glyph names **the habit being punched**, not
the thing waiting at the finish line. "Try bites" could only be labelled 🍦.
The two sets were sharing a picker because the two drawers ship in the same tab,
not because they want the same emojis.

## What changed

`plugins/rewards/src/lib/punch-emojis.ts` — `PUNCH_EMOJI_GROUPS`, seven shelves:
Routine · Food · Learning · House & help · Getting along · Outside · Anything.
Written under the reward set's own rule: one emoji per thing a family would
actually punch, no look-alike padding, each one annotated with the card behind
it. The catalog drawer is untouched and keeps `REWARD_EMOJI_GROUPS`.

⭐ is in the set now (shelf "Anything"), so the drawer's default glyph shows as
selected when the picker opens — it didn't before.

## The five cards this was for

The set was derived from real cards, not the other way round:

| Card         | Glyph | Punches | Earns                                  |
| ------------ | ----- | ------- | -------------------------------------- |
| Try bites    | 🥦    | 10      | pick of 🍦 ice cream run / 🍪 dessert  |
| Reading log  | 📖    | 15      | pick of 📚 new book / 🌙 stay up late  |
| Teeth, twice | 🪥    | 20      | 15 P-Bucks                             |
| Bed made     | 🛏️    | 10      | 10 P-Bucks                             |
| Kind catch   | 🫶    | 5       | pick of 🎲 family game / 💺 front seat |

Two judgement calls worth keeping: **"Bed made", not "Room tidy"** — a made bed
is one visible thing a kid self-checks at 7am, "tidy" is a nightly arbitration.
And **🫶 over 🤝** for Kind catch — heart hands read as kindness to a kid, a
handshake reads as a deal being struck.

Kind catch is deliberately the short card (5) because it is parent-observed and
rare; at 15 it would never fill.

## Verified

Live dev app at `localhost:5173` — picker opens on all seven shelves, sign-off
given. Rewards suite green (93 tests). Nothing in `@family-os/ui` changed; the
`EmojiPicker` scoped mode already took an arbitrary group list.

## Note for the next session

The dev stack got restarted mid-session: a second `pnpm dev` came up alongside
one already running, and its plugin `vite build` wiped `plugins/*/dist` out from
under the first stack's `vite preview`, so the rewards and chores remotes served
404 until everything was killed and restarted clean. **Check `lsof -nP -iTCP
-sTCP:LISTEN` for 5173/3000 before running `pnpm dev`** — turbo does not notice,
the shell just moves to 5174 and the API dies with `EADDRINUSE` fifteen lines
into a log nobody is reading.
