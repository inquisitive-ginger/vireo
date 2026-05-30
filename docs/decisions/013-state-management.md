# 013 — State Management

**Status:** Decided

**Decision:** State is managed in layers matched to the type of state:

| Layer | Tool | Scope |
|-------|------|-------|
| Auth + tier | React Context (`AuthProvider`, `useAuth()`, `useTier()`) | Global — shell root |
| Shell client state | Zustand | Global — shell root, no provider needed |
| Server / plugin data | TanStack Query | Per-plugin — fetching, caching, loading states |
| Plugin UI state | React `useState` / `useReducer` | Local — within plugin |
| Real-time (event bus) | WebSocket → TanStack Query cache invalidation | Per-plugin |

`useAuth()` is the primary hook and returns the full user object
including trust tier. `useTier()` is a convenience wrapper over
`useAuth()` for components that only need the tier level. Neither
replaces the other — they read from the same `AuthProvider`.

Zustand carries no React provider; it is a standalone store accessed
via hooks. This keeps the provider tree minimal:
`QueryClientProvider → AuthProvider → App`.

**Why:** Auth and tier change at most once per session switch — React
Context is the right tool (low update frequency, global reach). Shell
state (notifications, active surface) updates more frequently and
benefits from Zustand's selective subscription model, which avoids
re-rendering all Context consumers. Plugin data is server state with
caching and loading concerns — TanStack Query is purpose-built for
this. The event bus (ADR 008) feeds into TanStack Query cache
invalidation, completing the real-time update loop.

**Alternatives considered:** Redux Toolkit — comprehensive but more
boilerplate than the project warrants; Jotai — good for complex
derived state, more mental overhead than Zustand for this use case;
React Context for all state — re-render frequency makes it wrong for
frequently-updating shell and plugin state.

**Do not revisit unless:** Plugin state complexity grows to the point
where cross-plugin state sharing is needed (evaluate at M8 Marketplace
session).
