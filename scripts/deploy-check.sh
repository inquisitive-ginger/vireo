#!/usr/bin/env bash
# Passes once the deploy workflow has succeeded for the newest main commit that release.yml builds
# (it ignores docs and markdown) and the site answers.
set -euo pipefail
git fetch -q origin main
sha=$(git log -1 --first-parent --format=%H origin/main -- . ':(glob,exclude)docs/**' ':(glob,exclude)**/*.md' ':(glob,exclude).github/ISSUE_TEMPLATE/**')
ok=$(gh run list --workflow deploy.yml --commit "$sha" --json conclusion -q '[.[] | select(.conclusion == "success")] | length')
if [ "${ok:-0}" -eq 0 ]; then
  echo "deploy for ${sha:0:7} not finished yet"
  exit 1
fi
curl -fsS -o /dev/null https://vireohome.app/
echo "deployed ${sha:0:7}, vireohome.app answers"
