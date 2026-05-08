#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- openapi contract ----"
curl -s "$BASE_URL/openapi.json" | python3 -m json.tool | sed -n '1,200p'
