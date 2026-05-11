#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- consolidated reviewer dashboard package ----"
curl -s "$BASE_URL/client/reviewer-dashboard-package" | python3 -m json.tool | sed -n '1,240p'

echo
echo "---- proof: individual reviewer dashboard ----"
curl -s "$BASE_URL/client/reviewer-dashboard" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- proof: reviewer audit ----"
curl -s "$BASE_URL/client/reviewer-audit" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- proof: production readiness package ----"
curl -s "$BASE_URL/client/production-readiness-package" | python3 -m json.tool | sed -n '1,100p'
