# Story: Typography Scale

**Module:** platform
**Status:** ⬜ Not Started
**Type:** Design

## User story

As a developer building any screen in this app, I can look up the typography scale in `design-system.md` and find the exact token name, size, weight, line-height, and usage rule for any text style, so I never make ad-hoc sizing decisions.

## Background

The profile-management story introduced two heading tokens — `page-title` and `section-label` — and a Storybook typography story (`typography.stories.tsx`). Both were decided contextually rather than from a defined scale. The current components use 14px as the de-facto body size, but this was organic rather than deliberate.

## Open question (resolve first)

**Should the base size be 14px or 16px?**

The existing components sit around 14px. A major second ratio (×1.125) from 16px produces:
11px → 13px → 14px → 16px → 18px → 20px → 23px

16px is the web standard and better for mixed-age readers (a 7-year-old reading chores benefits from 16px over 14px). 14px is common for dense desktop dashboards. This product is a tablet family UI — the design session should decide which base is appropriate before formalising the scale.

If 16px base is chosen, audit whether existing components need resizing or whether they already fall on natural scale steps.

## Scope

**In:**

- Decision on base size (14px vs 16px) and scale ratio
- Complete UI type scale: all sizes in use or anticipated, with token names, size, weight, line-height, and letter-spacing values
- Named semantic tokens where semantics matter (`page-title`, `section-label`, `body`, `caption`, etc.) vs raw Tailwind classes where semantics don't add value
- `docs/design-system.md` Typography section populated (currently sparse)
- `typography.stories.tsx` updated to reflect the finalised scale — becomes the living reference
- Explicit guidance on when to use display font (Lora) vs UI font (DM Sans)

**Out:** Icon sizing, spacing scale, motion tokens (already documented), any component resizing — that is a follow-up dev task if required

## Acceptance criteria

1. Base size and scale ratio are decided and documented with rationale
2. `docs/design-system.md` has a complete Typography section: scale table (token → size / weight / line-height / tracking / usage) and font-usage rules
3. Named semantic tokens are listed with their Tailwind equivalents
4. `typography.stories.tsx` updated to show every token in context
5. Any components that need resizing to match the settled scale are called out as a follow-up — not silently left misaligned

## Dependencies

- profile-management ✅ (`page-title`, `section-label` established)
- visual-language design session (Lora + DM Sans, Tailwind CSS v4 token setup)
