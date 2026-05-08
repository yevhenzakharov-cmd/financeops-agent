#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client reviewer dashboard ----"
curl -s "$BASE_URL/client/reviewer-dashboard" | python3 -m json.tool | head -220

echo
echo "---- proof: reviewer audit ----"
curl -s "$BASE_URL/client/reviewer-audit" | python3 -m json.tool | head -120

echo
echo "---- proof: artifact manifest ----"
curl -s "$BASE_URL/artifacts/manifest" | python3 -m json.tool | head -120
