# Story: Demo Plugin

**Module:** platform
**Status:** ⬜ Not Started

## User story
As a parent, I can see the demo plugin running on the tablet so that the platform's plugin model is proven end-to-end before any real module is built.

## Scope
**In:** One first-party demo plugin with a `remoteEntry.js` and `manifest.json`; plugin imports exclusively from `@family-os/ui` and `@family-os/platform`; plugin renders different content for tier-1 and tier-4 profiles; plugin publishes at least one event; plugin subscribes to at least one event and updates its UI in response; plugin is registered and loads on the tablet

**Out:** Production-quality UI; real business logic; content beyond what is needed to exercise the plugin contract

## Acceptance criteria
1. Demo plugin is registered in the plugin registry and loads on the tablet without errors
2. Plugin renders visibly different content when a tier-1 (child) profile is active vs. a tier-4 (parent) profile
3. Plugin uses at least one `@family-os/ui` component and at least one `@family-os/platform` hook
4. Plugin publishes one event; the shell receives it via the WebSocket bridge and the receipt is visible (e.g., a logged message or a UI update)
5. Plugin subscribes to one event and its UI updates in response when that event is emitted
6. Plugin source contains no direct imports from the shell, other plugins, or any third-party component library outside `@family-os/ui`
7. **This story satisfies the M0 done definition: a plugin can be installed and rendered on the tablet**

## Dependencies
- shell-skeleton
- auth-and-profiles
- event-bus
- plugin-loader

## Notes
This story is the integration test for M0. It should be the last story completed and its ACs collectively validate the full platform stack. If any prior story is incomplete, this story will reveal it. Keep the plugin's UI deliberately simple — its purpose is to exercise the contract, not to look good.
