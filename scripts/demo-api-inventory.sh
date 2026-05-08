#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- api inventory ----"
curl -s "$BASE_URL/api/inventory" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- api routes ----"
curl -s "$BASE_URL/api/routes" | python3 -m json.tool | sed -n '1,180p'
