#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- audit health ----"
curl -s "$BASE_URL/audit/health" | python3 -m json.tool | sed -n '1,100p'

echo
echo "---- audit summary ----"
curl -s "$BASE_URL/audit/summary" | python3 -m json.tool | sed -n '1,140p'

echo
echo "---- audit visibility ----"
curl -s "$BASE_URL/audit/visibility" | python3 -m json.tool | sed -n '1,180p'
