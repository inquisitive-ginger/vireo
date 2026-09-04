#!/usr/bin/env sh
set -e
cd /repo

# Apply migrations for every schema before the API binds. Each package's
# prisma.config.ts points at its own schema and reads DATABASE_URL from env.
for pkg in platform plugin-family-feed plugin-chores plugin-calendar plugin-rewards plugin-meals plugin-shopping; do
  echo "migrate deploy → @family-os/$pkg"
  pnpm --filter "@family-os/$pkg" exec prisma migrate deploy
done

exec pnpm --filter @family-os/api exec tsx src/index.ts
