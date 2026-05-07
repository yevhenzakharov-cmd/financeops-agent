#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client production prerequisites ----"
curl -s "$BASE_URL/client/production-prerequisites" | python3 -m json.tool | head -140

echo
echo "---- client production risk report ----"
curl -s "$BASE_URL/client/production-risk-report" | python3 -m json.tool | head -140

echo
echo "---- client production handoff plan ----"
curl -s "$BASE_URL/client/production-handoff-plan" | python3 -m json.tool | head -180

echo
echo "---- client production demo script ----"
curl -s "$BASE_URL/client/production-demo-script" | python3 -m json.tool | head -140

echo
echo "---- client production handoff package ----"
curl -s "$BASE_URL/client/production-handoff-package" | python3 -m json.tool | head -220

echo
echo "---- related go-live package ----"
curl -s "$BASE_URL/client/go-live-package" | python3 -m json.tool | head -80
