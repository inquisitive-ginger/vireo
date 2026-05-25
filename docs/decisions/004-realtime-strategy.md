# 004 — Real-Time Communication Strategy

**Status:** Decided

**Decision:** WebSockets for all internal events (local network makes
this effectively free). Push notifications for parents on mobile.
Polling for external integrations (Monarch, calendar sync, weather).

**Why:** Local-first means WebSocket infrastructure costs are
negligible — no meaningful trade-off. Push notifications bridge the
gap for out-of-home parents without requiring the full WebSocket
stack on mobile. External APIs are polled on schedules appropriate
to how often their data changes.

**Alternatives considered:** Polling everything (simpler but kills
the magic of real-time moments like XP animations and routine
triggers); full WebSocket including mobile (complex and unnecessary).

**Do not revisit unless:** System moves to cloud hosting.
