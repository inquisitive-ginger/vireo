# Build the shell + all three plugins, then serve the flat prod tree (shell at /,
# plugins under /plugins/<name>/) from Caddy. A2 verified this layout loads the
# federated remotes with the default base — see docs/deployment.md.
#
# Everything the arm64 image needs is arch-independent (static dist) or
# cross-compilable (the Caddy Go binary), so both build stages pin
# $BUILDPLATFORM and run NATIVELY on the x86 runner — no QEMU. Only the final
# stage is arm64, and it just copies files in (no RUN), so nothing is emulated.
FROM --platform=$BUILDPLATFORM node:22-slim AS build
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @family-os/plugin-family-feed --filter @family-os/plugin-chores \
        --filter @family-os/plugin-calendar build
RUN pnpm --filter @family-os/shell build

# Caddy with the Cloudflare DNS-01 module, cross-compiled to the target arch
FROM --platform=$BUILDPLATFORM caddy:2-builder AS caddybuild
ARG TARGETOS
ARG TARGETARCH
RUN GOOS=$TARGETOS GOARCH=$TARGETARCH xcaddy build --with github.com/caddy-dns/cloudflare

FROM caddy:2
COPY --from=caddybuild /usr/bin/caddy /usr/bin/caddy
COPY apps/shell/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/shell/dist /srv
COPY --from=build /repo/plugins/family-feed/dist /srv/plugins/family-feed
COPY --from=build /repo/plugins/chores/dist       /srv/plugins/chores
COPY --from=build /repo/plugins/calendar/dist     /srv/plugins/calendar
