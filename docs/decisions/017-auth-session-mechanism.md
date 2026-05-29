# 017 — Auth Session Mechanism

**Status:** Decided

**Decision:** Server-side sessions via `@fastify/session` + `connect-pg-simple`.
Cookie-based. The session record stores `{ activeProfileId }`, resolved to a
full `Profile` object by auth middleware on each request.

**Why:** The platform's interaction model is profile switching, not traditional
login — a mutable server-side session is a natural fit. The session store
re-uses the existing PostgreSQL instance (ADR 009), so no additional
infrastructure is required. Profile switching is a single session row update;
the React `AuthProvider` uses TanStack Query (ADR 013), so
`queryClient.invalidateQueries(['auth/me'])` on a successful switch triggers a
reactive re-render of all `TierGate` and `PermissionGate` trees without a page
reload. Statefulness is a feature, not a drawback, for a single-instance home
server.

**Profile switching rules:**

`POST /auth/switch { targetProfileId }`

- If target profile tier ≤ current active profile tier → allow; update session
- If target profile tier > current active profile tier → return 403; require PIN
  verification via `POST /auth/verify-pin { pin, targetProfileId }` first

This mirrors the Pixel TV / shared-device model: switching down to a child
profile is unblocked; switching up to a parent profile requires that parent's
PIN (or any profile at or above the target tier). The login/profile-switch UX
mechanism is a separate design session — M0 ships a dev-mode selector.

**Alternatives considered:**

- **JWT (`@fastify/jwt`):** stateless, but token expiry/refresh adds complexity
  with no benefit for a local single-instance server; profile switching requires
  issuing a new token anyway, reintroducing statefulness
- **Lucia:** TypeScript-first auth library, but retired as an installable package
  in early 2025 (now a reference guide only); unnecessary indirection for the
  actual problem
- **NextAuth/Auth.js:** designed for the Next.js ecosystem, not Fastify

**Do not revisit unless:** The platform needs to support external OAuth
providers, cross-device shared sessions, or horizontal scaling beyond a single
home server instance.
