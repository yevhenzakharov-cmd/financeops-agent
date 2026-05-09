#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client implementation roadmap ----"
curl -s "$BASE_URL/client/implementation-roadmap" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client implementation roadmap summary ----"
curl -s "$BASE_URL/client/implementation-roadmap/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client implementation roadmap validation ----"
curl -s "$BASE_URL/client/implementation-roadmap/validation" | python3 -m json.tool | sed -n '1,120p'
