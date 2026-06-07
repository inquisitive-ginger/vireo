# Platform — Progress

---

## M1 — Platform Shell · 🔄 In Progress

> **Milestone done when:** A family can set up the system, see a meaningful home screen, and post to a shared feed.

| Story                                                                 | Status         | Notes                                                                                                |
| --------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| [Home Surface](stories/home-surface.md)                               | ✅ Done        |                                                                                                      |
| [Family Onboarding](stories/family-onboarding.md)                     | ✅ Done        |                                                                                                      |
| [Profile Management](stories/profile-management.md)                   | ✅ Done        |                                                                                                      |
| [Settings Permissions](stories/settings-permissions.md)               | ✅ Done        |                                                                                                      |
| [Typography Scale](stories/typography-scale.md)                       | ✅ Done        | Design session 2026-06-08                                                                            |
| [Permission Overrides](stories/permission-overrides.md)               | ✅ Done        |                                                                                                      |
| [Notification Infrastructure](stories/notification-infrastructure.md) | ✅ Done        |                                                                                                      |
| [PWA Installable](stories/pwa-installable.md)                         | ✅ Done        |                                                                                                      |
| [Web Push](stories/web-push.md)                                       | ⬜ Not Started | Depends on notification-infrastructure + pwa-installable                                             |
| [Notification Design Audit](stories/notification-design-audit.md)     | ⬜ Not Started | Design session; follow-up to notification-infrastructure                                             |
| [Appearance Preference Gate](stories/appearance-preference-gate.md)   | ⬜ Not Started | Addendum from settings-permissions (surfaced 2026-06-09 audit)                                       |
| [Accessibility & Radix Audit](stories/accessibility-radix-audit.md)   | ✅ Done        | `ConfirmDialog` on `@radix-ui/react-alert-dialog`; all other interactive components already on Radix |

---

## M0 — Foundation · ✅ Done (2026-06-01)

> **Milestone done when:** A plugin can be installed and rendered on the tablet. ✅

| Story                                                  | Status  | Notes                        |
| ------------------------------------------------------ | ------- | ---------------------------- |
| [Dev Environment](stories/dev-environment.md)          | ✅ Done |                              |
| [Shell Skeleton](stories/shell-skeleton.md)            | ✅ Done |                              |
| [Event Bus](stories/event-bus.md)                      | ✅ Done |                              |
| [Auth & Family Profiles](stories/auth-and-profiles.md) | ✅ Done |                              |
| [Plugin Registry & Loader](stories/plugin-loader.md)   | ✅ Done |                              |
| [Demo Plugin](stories/demo-plugin.md)                  | ✅ Done | Satisfies M0 done definition |
