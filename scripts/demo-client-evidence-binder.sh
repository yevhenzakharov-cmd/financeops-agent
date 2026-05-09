#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client evidence binder ----"
curl -s "$BASE_URL/client/evidence-binder" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client evidence binder summary ----"
curl -s "$BASE_URL/client/evidence-binder/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client evidence binder validation ----"
curl -s "$BASE_URL/client/evidence-binder/validation" | python3 -m json.tool | sed -n '1,120p'
