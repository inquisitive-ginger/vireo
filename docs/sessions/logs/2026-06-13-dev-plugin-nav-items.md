# Session Log — 2026-06-13 — Dev: Plugin Nav Item Registration

**Type:** Development
**Story:** Plugin nav item registration

---

## What was decided

Plugins declare a `navItem` field in their `manifest.json` — one optional entry per
plugin. The shell resolves the icon string to a lucide-react component at boot and passes
the derived list to the Sidebar. ADR 032.

The triggering observation: the Sidebar already accepted a `pluginNavItems` prop (with
tier filtering) but App.tsx called it with no props, so the nav was permanently empty.
The manifest type had no `navItem` field either.

---

## What was built

| File                                                 | Change                                                                                                                     |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `packages/platform/src/types.ts`                     | Added `NavItemManifest` type; added `navItem?: NavItemManifest` to `PluginManifest`                                        |
| `plugins/family-feed/public/manifest.json`           | Added `navItem` (`label: "Family Feed"`, `route: "/family-feed"`, `icon: "rss"`, `minTier: 1`)                             |
| `apps/shell/src/main.tsx`                            | Added `ICON_MAP` (icon name → lucide component); derived `pluginNavItems` from loaded manifests at boot; passed to `<App>` |
| `apps/shell/src/App.tsx`                             | Added `pluginNavItems` prop; forwarded to `<Sidebar>`                                                                      |
| `docs/decisions/032-plugin-nav-item-registration.md` | ADR                                                                                                                        |

`Sidebar.tsx` needed no changes — it already handled the prop and tier filtering correctly.

**Adding a new plugin nav item:** declare `navItem` in the plugin's `manifest.json` and,
if using a new icon, add an entry to `ICON_MAP` in `apps/shell/src/main.tsx`.

---

## What was sent back

Nothing.

---

## Open questions

None. The pattern is complete and consistent with routes/widgets.

---

## What the next session needs to know

The nav registration pattern is live. Family Feed now appears in the sidebar for tier 1+
users. `demo-plugin` intentionally has no `navItem` (it's a dev tool, not a user feature).
