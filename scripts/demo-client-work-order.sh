#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client work order ----"
curl -s "$BASE_URL/client/work-order" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client work order summary ----"
curl -s "$BASE_URL/client/work-order/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client work order validation ----"
curl -s "$BASE_URL/client/work-order/validation" | python3 -m json.tool | sed -n '1,120p'
