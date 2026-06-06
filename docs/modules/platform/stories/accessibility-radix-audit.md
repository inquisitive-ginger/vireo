# Story: Accessibility & Radix Primitives Audit

**Module:** platform
**Status:** ✅ Done

## User story

As a developer, I want all interactive UI components to use Radix UI primitives where appropriate so that keyboard navigation, focus management, and ARIA attributes are correct without custom reimplementation.

## Scope

**In:**

- Audit every component in `packages/ui` against the Radix primitive list
- Replace custom implementations where Radix provides focus trap, Escape handling, scroll lock, or ARIA state management that the current component lacks
- Known gap: `confirm-dialog.tsx` uses `createPortal` + manual backdrop click — missing focus trap and Escape key dismiss; replace with `@radix-ui/react-alert-dialog`
- Install only the Radix packages needed; add each as a dependency to `packages/ui/package.json`
- Update Storybook stories for any replaced components to exercise keyboard and focus behavior

**Out:** New interactive components not already in `packages/ui`; design changes to existing components; WCAG full compliance audit (colour contrast, motion, etc.)

## Acceptance criteria

1. Every component in `packages/ui` that manages interactive state (open/closed, checked, expanded) uses the appropriate Radix primitive or has a documented justification for not doing so
2. `ConfirmDialog` uses `@radix-ui/react-alert-dialog` and traps focus, dismisses on Escape, and locks scroll
3. `pnpm typecheck` passes with zero errors
4. Storybook stories for affected components remain passing

## Dependencies

- None

## Notes

Radix primitives that are candidates based on current and near-term components:
`react-alert-dialog` (ConfirmDialog), `react-collapsible` (any future expandable sections), `react-tooltip` (icon buttons needing labels).

`react-switch` shipped in the permission-overrides story (`Switch` in `packages/ui`) — this audit story covers the remaining gaps.
