#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client security boundary ----"
curl -s "$BASE_URL/client/security-boundary" | python3 -m json.tool | head -240

echo
echo "---- client reviewer dashboard ----"
curl -s "$BASE_URL/client/reviewer-dashboard" | python3 -m json.tool | head -120

echo
echo "---- client production handoff package ----"
curl -s "$BASE_URL/client/production-handoff-package" | python3 -m json.tool | head -120
