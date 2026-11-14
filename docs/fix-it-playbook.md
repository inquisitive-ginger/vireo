# The fix-it playbook

How a problem someone reported on the fridge iPad becomes a deployed fix.

The surface and the capture are ADR 046. This is the operational half: what
happens after Send, who does it, and how to make more of it automatic.

---

## The loop

```
   in-app report            server                  GitHub                  you
  ┌──────────────┐    ┌────────────────┐    ┌──────────────────┐    ┌──────────────┐
  │ Report a     │───▶│ bug_reports    │───▶│ issue, labelled  │───▶│ fix session  │
  │ problem      │    │ status: new    │    │ `auto-bug`       │    │ patch + PR   │
  └──────────────┘    └────────────────┘    └──────────────────┘    └──────┬───────┘
         ▲                     ▲                                           │
         │                     │                                    merge to main
         │              PATCH status                                       │
         │              → `deployed`                                       ▼
         │                     │                              release.yml → GHCR
   ┌─────┴───────┐             │                                           │
   │ "Fixed and  │◀────────────┘                              deploy.yml (Pi runner)
   │  live"      │                                                         │
   └─────────────┘                                                   pull + up -d
```

Everything left of "fix session" is automatic. Everything right of "merge to
main" is automatic. **The fix itself is the manual step** — deliberately, for now
(ADR 046 §"Why not").

---

## Setup

The bridge needs two environment variables on the API container. Without them the
feature still works — reports just stop at a row you triage by hand in
**Settings → Reported problems**.

| Variable       | Value                                                                               |
| -------------- | ----------------------------------------------------------------------------------- |
| `GITHUB_TOKEN` | Fine-grained PAT · repo `family-os` only · **Issues: Read and write**, nothing else |
| `GITHUB_REPO`  | `inquisitive-ginger/family-os`                                                      |

Create it at **Settings → Developer settings → Personal access tokens →
Fine-grained tokens**: resource owner `inquisitive-ginger`, _Only select
repositories_ → `family-os`, then under **Repository permissions** set
**Issues: Read and write** and leave everything else at _No access_
(`Metadata: Read-only` is added automatically and is required).

Do **not** grant Contents, Pull requests, or Workflows. This token lives on a
machine in a kitchen; it should be able to file an issue and nothing more. A
classic PAT's `repo` scope is far too broad — it would grant push access to the
whole repository.

Add both to `/opt/family-os/.env` on the Pi (the file is `chmod 600`), then
`docker compose -f docker-compose.prod.yml --env-file .env up -d api`.

---

## Running a fix session

`/triage` reads the open `auto-bug` issues, checks each against current main, and
routes it: a fix goes under `## Fixes` in `docs/roadmap.md` for a build session, an
enhancement or new feature goes through `/feature`, and the rest are closed as
won't-fix or asked for more information. The build session writes a failing test
named after the issue, fixes it, and `/lock-in` merges the PR (`Fixes #N`) and waits
on `scripts/deploy-check.sh`.

Each issue body carries the capture from ADR 046: route, build hash, viewport,
user agent, and up to ten console errors. **Start with the route and the build
hash.** If the build hash is older than what is live, check whether the bug
already went away — a report can outlive its cause.

**Status is still flipped by hand** until the maintainer token (D-075) lands and
`issues.onStatus` is wired: move the report to `fixing` when its session starts and
to **`deployed`** once the deploy check passes, from **Settings → Reported
problems**, with a `resolution` in the household's words — it replaces the default
notification body, and `deployed` is the only status that notifies (ADR 046 §4).
Merge-to-live is ~15 minutes (`release.yml` ~4–6 min, then `deploy.yml` on the Pi
~6–12 min) plus ~40 seconds of API 502 while `tsx` boots and migrations run.

If it turns out not to be a bug, move it to `wont_fix` with a resolution that
says why. Leaving it at `new` forever is how you teach a household to stop
reporting.

---

## Making it automatic

The manual step is the fix session. Two ways to remove it, in the order they
should be adopted:

### 1. GitHub Action on issue open — event-driven

Nothing runs between reports. When an `auto-bug` issue is opened, a runner boots,
Claude patches, a PR opens, the runner dies. A few minutes of compute per bug.

Needs an `ANTHROPIC_API_KEY` repo secret. Start it with **PR-only** output — no
auto-merge — so you still approve every change to a live family app. Graduate to
auto-merge-on-green only once you have watched enough of them land to trust it.

### 2. A scheduled sweep — periodic

A routine that wakes on a cron, fixes what has queued up, and sleeps. Better if
you would rather batch than react.

**Do not run fixes on the Pi.** Its self-hosted runner is right for `docker pull`
and nothing heavier — it is a 4 GB Pi 5 serving the live household
([`project-poc-hardware`]), not a build box. Fixes belong on a dev machine or a GitHub-hosted
runner; only the deploy touches the Pi.

---

## When the bridge is down

`createBugIssue` returns `null` on every failure — bad token, no network, GitHub
down — and the report keeps `status: new` with a null issue number. Nothing is
lost and nothing is retried. Find them with:

```sql
select id, description, created_at from platform.bug_reports
where github_issue_number is null and status = 'new';
```

Fix the token, then file those by hand. If this happens more than once, that is
the argument for a retry — not before.

---

## Checking what is actually owed

Do not trust a doc bullet for this. Report status is a database column, and
`CLAUDE.md` / the queue only record what someone believed at closeout — an
"owed" line written in one session survives every later session that flips the
status by hand:

```bash
ssh vireo-pi "docker exec \$(docker ps --format '{{.Names}}' | grep -i postgres | head -1) \
  psql -U familyos -d familyos -c \
  \"select left(id::text,8), status, left(description,44) from platform.bug_reports \
    where status <> 'deployed' order by created_at desc;\""
```

Empty result means nothing is owed. Note the schema — the table is
`platform.bug_reports`, not `bug_reports`, and it is not on the default
`search_path`. `GET /api/bug-reports` is no substitute: it scopes to the calling
profile's own reports unless the caller is tier 4, so a partial list reads as a
complete one.
