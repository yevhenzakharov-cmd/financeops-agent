#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client production readiness package ----"
curl -s "$BASE_URL/client/production-readiness-package" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client production readiness package summary ----"
curl -s "$BASE_URL/client/production-readiness-package/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client production readiness package validation ----"
curl -s "$BASE_URL/client/production-readiness-package/validation" | python3 -m json.tool | sed -n '1,120p'
