# The API imports workspace TS source at runtime (@family-os/platform/server,
# each plugin's ./db) and the committed Prisma clients use the driver adapter (no
# native engine → arch-independent). So there is no compile step: install the
# full workspace and run it with tsx. Migrations (prisma, a devDep) run from the
# entrypoint before the server binds, so devDependencies are kept.
FROM node:22-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN chmod +x apps/api/docker-entrypoint.sh
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["/repo/apps/api/docker-entrypoint.sh"]
