#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client risk acceptance package ----"
curl -s "$BASE_URL/client/risk-acceptance-package" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client risk acceptance package summary ----"
curl -s "$BASE_URL/client/risk-acceptance-package/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client risk acceptance package validation ----"
curl -s "$BASE_URL/client/risk-acceptance-package/validation" | python3 -m json.tool | sed -n '1,120p'
