# 011 — Shell Composition Model

**Status:** Decided

**Decision:** The shell home surface is a composable, role-aware widget
grid. Which widgets are visible and prominent is determined by the
current user's trust tier — not by explicit navigation. Implementation
is deferred to M1.

M0 is explicitly constrained by this: the plugin loading mechanism
must not assume a single plugin fills the entire screen. The M0 home
screen is a named placeholder, not the final composition surface.

**Why:** Role-aware composition is a core product principle — kids and
parents have meaningfully different primary surfaces. Building a
fixed nav-plus-content-area model in M0 without this constraint would
require a structural refactor to undo.

**Alternatives considered:** Sidebar nav with full-screen plugin views
only (clean and simple, but forecloses role-aware composition without
significant rework); deferring the decision entirely (risk of M0
inadvertently baking in the wrong model).

**Do not revisit unless:** The composable, role-aware home surface
concept is abandoned entirely.
