#!/usr/bin/env bash
set -euo pipefail

RUN_ID="$(gh run list --workflow CI --limit 1 --json databaseId --jq '.[0].databaseId')"

if [ -z "$RUN_ID" ] || [ "$RUN_ID" = "null" ]; then
  echo "No CI run found."
  exit 1
fi

echo "Watching CI run: $RUN_ID"
gh run watch "$RUN_ID" --compact --exit-status
