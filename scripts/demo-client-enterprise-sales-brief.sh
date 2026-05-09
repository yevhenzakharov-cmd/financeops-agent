#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client enterprise sales brief ----"
curl -s "$BASE_URL/client/enterprise-sales-brief" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client enterprise sales brief summary ----"
curl -s "$BASE_URL/client/enterprise-sales-brief/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client enterprise sales brief validation ----"
curl -s "$BASE_URL/client/enterprise-sales-brief/validation" | python3 -m json.tool | sed -n '1,120p'
