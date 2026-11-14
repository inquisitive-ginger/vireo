#!/usr/bin/env bash
# Passes once the deploy workflow has succeeded for the newest main commit that release.yml builds
# (it ignores docs and markdown) and the site answers.
set -euo pipefail
git fetch -q origin main
sha=$(git log -1 --first-parent --format=%H origin/main -- . ':(glob,exclude)docs/**' ':(glob,exclude)**/*.md' ':(glob,exclude).github/ISSUE_TEMPLATE/**')
# deploy.yml runs on workflow_run, so its run carries main's head when it fired, not $sha.
# Match it by time instead: a successful deploy started after this commit's release did.
rel=$(gh run list --workflow release.yml --commit "$sha" --json conclusion,createdAt -q '[.[] | select(.conclusion == "success")][0].createdAt // ""')
ok=0
if [ -n "$rel" ]; then
  ok=$(gh run list --workflow deploy.yml --limit 20 --json conclusion,createdAt -q "[.[] | select(.conclusion == \"success\" and .createdAt > \"$rel\")] | length")
fi
if [ "$ok" -eq 0 ]; then
  echo "deploy for ${sha:0:7} not finished yet"
  exit 1
fi
curl -fsS -o /dev/null https://vireohome.app/
echo "deployed ${sha:0:7}, vireohome.app answers"
