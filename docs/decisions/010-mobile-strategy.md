# 010 — Mobile Strategy

**Status:** Decided

**Decision:** Progressive Web App (PWA) for all milestones through
at least M2. The PWA is the mobile surface for parents out of home
and for children on personal devices. Push notifications are delivered
via the Web Push API (satisfying ADR 004). Native app development is
not planned; revisit only if a concrete capability wall is hit that
PWA cannot address.

**Why:** Both parents in the household are on Android, where PWA
support is first-class — Chrome on Android has supported Web Push,
background notifications, and home-screen installation since 2015.
Push notifications on Android PWAs are functionally identical to those
from native apps. Children primarily interact with the system at home
on tablets or room displays — surfaces where a PWA is
indistinguishable from a native app. A native app would require a
separate codebase that the plugin system does not extend to, meaning
plugins would need to ship both a web and a native version. PWA avoids
this duplication and keeps the plugin contract unified across all
surfaces.

**Alternatives considered:** React Native (richer native feel on iOS,
better push reliability on older iOS versions — not a factor given the
Android-only parent household; adds a separate codebase that breaks
plugin portability); native Android (maximum capability, unjustifiable
maintenance cost for a family-scale local-first product with no
distribution requirement).

**Do not revisit unless:** A specific capability is identified that
PWA provably cannot deliver on the Android versions in active use
(e.g. lock screen widgets, deep background processing), or iOS becomes
a required platform for a family member on an older iOS release prior
to 16.4.
