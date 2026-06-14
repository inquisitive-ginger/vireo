# 032 — Plugin Nav Item Registration

**Status:** Decided

**Decision:** Plugins declare a `navItem` field in their `manifest.json`. The shell reads
this at boot alongside routes and widgets, resolves the icon string to a lucide-react
component via a shell-side registry, and passes the resulting nav items to the Sidebar.
Each plugin may declare at most one nav item (singular field, not array).

---

## Manifest shape

```json
"navItem": {
  "label": "Family Feed",
  "route": "/family-feed",
  "icon": "rss",
  "minTier": 1
}
```

**Field rules:**

| Field     | Required | Rules                                                         |
| --------- | -------- | ------------------------------------------------------------- |
| `label`   | Yes      | Shown in sidebar; short (1–3 words)                           |
| `route`   | Yes      | Must be one of the routes declared in `routes[]`              |
| `icon`    | Yes      | Key from the shell's icon registry (`ICON_MAP` in `main.tsx`) |
| `minTier` | No       | Numeric 1–4; defaults to 1 if omitted                         |

The `navItem` field is optional — plugins that only add widgets or background services
do not need a sidebar entry. `demo-plugin` is an example: it has routes but no nav item.

---

## Shell wiring

`main.tsx` resolves nav items at boot (same pass as routes), maps each icon string to a
lucide-react component, and passes the resulting `PluginNavItem[]` to `<App>` via prop.
`App` forwards to `Sidebar`, which already filters by `minTier` and renders the items.

Adding a new icon: add an entry to `ICON_MAP` in `main.tsx` and declare the key in the
plugin's manifest. No other files need to change.

---

## Why

**Manifest-driven, consistent with routes and widgets.** ADR 007 established the manifest
as the single place plugins declare their shell capabilities. Nav items belong there too.

**Icon-as-string keeps manifests pure JSON.** The shell owns the UI concern of resolving
icon names to components. Plugin manifests never import from the shell.

**Singular `navItem` reflects plugin identity.** Plugins represent one feature area with
one primary entry point. Arrays would imply sub-navigation, which is a plugin-internal
concern and not a sidebar concern.

---

## Alternatives considered

**Runtime registration hook (`useRegisterNavItem`)** — more flexible, but nav items
would not appear until the plugin route is first visited. Manifest-driven items are
available at boot, before any plugin code loads.

**Separate nav config file** — splits plugin metadata across files; manifest is already
the canonical plugin contract (ADR 014).

**Inline React components in manifest** — impossible; manifests are JSON. Icon name →
component resolution is the minimal bridge.

---

## Do not revisit unless

A plugin legitimately needs multiple top-level nav entries. If that arises, change
`navItem?` to `navItems?` (array) and update the shell resolver accordingly.
