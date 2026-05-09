#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client procurement review package ----"
curl -s "$BASE_URL/client/procurement-review-package" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client procurement review package summary ----"
curl -s "$BASE_URL/client/procurement-review-package/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client procurement review package validation ----"
curl -s "$BASE_URL/client/procurement-review-package/validation" | python3 -m json.tool | sed -n '1,120p'
