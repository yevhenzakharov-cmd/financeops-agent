#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client delivery package ----"
curl -s "$BASE_URL/client/delivery-package" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client delivery package summary ----"
curl -s "$BASE_URL/client/delivery-package/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client delivery package validation ----"
curl -s "$BASE_URL/client/delivery-package/validation" | python3 -m json.tool | sed -n '1,120p'
