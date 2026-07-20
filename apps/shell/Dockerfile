# Build the shell + all three plugins, then serve the flat prod tree (shell at /,
# plugins under /plugins/<name>/) from Caddy. A2 verified this layout loads the
# federated remotes with the default base — see docs/deployment.md.
FROM node:22-slim AS build
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @family-os/plugin-family-feed --filter @family-os/plugin-chores \
        --filter @family-os/plugin-calendar build
RUN pnpm --filter @family-os/shell build

# Caddy with the Cloudflare DNS-01 module compiled in
FROM caddy:2-builder AS caddybuild
RUN xcaddy build --with github.com/caddy-dns/cloudflare

FROM caddy:2
COPY --from=caddybuild /usr/bin/caddy /usr/bin/caddy
COPY apps/shell/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/shell/dist /srv
COPY --from=build /repo/plugins/family-feed/dist /srv/plugins/family-feed
COPY --from=build /repo/plugins/chores/dist       /srv/plugins/chores
COPY --from=build /repo/plugins/calendar/dist     /srv/plugins/calendar
