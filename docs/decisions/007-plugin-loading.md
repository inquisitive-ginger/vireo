# 007 — Plugin Loading Mechanism

**Status:** Decided

**Decision:** Plugins are loaded via Vite Module Federation. Each
plugin publishes a `remoteEntry.js` and a `manifest.json`. The shell
reads the plugin registry at boot, then lazy-loads each plugin's
remote module on demand when the user navigates to it. Plugins
communicate with the platform exclusively through the typed Platform
API — never by reaching into the shell or each other.

**Why:** Module Federation gives real JS-context isolation (separate
bundle, separate build pipeline) without the UX seams of iframes.
It is the only mechanism that satisfies ADR 001 cleanly — first-party
and community plugins go through identical loading and API paths with
no shell-side shortcuts possible. Lazy loading keeps startup time flat
regardless of how many plugins are installed.

**Alternatives considered:** Iframe-based sandboxing (maximum
isolation, works with any framework, but postMessage communication is
clunky and iframe seams are visible in the UI — bad for a polished
family product); custom script injection / plugin registry (simplest
to implement, but a bad plugin can access and corrupt shell state —
unacceptable for a marketplace model).

**Do not revisit unless:** Module Federation introduces an
irreconcilable build tooling conflict, or a security audit identifies
a fundamental isolation gap that iframes would solve.
