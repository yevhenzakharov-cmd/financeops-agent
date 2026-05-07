#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client pilot scope ----"
curl -s "$BASE_URL/client/pilot-scope" | python3 -m json.tool | head -140

echo
echo "---- client pilot risk register ----"
curl -s "$BASE_URL/client/pilot-risk-register" | python3 -m json.tool | head -140

echo
echo "---- client pilot success metrics ----"
curl -s "$BASE_URL/client/pilot-success-metrics" | python3 -m json.tool | head -140

echo
echo "---- client pilot plan ----"
curl -s "$BASE_URL/client/pilot-plan" | python3 -m json.tool | head -200
