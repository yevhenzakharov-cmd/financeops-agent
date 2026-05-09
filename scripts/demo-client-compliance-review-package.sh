#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client compliance review package ----"
curl -s "$BASE_URL/client/compliance-review-package" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client compliance review package summary ----"
curl -s "$BASE_URL/client/compliance-review-package/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client compliance review package validation ----"
curl -s "$BASE_URL/client/compliance-review-package/validation" | python3 -m json.tool | sed -n '1,120p'
