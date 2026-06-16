# Session Log — Visual Language Design

**Date:** 2026-06-02
**Type:** Design

---

## What was decided

### Typography — Classic Warmth

- **Display font:** Lora (Google Fonts, weights 400/600/700)
- **UI font:** DM Sans (Google Fonts, weights 400/500/600)
- Lora's well-crafted serifs give headings warmth and editorial character. DM Sans is clean and legible for UI text without the generic Inter/Geist feel. The pairing reads as distinctive and warm — adult-legible but approachable for kids.

### Color palette — Terracotta & Teal

- **Primary:** Terracotta `oklch(0.57 0.14 35)` — warm burnt-orange for actions and active states
- **Accent:** Teal `oklch(0.52 0.11 190)` — calm blue-green for progress indicators and highlights
- Deliberately two distinct hues rather than a monochromatic scale. The contrast between warm and cool provides visual variety while keeping the palette grounded.

### Dark mode strategy

- `prefers-color-scheme: dark` media query — cascade-based, no JavaScript
- Dark background is a **warm clay** `oklch(0.15 0.022 45)` — not the cold blue-black common in most apps. Intentionally earthy to match the warm character of the light palette.
- Primaries lighten in dark mode to maintain contrast on dark surfaces.
- Manual dark mode toggle (for families overriding system preference) deferred to M1.

---

## What was produced

- `apps/shell/src/styles.css` — full token set committed (light + dark), font vars updated
- `apps/shell/index.html` — Google Fonts loaded (Lora + DM Sans)
- `docs/design-system.md` — Typography and Color & Tokens sections updated; To Be Defined table trimmed

---

## Open questions raised

- **Motion and animation** — not decided this session. Deferred to M1 design session. Given "calm by default" principle, expectation is: no page-level transitions in M1, CSS transitions only for hover/focus at ≤150ms.
- **Manual dark mode toggle** — deferred to M1. System `prefers-color-scheme` is sufficient for now.

---

## What the next session needs to know

- Tokens are live in `styles.css`. The shell renders with Lora/DM Sans and the Terracotta & Teal palette.
- **Home Surface Design** is next — it should apply these tokens in the home screen layout decisions. All widget cards, sidebar elements, and placeholder states should be designed against the real palette (not neutrals).
- The teal accent is specifically for progress/highlight moments (progress bars, active indicators, completion states). Terracotta primary is for interactive elements (buttons, active nav item, focus rings). Don't blur those roles.
