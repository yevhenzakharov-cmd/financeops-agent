#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client pilot proposal package ----"
curl -s "$BASE_URL/client/pilot-proposal-package" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client pilot proposal package summary ----"
curl -s "$BASE_URL/client/pilot-proposal-package/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client pilot proposal package validation ----"
curl -s "$BASE_URL/client/pilot-proposal-package/validation" | python3 -m json.tool | sed -n '1,120p'
