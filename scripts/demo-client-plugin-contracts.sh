#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client plugin contracts ----"
curl -s "$BASE_URL/client/plugin-contracts" | python3 -m json.tool | sed -n '1,180p'
