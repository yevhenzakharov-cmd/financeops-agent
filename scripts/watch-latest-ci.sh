#!/usr/bin/env bash
set -euo pipefail

WORKFLOW="${WORKFLOW:-CI}"
HEAD_SHA="$(git rev-parse HEAD)"

echo "Waiting for CI run for commit: $HEAD_SHA"

RUN_ID=""

for i in {1..30}; do
  RUN_ID="$(gh run list \
    --workflow "$WORKFLOW" \
    --commit "$HEAD_SHA" \
    --limit 1 \
    --json databaseId \
    --jq '.[0].databaseId // empty')"

  if [ -n "$RUN_ID" ]; then
    break
  fi

  sleep 2
done

if [ -z "$RUN_ID" ]; then
  echo "No CI run found yet for commit: $HEAD_SHA"
  echo
  echo "Recent CI runs:"
  gh run list --workflow "$WORKFLOW" --limit 5
  exit 1
fi

echo "Watching CI run: $RUN_ID"
gh run watch "$RUN_ID" --compact --exit-status
