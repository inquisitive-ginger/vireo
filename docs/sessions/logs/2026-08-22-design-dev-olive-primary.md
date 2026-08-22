# 2026-08-22 — Design + dev: olive primary (the Vireo commit)

**PR #120 · ADR 065 · comp artifact `artifacts/2026-08-22-olive-primary-comp.html`**

## Decided

- **Deep Olive** won the three-way comp (vs moss straight-port, golden olive):
  `--primary`/`--ring` = `oklch(0.5 0.11 122)` light / `oklch(0.62 0.11 122)`
  dark; theme-color `#596C17`. ΔEok analysis and do-not-revisit terms in ADR 065.
- **Neutrals rotate with it** (live-review finding): clay 45–80° → oat/loam
  100–105°, L/C held; tinted light shadows follow; manifest bg `#FBFAF4`, dark
  theme-color `#1C1B12`. Nav active wash `bg-primary/10` → `/13` (nav only —
  chips, hovers, icon tiles keep /10).
- Identity hues, accent, coin, statuses untouched. The harmonized-with-primary
  role moves terracotta → moss/sage. Watch item: `--success` (148°) is now
  primary's colour family — nudge success toward ~158° if it ever reads muddy,
  never primary.

## Also fixed — latent issues the hue change exposed

- Button `outline`/`ghost` hovered stock-shadcn `bg-accent` — module-identity
  teal here, so every hovered Cancel filled solid teal. Now
  `hover:bg-secondary/70 hover:text-foreground` (the nav idiom). Accent is never
  an interaction state; remaining `bg-accent` uses (badge, unread spine,
  eyebrow) are sanctioned identity spots.
- Mobile active tab was colour-only, and olive ≈ muted ink (both mid-value,
  hues 122 vs 100). Active icon now sits on a `bg-primary/13` pill with a
  semibold label; the More-sheet active row takes the same wash.

## Shipped mechanics

- Icon set re-rendered from the recolored SVGs (resvg; oklch→hex conversion for
  rasterization only — committed SVGs stay oklch). sw.js cache version is
  build-injected, no manual bump.
- Onboarding PIN wash de-hardcoded to `color-mix(… var(--primary) 8% …)`.
- "Family OS" wordmark strings → "Vireo" (top bar, onboarding, GitHub-issue
  footer, two stories).
- Verified: ui 198/198, shell 17/17, live shell both themes at every step;
  reward-drawer Cancel hover is PIN-gated so it was user-verified in review.

## Environment note

- Local repo dir renamed `~/Develop/family-os` → `~/Develop/vireo`. GitHub repo
  name, `@family-os/*` scope, sw cache prefix, ghcr image names, and Pi paths
  deliberately unchanged — near-zero user-facing payoff; own session if ever.

## Next session needs to know

- Installed-PWA icons refresh lazily; iOS homescreens may need a re-add to show
  the olive icon (Safari behavior, not ours).

## Deploy incident (post-merge)

The known watchdog/deploy race fired again, worse: during the PR #120 rollout,
postgres's slow cold start held the `api` recreate at its health gate, the
watchdog's probe (`/api/plugins` through Caddy) saw the stack down, and it
**rebooted the Pi under the in-flight deploy** (reboot stamp 11:22, deploy
"canceled" 11:23). Prod was fully down (~11:25–11:40) until the watchdog's own
`compose up -d` retry loop finished the rollout with the already-pulled images.
Verified after: `#596C17` served, `/api/plugins` 200, all containers healthy.
The api container carries a compose temp name (`1aa1b727c2d6_…`) until the next
clean deploy — cosmetic. Queue item escalated: 2 for 2 on recent deploys.
