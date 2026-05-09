#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client acceptance gate ----"
curl -s "$BASE_URL/client/acceptance-gate" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client acceptance gate summary ----"
curl -s "$BASE_URL/client/acceptance-gate/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client acceptance gate validation ----"
curl -s "$BASE_URL/client/acceptance-gate/validation" | python3 -m json.tool | sed -n '1,120p'
