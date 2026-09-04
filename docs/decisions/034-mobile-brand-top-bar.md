# 034 — Mobile Brand Top Bar

**Status:** Decided · supersedes the "Profile chip on mobile" and top-bar clauses of [ADR 033](033-mobile-nav-pattern.md)

**Decision:** Mobile (`< md:`, 768px) gains a persistent brand top bar with three slots: profile avatar (left) → opens the `ProfileGrid` switcher; the **Vireo** wordmark (center); the notification bell (right). The bottom tab bar drops its profile slot and becomes **nav-only** — Home + the tier-filtered plugin tabs. The top bar shares the bottom bar's `--secondary` material so the two chrome strips bookend the page content.

**Why:** ADR 033 left two things open — bell placement and whether mobile gets a top bar — and shipped an interim floating bell (`fixed top-3 right-3`) plus a profile tab. Two problems surfaced in the mobile dev session and the follow-up UX playground (`Platform/Mobile UX Playground`):

1. The floating bell sat over content with dead space to its left — unbalanced, and it occluded the page on scroll.
2. A profile tab in the bottom bar competed with the four module tabs and pushed toward a crowded 5–6 slot bar (see Option 4 below).

The brand top bar solves both: the bell is always visible in peripheral vision (the ambient-awareness value the badge exists for), the avatar fills the left slot so the bar reads as a balanced header rather than a lone floating control, and the bottom bar stays a clean nav-only strip well inside the 5-slot ceiling. The wordmark also gives the shell a brand anchor it previously lacked on mobile.

**Wordmark typography:** The wordmark renders in **DM Sans** (`--font-ui`), not Lora. Per `design-system.md`, Lora is reserved for one display moment per route (the page title). Setting the wordmark in Lora would create two competing serif elements stacked in the same viewport; chrome stays DM Sans.

**Profile entry point:** The avatar opens the existing `ProfileGrid` (switch rows → Family view → Settings) as a top-anchored dropdown beneath the bar — not the bottom sheet ADR 033 described. The trigger is now at the top, so the menu drops from the trigger. The tablet sidebar profile path (`Sidebar`'s `ProfileChip` + its own `ProfileGrid`) is unchanged.

**Safe-area insets:** The top bar applies `padding-top: env(safe-area-inset-top)` for notch/Dynamic Island clearance, mirroring the bottom bar's `env(safe-area-inset-bottom)`.

**Alternatives considered (the four playground options):**

- **Option 1 — Brand top bar (chosen).** Bell always visible, profile one tap, balanced header. Cost: ~52px of top chrome and the profile leaves the thumb zone (acceptable — switching profiles is infrequent vs. glancing at alerts).
- **Option 2 — Bell in the profile sheet.** Cleanest content area, but the unread count is two taps deep, defeating the badge's at-a-glance purpose. Kept as the fallback if top chrome is ever deemed too costly.
- **Option 3 — In-page bell (per-page header).** Rejected: placement varies per page, the Home surface has no header to hold it, and every plugin would have to re-implement the bell — untested shell/plugin coupling.
- **Option 4 — Bell slot in the tab bar.** Rejected: 4 nav + Alerts + profile = 6 items at ~62px each on a 375px screen, below iOS HIG / Material's ≤5-tab guidance and over the 5-slot bar ADR 033 settled on.

**Do not revisit unless:** User testing shows the top chrome meaningfully hurts content density on small phones (fall back to Option 2), or the wordmark/brand treatment changes again (the wordmark became "Vireo" on 2026-08-22 — ADR 065).
