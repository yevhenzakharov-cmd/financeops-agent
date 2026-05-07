#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client acceptance criteria ----"
curl -s "$BASE_URL/client/acceptance-criteria" | python3 -m json.tool | head -140

echo
echo "---- client test scenarios ----"
curl -s "$BASE_URL/client/test-scenarios" | python3 -m json.tool | head -140

echo
echo "---- client demo script ----"
curl -s "$BASE_URL/client/demo-script" | python3 -m json.tool | head -140

echo
echo "---- client acceptance package ----"
curl -s "$BASE_URL/client/acceptance-package" | python3 -m json.tool | head -200

echo
echo "---- related pilot plan ----"
curl -s "$BASE_URL/client/pilot-plan" | python3 -m json.tool | head -80
