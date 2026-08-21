# 033 — Mobile Nav Pattern

**Status:** Decided · the "Profile chip on mobile" clause and the "no top header bar on mobile in M1" stance are **superseded by [ADR 034](034-mobile-brand-top-bar.md)** (profile + bell now live in a brand top bar; the bottom bar is nav-only). The bottom-tab-bar, breakpoint, widget-reflow, and safe-area decisions below still stand. **Amended 2026-08-17** (auto-bug #112, PR #113): the bar now caps at **5 tabs** with a **More** sheet for overflow — see "Overflow shipped early" below.

**Decision:** Bottom tab bar — ~~4 module tabs (Home, Feed, Chores, Calendar)~~ **(superseded 2026-08-17 — the bar caps at 5 tabs with a More sheet, see below)** + ~~profile avatar as the rightmost tab~~ **(superseded by ADR 034 — no avatar tab)**. The sidebar (ADR 022) is hidden below the `md:` breakpoint (768px); the bottom tab bar appears instead. Single-column widget stack on mobile. Bottom tab bar uses `env(safe-area-inset-bottom)` for home indicator clearance.

**Why:** The four M1 primary surfaces fit within 5 tabs with no overflow. The bottom tab bar is thumb-friendly, always visible, and matches iOS/Android conventions family members already know. The hamburger drawer alternative adds a mandatory extra tap to every navigation action and hides what surfaces are available until opened — not appropriate for a glanceable shared-family display. Drawer does scale better to many modules (scrollable list vs. fixed tabs), but that problem doesn't exist until the marketplace ships.

**Alternatives considered:** Hamburger drawer (rejected: 2 taps to navigate anywhere, context hidden until opened; advantage is unlimited module capacity — deferred to M8+ when overflow is needed); top navigation bar (rejected: competes with content, hard to reach on tall phones).

**Breakpoint convention:** `md:` (768px) is the canonical tablet/mobile split. Below this threshold the sidebar is hidden and the bottom tab bar is shown. This is a settled shell convention for all future responsive work.

**Profile chip on mobile:** ~~Profile avatar is the rightmost tab. Tapping opens the profile grid overlay (same component as tablet, `mode: 'overlay'`). No top header bar on mobile in M1.~~ **Superseded by ADR 034** — the profile avatar moved to a brand top bar (left slot) and the bottom bar is nav-only.

**Widget grid on mobile:** Widgets reflow to a single-column stack — full viewport width, ordered by tier-default priority. No carousel.

**Safe-area insets:** The bottom tab bar applies `padding-bottom: env(safe-area-inset-bottom)` to clear the iPhone home indicator. All mobile layout primitives must respect safe-area insets.

**Overflow ceiling:** At M1, all core module tabs have `minTier: 1` — every user sees the same 4 tabs; no overflow needed. When the marketplace (M8+) makes it possible to install many plugins, Frame A will need a "More" tab and a tab-pinning management UI. That is a deferred design session.

**Overflow shipped early (2026-08-17, issue #112):** the revisit trigger fired — five core modules pushed the bar to six tabs. The bar now caps at **5 tabs**: Home + the first three tier-visible plugin tabs + a **More** tab that opens a bottom `Sheet` listing the rest (More shows active state when an overflowed route is current; no overflow renders when everything fits). Pinning is registry order in `plugins.json` (calendar, chores, meals ahead of rewards, family-feed); the tab-pinning **management UI** remains deferred to M8+.

**Open questions deferred to mobile dev session:**

- ~~Notification bell placement~~ — **resolved by ADR 034**: bell lives in the right slot of the mobile brand top bar.
- Page transition animations — the M1 prohibition list was written for tablet. Mobile may warrant slide transitions. Decision belongs in the mobile dev session.

**Do not revisit unless:** ~~Core M1 module count exceeds 4 (requiring overflow before M8+)~~ **(fired 2026-08-17 — overflow shipped, see above)**, or user testing shows bottom tab bar is inappropriate for the shared-device use case.
