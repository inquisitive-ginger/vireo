# Story: Plugin Registry & Loader

**Module:** platform
**Status:** ✅ Done

## User story
As a developer, I can register a plugin and have the shell load and mount it via Module Federation so that plugins are the standard delivery mechanism for all platform features.

## Scope
**In:** Plugin registry (database table or config file — either is acceptable for M0); shell reads the registry at boot and fetches each plugin's `manifest.json`; shell lazy-loads `remoteEntry.js` when navigating to a plugin's declared route; plugin mounts into the shell's content slot; `@family-os/platform` SDK (useAuth, useTier, usePermissions, TierGate, PermissionGate) is available to plugins at mount time; graceful error state if a plugin fails to load

**Out:** Plugin installation UI (parent-facing); plugin marketplace; plugin dev toolchain / scaffold (M0 Architecture session); explicit plugin sandboxing beyond Module Federation's natural isolation; hot-swapping plugins at runtime

## Acceptance criteria
1. A plugin entry in the registry causes the shell to fetch its `manifest.json` at boot
2. Navigating to the plugin's declared route triggers lazy-loading of its `remoteEntry.js`
3. The plugin renders in the shell's content slot without errors
4. The plugin can call `useAuth()`, `useTier()`, and `usePermissions()` from `@family-os/platform` and receive correct values for the active profile
5. The plugin can import and render components from `@family-os/ui` without additional build configuration
6. A route that maps to an unregistered plugin returns an error state in the content slot — the shell does not crash
7. If a registered plugin's `remoteEntry.js` fails to load, an error state is shown in the content slot — the shell and other plugins are unaffected

## Dependencies
- dev-environment
- shell-skeleton
- auth-and-profiles

## Notes
The plugin registry for M0 can be as simple as a JSON config file or a single database table — the interface is what matters, not the storage. The Platform API surface (the full typed SDK contract) is finalized in the M0 Architecture session; this story implements the subset needed to satisfy these ACs.
