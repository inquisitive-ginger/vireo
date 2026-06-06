# Session Log — 2026-06-06 — Dev: accessibility-radix-audit

## What was built

Replaced `ConfirmDialog` in `packages/ui` with `@radix-ui/react-alert-dialog`. The previous implementation used `createPortal` with a manual backdrop-click handler and no focus trap, no Escape key handling, and no scroll lock. The Radix primitive provides all three automatically.

Full audit of every component in `packages/ui` for open/closed/checked/expanded interactive state:

| Component                                                                                                                                               | State type           | Result                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------- |
| `ConfirmDialog`                                                                                                                                         | open/closed, modal   | **Replaced** — now `@radix-ui/react-alert-dialog`                               |
| `Drawer`                                                                                                                                                | open/closed, modal   | Already on `@radix-ui/react-dialog` — no change                                 |
| `Switch`                                                                                                                                                | checked              | Already on `@radix-ui/react-switch` — no change                                 |
| `PermissionToggleItem`                                                                                                                                  | checked (via Switch) | Delegates to Radix Switch — no change                                           |
| `PinInput`                                                                                                                                              | —                    | Numeric input mask; no open/closed/expanded pattern; no Radix primitive applies |
| All others (Badge, Button, Input, Label, PlaceholderCard, ProfileAvatar, ProfileListItem, SettingsLayout, WidgetGrid, WidgetSlot, PermissionToggleList) | —                    | Presentational — no change                                                      |

## Acceptance criteria status

| AC                                                                                        | Status  |
| ----------------------------------------------------------------------------------------- | ------- |
| AC1: All interactive-state components on Radix or justified                               | ✅ Pass |
| AC2: `ConfirmDialog` on `@radix-ui/react-alert-dialog`, focus trap + Escape + scroll lock | ✅ Pass |
| AC3: `pnpm typecheck` zero errors                                                         | ✅ Pass |
| AC4: Storybook stories for affected components passing                                    | ✅ Pass |

## Decisions made

- **`AlertDialog.Cancel` for Cancel; plain `Button` for Confirm.** `AlertDialog.Cancel` correctly handles both explicit Cancel clicks and Escape key via `onOpenChange`. The Confirm button intentionally does not use `AlertDialog.Action` so that the parent controls closure timing (needed for `isPending` state where the action is async).
- **`onEscapeKeyDown` blocks Escape when `isPending`.** Since the Cancel button is disabled when pending, Escape should be too.
- **Backdrop click intentionally not supported.** `AlertDialog` by design does not close on overlay click — appropriate for destructive confirmation dialogs. This is the more accessible pattern.
- **`BackdropDismiss` story replaced with `EscapeKeyDismiss`.** The old story described behavior that is intentionally absent in AlertDialog; the new story demonstrates the correct dismissal path.

## Scope additions

None.

## New stories created

None.

## Open questions raised

None.

## What the next session needs to know

`ConfirmDialog`'s public API is unchanged (`open`, `title`, `description`, `confirmLabel`, `onConfirm`, `onCancel`, `isPending`). Existing callers (Settings.tsx) need no changes. The only behavioral difference: backdrop click no longer dismisses the dialog.
