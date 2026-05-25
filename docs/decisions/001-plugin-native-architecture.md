# 001 — Plugin-Native Micro-Frontend Architecture

**Status:** Decided

**Decision:** The platform is a shell that loads plugins dynamically.
First-party modules and community plugins are built against the same
plugin API — no special privileges for built-ins.

**Why:** Enables a community marketplace. Forces clean boundaries
between platform and features from day one. Prevents first-party
shortcuts that would make the plugin API a second-class citizen.

**Alternatives considered:** Single monolithic app (simpler to build,
rules out marketplace); plugin system added later (too much retrofit
cost, first-party code would have shortcuts baked in).

**Do not revisit unless:** Marketplace is explicitly descoped as a goal.
