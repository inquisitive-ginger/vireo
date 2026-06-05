## What was decided

- **Font scope:** Lora for `page-title`, `display-lg`, `display-xl` only. All structural headings (`heading`, `card-title`, `section-label`) use DM Sans. The former blanket `h1–h6 → var(--font-display)` CSS rule was removed in favour of explicit utility classes.
- **Scale:** Major second (ratio 1.125), base 16px. 11 tokens.
- **No 12px step** — caption merges into `sm` (13px); 1px difference is imperceptible in practice.
- **No 15px step** — `list-name` folds into `card-title` (16px).
- **`page-title` at 26px** (major 2nd step +4 from 16px, Lora) — prior code used `text-2xl` (24px), which was an informal choice; this locks it.
- **`display-lg` at 29px** (step +5, Lora) — was informally 28px.
- **Token classes** — all 11 tokens defined as `@utility` classes in `packages/ui/src/styles.css`. Components use utility names (`text-page-title`, `text-card-title`, etc.) rather than raw pixel/weight combinations. Future sessions must use these classes; raw size utilities are a smell.

## What was produced

- `packages/ui/src/styles.css` — `h1–h6` rule removed; `@utility font-display`, `@utility font-ui`, and all 11 token utilities added.
- `packages/ui/src/components/settings-layout.tsx` — `text-page-title`
- `packages/ui/src/components/profile-list-item.tsx` — `text-card-title`
- `packages/ui/src/components/confirm-dialog.tsx` — `text-card-title`
- `apps/shell/src/pages/DemoPage.tsx` — `text-page-title`
- `apps/shell/src/pages/Onboarding.tsx` — `text-heading`
- `packages/ui/src/components/typography.stories.tsx` — rewritten to the locked 11-token scale with specimens
- `packages/ui/src/components/typography.playground.stories.tsx` — created (throwaway; delete after this session)
- `docs/design-system.md` — Typography section replaced with full locked spec

## Open questions raised

None. Scale is closed.

## What the next session needs to know

- All type is now set via token utilities. `text-sm`, `text-base`, `text-xl`, `text-2xl` etc. from Tailwind should not appear on text elements in new code — use `text-sm-token`, `text-base-token`, `text-heading`, `text-page-title` etc.
- The playground story (`typography.playground.stories.tsx`) should be deleted once this session is committed.
- `settings-permissions` (next in queue) introduces a tiered Settings view — all new text should use the locked token classes.
