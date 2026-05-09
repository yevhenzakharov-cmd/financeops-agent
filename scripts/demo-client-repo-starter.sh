#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client repo starter ----"
curl -s "$BASE_URL/client/repo-starter" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client repo starter summary ----"
curl -s "$BASE_URL/client/repo-starter/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client repo starter validation ----"
curl -s "$BASE_URL/client/repo-starter/validation" | python3 -m json.tool | sed -n '1,120p'
